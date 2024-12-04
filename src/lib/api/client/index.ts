```typescript
import { client, API_CONFIG, RATE_LIMIT } from './config';
import { APIError } from './error';
import { withRateLimit } from './rateLimit';

export {
  client,
  API_CONFIG,
  RATE_LIMIT,
  APIError,
  withRateLimit
};
```