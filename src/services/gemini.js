// Native Browser & REST Gemini Service for StudySpace
// Uses models available in the current environment with automatic fallback

const getApiKey = () => {
  let key = '';
  try {
    key = 
      import.meta.env.Gemini_api_key || 
      import.meta.env.VITE_GEMINI_API_KEY || 
      (typeof process !== 'undefined' && process.env?.Gemini_api_key) || 
      '';
  } catch (e) {
    key = '';
  }
  return key;
};

const SYSTEM_INSTRUCTION = `You are StudyBot, an encouraging, highly knowledgeable, and clear AI study partner and tutor.
Your mission is to help students understand complex concepts, break down problems step-by-step, generate active recall questions, and stay motivated.
Format your responses using clean Markdown with bold headers, concise bullet points, and code blocks where applicable. Ensure your explanations and answers are thorough and complete.`;

// Primary fast model with tested fallbacks
const CANDIDATE_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest'
];

/**
 * Ensures message history conforms to Gemini API rules:
 * 1. The first message must always have role 'user'
 * 2. Roles alternate user -> model -> user -> model
 */
const sanitizeContents = (history, userPrompt) => {
  const contents = [];
  let hasEncounteredUser = false;

  if (Array.isArray(history)) {
    for (const msg of history) {
      if (msg.role === 'user' && msg.text?.trim()) {
        hasEncounteredUser = true;
        contents.push({
          role: 'user',
          parts: [{ text: msg.text.trim() }]
        });
      } else if (hasEncounteredUser && msg.role === 'assistant' && msg.text?.trim()) {
        contents.push({
          role: 'model',
          parts: [{ text: msg.text.trim() }]
        });
      }
    }
  }

  // Append latest user message
  contents.push({
    role: 'user',
    parts: [{ text: userPrompt.trim() }]
  });

  return contents;
};

export const sendStudyBotMessage = async (history, userPrompt) => {
  const apiKey = getApiKey();

  if (!apiKey) {
    return {
      success: false,
      text: "⚠️ **Gemini API Key Missing**: Please ensure `Gemini_api_key=...` is set in your `.env` file at the root of the project, then restart your dev server (`npm run dev`)."
    };
  }

  const contents = sanitizeContents(history, userPrompt);
  let lastErrorMsg = null;

  // Try candidate models in sequence
  for (const model of CANDIDATE_MODELS) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout limit

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      
      const payload = {
        contents,
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }]
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096, // High token ceiling to prevent truncating long study plans or quizzes
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        const errorDetail = data.error?.message || `HTTP ${response.status}`;
        console.warn(`Model ${model} failed with:`, errorDetail);
        lastErrorMsg = errorDetail;
        continue;
      }

      const candidate = data.candidates?.[0];
      const replyText = candidate?.content?.parts?.[0]?.text;

      if (replyText) {
        return { success: true, text: replyText };
      } else if (candidate?.finishReason) {
        return { 
          success: true, 
          text: `*(StudyBot finished with: ${candidate.finishReason})*` 
        };
      }
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        console.warn(`Model ${model} timed out, trying fallback...`);
        lastErrorMsg = "Request timed out";
      } else {
        console.warn(`Model ${model} request error:`, err.message);
        lastErrorMsg = err.message;
      }
    }
  }

  // If all models failed
  return {
    success: false,
    text: `⚠️ **StudyBot Notice**: ${
      lastErrorMsg?.includes('503') || lastErrorMsg?.includes('demand')
        ? "Gemini servers are experiencing temporary high demand. Please try sending your message again in a few seconds."
        : lastErrorMsg || "Unable to reach the Gemini API. Please check your internet connection and API key."
    }`
  };
};
