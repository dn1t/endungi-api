require('dotenv').config();
import express from 'express';
import { join } from 'path';
import userRouter from './routers/user';

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static('public'));
app.use('/api/user', userRouter);

app.get('*', (_, res) => res.sendFile(join(__dirname, '../public/index.html')));

app.listen(port, () => console.log(`http://localhost:${port}`));
