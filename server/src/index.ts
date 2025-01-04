import express from 'express';
import { Response, Request } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
//import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import UserRoutes from './route/user.route';
import TaskRoutes from './route/task.route';
import RoutineRoutes from './route/routine.route';
import { taskTodayCronService } from './service/taskToday.service';
import ContributionRoutes from './route/contribution.route';
import NotesRouter from './route/notes.route';



export const app = express();

const PORT = process.env.PORT;
app.use(cookieParser());
app.use(cors(
  {
    origin: process.env.WEB_URL,
    credentials: true,
  }
));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/* app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
 */
app.use(morgan('common'));

/* routes */

app.get('/', (_: Request, res: Response) => {
  res.status(200).json({ message: 'Server is running' });
});

app.use('/api', UserRoutes);
app.use('/api', TaskRoutes);
app.use('/api', RoutineRoutes);
app.use('/api', ContributionRoutes);
app.use('/api', NotesRouter);

/* 
  cron job
*/
taskTodayCronService.start();



/* server */
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});