const axios = require('axios');
const User = require('../models/User');

const FALLBACK_IMAGE =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PdN6NwAAAABJRU5ErkJggg==';

const toBase64 = (file) => file?.buffer?.toString('base64');

exports.tryOn = async (req, res) => {
  try {
    const userImage = req.files?.userImage?.[0];
    const clothImage = req.files?.clothImage?.[0];
    if (!userImage || !clothImage) {
      return res.status(400).json({ message: 'Both user and clothing images are required' });
    }

    const base64User = toBase64(userImage);
    const base64Cloth = toBase64(clothImage);

    let generatedImage = FALLBACK_IMAGE;
    let source = 'fallback';

    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt =
          'Generate a realistic image of this person wearing the given clothing item. Maintain body posture and face accuracy.';
        const payload = {
          contents: [
            {
              parts: [
                { text: prompt },
                { inlineData: { mimeType: userImage.mimetype, data: base64User } },
                { inlineData: { mimeType: clothImage.mimetype, data: base64Cloth } },
              ],
            },
          ],
        };

        const { data } = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
          payload,
          { headers: { 'Content-Type': 'application/json' } }
        );

        const contentPart = data?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
        if (contentPart?.inlineData?.data) {
          generatedImage = `data:image/png;base64,${contentPart.inlineData.data}`;
          source = 'gemini';
        } else if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          // if model responded with text, keep fallback but return message
          source = 'gemini-text';
        }
      } catch (apiError) {
        console.warn('Gemini try-on fallback used', apiError?.response?.data || apiError.message);
      }
    }

    if (req.user?.id) {
      const user = await User.findById(req.user.id);
      if (user) {
        user.savedTryOns.push({
          imageUrl: generatedImage,
          prompt: 'virtual try-on',
        });
        await user.save();
      }
    }

    res.json({
      resultImage: generatedImage,
      source,
    });
  } catch (error) {
    res.status(500).json({ message: 'Try-on failed', error: error.message });
  }
};
