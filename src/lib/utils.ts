import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Block } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAgeGroup(age: number): 'young' | 'old' {
  return age >= 5 && age <= 8 ? 'young' : 'old';
}

export function formatPoints(points: number): string {
  return `+${points} points ✨`;
}

export function getTopicIcon(topic: string): string {
  const icons: Record<string, string> = {
    'science': '🔬',
    'chemistry': '⚗️',
    'physics': '⚡',
    'biology': '🧬',
    'space': '🚀',
    'astronomy': '🌌',
    'planets': '🌍',
    'nature': '🌿',
    'environment': '🌱',
    'animals': '🦁',
    'wildlife': '🐾',
    'history': '📜',
    'ancient': '🏺',
    'civilization': '🏛️',
    'math': '🔢',
    'geometry': '📐',
    'algebra': '➗',
    'art': '🎨',
    'painting': '🖼️',
    'music': '🎵',
    'instruments': '🎸',
    'geography': '🌍',
    'maps': '🗺️',
    'technology': '💻',
    'computers': '🖥️',
    'robotics': '🤖',
    'literature': '📚',
    'writing': '✍️',
    'poetry': '📝',
    'default': '✨'
  };

  const lowercaseTopic = topic.toLowerCase();
  return Object.entries(icons).find(([key]) => 
    lowercaseTopic.includes(key)
  )?.[1] || icons.default;
}

export function createBreadcrumb(blocks: Block[]): string {
  return blocks
    .map((block) => block.title)
    .join(' → ');
}

export function getDifficultyColor(difficulty: string): string {
  return {
    easy: 'text-green-500 bg-green-100',
    medium: 'text-yellow-500 bg-yellow-100',
    hard: 'text-red-500 bg-red-100',
  }[difficulty] || 'text-blue-500 bg-blue-100';
}

export function getDifficultyLabel(difficulty: string): string {
  return {
    easy: 'Beginner Friendly',
    medium: 'Intermediate',
    hard: 'Advanced Challenge',
  }[difficulty] || 'Intermediate';
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return date.toLocaleDateString();
}