// Write function to handle chat generation
import { GoogleGenAI } from '@google/genai'; // Ensure you have the correct package installed
import dotenv from 'dotenv';
dotenv.config();

export const handleChatGeneration = async (req, res) => {
  // console.log(req.body.inputs);
  const input = req.body.input;
  console.log('Received input:', input);
  if (!input) {
    return res.status(400).json({ error: 'Input is required' });
  }
  const ai = new GoogleGenAI(process.env.GOOGLE_API_KEY);
  try {
    // console.log('Received prompt:', Prompt);
     const chat = await ai.chats.create({
    model: "gemini-2.5-flash",
    history: req.body.history,
  });
   res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
  const response = await chat.sendMessageStream({
    message: req.body.input,
  });
  
  for await (const chunk of response) {
    const text = chunk.text || '';
     res.write(JSON.stringify(text) + '\n\n');
     res.write("--".repeat(2) + '\n\n');
  }




  // console.log('Chat response:', response.text);

  // res.send(`${JSON.stringify(response.text)}`);

  //res.json({response: response.text}); 
  } catch (error) {
    console.error('Error generating chat response:', error);
    res.status(500).json({error: 'Failed to generate chat response'});
  } finally {
    if (!res.writableEnded) {
      res.end();
    }
    
  }
};

