import Joi from "joi";

export const lessonCreate = Joi.object(
    {
        topic: Joi.string().required(),
        objectives: Joi.array().items(
            Joi.string()
        ).required(),
        lessonType: Joi.string().valid("slide", "interactive", "video").required(),
        resources: Joi.array().items(
            Joi.object({
                title: Joi.string().required(),
                url: Joi.string().required()
            })
        ),
        course_id: Joi.string().required()
    }
)


export const lessonUpdate = Joi.object(
    {
        topic: Joi.string(),
        objectives: Joi.array().items(
            Joi.string()
        ),
        lessonType: Joi.string().valid("slide", "interactive", "video"),
        resources: Joi.array().items(
            Joi.object({
                title: Joi.string().required(),
                url: Joi.string().required()
            })
        ),
    }
).min(1)