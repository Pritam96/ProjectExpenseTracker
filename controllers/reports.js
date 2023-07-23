const sequelize = require('../utils/database');
const PDFDocument = require('pdfkit-table');
const fs = require('fs');
const path = require('path');

exports.getDailyReport = async (req, res, next) => {
  try {
    if (!req.user.isPremium) {
      return res.status(401).json({
        success: false,
        error: 'the user does not have permission to perform this action',
      });
    }
    const date = req.params.date;
    const expenses = await req.user.getExpenses({
      where: sequelize.where(
        sequelize.fn('date', sequelize.col('createdAt')),
        '=',
        date
      ),
    });
    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error });
  }
};

exports.getMonthlyReport = async (req, res, next) => {
  try {
    if (!req.user.isPremium) {
      return res.status(401).json({
        success: false,
        error: 'the user does not have permission to perform this action',
      });
    }
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
    });
    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error });
  }
};

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
    writeStream.on('finish', () => {
      console.log('PDF generated and saved successfully.');

      // Send the file link to the frontend as JSON
      // const fileLink = `/pdfs/${fileName}`;
      // res.json({ success: true, fileLink });
      res.json({ success: true, fileLink: filePath });
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({
      success: false,
      error: 'Error generating PDF.',
    });
  }
};
