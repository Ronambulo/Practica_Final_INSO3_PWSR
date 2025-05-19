const PDFDocument = require("pdfkit");

// Asume que note está populado con userId, clientId, projectId
const generatePDFBuffer = async (note) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(20).text("Albarán firmado", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`ID: ${note._id}`);
    doc.text(`Fecha: ${note.createdAt.toLocaleDateString()}`);
    doc.moveDown();
    doc.text(`Cliente: ${note.clientId.name}`);
    doc.text(`Proyecto: ${note.projectId.name}`);
    doc.text(`Usuario: ${note.userId.name} ${note.userId.surnames}`);
    doc.moveDown();
    doc.text(`Formato: ${note.format}`);
    if (note.format === "hours") doc.text(`Horas: ${note.hours}`);
    doc.moveDown();
    doc.text(`Descripción: ${note.description || ""}`);
    doc.moveDown();
    doc.text(`Firmado: Sí`);

    doc.end();
  });
};

module.exports = {
  generatePDFBuffer,
};
