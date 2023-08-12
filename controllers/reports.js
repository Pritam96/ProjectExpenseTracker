const sequelize = require('../utils/database');
const Sequelize = require('sequelize');
const PDFDocument = require('pdfkit-table');
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const { PassThrough } = require('stream');

// GET => /reports/dailyReport/<date> => GET EXPENSES BY DATE
exports.getDailyReport = async (req, res, next) => {
  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    const expenses = await req.user.getExpenses({
      where: {
        createdAt: {
          [Sequelize.Op.between]: [startDate, endDate],
        },
      },
      order: [['createdAt', 'ASC']],
    });

    let totalExpense = 0;
    expenses.forEach((expense) => {
      totalExpense += +expense.price;
    });

    res.status(200).json({ total: totalExpense, data: expenses });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// GET => /reports/dailyReport/<month> => GET EXPENSES BY MONTH
exports.getMonthlyReport = async (req, res, next) => {
  try {
    const yearMonth = req.params.yearMonth;
    const year = yearMonth.split('-')[0];
    const month = yearMonth.split('-')[1];

    const expenses = await req.user.getExpenses({
      where: [
        sequelize.where(sequelize.fn('year', sequelize.col('createdAt')), year),
        sequelize.where(
          sequelize.fn('month', sequelize.col('createdAt')),
          month
        ),
      ],
      order: [['createdAt', 'ASC']],
    });

    let totalExpense = 0;
    expenses.forEach((expense) => {
      totalExpense += +expense.price;
    });

    res.status(200).json({ total: totalExpense, data: expenses });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Configure the AWS SDK with your credentials and region
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_BUCKET_REGION,
});

// Create a new instance of the S3 service
const s3 = new AWS.S3();

// Download Reports PDF By Month/ By Date Range
exports.getDownloadReport = async (req, res, next) => {
  const yearMonth = req.params.yearMonth;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  let expenses;
  let table_heading;

  if (yearMonth) {
    const year = yearMonth.split('-')[0];
    const month = yearMonth.split('-')[1];
    expenses = await req.user.getExpenses({
      where: [
        sequelize.where(sequelize.fn('year', sequelize.col('createdAt')), year),
        sequelize.where(
          sequelize.fn('month', sequelize.col('createdAt')),
          month
        ),
      ],
      order: [['createdAt', 'ASC']],
    });

    table_heading = yearMonth;
  } else {
    expenses = await req.user.getExpenses({
      where: {
        createdAt: {
          [Sequelize.Op.between]: [startDate, endDate],
        },
      },
      order: [['createdAt', 'ASC']],
    });
    table_heading = `${startDate} to ${endDate}`;
  }

  try {
    if (!req.user.isPremium) {
      return res.status(401).json({
        message: 'User need to buy premium to access this feature.',
      });
    }

    let totalExpense = 0;
    expenses.forEach((expense) => {
      totalExpense += +expense.price;
    });

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

    // Push the last row (Total Expenses)
    tableData.push(['', '', 'Total Expenses:', totalExpense]);

    const tableArray = {
      headers: ['Date', 'Description', 'Category', 'Amount (Rs.)'],
      rows: tableData,
    };

    // Add content to the PDF using the fetched data
    doc
      .fontSize(14)
      .text(`Expense Report: (${table_heading})`, { align: 'center' });

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

        // Delete the locally created pdf
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log('PDF file deleted from local storage');
        });

        // Send the file link to the frontend as JSON
        const fileLink = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
        res.json({
          message: 'PDF uploaded successfully.',
          fileLink,
        });
      } catch (error) {
        console.log(error.message);
        console.error('Error uploading PDF to S3:', error);

        // Delete the locally created pdf if upload fails
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log('PDF file deleted from local storage');
        });

        res.status(500).json({
          message: 'Error generating PDF.',
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};
