import { Request, Response} from 'express';

import Dev from '../models/Dev';

export default {
  async store(request: Request, response: Response) {
    const { user } = request.headers;
    
    const { devId } = request.params;

    const loggedDev = await Dev.findById(user);

    let targetDev = null

    try {
      targetDev = await Dev.findById(devId);
    } catch (error) {
      return response.status(400).json({ error: 'Dev not exists' });
    }

    loggedDev.dislikes.push(targetDev._id);

    await loggedDev.save();

    return response.json(loggedDev);
  }
}