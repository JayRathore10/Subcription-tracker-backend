import { Response, NextFunction } from "express";
import { Subcription, SubcriptionDocument } from '../models/subcription.model';
import { UserRequest } from "../types/userRequest.types";
import { Types } from "mongoose";
import { workflowClient } from "../configs/upstash.config";
import { SERVER_URL } from "../configs/env.config";

export const createSubcription = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || !req.user._id) {
      const error: any = new Error("User data is missing");
      error.statusCode = 404;
      throw error;
    }

    // Create new subscription document
    const subcription: SubcriptionDocument = new Subcription({
      ...req.body,
      user: req.user._id
    });

    await subcription.save();

    let workflowRunId: string | undefined;

    // Only trigger QStash workflow if signing key exists
    if (process.env.QSTASH_CURRENT_SIGNING_KEY) {
      const result = await workflowClient.trigger({
        url: `${SERVER_URL}/api/v1/workflows/subcription/reminder`,
        body: { subcriptionId: subcription._id },
        headers: { "content-type": "application/json" },
        retries: 0,
      });

      workflowRunId = result.workflowRunId;
    }

    return res.status(201).json({
      success: true,
      data: {
        subcription,
        workflowRunId
      }
    });

  } catch (error: any) {
    next(error);
  }
};


export const getUserSubcriptions = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || !req.user._id) {
      const error: any = new Error("User data is missing");
      error.statusCode = 404;
      throw error;
    }

    const userId = new Types.ObjectId(req.user._id);

    if (userId.toString() !== req.params.id) {
      const error: any = new Error("You are not the owner of the account");
      error.statusCode = 401;
      throw error;
    }

    const subscriptions = await Subcription.find({
      user: req.params.id as any 
    });

    return res.status(200).json({
      success: true,
      data: subscriptions
    });

  } catch (error) {
    next(error);
  }
};
