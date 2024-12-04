import { client, API_CONFIG, RATE_LIMIT } from '../client/config';
import { APIError } from '../client/error';
import { withRateLimit } from '../client/rateLimit';
import { createSystemPrompt } from './prompts';
import { validateResponse } from './validators';
import { generateContextualBlocks } from './blockGenerator';
import type { Message, ChatResponse } from '../../types';

export async function generateResponse(
  messages: Message[],
  age: number,
  includeQuiz = false,
  context: string[] = [],
  difficulty = 'easy'
): Promise<ChatResponse> {
  const lastMessage = messages[messages.length - 1];
  const systemPrompt = createSystemPrompt(age, difficulty, includeQuiz);
  
  const contextPrompts = context.map(ctx => ({
    role: 'system' as const,
    content: 'Previous context: ' + ctx
  }));

  const userPrompt = {
    role: 'user' as const,
    content: lastMessage.content
  };

  return withRateLimit(async () => {
    try {
      const completion = await client.chat.completions.create({
        ...API_CONFIG,
        messages: [systemPrompt, ...contextPrompts, userPrompt]
      });

      const content = completion.choices[0].message?.content;
      if (!content) {
        throw new APIError(
          'Empty response from API',
          'API_ERROR',
          { completion }
        );
      }

      const response = validateResponse(JSON.parse(content));
      const blocks = await generateContextualBlocks({
        content: response.content,
        age,
        difficulty
      });

      return {
        content: response.content,
        blocks,
        quiz: response.quiz,
      };
    } catch (error) {
      throw APIError.fromError(error);
    }
  }, RATE_LIMIT.estimatedTokens.chat);
}