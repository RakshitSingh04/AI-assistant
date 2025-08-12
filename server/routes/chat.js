// this is a route file for handling chat-related requests
import express from 'express';
import { handleChatGeneration } from '../controller/generate.js';

const router = express.Router();

// Define your chat-related routes here
router.post('/generate', handleChatGeneration);

export default router;
