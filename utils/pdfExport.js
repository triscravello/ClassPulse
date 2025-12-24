const PDFDocument = require('pdfkit');

const createPDFBuffer = (data) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        // Header
        doc
            .fontSize(16)
            .text('Class Behavior Report', { align: 'center' })
            .moveDown(1.5);

        doc.fontSize(11);

        data.forEach((item, index) => {
            doc.text(
                `${index + 1}. Student: ${item.student_name}
   Type: ${item.type}
   Points: ${item.points}
   Note: ${item.comment || 'N/A'}
   Date: ${new Date(item.created_at).toLocaleString()}
                `,
                { lineGap: 4 }
            );
            doc.moveDown();
        });

        doc.end();
    });
};

module.exports = { createPDFBuffer };

