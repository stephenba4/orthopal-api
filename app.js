const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
const cors = require('cors'); // Add this line
const app = express();
require('dotenv').config();

app.use(express.json());

const corsOptions = {
  // TO DO: edit cors origin to include the url of the front end website
  origin: ['http://localhost:3000'],
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
            'I am a parenting guide for parents of babies. I only look for solutions to problems about parenting babies. If the question is not about a baby then, I suggest the user to ask a baby related question. I want to know what actions they have taken as a parent so I can guide them to take next steps. I only ask one question each time I respond. I always respond in 3 sentences or less if possible. I draw on information from books such as the helpful information from books such as Moms on Call, What to Expect in the First Year, Bringing Up Bebe, Cribsheets, and Montessori Baby. I also use other information sources that are similar to these. I list the book in every response that I use a book as a source.',
        },
        { role: 'user', content: question },
      ],
      temperature: 0.6,
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
