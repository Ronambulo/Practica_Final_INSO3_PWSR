const { matchedData } = require("express-validator");
const ClientsModel = require("../models/clients");
const { handleHttpError } = require("../utils/handleHttpError");

// Crea un nuevo cliente asociado al usuario autenticado
const createClient = async (req, res) => {
  try {
    const clientData = matchedData(req);
    const userId = req.user._id;

    const existing = await ClientsModel.findOne({
      cif: clientData.cif,
      userId,
    });
    if (existing) {
      return res.status(409).json({ message: "CLIENT_ALREADY_EXISTS" });
    }

    const newClient = await ClientsModel.create({ ...clientData, userId });
    res.status(201).json(newClient);
  } catch (error) {
    console.error(error);
    return handleHttpError(res, "ERROR_CREATING_CLIENT", 500);
  }
};

// Obtiene todos los clientes no borrados del usuario autenticado
const getClients = async (req, res) => {
  try {
    const userId = req.user._id;
    const clients = await ClientsModel.find({ userId });
    res.json(clients);
  } catch (error) {
    console.error(error);
    return handleHttpError(res, "ERROR_FETCHING_CLIENTS", 500);
  }
};

// Obtiene un cliente por su ID (si no está borrado y pertenece al usuario)
const getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const client = await ClientsModel.findOne({ _id: id, userId });
    if (!client) {
      return res.status(404).json({ message: "CLIENT_NOT_FOUND" });
    }

    res.json(client);
  } catch (error) {
    console.error(error);
    return handleHttpError(res, "ERROR_FETCHING_CLIENT", 500);
  }
};

// Actualiza un cliente existente
const updateClient = async (req, res) => {
  try {
    const clientId = req.params.id;
    const updates = matchedData(req);
    const userId = req.user._id;

    const client = await ClientsModel.findOne({ _id: clientId, userId });
    if (!client) {
      return res.status(404).json({ message: "CLIENT_NOT_FOUND" });
    }

    if (updates.cif && updates.cif !== client.cif) {
      const dup = await ClientsModel.findOne({ cif: updates.cif, userId });
      if (dup) {
        return res.status(409).json({ message: "CIF_ALREADY_IN_USE" });
      }
    }

    Object.assign(client, updates);
    await client.save();
    res.json(client);
  } catch (error) {
    console.error(error);
    return handleHttpError(res, "ERROR_UPDATING_CLIENT", 500);
  }
};

// Soft delete (archivar) un cliente usando mongoose-delete
const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const deleted = await ClientsModel.delete({ _id: id, userId });
    if (!deleted) {
      return res.status(404).json({ message: "CLIENT_NOT_FOUND" });
    }
    res.json(deleted);
  } catch (error) {
    console.error(error);
    return handleHttpError(res, "ERROR_DELETING_CLIENT", 500);
  }
};

// Hard delete (borrado físico) un cliente
const hardDeleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const result = await ClientsModel.deleteOne({ _id: id, userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "CLIENT_NOT_FOUND" });
    }
    res.json({ message: "CLIENT_PERMANENTLY_DELETED" });
  } catch (error) {
    console.error(error);
    return handleHttpError(res, "ERROR_HARD_DELETING_CLIENT", 500);
  }
};

// Lista los clientes archivados (soft deleted)
const getArchivedClients = async (req, res) => {
  try {
    const userId = req.user._id;
    const archived = await ClientsModel.findDeleted({ userId });
    res.json(archived);
  } catch (error) {
    console.error(error);
    return handleHttpError(res, "ERROR_FETCHING_ARCHIVED_CLIENTS", 500);
  }
};

// Recupera un cliente archivado (restaurar)
const restoreClient = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const restored = await ClientsModel.restore({ _id: id, userId });
    if (!restored) {
      return res
        .status(404)
        .json({ message: "CLIENT_NOT_FOUND_OR_NOT_ARCHIVED" });
    }
    res.json({ message: "CLIENT_RESTORED", restored });
  } catch (error) {
    console.error(error);
    return handleHttpError(res, "ERROR_RESTORING_CLIENT", 500);
  }
};

module.exports = {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
  hardDeleteClient,
  getArchivedClients,
  restoreClient,
};
