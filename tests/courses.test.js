import app from "../app.js"
import supertest from "supertest"
import { user_router } from "../routes/user.js"
import bodyParser from "body-parser"
import { generate_a_random_course, generate_a_random_user } from "../utils/faker.js"
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
    const response = await request.post("/auth/login").send({
        email: user.email,
        password: "*.Oluwaseyi88.*",
    })
    return response.body
}


describe('Integration Test for Courses Route', () => {
    describe('Test for GET Courses', () => {
        test('Get courses by any user', async () => {
            await seed_courses(10)
            const { status, body, text } = await request.get('/api/courses')
            expect(status).toBe(200)
            expect(body.length).toBe(10)
        })
    })

    describe('Test for GET Course', () => {
        test('Get course a course by any user', async () => {
            const { saved_courses } = await seed_courses(1)
            const { status, body, text } = await request.get(`/api/courses/${saved_courses[0]._id}`)
            expect(status).toBe(200)
            expect(body.title).toBe(saved_courses[0].title)
            expect(body.description).toBe(saved_courses[0].description)
            expect(body.duration).toBe(saved_courses[0].duration)
            expect(body._id.toString()).toBe(saved_courses[0]._id.toString())
        })
    })

    describe('Test for POST Courses', () => {
        test('Create a course by instructor', async () => {
            const { token, _id } = await createUserAndLogin('instructor')
            const course = await generate_a_random_course(_id)
            const { status, body, text } = await request
                .post('/api/courses')
                .send(course)
                .set('Authorization', `Bearer ${token}`)
            expect(status).toBe(200)
            expect(body.title).toBe(course.title)
            expect(body.description).toBe(course.description)
            expect(body.duration).toBe(course.duration)
            expect(body.instructor.toString()).toBe(_id.toString())
        })

        test('Create a course by admin', async () => {
            const { token, _id } = await createUserAndLogin('admin')
            // const course = await generate_a_random_course(_id)
            const { status, body, text } = await request
                .post('/api/courses')
                .send({})
                .set('Authorization', `Bearer ${token}`)
            expect(status).toBe(403)
            expect(text).toBe("Unauthorized User")
        })

        test('Create a course by student', async () => {
            const { token, _id } = await createUserAndLogin('student')
            const { status, body, text } = await request
                .post('/api/courses')
                .send({})
                .set('Authorization', `Bearer ${token}`)
            expect(status).toBe(403)
            expect(text).toBe("Unauthorized User")
        })

        test('Create a course unauthenticated user', async () => {
            const { status, body, text } = await request
                .post('/api/courses')
                .send({})
            expect(status).toBe(401)
            expect(text).toBe("Unauthenticated user, bearer token required")
        })

    })


    describe('Test for PUT Courses', () => {
        test('Update Course by Instructor', async () => {
            const { token, _id } = await createUserAndLogin('instructor')
            const { saved_courses } = await seed_courses(1, _id)
            const update = {
                description: "About to change the description",
                price: "$45"
            }
            const { status, body, text } = await request
                .put(`/api/courses/${saved_courses[0]._id}`)
                .send(update)
                .set('Authorization', `Bearer ${token}`)
            expect(status).toBe(200)
            expect(body._id.toString()).toBe(saved_courses[0]._id.toString())
            expect(body.title).toBe(saved_courses[0].title)
            expect(body.description).toBe("About to change the description")
            expect(body.price).toBe("$45")
        })

        test('Update Course by Student', async () => {
            const { token, _id } = await createUserAndLogin('student')
            const { saved_courses } = await seed_courses(1)
            const update = {}
            const { status, body, text } = await request
                .put(`/api/courses/${saved_courses[0]._id}`)
                .send(update)
                .set('Authorization', `Bearer ${token}`)
            expect(status).toBe(403)
            expect(text).toBe("Unauthorized User")

        })

        test('Update Course by Admin', async () => {
            const { token, _id } = await createUserAndLogin('admin')
            const { saved_courses } = await seed_courses(1)
            const update = {}
            const { status, body, text } = await request
                .put(`/api/courses/${saved_courses[0]._id}`)
                .send(update)
                .set('Authorization', `Bearer ${token}`)
            expect(status).toBe(403)
            expect(text).toBe("Unauthorized User")

        })

        test('Update Course by a user not logged in', async () => {
            const { saved_courses } = await seed_courses(1)
            const update = {}
            const { status, body, text } = await request
                .put(`/api/courses/${saved_courses[0]._id}`)
                .send(update)
            expect(status).toBe(401)
            expect(text).toBe("Unauthenticated user, bearer token required")

        })
    })


    describe('Test for DELETE Courses', () => {
        test('Test Delete course by the Instructor', async () => {
            const { token, _id } = await createUserAndLogin('instructor')
            const { saved_courses } = await seed_courses(1, _id)
            const { status, body, text } = await request
                .delete(`/api/courses/${saved_courses[0]._id}`)
                .set('Authorization', `Bearer ${token}`)
            expect(status).toBe(200)
            expect(text).toBe("Course deleted")
        })

        test('Test Delete course by the admin', async () => {
            const { token, _id } = await createUserAndLogin('admin')
            const { saved_courses } = await seed_courses(1)
            const { status, body, text } = await request
                .delete(`/api/courses/${saved_courses[0]._id}`)
                .set('Authorization', `Bearer ${token}`)
            expect(status).toBe(200)
            expect(text).toBe("Course deleted")
        })

        test('Test Delete course by the student', async () => {
            const { token, _id } = await createUserAndLogin('student')
            const { saved_courses } = await seed_courses(1)
            const { status, body, text } = await request
                .delete(`/api/courses/${saved_courses[0]._id}`)
                .set('Authorization', `Bearer ${token}`)
            expect(status).toBe(403)
            expect(text).toBe("Unauthorized User")
        })

        test('Test Delete a user not logged in', async () => {
            const { saved_courses } = await seed_courses(1)
            const { status, body, text } = await request
                .delete(`/api/courses/${saved_courses[0]._id}`)
            expect(status).toBe(401)
            expect(text).toBe("Unauthenticated user, bearer token required")
        })
    })
})