export function handleStoreError(error: unknown): string {
  console.error('Store error:', error);

  if (error instanceof Error) {
    if (error.name === 'QuotaExceededError') {
      return 'Storage quota exceeded. Please clear some browser data.';
    }
    if (error.message.includes('IndexedDB')) {
      return 'Unable to access storage. Please check your browser settings.';
    }
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}