import app from "../app.js"
import supertest from "supertest"
import { user_router } from "../routes/user.js"
import bodyParser from "body-parser"
import { generate_a_random_user } from "../utils/faker.js"
import { auth_router } from "../routes/auth.js"
import { seed_users } from "../utils/seeder.js"

const request = supertest(app)

app.use(bodyParser.json())
app.use("/api/users", user_router)
app.use("/auth/login", auth_router)


// Helper function to create and log in a user
async function createUserAndLogin(usertype = "student") {
    const user = await seed_users(1, "active", usertype)
    const response = await request.post("/auth/login").send({
        email: user.email,
        password: "*.Oluwaseyi88.*",
    })
    return response.body
}


describe("Test for users route", () => {

    test('should create a new user', async () => {
        const userData = await generate_a_random_user("student")
        const { status, body } = await request
            .post('/api/users')
            .send(userData)

        expect(status).toBe(200);
        expect(body).toHaveProperty('_id');
        expect(body.first_name).toBe(userData.first_name);
        expect(body.email).toBe(userData.email);
    }, 10000)

    test('should get a user', async () => {
        //create an user and login the user
        const { _id, token, email, userType, first_name, last_name, } = await createUserAndLogin()

        //the user get a user details using the id
        const response = await request
            .get(`/api/users/${_id}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.first_name).toBe(first_name)
        expect(response.body.last_name).toBe(last_name)
        expect(response.body._id).toBe(_id)
        expect(response.body.email).toBe(email)
        expect(response.body.userType).toBe(userType)
    })

    test('should update a user detail', async () => {
        //create an user and login the user
        const { _id, token, email } = await createUserAndLogin()
        const { body, status } = await request
            .put(`/api/users/${_id}`)
            .send({ first_name: 'Temitope', last_name: 'Fakile' })
            .set('Authorization', `Bearer ${token}`)
        expect(status).toBe(200)
        expect(body.first_name).toBe('Temitope')
        expect(body.last_name).toBe('Fakile')
        expect(body.email).toBe(email)
        expect(body._id).toBe(_id)
    })

    test('should delete a user', async () => {
        const { token } = await createUserAndLogin("admin")
        const { _id } = await seed_users(1, "active", "student")
        const { text, status, body } = await request
            .delete(`/api/users/${_id}`)
            .set('Authorization', `Bearer ${token}`)
        expect(status).toBe(200)
        expect(text).toBe("User deleted")
    })
})