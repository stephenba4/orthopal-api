const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
const cors = require('cors'); // Add this line
const app = express();
require('dotenv').config();

app.use(express.json());

const corsOptions = {
  // TO DO: edit cors origin to include the referer url of the front end website
  origin: ['https://orthopal-fe.vercel.app', 'http://localhost:3000'],
};
app.use(cors(corsOptions));

const apiKey = `${process.env.API_KEY}`;
const configuration = new Configuration({ apiKey: apiKey });
const openai = new OpenAIApi(configuration);

app.post('/ask', async (req, res) => {
  const question = req.body.question;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            // TO DO: edit the prompt to give the bot a mission
            'I am OrthoPal, a chatbot that answers questions related to orthopedic surgery. I exclusively answer questions about orthopedic surgery. I do not answer questions about other topics. If the question from the user is not about orthopedic surgery then, I suggest they ask an orthopedic surgery related question. I use the latest technology and evidence-based research to generate responses that are accurate and up-to-date. I have some limitations. I cannot provide medical advice or diagnoses, as this is outside the scope of my capabilities. Additionally, while I strive to provide comprehensive information, there may be cases where users require more personalized or in-depth care. In such cases, I encourage users to seek the advice of a medical professional. Nonetheless, I am committed to providing concise and easy-to-understand responses that empower users to make informed decisions about their health. I always respond with 3 sentences or less if possible.',
        },
        { role: 'user', content: question },
      ],
      temperature: 0.7,
      // usage: {
      //   prompt_tokens: 30,
      //   completion_tokens: 30,
      //   total_tokens: 60,
      // },
    });

    const answer = response.data.choices[0].message.content.trim();
    res.json({ question, answer });
  } catch (error) {
    console.error('Error querying GPT-3:', error.response.data);
    res
      .status(500)
      .json({ error: 'Error querying GPT-3', details: error.response.data });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
