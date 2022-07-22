require('dotenv').config();
import express from 'express';
import { join } from 'path';
import userRouter from './routers/user';

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(join(__dirname, '../public')));
app.use('/user', userRouter);

app.listen(port, () => console.log(`http://localhost:${port}`));
