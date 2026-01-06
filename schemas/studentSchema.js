// schemas/studentSchema.js

const Joi = require('joi');

exports.createStudentSchema = Joi.object({
    first_name: Joi.string().trim().min(1).required(),
    last_name: Joi.string().trim().min(1).optional(),
    classId: Joi.string().hex().length(24).required(),
});