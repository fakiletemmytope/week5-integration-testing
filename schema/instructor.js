import mongoose from "mongoose"

const { Schema, model } = mongoose

const InstructorSchema = new Schema(
    {
        name: { type: String, required: true },
        bio: { type: String, default: null },
        userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    },
    { timestamps: true }
)

export const InstructorModel = model('Instructor', InstructorSchema)