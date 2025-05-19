const { matchedData } = require("express-validator");
const deliveryNoteModel = require("../models/deliveryNote");
const { handleHttpError } = require("../utils/handleHttpError");
const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

// Crear albarán
const createDeliveryNote = async (req, res) => {
  try {
    const body = matchedData(req);
    const note = await deliveryNoteModel.create(body);
    res.status(201).json(note);
  } catch (err) {
    console.error(err);
    handleHttpError(res, "ERROR_CREATING_DELIVERY_NOTE");
  }
};

// Listar albaranes (de usuario, cliente, proyecto, o todos)
const getDeliveryNotes = async (req, res) => {
  try {
    // Puedes filtrar por query si quieres: ?userId=...&clientId=...
    const filter = {};
    if (req.query.userId) filter.userId = req.query.userId;
    if (req.query.clientId) filter.clientId = req.query.clientId;
    if (req.query.projectId) filter.projectId = req.query.projectId;

    const notes = await deliveryNoteModel
      .find(filter)
      .populate("userId", "email name surnames")
      .populate("clientId", "name cif")
      .populate("projectId", "name projectCode");
    res.json(notes);
  } catch (err) {
    console.error(err);
    handleHttpError(res, "ERROR_GETTING_DELIVERY_NOTES");
  }
};

// Obtener uno por ID
const getDeliveryNoteById = async (req, res) => {
  try {
    const note = await deliveryNoteModel
      .findById(req.params.id)
      .populate("userId", "email name surnames")
      .populate("clientId", "name cif")
      .populate("projectId", "name projectCode");
    if (!note) return handleHttpError(res, "DELIVERY_NOTE_NOT_FOUND", 404);
    res.json(note);
  } catch (err) {
    console.error(err);
    handleHttpError(res, "ERROR_GETTING_DELIVERY_NOTE");
  }
};

// Actualizar un albarán
const updateDeliveryNote = async (req, res) => {
  try {
    const update = matchedData(req);
    const note = await deliveryNoteModel.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );
    if (!note) return handleHttpError(res, "DELIVERY_NOTE_NOT_FOUND", 404);
    res.json(note);
  } catch (err) {
    console.error(err);
    handleHttpError(res, "ERROR_UPDATING_DELIVERY_NOTE");
  }
};

// Soft delete (archivar albarán)
const deleteDeliveryNote = async (req, res) => {
  try {
    await deliveryNoteModel.delete({ _id: req.params.id });
    res.json({ message: "DELIVERY_NOTE_SOFT_DELETED" });
  } catch (err) {
    console.error(err);
    handleHttpError(res, "ERROR_SOFT_DELETING_DELIVERY_NOTE");
  }
};

// Hard delete (borrado físico, solo si no está firmado)
const hardDeleteDeliveryNote = async (req, res) => {
  try {
    const note = await deliveryNoteModel.findById(req.params.id);
    if (!note) return handleHttpError(res, "DELIVERY_NOTE_NOT_FOUND", 404);
    if (!note.pending) {
      await deliveryNoteModel.deleteOne({ _id: req.params.id });
      return res.json({ message: "DELIVERY_NOTE_HARD_DELETED" });
    } else {
      return handleHttpError(res, "CANNOT_DELETE_PENDING_NOTE", 400);
    }
  } catch (err) {
    console.error(err);
    handleHttpError(res, "ERROR_HARD_DELETING_DELIVERY_NOTE");
  }
};

// Listar albaranes archivados (soft-deleted)
const getArchivedDeliveryNotes = async (req, res) => {
  try {
    const notes = await deliveryNoteModel
      .findDeleted()
      .populate("userId", "email name surnames")
      .populate("clientId", "name cif")
      .populate("projectId", "name projectCode");
    res.json(notes);
  } catch (err) {
    console.error(err);
    handleHttpError(res, "ERROR_GETTING_ARCHIVED_DELIVERY_NOTES");
  }
};

// Restaurar albarán archivado
const restoreDeliveryNote = async (req, res) => {
  try {
    await deliveryNoteModel.restore({ _id: req.params.id });
    res.json({ message: "DELIVERY_NOTE_RESTORED" });
  } catch (err) {
    console.error(err);
    handleHttpError(res, "ERROR_RESTORING_DELIVERY_NOTE");
  }
};

const getDeliveryNotePDF = async (req, res) => {
  try {
    const note = await deliveryNoteModel
      .findById(req.params.id)
      .populate("userId", "name surnames email")
      .populate("clientId", "name cif")
      .populate("projectId", "name projectCode");
    if (!note) return handleHttpError(res, "DELIVERY_NOTE_NOT_FOUND", 404);

    // Crea PDF en memoria
    const doc = new PDFDocument();
    let chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks);
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="albaran_${note._id}.pdf"`,
      });
      res.send(pdfBuffer);
    });

    // Contenido básico del albarán
    doc.fontSize(20).text("Albarán", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`ID: ${note._id}`);
    doc.text(`Fecha: ${note.createdAt.toLocaleDateString()}`);
    doc.moveDown();
    doc
      .fontSize(14)
      .text(`Cliente: ${note.clientId.name} (${note.clientId.cif})`);
    doc.text(
      `Proyecto: ${note.projectId.name} (${note.projectId.projectCode})`
    );
    doc.moveDown();
    doc.text(
      `Usuario: ${note.userId.name} ${note.userId.surnames} (${note.userId.email})`
    );
    doc.moveDown();
    doc.text(`Formato: ${note.format}`);
    if (note.format === "hours") {
      doc.text(`Horas: ${note.hours}`);
    }
    doc.moveDown();
    doc.text(`Descripción: ${note.description || ""}`);
    doc.moveDown();
    doc.text(`Firmado: ${note.pending ? "No" : "Sí"}`);
    // Puedes poner más info o personalizar el formato aquí

    doc.end();
  } catch (err) {
    console.error(err);
    handleHttpError(res, "ERROR_GENERATING_PDF");
  }
};

module.exports = {
  createDeliveryNote,
  getDeliveryNotes,
  getDeliveryNoteById,
  updateDeliveryNote,
  deleteDeliveryNote,
  hardDeleteDeliveryNote,
  getArchivedDeliveryNotes,
  restoreDeliveryNote,
  getDeliveryNotePDF,
};
