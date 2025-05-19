const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const usersModel = require("../models/users");
const { encrypt } = require("../utils/handlePassword");

beforeAll(async () => {
  await mongoose.connect(process.env.DB_URI_TEST);
  await usersModel.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("Auth flow", () => {
  const userData = {
    name: "TestUser",
    surnames: "UserSurname",
    email: "test@correo.com",
    password: "TestPass.01",
  };

  beforeAll(async () => {
    const encryptedPassword = await encrypt(userData.password);
    await usersModel.create({ ...userData, password: encryptedPassword });
  });

  test("should login with correct credentials", async () => {
    const res = await request(app).post("/auth/login").send({
      email: userData.email,
      password: userData.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
