import { client, API_CONFIG } from '../client/config';
import { APIError } from '../client/error';
import { withRateLimit } from '../client/rateLimit';
import { validateBlocks } from './validators';
import type { Block } from '../../types';

interface BlockGenerationParams {
  content: string;
  age: number;
  difficulty: string;
  count?: number;
}

export async function generateContextualBlocks({
  content,
  age,
  difficulty,
  count = 3
}: BlockGenerationParams): Promise<Block[]> {
  const prompt = [
    `Analyze this content and generate ${count} engaging follow-up questions for a ${age} year old child:`,
    '',
    `Content: "${content}"`,
    '',
    'Guidelines:',
    '1. Questions should directly relate to the content',
    '2. Use age-appropriate language and concepts',
    '3. Build upon what was just discussed',
    '4. Encourage deeper exploration',
    `5. Match the ${difficulty} difficulty level`,
    '',
    'Format as JSON:',
    '{',
    '  "blocks": [',
    '    {',
    '      "title": "Follow-up question?",',
    '      "description": "Brief preview",',
    '      "topic": "Relevant topic category",',
    `      "difficulty": "${difficulty}"`,
    '    }',
    '  ]',
    '}'
  ].join('\n');

  return withRateLimit(async () => {
    try {
      const completion = await client.chat.completions.create({
        ...API_CONFIG,
        messages: [
          {
            role: "system",
            content: "You are an expert in creating educational content for children."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      });

      const content = completion.choices[0].message?.content;
      if (!content) {
        throw new APIError(
          'Empty response from API',
          'API_ERROR',
          { completion }
        );
      }

      const response = JSON.parse(content);
      return validateBlocks(response.blocks);
    } catch (error) {
      throw APIError.fromError(error);
    }
  }, API_CONFIG.max_tokens);
}