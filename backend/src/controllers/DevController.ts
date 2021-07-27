import { Request, Response} from 'express';

import axios from 'axios';

import Dev from '../models/Dev';

export default {
  async index(request: Request, response: Response) {
    const { user } = request.headers;

    const loggedDev = await Dev.findById(user);

    const users = await Dev.find({
      $and: [
        { _id: { $ne: user } },
        { _id: { $nin: loggedDev.likes } },
        { _id: { $nin: loggedDev.dislikes } },
      ],
    });

    return response.json(users);
  },

  async store(request: Request, response: Response) {
    const { username } = request.body;

    const userExists = await Dev.findOne({ user: username });

    if (userExists)
      return response.json(userExists);

    const res = await axios.get(`https://api.github.com/users/${username}`);

    const { name, bio, avatar_url: avatar } = res.data;

    const dev = await Dev.create({
      name,
      user: username,
      bio,
      avatar
    });

    return response.json(dev);
  }
}