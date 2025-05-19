const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const clientsModel = require("../models/clients");
const usersModel = require("../models/users");
const { encrypt } = require("../utils/handlePassword");
const { tokenSign } = require("../utils/handleJWT");

let token = "";
let clientId = "";

beforeAll(async () => {
  await mongoose.connect(process.env.DB_URI_TEST);
  await clientsModel.deleteMany({});
  await usersModel.deleteMany({});

  const password = await encrypt("TestPass.01");
  const user = await usersModel.create({
    name: "ClientTest",
    surnames: "Surname",
    email: "client@correo.com",
    password,
  });
  token = await tokenSign(user, process.env.JWT_SECRET);
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("Clients CRUD", () => {
  test("should create a client", async () => {
    const res = await request(app)
      .post("/clients")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Client1",
        cif: "A11111111",
        address: {
          street: "Test",
          number: 1,
          postal: 28001,
          city: "Madrid",
          province: "Madrid",
        },
      });
    expect(res.statusCode).toBe(201); // <-- Cambiado aquí
    expect(res.body).toHaveProperty("_id");
    clientId = res.body._id;
  });

  test("should get a client by ID", async () => {
    const res = await request(app)
      .get(`/clients/${clientId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);

    // Si te devuelve array:
    // expect(res.body[0]).toHaveProperty("name", "Client1");

    // Lo correcto (ajusta tu controller si hace falta):
    expect(res.body).toHaveProperty("name", "Client1");
  });

  test("should soft delete a client", async () => {
    const res = await request(app)
      .delete(`/clients/${clientId}`)
      .set("Authorization", `Bearer ${token}`);

    // Haz un console.log(res.body) si te sigue fallando
    expect(res.statusCode).toBe(200); // O 204 según tu lógica
    expect(res.body).toHaveProperty("message");
  });
});
