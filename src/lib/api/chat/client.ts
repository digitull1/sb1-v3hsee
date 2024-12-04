import { Groq } from 'groq-sdk';

export class GroqError extends Error {
  constructor(
    message: string,
    public readonly code: 'API_ERROR' | 'PARSE_ERROR' | 'VALIDATION_ERROR',
    public readonly context?: any
  ) {
    super(message);
    this.name = 'GroqError';
  }
}

const client = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function makeGroqRequest<T>(
  messages: any[],
  config = {},
  validate?: (data: any) => T
): Promise<T> {
  try {
    const completion = await client.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages,
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" },
      ...config
    });

    const content = completion.choices?.[0]?.message?.content;
    if (!content) {
      throw new GroqError(
        'Empty API response',
        'API_ERROR',
        { completion }
      );
    }

    let parsedData;
    try {
      parsedData = JSON.parse(content);
    } catch (error) {
      throw new GroqError(
        'Failed to parse response',
        'PARSE_ERROR',
        { content, error }
      );
    }

    if (validate) {
      try {
        return validate(parsedData);
      } catch (error) {
        throw new GroqError(
          'Invalid response format',
          'VALIDATION_ERROR',
          { parsedData, error }
        );
      }
    }

    return parsedData as T;
  } catch (error) {
    if (error instanceof GroqError) {
      throw error;
    }
    throw new GroqError(
      'API request failed',
      'API_ERROR',
      { error }
    );
  }
}

export { client };