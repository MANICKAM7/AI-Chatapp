import { getGeminiClient } from '../config/gemini.js';

// Gemini model
const MODEL = 'gemini-3.7-flash';

/**
 * Send message with limited retry
 *
 * We retry only once when Gemini temporarily returns
 * 503 / UNAVAILABLE / high demand errors.
 */
const sendWithRetry = async (chat, message, maxRetries = 1) => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await chat.sendMessage({
        message,
      });

      return response;
    } catch (error) {
      const errorMessage = error?.message || '';

      const isTemporaryError =
        errorMessage.includes('503') ||
        errorMessage.includes('UNAVAILABLE') ||
        errorMessage.includes('high demand');

      // Don't retry other errors
      if (!isTemporaryError || attempt === maxRetries) {
        throw error;
      }

      // Wait only 1 second before retry
      console.log(
        '[Gemini] Temporary error. Retrying once in 1 second...'
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
};


/**
 * Generate AI response using Gemini
 */
export const generateAIResponse = async (
  history = [],
  newMessage
) => {
  const ai = getGeminiClient();

  // Check API key
  if (!ai) {
    throw new Error(
      'GEMINI_API_KEY is not configured. Please check server/.env'
    );
  }

  try {
    /**
     * Convert MongoDB conversation messages
     * into Gemini history format.
     */
    const formattedHistory = history
      .filter(
        (msg) =>
          (msg.role === 'user' || msg.role === 'assistant') &&
          msg.content
      )
      .map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',

        parts: [
          {
            text: msg.content,
          },
        ],
      }));


    /**
     * Create Gemini chat
     */
    const chat = ai.chats.create({
      model: MODEL,

      history: formattedHistory,

      config: {
        systemInstruction:
          'You are NexusAI, an intelligent, friendly, and helpful AI assistant. ' +
          'Answer questions clearly and accurately. ' +
          'For programming questions, provide useful explanations and examples. ' +
          'Format code using Markdown code blocks with the correct language identifier. ' +
          'Keep answers structured and easy to understand.',
      },
    });


    /**
     * Send message
     *
     * Only ONE retry is allowed.
     */
    const response = await sendWithRetry(
      chat,
      newMessage,
      1
    );


    /**
     * Get AI response text
     */
    const text = response?.text;

    if (!text) {
      throw new Error(
        'Gemini returned an empty response.'
      );
    }

    return text;

  } catch (error) {
    console.error(
      '[Gemini API Error]:',
      error?.message || error
    );


    /**
     * 401 - Invalid API key
     */
    if (
      error?.message?.includes('401') ||
      error?.message?.includes('API key not valid') ||
      error?.message?.includes('API_KEY_INVALID')
    ) {
      throw new Error(
        'Gemini API key is invalid. Please check your GEMINI_API_KEY in server/.env'
      );
    }


    /**
     * 403 - Permission denied
     */
    if (error?.message?.includes('403')) {
      throw new Error(
        'Gemini API permission denied. Check your API key and project permissions.'
      );
    }


    /**
     * 404 - Model unavailable
     */
    if (error?.message?.includes('404')) {
      throw new Error(
        `Gemini model "${MODEL}" is unavailable. Please use an available Gemini model.`
      );
    }


    /**
     * 429 - Rate limit / quota
     */
    if (
      error?.message?.includes('429') ||
      error?.message?.toLowerCase().includes('quota')
    ) {
      throw new Error(
        'Gemini API quota or rate limit reached. Please try again later.'
      );
    }


    /**
     * 503 - Temporary Gemini server problem
     */
    if (
      error?.message?.includes('503') ||
      error?.message?.includes('UNAVAILABLE') ||
      error?.message?.includes('high demand')
    ) {
      throw new Error(
        'Gemini is temporarily unavailable because the model is experiencing high demand. Please try again shortly.'
      );
    }


    /**
     * Other errors
     */
    throw new Error(
      `Gemini API Error: ${
        error?.message || 'Unknown error'
      }`
    );
  }
};


/**
 * Generate conversation title
 */
export const generateConversationTitle = async (prompt) => {

  // Invalid prompt
  if (!prompt || typeof prompt !== 'string') {
    return 'New Chat';
  }

  const ai = getGeminiClient();

  /**
   * If Gemini is unavailable,
   * create title locally.
   */
  if (!ai) {
    return createFallbackTitle(prompt);
  }

  try {

    const response = await ai.models.generateContent({
      model: MODEL,

      contents:
        `Generate a short 3 to 5 word title for a conversation ` +
        `that starts with this message:\n\n` +
        `"${prompt}"\n\n` +
        `Return ONLY the title. ` +
        `Do not use quotes, punctuation, or explanations.`,
    });


    const title = response?.text
      ?.trim()
      .replace(/["']/g, '');


    if (title && title.length < 50) {
      return title;
    }

  } catch (error) {

    console.warn(
      '[Title Generation Warning]:',
      error?.message || error
    );
  }


  /**
   * If title generation fails,
   * use local title.
   */
  return createFallbackTitle(prompt);
};


/**
 * Local fallback title generator
 */
function createFallbackTitle(prompt) {

  const clean = prompt
    .trim()
    .replace(/[^\w\s]/gi, '');


  const words = clean
    .split(/\s+/)
    .slice(0, 5)
    .join(' ');


  if (!words) {
    return 'New Conversation';
  }


  return (
    words.charAt(0).toUpperCase() +
    words.slice(1)
  );
}