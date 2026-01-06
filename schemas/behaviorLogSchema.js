// schemas/behaviorLogSchema.js
const Joi = require('joi');

exports.createLogSchema = Joi.object({
  studentId: Joi.string()
    .hex()
    .length(24)
    .required(),

  type: Joi.string()
    .valid("positive", "negative")
    .required(),

  value: Joi.number()
    .integer()
    .when('type', {
      is: 'positive',
      then: Joi.number().min(1).max(10),
      otherwise: Joi.number().min(-10).max(-1),
    })
    .required(),

  comment: Joi.string()
    .trim()
    .max(500)
    .optional(),

  occurredAt: Joi.date()
    .default(() => new Date(), 'current timestamp'),
});
