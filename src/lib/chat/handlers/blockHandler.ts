import type { Block } from '../../../types';

interface BlockHandlerParams {
  block: Block;
  setCurrentTopic: (topic: string | null) => void;
  handleSend: (content: string) => void;
}

export function handleBlockClick({
  block,
  setCurrentTopic,
  handleSend,
}: BlockHandlerParams): void {
  if (block.parentId) {
    setCurrentTopic(block.parentId);
  }
  handleSend(`Tell me about ${block.title}`);
}