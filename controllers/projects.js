const { matchedData } = require("express-validator");
const ProjectModel = require("../models/project");
const { handleHttpError } = require("../utils/handleHttpError");

const createProject = async (req, res) => {
  try {
    const projectData = matchedData(req);
    const userId = req.user._id;
    // Chequeo: ¿Ya existe para el usuario y ese cliente con el mismo nombre o código?
    const existing = await ProjectModel.findOne({
      name: projectData.name,
      clientId: projectData.clientId,
      userId,
    });
    if (existing)
      return res.status(409).json({ message: "PROJECT_ALREADY_EXISTS" });

    const newProject = await ProjectModel.create({ ...projectData, userId });
    res.status(201).json(newProject);
  } catch (err) {
    console.error(err);
    handleHttpError(res, "ERROR_CREATING_PROJECT");
  }
};

const updateProject = async (req, res) => {
  try {
    const projectData = matchedData(req);
    const projectId = req.params.id;
    const userId = req.user._id;
    // Chequeo de duplicados, puedes hacer más fino aquí si quieres
    const existing = await ProjectModel.findOne({
      name: projectData.name,
      clientId: projectData.clientId,
      userId,
      _id: { $ne: projectId },
    });
    if (existing)
      return res.status(409).json({ message: "PROJECT_ALREADY_EXISTS" });

    const updated = await ProjectModel.findOneAndUpdate(
      { _id: projectId, userId },
      projectData,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error(err);
    handleHttpError(res, "ERROR_UPDATING_PROJECT");
  }
};

const getProjects = async (req, res) => {
  try {
    const userId = req.user._id;
    // Solo los del usuario autenticado
    const projects = await ProjectModel.find({ userId });
    res.json(projects);
  } catch (err) {
    handleHttpError(res, "ERROR_GETTING_PROJECTS");
  }
};

const getProjectById = async (req, res) => {
  try {
    const userId = req.user._id;
    const project = await ProjectModel.findOne({ _id: req.params.id, userId });
    if (!project) return handleHttpError(res, "PROJECT_NOT_FOUND", 404);
    res.json(project);
  } catch (err) {
    handleHttpError(res, "ERROR_GETTING_PROJECT");
  }
};

const deleteProject = async (req, res) => {
  try {
    const userId = req.user._id;
    await ProjectModel.delete({ _id: req.params.id, userId });
    res.json({ message: "PROJECT_ARCHIVED" });
  } catch (err) {
    handleHttpError(res, "ERROR_ARCHIVING_PROJECT");
  }
};

const hardDeleteProject = async (req, res) => {
  try {
    const userId = req.user._id;
    await ProjectModel.deleteOne({ _id: req.params.id, userId });
    res.json({ message: "PROJECT_DELETED" });
  } catch (err) {
    handleHttpError(res, "ERROR_DELETING_PROJECT");
  }
};

const getArchivedProjects = async (req, res) => {
  try {
    const userId = req.user._id;
    const projects = await ProjectModel.findDeleted({ userId });
    res.json(projects);
  } catch (err) {
    handleHttpError(res, "ERROR_GETTING_ARCHIVED_PROJECTS");
  }
};

const restoreProject = async (req, res) => {
  try {
    const userId = req.user._id;
    await ProjectModel.restore({ _id: req.params.id, userId });
    res.json({ message: "PROJECT_RESTORED" });
  } catch (err) {
    handleHttpError(res, "ERROR_RESTORING_PROJECT");
  }
};

module.exports = {
  createProject,
  updateProject,
  getProjects,
  getProjectById,
  deleteProject,
  hardDeleteProject,
  getArchivedProjects,
  restoreProject,
};
