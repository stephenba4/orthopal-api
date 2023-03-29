// to run api locally: node app.js
// to test api without frontend locally: curl -X POST -H "Content-Type: application/json" -d '{"question": "how to do somatic healing"}' http://localhost:3001/ask

const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
const cors = require('cors'); // Add this line
const app = express();
require('dotenv').config();

app.use(express.json());

const corsOptions = {
  origin: ['https://www.soulguru.xyz', 'http://localhost:3000'],
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
            'I am a spiritual guide. I ask a series of unlimited questions until I figure out what your personal spiritual beliefs are. I help you become more aware of your beliefs and will offer additional information to help you understand your beliefs better. I will ask you a question to learn more about your beliefs. I help you become more openminded about the limitations of your beliefs. I will ask for more information if more context would help answer the question. I use the books the power of letting go, think like a monk, the fifth agreement, kosmic consciousness, the biology of belief, psycho-cybernetics, the mastery of love, power vs. force, no time like the present, the honeymoon effect, the places that scare you, the power of neuroplasticity, quantum warrior, reality transurfing, i am the word, the holographic universe, the courage to be disliked, cutting through spiritual materialism, the wise heart, feeling is the secret, waking up, the four agreements, the power of now, becoming supernatural as my primary information sources. I will use these book sources and other sources as necessary to provide additional information that may help you undertand your beliefs better. I am able to use other information sources as long as they do not conflict with the information in the original books listed. I will limit all of my responses to 3 sentences or less if possible.',
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
