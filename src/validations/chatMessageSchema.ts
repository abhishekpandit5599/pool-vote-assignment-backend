import Joi from "joi";

// Define Joi schema for a message
const messageSchema = Joi.object({
    content: Joi.string().required().min(1).max(1000),
});

// Define Joi schema for sending a message in a chat
export const sendMessageSchema = Joi.object({
    poolId: Joi.string().required(), // assuming poolId is an ObjectId in string format
    message: messageSchema.required()
});

// Define Joi schema for chat message
export const getMessageSchema = Joi.object({
  poolId: Joi.string().required(),
});
