import { Request, Response } from "express";
import Pool from "../../models/Pool";
import Voter from "../../models/Voter";
import { IPool } from "../../interfaces/IPool";
import { CustomRequest } from "../../interfaces/CustomRequest";
import { successResponse, errorResponse } from "../../utils/responseUtils";
import errorMessages from "../../config/errorMessages.json";
import mongoose from "mongoose";
import { updatePollingResults } from "../../socket/pooling/index";

export const createPool = async (
  req: Request | CustomRequest,
  res: Response
) => {
  const { topic, options } = req.body;
  const userId = (req as CustomRequest).user!.id;

  try {
    const newPool: IPool = new Pool({
      topic,
      options,
      createdBy: new mongoose.Types.ObjectId(userId),
      votes: options.reduce((acc: any, option: string) => {
        acc[option] = 0;
        return acc;
      }, {}),
    });

    await newPool.save();
    return res.status(201).json(successResponse(newPool));
  } catch (error) {
    return res
      .status(500)
      .json(errorResponse(errorMessages.INTERNAL_SERVER_ERROR));
  }
};

export const votePool = async (req: Request | CustomRequest, res: Response) => {
  const { poolId, option } = req.body;
  const userId = (req as CustomRequest).user!.id;

  try {
    const pool = await Pool.findById(poolId);
    if (!pool) {
      return res.status(404).json(errorResponse(errorMessages.poolNotFound));
    }

    if (!pool.options.includes(option)) {
      return res.status(400).json(errorResponse(errorMessages.invalidOption));
    }

    const existingVoter = await Voter.findOne({ userId, poolId });
    if (existingVoter) {
      return res.status(400).json(errorResponse(errorMessages.alreadyVoted));
    }

    const newVoter = new Voter({ userId: new mongoose.Types.ObjectId(userId), poolId, option });
    await newVoter.save();

    pool.votes[option] = (pool.votes[option] || 0) + 1;
    pool.markModified('votes');
    await pool.save();

    // Update polling results for all connected clients
    updatePollingResults(req.app.get("socketServer"), poolId);

    return res.json(successResponse(pool));
  } catch (error) {
    return res
      .status(500)
      .json(errorResponse(errorMessages.INTERNAL_SERVER_ERROR));
  }
};

export const getPools = async (_: Request, res: Response) => {
  try {
    const pools = await Pool.find();
    return res.json(successResponse(pools));
  } catch (error) {
    return res
      .status(500)
      .json(errorResponse(errorMessages.INTERNAL_SERVER_ERROR));
  }
};

export const getPool = async (req: Request, res: Response) => {
  try {
    const pools = await Pool.findById(req.params.poolId);
    return res.json(successResponse(pools));
  } catch (error) {
    return res
      .status(500)
      .json(errorResponse(errorMessages.INTERNAL_SERVER_ERROR));
  }
};
