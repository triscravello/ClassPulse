const PDFDocument = require('pdfkit');

/**
 * Generate Class Behavior Report PDF from log array
 * @param {Array} logs - Array of BehaviorLog documents (with student populated)
 * @returns {Promise<Buffer>} PDF data
 */
const createClassBehaviorPDF = async (logs) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        doc.fontSize(16).text('Class Behavior Report', { align: 'center' }).moveDown(1.5);
        doc.fontSize(11);

        if (!logs.length) {
            doc.text('No behavior logs available for this class.', { align: 'center' });
        } else {
            logs.forEach((log, index) => {
                const studentName = log.student_name || 'Unknown Student';
                const type = log.category || 'N/A';
                const points = typeof log.value === 'number' ? log.value : 0;
                const note = log.comment || 'N/A';
                const date = log.occurredAt || log.occuredAt || new Date();
                const formattedDate = isNaN(new Date(date)) ? 'N/A' : new Date(date).toLocaleString();

                doc.text(
`${index + 1}. Student: ${studentName}
   Type: ${type}
   Points: ${points}
   Note: ${note}
   Date: ${formattedDate}`,
                    { lineGap: 4 }
                );
                doc.moveDown();
            });
        }

        doc.end();
    });
};

module.exports = { createClassBehaviorPDF };