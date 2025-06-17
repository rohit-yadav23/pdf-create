const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs-extra");
const PDFDocument = require("pdfkit");

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(express.static('pdfs'));

fs.ensureDirSync(path.join(__dirname, 'pdfs'));

app.post("/create-pdf", (req, res) => {
    const data = req.body;

    const filename = `nodejs_machine_certificate_${Date.now()}.pdf`;
    const filepath = path.join(__dirname, 'pdfs', filename);
    const doc = new PDFDocument({ size: 'A4' });
    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);


    doc.fontSize(12);
    doc.text(`Register-Id:- ${data.registerId || '12297918'}`, 50, 50);
    doc.text(`E-Mail: ${data.email || 'rohityadav5396@gmail.com'}`, 50, 70);
    doc.text(`Phone No.: ${data.phone || '+917089837869'}`, 50, 90);


    doc.text(`${data.addressLine1 || 'Vijay Nagar, Sector 22'}`, 350, 50);
    doc.text(`${data.addressLine2 || 'Indore (122016)'}`, 350, 70);
    doc.text(`${data.addressLine3 || '(Indore) India'}`, 350, 90);


    // doc.fontSize(12).text(`Register-Id:- ${data.registerId || '12297918'}`, 50, 50);
    // doc.text(`E-Mail: ${data.email || 'rohityadav@gmail.com'}`);
    // doc.text(`Phone No.: ${data.phone || '+919910892371'}`);

    // doc.moveDown();
    // doc.text(data.address || 'Anand Farm, Sector 22\nIndore (122016)\n(Indore) India');

    doc.moveDown(2);

    doc.fontSize(20).text("Certificate of Half Marathon", 0, 200, {
        align: 'center',
        width: doc.page.width
    });

    doc.fontSize(16).text("This Certificate Presented to", 0, 230, {
        align: 'center',
        width: doc.page.width
    });

    doc.fontSize(24).text(data.name || 'Rohit Yadav', 0, 260, {
        align: 'center',
        underline: true,
        width: doc.page.width
    });

    doc.fontSize(12).text(
        "The certificate of achievement is awarded to individuals who have \ndemonstrated outstanding performance in their field. Here’s an example text \nfor a certificate.",
        0,
        300,
        {
            align: 'center',
            width: doc.page.width
        }
    );


    doc.moveDown(1.5);
   
const yPosition = 460; // Adjust as needed


doc.fontSize(12).text(`Date of Birth: ${data.dob || '20-01-1999'}`, 50, yPosition);


doc.text(`Gender: ${data.gender || 'Male'}`, doc.page.width / 2 - 40, yPosition);

doc.text(`Blood Group: ${data.blood || 'A+'}`, 400, yPosition);


    doc.moveDown(2);

   doc.text(data.dateTime || '23-11-2023 22:34:00', 100, 520);

doc.text("_______________________", 100, 540);
doc.text("DATE-TIME", 135, 560);

doc.text("_______________________", 370, 540);
doc.text("SIGNATURE", 405, 560);

    doc.end();

    stream.on('finish', () => {
        res.status(200).json({ message: "PDF Created Successfully", path: `/pdfs/${filename}` });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
