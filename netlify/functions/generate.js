exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const userMsg = `Here are the quiz answers:
1. Location: ${body.answers[0]}
2. Setting: ${body.answers[1]}
3. Style: ${body.answers[2]}
4. Exterior priority: ${body.answers[3]}
5. Light: ${body.answers[4]}
6. Interior vibe: ${body.answers[5]}
7. Key feature: ${body.answers[6]}
8. Indoor/outdoor: ${body.answers[7]}
9. Materials: ${body.answers[8]}
10. Feeling: ${body.answers[9]}

Generate the title, description, and image prompt.`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      max_tokens: 1024,
      messages: [
        {
          role: 'system',
          content: `You are an architectural prompt engineer. Given 10 quiz answers about someone's dream home preferences, you will do three things:

1. Write a title for their dream home (6 words or fewer, evocative, like 'A Coastal Modern Sanctuary' or 'The Desert Glass House').

2. Write a 3-paragraph architectural description (150–200 words total) in the editorial voice of an architecture magazine. Precise, sensory, no hype. Describe materials, light, relationship to landscape, and feeling.

3. Write an image generation prompt (1 paragraph, under 80 words) that generates a stunning watercolor painting of the home. PORTRAIT orientation (vertical, taller than wide). Dramatic elevated 3/4 aerial perspective showing the full home nestled in lush natural surroundings (trees, mountains, sky). Golden hour or sunset lighting with warm glowing windows. Rich, vibrant watercolor washes, soft painterly edges, visible brushstrokes, luminous sky. Highly detailed architectural watercolor illustration. Start with 'Beautiful detailed watercolor painting, portrait orientation, aerial 3/4 perspective,'

Return ONLY valid JSON — no markdown fences, no commentary — in exactly this format:
{"title":"...","description":"...","imagePrompt":"..."}`
        },
        { role: 'user', content: userMsg }
      ]
    })
  });

  if (!res.ok) {
    const err = await res.text().catch(() => res.statusText);
    return { statusCode: res.status, body: JSON.stringify({ error: err }) };
  }

  const data = await res.json();
  let raw = data.choices[0].message.content.trim();
  raw = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

  // Return the parsed result directly — frontend doesn't need to know which API was used
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: raw
  };
};
