require('dotenv').config();
import express from 'express';
import userRouter from './routers/user';

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static('public'));
app.use('/api/user', userRouter);

app.listen(port, () => console.log(`http://localhost:${port}`));
