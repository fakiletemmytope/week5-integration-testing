// import express from "express"
import supertest from "supertest"
import { auth_router } from "../routes/auth.js"
import bodyParser from "body-parser"
import app from "../app.js"


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

    test("POST /login -Invalid correct", async () => {
        //create a user with a known password
        const { body, status, text } = await request.post("/auth/login").send({
            email: "testuser@yahoo.com",
            password: "testpassword"
        })
        expect(status).toBe(404)
        expect(text).toBe("User not found")
    });
});