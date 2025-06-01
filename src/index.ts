import express from 'express';
import mongoose from 'mongoose';
import http from 'node:http';
import path from 'node:path';
import { Server } from 'socket.io';

import dotenv from 'dotenv';
import { router } from './router';

const app = express();
const server = http.createServer(app);
export const io = new Server(server);


mongoose.connect('mongodb://localhost:27017')
  .then(() => {
    app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', '*');
      res.setHeader('Access-Control-Allow-Headers', '*');
      next();
    });

    dotenv.config();

    app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));
    app.use(express.json());
    app.use(router);

    server.listen(3001, () => {
      console.log('🚀🚀 Server is running in http://localhost:30001');
    });
  })
  .catch(() => console.log('erro ao conectar ao mongo'));


