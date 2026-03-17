const Groq = require('groq-sdk');

const groqClient = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

const fallbackReply = (userMessage) =>
  `Style tip: ${userMessage ? `For "${userMessage}", ` : ''}try pairing neutral layers with one statement piece.`;

exports.chat = async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: 'Message is required' });

  if (!groqClient) {
    return res.json({ reply: fallbackReply(message), source: 'fallback' });
  }

  try {
    const completion = await groqClient.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'system',
          content:
            'You are a concise fashion assistant. Provide outfit ideas, sizing guidance, and style recommendations in 2-3 sentences.',
        },
        { role: 'user', content: message },
      ],
    });

    const reply = completion.choices?.[0]?.message?.content || fallbackReply(message);
    res.json({ reply, source: 'groq' });
  } catch (error) {
    console.warn('Groq error', error.message);
    res.json({ reply: fallbackReply(message), source: 'fallback' });
  }
};
