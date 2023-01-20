import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';

import Area from '../models/Area';

const getAllAreasByUser = async (req: Request, res: Response) => {
  if (!req.userId) {
    return res.status(400).json({ error: 'Invalid request' });
  }
  const userId = req.userId;

  try {
    const areas = await new Area().getAllAreasByUser({ userId });
    if (!areas) {
      return res.status(404).json({ error: 'Areas not found' });
    }
    res.status(200).json(areas);
  } catch (error) {
    console.log(`Areas for user not found: ${error}`);
    res.status(500).json({ error: 'Failed to fetch areas' });
  }
};

const createArea = async (req: Request, res: Response) => {
  if (!req.userId) {
    return res.status(400).json({ error: 'Invalid request' });
  }
  const userId = req.userId;

  if (!req.body || !req.body.areaName) {
    return res.status(400).json({ error: 'Area name is required' });
  }

  const { areaName } = req.body;
  const payload = {
    userId,
    area: areaName,
  };

  try {
    const insertedId = await new Area().createArea(payload);
    res.status(201).json({ insertedId });
  } catch (error) {
    console.log(`Area not created: ${error}`);
    res.status(500).json({ error: 'Failed to create area' });
  }
};

const deleteArea = async (req: Request<{ id: ObjectId }>, res: Response) => {
  if (!req.params || !req.params.id) {
    return res.status(400).json({ error: 'Invalid request' });
  }
  const { id } = req.params;
  if (!req.userId) {
    return res.status(400).json({ error: 'Invalid request' });
  }
  const userId = req.userId;
  try {
    const payload = {
      userId,
      id,
    };
    await new Area().deleteArea(payload);
    res.status(200).json({ msg: `Area deleted id: ${payload.id}` });
  } catch (error) {
    console.log(`Area not deleted: ${error}`);
    res.status(500).json({ error: 'Failed to delete Area' });
  }
};

export { deleteArea, createArea, getAllAreasByUser };