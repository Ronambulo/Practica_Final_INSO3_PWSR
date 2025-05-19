const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const usersModel = require("../models/users");
const { encrypt } = require("../utils/handlePassword");
const { tokenSign } = require("../utils/handleJWT");

describe("Auth flow", () => {
  let token = "";

  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URI_TEST);
    await usersModel.deleteMany({});
    const password = await encrypt("testpassword1A.");
    const user = await usersModel.create({
      name: "TestName",
      surnames: "TestSurname",
      email: "test@correo.com",
      password,
    });
    token = await tokenSign(user, process.env.JWT_SECRET);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test("should login with correct credentials", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "test@correo.com",
      password: "testpassword1A.",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("should fail login with wrong password", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "test@correo.com",
      password: "badpassword",
    });
    expect(res.statusCode).toBe(401);
  });
});
