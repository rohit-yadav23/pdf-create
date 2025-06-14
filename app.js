const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs-extra");
const PDFDocuments = require("pdfkit");


const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(express.static('pdfs'));

fs.ensureDirSync(path.join(__dirname, 'pdfs'));

app.post("/create-pdf", (req, res) => {
    const data = req.body;
    const filename = `file_${Date.now()}.pdf`;
    const filepath = path.join(__dirname, 'pdfs', filename);
    const doc = new PDFDocuments();
    const strem = fs.createWriteStream(filepath);
    doc.pipe(strem);

    doc.fontSize(25).text(data.name || 'Rohit Yadav', 50, 180);
    doc.fontSize(20).text(data.role || 'Developer', 50, 200);
    doc.fontSize(25).text(data.message || 'wlc to pdf file', 50, 220);
    doc.text(`Date:${data.date || new Date().toLocaleDateString()}`, 60, 250);
    doc.end();

    strem.on('finish', () => {
        res.status(200).json({ message: "PDF Create Success", path: `/pdf/${filename}` });
    });
});


app.listen(PORT, () => {
    console.log(`server runing on port: ${PORT}`)
});