const Joi = require('joi');

const postAuthenticationPayloadSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

const putAuthenticationPayloadSchema = Joi.object({
    refreshToken: Joi.string().required(),
});

const deleteAuthenticationPayloadSchema = Joi.object({
    refreshToken: Joi.string().required(),
});

module.exports = {
    postAuthenticationPayloadSchema,
    putAuthenticationPayloadSchema,
    deleteAuthenticationPayloadSchema,
};
