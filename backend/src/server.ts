import express from 'express';

import cors from 'cors';

import { createServer } from "http";

import { Server } from "socket.io";

import mongoose from 'mongoose';

import routes from './routes';

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '',
    methods: ['GET', 'POST']
  },
});

mongoose.connect('mongodb+srv://<username>:<password>@cluster0.admyh.mongodb.net/<databasename>?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connectedUsers: { [key: string]: string; } = {};

io.on('connection', socket => {
  const { user_id } = socket.handshake.query;

  connectedUsers[String(user_id)] = socket.id;
});

declare global {
  namespace Express {
    interface Request {
      io: any;
      connectedUsers: any;
    }
  }
};

app.use((request, response, next) => {
  request.io = io;
  request.connectedUsers = connectedUsers;

  return next();
});

app.use(cors());
app.use(express.json());
app.use(routes);

httpServer.listen(3333, () => {
  console.log('server started.')
});