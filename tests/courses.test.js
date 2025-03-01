import app from "../app.js"
import supertest from "supertest"
import { user_router } from "../routes/user.js"
import bodyParser from "body-parser"
import { generate_a_random_user } from "../utils/faker.js"
import { auth_router } from "../routes/auth.js"
import { seed_courses, seed_users } from "../utils/seeder.js"
import { course_router } from "../routes/course.js"

const request = supertest(app)

app.use(bodyParser.json())
app.use("/api/users", user_router)
app.use("/auth/login", auth_router)
app.use("/api/courses", course_router)


async function createUserAndLogin(usertype = "student") {
    const user = await seed_users(1, "active", usertype)
    console.log(user)
    const response = await request.post("/auth/login").send({
        email: user.email,
        password: "*.Oluwaseyi88.*",
    })
    return response.body
}


describe('Integration Test for Courses Route', () => {
    describe('Test for GET Courses', () => {
        test('Get courses', async () => {
            const user = await seed_users(1, 'active', 'instructor')
            await seed_courses(10, user._id)
            const { status, body, text } = await request.get('/api/courses')
            expect(status).toBe(200)
            expect(body.length).toBe(10)
        })
    })

    describe('Test for GET Course', () => {
        test('Get course', async () => {
            const user = await seed_users(1, 'active', 'instructor')
            const { saved_courses } = await seed_courses(1, user._id)
            const { status, body, text } = await request.get(`/api/courses/${saved_courses[0]._id}`)
            expect(status).toBe(200)
            expect(body.title).toBe(saved_courses[0].title)
            expect(body.description).toBe(saved_courses[0].description)
            expect(body.duration).toBe(saved_courses[0].duration)
            expect(body.instructor.toString()).toBe(user._id.toString())
            expect(body._id.toString()).toBe(saved_courses[0]._id.toString())

        })
    })

    describe('Test for POST Courses', () => {
        
    })


    describe('Test for PUT Courses', () => {

    })


    describe('Test for DELETE Courses', () => {

    })
})