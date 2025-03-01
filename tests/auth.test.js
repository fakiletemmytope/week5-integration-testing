// import express from "express"
import supertest from "supertest"
import { auth_router } from "../routes/auth.js"
import bodyParser from "body-parser"
import app from "../app.js"
import { seed_users } from "../utils/seeder.js"


const request = supertest(app)

app.use(bodyParser.json())

app.use("/auth", auth_router)


describe("Test the root path", () => {
    test("It should response the GET method", async () => {
        const response = await request.get("/");
        expect(response.statusCode).toBe(302);
    });
});

describe("Integration test for auth route", () => {
    test("POST /login -Invalid email", async () => {
        const { body, status } = await request.post("/auth/login").send({
            email: "testuser",
            password: "testpassword"
        })
        expect(status).toBe(422)
        expect(body[0].message).toBe('"email" must be a valid email')
    });

    test("POST /login - Non-existent user", async () => {
        const { body, status, text } = await request.post("/auth/login").send({
            email: "testuser@yahoo.com",
            password: "testpassword"
        })
        expect(status).toBe(404)
        expect(text).toBe("User not found or Incorrect login details")
    });

    test("POST /login - registered user", async () => {
        const { email, _id, userType, first_name, last_name } = await seed_users(1, "active")
        const { body, status, text } = await request.post("/auth/login").send({
            email: email,
            password: "*.Oluwaseyi88.*"
        })
        expect(status).toBe(200)
        expect(body._id.toString()).toBe(_id.toString())
        expect(body.userType).toBe(userType)
        expect(body.email).toBe(email)
        expect(body.first_name).toBe(first_name)
        expect(body.last_name).toBe(last_name)
    });

    test("POST /login - incorrect user details", async () => {
        const { email } = await seed_users(1, "active")
        const { body, status, text } = await request.post("/auth/login").send({
            email: email,
            password: "eurkriooai"
        })
        expect(status).toBe(404)
        expect(text).toBe("User not found or Incorrect login details")

    });
});