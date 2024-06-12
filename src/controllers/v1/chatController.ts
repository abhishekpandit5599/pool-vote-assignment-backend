import { Request, Response } from "express";
import Chat from "../../models/Chat";
import { CustomRequest } from "../../interfaces/CustomRequest";
import { successResponse, errorResponse } from "../../utils/responseUtils";
import successMessages from "../../config/successMessages.json";
import errorMessages from "../../config/errorMessages.json";
import mongoose from "mongoose";

export const sendMessage = async (
  req: Request | CustomRequest,
  res: Response
) => {
  const { poolId, message } = req.body;
  const userId = (req as CustomRequest).user!.id;

  try {
    // Add additional fields to the message
    const enrichedMessage = {
      ...message,
      sender: new mongoose.Types.ObjectId(userId)
    };
    const newMessage = new Chat({
      poolId: new mongoose.Types.ObjectId(poolId),
      userId: new mongoose.Types.ObjectId(userId),
      message: enrichedMessage,
    });

    await newMessage.save();
    return res.status(201).json(successResponse(successMessages.messageSent));
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse(errorMessages.INTERNAL_SERVER_ERROR));
  }
};

export const getMessages = async (
  req: Request | CustomRequest,
  res: Response
) => {
  const { poolId } = req.params;
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  try {
    const messages = await Chat.find({ poolId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.json(successResponse(messages));
  } catch (error) {
    return res.status(500).json(errorResponse(errorMessages.INTERNAL_SERVER_ERROR));
  }
};
