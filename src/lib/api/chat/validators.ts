import { APIError } from '../client';
import type { Block, DifficultyLevel, ChatResponse } from '../../../types';
import { getTopicIcon } from '../../utils';

export function validateResponse(data: any): ChatResponse {
  if (!data || typeof data !== 'object') {
    throw new APIError(
      'Invalid response format: expected object',
      'VALIDATION_ERROR',
      { data }
    );
  }

  if (typeof data.content !== 'string' || !data.content.trim()) {
    throw new APIError(
      'Invalid response format: missing or invalid content',
      'VALIDATION_ERROR',
      { data }
    );
  }

  return {
    content: data.content,
    blocks: validateBlocks(data.blocks || []),
    quiz: validateQuiz(data.quiz || []),
  };
}

export function validateBlocks(blocks: any[]): Block[] {
  if (!Array.isArray(blocks)) {
    return [];
  }

  return blocks.map((block, index) => {
    if (!block?.title?.trim() || !block?.description?.trim()) {
      throw new APIError(
        'Invalid block format: missing title or description',
        'VALIDATION_ERROR',
        { block }
      );
    }

    const difficulty = validateDifficulty(block.difficulty);
    const topic = block.topic?.toLowerCase() || null;

    return {
      id: `block-${Date.now()}-${index}`,
      title: block.title.trim(),
      description: block.description.trim(),
      points: calculatePoints(difficulty),
      icon: getTopicIcon(topic || block.title),
      difficulty,
      parentId: topic,
    };
  });
}

function validateQuiz(quiz: any[]): any[] {
  if (!Array.isArray(quiz)) {
    return [];
  }

  return quiz.map((question, index) => {
    if (!question?.question?.trim() || 
        !Array.isArray(question.options) || 
        question.options.length < 2 ||
        typeof question.correctAnswer !== 'number' ||
        !question.explanation?.trim()) {
      throw new APIError(
        'Invalid quiz format',
        'VALIDATION_ERROR',
        { question }
      );
    }

    return {
      id: `quiz-${Date.now()}-${index}`,
      question: question.question.trim(),
      options: question.options.map((opt: any) => String(opt).trim()),
      correctAnswer: question.correctAnswer,
      explanation: question.explanation.trim(),
      difficulty: validateDifficulty(question.difficulty),
    };
  });
}

function validateDifficulty(difficulty: any): DifficultyLevel {
  const validDifficulties: DifficultyLevel[] = ['easy', 'medium', 'hard'];
  return validDifficulties.includes(difficulty) ? difficulty : 'easy';
}

function calculatePoints(difficulty: DifficultyLevel): number {
  return {
    easy: 10,
    medium: 20,
    hard: 30,
  }[difficulty];
}