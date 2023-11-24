import cors from 'cors';
import express, { Express, json } from 'express';
import 'express-async-errors';
import 'reflect-metadata';
import { errorHandlerMiddleware } from './errors';


const app = express();

app
  .use(cors())
  .use(json())
  .get('/health', (_req, res) => res.send(`OK! Ambiente: ${process.env.NODE_ENV}`))

  .use(errorHandlerMiddleware);



  export function init(): Promise<Express> {
    //connectDb();
    return Promise.resolve(app);
  }

  export async function close(): Promise<void> {
   // await disconnectDB();
  }

export default app;
