import express from 'express';
import remindersRouter from './routes/reminders';

const port = 3000;
const app = express();

app.use(express.json());
app.use('/reminders', remindersRouter);

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.listen(port, () => console.log(`Server is running in port: ${port}`));
