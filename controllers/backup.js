const sequelize = require('../utils/database');
const PDFDocument = require('pdfkit-table');
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const { PassThrough } = require('stream');

// Configure the AWS SDK with your credentials and region
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_BUCKET_REGION,
});

// Create a new instance of the S3 service
const s3 = new AWS.S3();

exports.getDownloadReport = async (req, res, next) => {
  try {
    if (!req.user.isPremium) {
      return res.status(401).json({
        success: false,
        error: 'The user does not have permission to perform this action.',
      });
    }

    const expenses = await req.user.getExpenses();

    // Create a new PDF document
    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    const fileName = `expenses_${Date.now()}.pdf`;
    // Save PDFs in a 'pdfs' folder
    const filePath = path.join(__dirname, '..', 'pdfs', fileName);

    // Pipe the PDF to a writable stream to save it as a file
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    const tableData = [];

    expenses.forEach((expense) => {
      tableData.push([
        expense.createdAt.toISOString().split('T')[0],
        expense.description,
        expense.category,
        expense.price,
      ]);
    });

    const tableArray = {
      headers: ['Date', 'Description', 'Category', 'Amount'],
      rows: tableData,
    };

    // Add content to the PDF using the fetched data
    doc.fontSize(14).text('Expense Report', { align: 'center' });

    doc.table(tableArray, { width: 530 }); // table width

    // Finalize the PDF
    doc.end();

    // Wait for the PDF to be fully written before sending the response
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
      console.log('PDF generated.');

      // Convert the buffer to a readable stream using PassThrough
      const passThrough = new PassThrough();
      passThrough.end(Buffer.concat(buffers));

      // Upload the PDF to S3 bucket
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: passThrough,
        ContentType: 'application/pdf',
      };

      try {
        await s3.upload(params).promise();
        console.log('PDF uploaded to S3 successfully.');

        // Send the file link to the frontend as JSON
        const fileLink = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
        res.json({ success: true, fileLink });
      } catch (error) {
        console.error('Error uploading PDF to S3:', error);
        res.status(500).json({
          success: false,
          error: 'Error generating PDF.',
        });
      }
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({
      success: false,
      error: 'Error generating PDF.',
    });
  }
};

// AWS_BUCKET_NAME = expense-tracker-reports
// AWS_BUCKET_REGION = ap-south-1
// AWS_ACCESS_KEY = AKIA26R3OCDNTJK6BHR3
// AWS_SECRET_KEY = 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
