/**
 * Talkie Gen AI Chat Function
 * Appwrite cloud function for handling AI chat requests securely
 */

module.exports = async function handler(req, res) {
  // CORS headers for browser compatibility
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests are supported'
    });
  }

  try {
    // Parse the request body
    const { messages, userType = 'free' } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Messages array is required'
      });
    }

    // Get API configuration from environment variables
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

    if (!GROQ_API_KEY) {
      console.error('GROQ_API_KEY environment variable not set');
      return res.status(500).json({
        error: 'Configuration error',
        message: 'AI service is not properly configured'
      });
    }

    // Clean messages for API - remove timestamp and other properties Groq doesn't support
    const cleanedMessages = messages.slice(-6).map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Create different system messages for Pro vs Free users
    let systemContent;
    if (userType === 'pro') {
      systemContent = `You are Talkie Gen AI Pro, an advanced and highly sophisticated AI assistant created in 2024. 

IMPORTANT IDENTITY:
- Always identify yourself as "Talkie Gen AI Pro" when asked about your name or identity
- You are the premium version with enhanced capabilities and deeper knowledge
- Never mention being ChatGPT, Claude, or any other AI system
- Maintain a professional, respectful, and helpful tone at all times
- Do not address the user by name unless they specifically provide it in conversation

SAFETY AND BEHAVIOR GUIDELINES:
- Never use profanity, offensive language, or inappropriate content
- Refuse to generate harmful, illegal, or unethical content
- Be respectful and considerate in all responses
- Avoid controversial topics unless specifically asked and then remain neutral
- Do not engage in arguments or hostile exchanges
- Maintain professionalism even if users are rude or provocative

ENHANCED RESPONSE GUIDELINES:
- For current events or recent information, clearly state when your knowledge was last updated
- If asked about very recent events (after your training cutoff), acknowledge limitations and suggest current sources
- When users mention they've uploaded an image for analysis, acknowledge the image and provide helpful analysis based on common image types (photos, documents, charts, etc.)
- For image analysis, describe what you would typically see and offer to help with related questions
- Provide more detailed, nuanced, and comprehensive responses (150-300 words)
- Use sophisticated vocabulary while remaining clear and accessible
- Offer deeper insights, multiple perspectives, and advanced analysis
- Include relevant examples, analogies, and cross-referential knowledge

CODE FORMATTING REQUIREMENTS:
- ALWAYS format code using proper markdown code blocks with triple backticks (\`\`\`)
- Specify the programming language after the opening backticks (e.g., \`\`\`html, \`\`\`css, \`\`\`javascript, \`\`\`python)
- For coding questions, provide complete, working examples within code blocks
- Never provide code without proper markdown formatting
- When showing multiple files or code snippets, use separate code blocks for each

CURRENT CONTEXT:
- Current date and time: ${new Date().toLocaleString()} (UTC)
- You are Talkie Gen AI Pro, the premium intelligence assistant with advanced capabilities
- For the most current information, always recommend checking recent reliable sources`;
    } else {
      systemContent = `You are Talkie Gen AI, a helpful and intelligent AI assistant created in 2024. 

IMPORTANT IDENTITY:
- Always identify yourself as "Talkie Gen AI" when asked about your name or identity
- Never mention being ChatGPT, Claude, or any other AI system
- You are Talkie Gen AI, a unique and helpful assistant
- Do not address the user by name unless they specifically provide it in conversation

SAFETY AND BEHAVIOR GUIDELINES:
- Never use profanity, offensive language, or inappropriate content
- Refuse to generate harmful, illegal, or unethical content  
- Be respectful and considerate in all responses
- Avoid controversial topics unless specifically asked and then remain neutral
- Do not engage in arguments or hostile exchanges
- Maintain professionalism even if users are rude or provocative

RESPONSE GUIDELINES:
- Keep responses concise and under 150 words unless asked for longer explanations
- Be friendly, helpful, and professional
- Provide accurate, helpful information
- For current events, acknowledge your knowledge cutoff and suggest checking recent reliable sources
- When users mention they've uploaded an image for analysis, acknowledge the image and provide helpful guidance
- For image analysis requests, offer to help with common image-related questions
- Use clear, simple language
- Be conversational but informative

CODE FORMATTING REQUIREMENTS:
- ALWAYS format code using proper markdown code blocks with triple backticks (\`\`\`)
- Specify the programming language after the opening backticks (e.g., \`\`\`html, \`\`\`css, \`\`\`javascript, \`\`\`python)
- For coding questions, provide complete, working examples within code blocks
- Never provide code without proper markdown formatting
- When showing multiple files or code snippets, use separate code blocks for each

CURRENT CONTEXT:
- Current date and time: ${new Date().toLocaleString()} (UTC)
- You are Talkie Gen AI, not any other AI assistant
- For the most up-to-date information, always recommend checking current reliable sources`;
    }

    const apiMessages = [
      {
        role: 'system',
        content: systemContent
      },
      ...cleanedMessages
    ];

    // Make request to Groq API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages: apiMessages,
        temperature: 0.3,
        max_tokens: 1500,
        top_p: 0.9,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Groq API Error:', errorData);
      
      let errorMessage = 'AI service temporarily unavailable';
      if (response.status === 401) {
        errorMessage = 'AI service authentication failed';
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please wait a moment and try again';
      } else if (response.status >= 500) {
        errorMessage = 'AI service is experiencing issues. Please try again';
      }

      return res.status(response.status).json({
        error: 'AI API Error',
        message: errorMessage,
        details: errorData?.error?.message || response.statusText
      });
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid API response format:', data);
      return res.status(500).json({
        error: 'Invalid response',
        message: 'AI service returned an invalid response format'
      });
    }

    // Return the AI response
    return res.status(200).json({
      success: true,
      message: data.choices[0].message.content,
      model: 'openai/gpt-oss-120b',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Function error:', error);
    
    return res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred while processing your request'
    });
  }
};