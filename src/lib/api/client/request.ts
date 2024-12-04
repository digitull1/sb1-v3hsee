import { client, DEFAULT_CONFIG } from './config';
import { withRateLimit } from './rateLimit';
import { APIError } from './error';

export async function makeRequest<T>(
  messages: any[],
  validate?: (data: any) => T,
  config = {}
): Promise<T> {
  return withRateLimit(async () => {
    try {
      const completion = await client.chat.completions.create({
        ...DEFAULT_CONFIG,
        messages,
        ...config,
      });

      const content = completion.choices?.[0]?.message?.content;
      if (!content) {
        throw new APIError(
          'Empty API response',
          'API_ERROR',
          { completion }
        );
      }

      let parsedData;
      try {
        parsedData = JSON.parse(content);
      } catch (error) {
        throw new APIError(
          'Failed to parse response',
          'PARSE_ERROR',
          { content, error }
        );
      }

      if (validate) {
        try {
          return validate(parsedData);
        } catch (error) {
          throw new APIError(
            'Invalid response format',
            'VALIDATION_ERROR',
            { parsedData, error }
          );
        }
      }

      return parsedData as T;
    } catch (error) {
      throw APIError.fromError(error);
    }
  });
}