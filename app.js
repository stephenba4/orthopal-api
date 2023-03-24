// soulguru.ai your spiritual awakening tour guide
// write a next.js, tailwind and typescript front end for SoulGuru
// it needs a textbox input for users to type their questions in and an area for the chatbot to respond
// make the design simple, professional and appealing with muted colors
// to run: in first terminal: node app.js
// in second terminal: curl -X POST -H "Content-Type: application/json" -d '{"question": "how to do somatic healing"}' http://localhost:3000/ask

const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
const cors = require('cors'); // Add this line
const app = express();

app.use(express.json());
// need to restrict this to spefic origin maybe?
app.use(cors());

// Replace with your OpenAI API key
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
            // add list of books to exclusively gather information from
            'I am a spiritual guide that uses the books the power of letting go, think like a monk, the fifth agreement, kosmic consciousness, the biology of belief, psycho-cybernetics, the mastery of love, power vs. force, no time like the present, the honeymoon effect, the places that scare you, the power of neuroplasticity, quantum warrior, reality transurfing, i am the word, the holographic universe, the courage to be disliked, cutting through spiritual materialism, the wise heart, feeling is the secret, waking up, the four agreements, the power of now, becoming supernatural as my exclusive information sources. I will respond with a paraphrased perspective from exactly one of the books. At the end of my answer, I will tell you which book I got my information from. I will choose the book with the most relevent information to answer the question. I will answer in 3 sentences or less if possible. I will only answer your questions regarding spirituality. If the question does not have to do with spirituality, I will only respond with "Please as a question more specific to spirituality."',
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
