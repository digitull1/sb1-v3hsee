export function getInputPlaceholder(userName?: string): string {
  return userName 
    ? ['What would you like to learn about,', userName + '?', '✨'].join(' ')
    : ['What would you like to learn about?', '✨'].join(' ');
}

export function formatMessage(content: string): string {
  return content.trim();
}

export function generateMessageId(): string {
  return ['msg', Date.now(), Math.random().toString(36).slice(2)].join('-');
}