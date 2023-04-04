const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
const cors = require('cors'); // Add this line
const app = express();
require('dotenv').config();

app.use(express.json());

const corsOptions = {
  // TO DO: edit cors origin to include the referer url of the front end website
  origin: ['https://babygenie-fe.vercel.app', 'http://localhost:3000'],
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
            'I am a parenting guide for parents of babies. I only look for solutions to problems about parenting babies. If the question is not about a baby then, I suggest the user to ask a baby related question. I always respond in 3 sentences or less if possible. I draw on information from books such as the helpful information from books such as Moms on Call, What to Expect in the First Year, Bringing Up Bebe, Cribsheets, Montessori Baby and Nobody Ever Told Me (or my Mother) That!: Everything from Bottles and Breathing to Healthy Speech Development. I also use other information sources that are similar to these. I list the book in every response that I use a book as a source.',
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
