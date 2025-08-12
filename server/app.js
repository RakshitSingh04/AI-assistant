// /create Express app
import express from 'express';
import chatRoutes from './routes/chat.js';
import cors from 'cors';// Middleware to parse JSON requests
import bodyParser from 'body-parser';

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
// Import routes
app.use('/api/chat', chatRoutes);



app.listen(5000, () => {
  console.log('Server is running on port 5000');
});