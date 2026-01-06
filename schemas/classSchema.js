// schemas/classSchema.js

const Joi = require('joi');

const objectId = Joi.string().hex().length(24);

exports.createClassSchema = Joi.object({
    name: Joi.string().min(2).max(100).trim().required(),
    subject: Joi.string().valid("Math", "Science", "English", "History", "Other").default("Other"), 
}).options({ abortEarly: false }); // abortEarly: false returns all validation errors

// Add update schema for PUT request
exports.updateClassSchema = Joi.object({
    name: Joi.string().min(2).max(100).trim().optional(),
    subject: Joi.string().allow('').optional(),
}).min(1); // min(1) ensures at least one field is provided 

exports.classIdParamSchema = Joi.object({
    classId: objectId.required()
});