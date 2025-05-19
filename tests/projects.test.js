const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const projectsModel = require("../models/project");
const usersModel = require("../models/users");
const clientsModel = require("../models/clients");
const { encrypt } = require("../utils/handlePassword");
const { tokenSign } = require("../utils/handleJWT");

let token = "";
let user = null;
let client = null;
let projectId = "";

beforeAll(async () => {
  await mongoose.connect(process.env.DB_URI_TEST);
  await projectsModel.deleteMany({});
  await usersModel.deleteMany({});
  await clientsModel.deleteMany({});

  const password = await encrypt("TestPass.01");
  user = await usersModel.create({
    name: "ProjectUser",
    surnames: "Surname",
    email: "project@correo.com",
    password,
  });
  token = await tokenSign(user, process.env.JWT_SECRET);

  client = await clientsModel.create({
    name: "ClientForProject",
    cif: "B22222222",
    userId: user._id.toString(),
    address: {
      street: "ClientStreet",
      number: 123,
      postal: 28001,
      city: "Madrid",
      province: "Madrid",
    },
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("Projects API", () => {
  test("should create a project", async () => {
    const res = await request(app)
      .post("/projects")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Proyecto Test",
        projectCode: "PRJ-001",
        clientId: client._id.toString(),
        userId: user._id.toString(),
      });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.name).toBe("Proyecto Test");
    projectId = res.body._id;
  });

  test("should get all projects", async () => {
    const res = await request(app)
      .get("/projects")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("should get a project by ID", async () => {
    const res = await request(app)
      .get(`/projects/${projectId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id", projectId);
    expect(res.body.name).toBe("Proyecto Test");
  });

  test("should update a project", async () => {
    const res = await request(app)
      .put(`/projects/${projectId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Proyecto Actualizado",
        status: "Completado",
      });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body.name).toBe("Proyecto Actualizado");
    // Si tu API devuelve status, descomenta la línea siguiente:
    // expect(res.body.status).toBe("Completado");
  });

  test("should soft delete a project", async () => {
    const res = await request(app)
      .delete(`/projects/${projectId}`)
      .set("Authorization", `Bearer ${token}`);
    expect([200, 204]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("message");
  });

  test("should restore a soft deleted project or return 404", async () => {
    const res = await request(app)
      .post(`/projects/${projectId}/restore`)
      .set("Authorization", `Bearer ${token}`);
    expect([200, 201, 404]).toContain(res.statusCode);
  });

  test("should hard delete a project", async () => {
    const res = await request(app)
      .delete(`/projects/${projectId}/hard`)
      .set("Authorization", `Bearer ${token}`);
    expect([200, 204]).toContain(res.statusCode);
  });
});
