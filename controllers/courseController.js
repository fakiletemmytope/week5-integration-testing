import { decode } from "jsonwebtoken"
import { dbClose, dbConnect } from "../database/dbConnect.js"
import { course_router } from "../routes/course.js"
import { CourseModel } from "../schema/course.js"
import { UserModel } from "../schema/user.js"

const get_courses = async (req, res) => {
    try {
        await dbConnect()
        const courses = await CourseModel.find({}, "title instructor duration _id price description")
        res.status(200).json(courses)
    } catch (error) {
        res.status(400).send(error.message)
    } finally {
        dbClose()
    }
}

const get_course = async (req, res) => {
    const id = req.params.id
    //console.log(req.decode)
    try {
        await dbConnect()
        let course = await CourseModel.findById(id, "title instructor duration _id price description")

        if(req.decode){
            if (req.decode.userType === 'student') {
                const id = course.students.filter(v => v == decode.id)
                if (id.length == 1) {
                    course = await CourseModel.findById(id, "title instructor duration _id price description").populate('lessons')
                }
            }
            if (req.decode.userType === 'instructor') {
                if (course.instructor == decode._id)
                    course = course = await CourseModel.findById(id, "title instructor duration _id price description").populate('lessons')
            }
            if (req.decode.userType === 'admin') {
                course = await CourseModel.findById(id, "title instructor duration _id price description").populate('lessons')
            }
        }

        if (!course) return res.status(404).send("Course not found")
        res.status(200).json(course)
    } catch (error) {
        res.status(400).send(error.message)
    } finally {
        dbClose()
    }
}


const create_course = async (req, res) => {
    const { title, description, price, duration } = req.body
    const course = new CourseModel({ title, description, price, duration, instructor: req.decode._id })
    try {
        await dbConnect()
        const savedCourse = await course.save()
        const user = await UserModel.findById(req.decode._id)
        user.courses.push(savedCourse)
        await user.save()
        res.status(200).json(savedCourse)
    } catch (err) {
        res.status(400).send(err.message)
    } finally {
        dbClose()
    }
}

const update_course = async (req, res) => {
    const { title, description, duration, price } = req.body
    const update = {}
    if (title) update.title = title
    if (description) update.description = description
    if (duration) update.duration = duration
    if (price) update.price = price
    try {
        await dbConnect()
        let updated_course = null

        if (req.decode.userType === "admin") {
            updated_course = await CourseModel.findOneAndUpdate(
                { _id: req.params.id },
                update,
                { new: true }
            )
        } else if (req.decode.userType === "instructor") {
            updated_course = await CourseModel.findOneAndUpdate(
                { _id: req.params.id, instructor: req.decode._id },
                update,
                { new: true }
            )
        }
        updated_course ? res.status(200).json(updated_course) : res.status(404).send("Course not found or not updated")

    } catch (error) {
        res.status(400).send(error.message)
    } finally {
        dbClose()
    }
}

const delete_course = async (req, res) => {
    try {
        await dbConnect()
        if (req.decode.userType === "admin") {
            const deleted_course = await CourseModel.findOneAndDelete(
                { _id: req.params.id }
            )
            !deleted_course ? res.status(404).send("Course not found") : res.status(200).send("Course deleted")
        }
        if (req.decode.userType === "instructor") {
            const deleted_course = await CourseModel.findOneAndDelete(
                { _id: req.params.id, instructor: req.decode._id }
            )
            !deleted_course ? res.status(404).send("Course not found") : res.status(200).send("Course deleted")
        }
    } catch (error) {
        res.status(400).send(error.message)
    } finally {
        dbClose()
    }
}

export { get_course, get_courses, update_course, delete_course, create_course }