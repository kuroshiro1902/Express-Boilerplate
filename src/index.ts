import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import router from '@/router';
import { setupAssociations } from './models';

setupAssociations();

const app = express();
app.use(bodyParser.json({ limit: '1mb' }));
app.use(express.json());
app.use(cors());

app.use(
  '/api',
  (req, res, next) => {
    console.log(req.hostname + ' sends request.');
    next();
  },
  router
);

app.listen(4537, () => {
  console.log('listening on port 4537');
});
