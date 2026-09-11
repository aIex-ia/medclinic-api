import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './database/data-source';
import * as dotenv from 'dotenv';
import { authRoutes } from './routes/authRoutes';
import { errorMiddleware } from './middlewares/errorMiddleware';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
