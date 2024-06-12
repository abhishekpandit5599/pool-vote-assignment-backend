import Joi from 'joi';

export const createPoolSchema = Joi.object({
  topic: Joi.string().required(),
  options: Joi.array().items(Joi.string().required()).min(2).required()
});

export const votePoolSchema = Joi.object({
  poolId: Joi.string().required(),
  option: Joi.string().required()
});
