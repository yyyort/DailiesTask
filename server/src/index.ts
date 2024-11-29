import express from 'express';
import { Response, Request } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import UserRoutes from './route/user.route';
import TaskRoutes from './route/task.route';

/* config */
dotenv.config();
export const app = express();
const PORT = process.env.PORT || 4000;
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(cors(
  {
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  }
));
app.use(morgan('common'));

/* routes */

app.get('/', (_: Request, res: Response) => {
  res.status(200).json({ message: 'Server is running' });
});

app.use('/api', UserRoutes);
app.use('/api', TaskRoutes);

/* server */
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});