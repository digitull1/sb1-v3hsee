import { Message } from '../../types';

export const TOPIC_CATEGORIES = {
  space: {
    name: 'Space',
    keywords: [
      'planet', 'moon', 'star', 'galaxy', 'astronaut', 'rocket', 
      'jupiter', 'mars', 'saturn', 'space', 'solar system', 'orbit',
      'telescope', 'constellation', 'asteroid', 'comet'
    ],
    icon: '🚀'
  },
  science: {
    name: 'Science',
    keywords: [
      'experiment', 'chemical', 'reaction', 'molecule', 'atom', 
      'energy', 'force', 'gravity', 'magnet', 'electricity',
      'light', 'sound', 'matter', 'temperature', 'pressure'
    ],
    icon: '🔬'
  },
  nature: {
    name: 'Nature',
    keywords: [
      'animal', 'plant', 'tree', 'flower', 'ocean', 'forest', 
      'ecosystem', 'weather', 'climate', 'environment', 'habitat',
      'species', 'wildlife', 'biology', 'evolution'
    ],
    icon: '🌿'
  },
  art: {
    name: 'Art',
    keywords: [
      'paint', 'draw', 'color', 'artist', 'museum', 'sculpture', 
      'design', 'creativity', 'imagination', 'masterpiece', 'canvas',
      'brush', 'palette', 'composition', 'perspective'
    ],
    icon: '🎨'
  },
  history: {
    name: 'History',
    keywords: [
      'ancient', 'civilization', 'war', 'king', 'queen', 'empire',
      'past', 'archaeology', 'artifact', 'culture', 'tradition',
      'heritage', 'dynasty', 'revolution', 'discovery'
    ],
    icon: '📜'
  },
  technology: {
    name: 'Technology',
    keywords: [
      'computer', 'robot', 'code', 'program', 'internet', 'digital',
      'software', 'hardware', 'algorithm', 'data', 'innovation',
      'invention', 'machine', 'artificial intelligence', 'virtual'
    ],
    icon: '💻'
  }
} as const;

export type TopicCategory = keyof typeof TOPIC_CATEGORIES;

interface TopicMatch {
  category: TopicCategory;
  confidence: number;
}

export function detectTopic(content: string): TopicCategory | null {
  if (!content) return null;
  
  const lowercaseContent = content.toLowerCase();
  let bestMatch: TopicMatch | null = null;
  let highestScore = 0;

  for (const [category, data] of Object.entries(TOPIC_CATEGORIES)) {
    // Direct category mention
    if (lowercaseContent.includes(category)) {
      return category as TopicCategory;
    }

    // Keyword matching
    let score = 0;
    let matches = 0;
    for (const keyword of data.keywords) {
      if (lowercaseContent.includes(keyword)) {
        matches++;
        // Weight early mentions more heavily
        const position = lowercaseContent.indexOf(keyword);
        score += 1 + (1 - position / lowercaseContent.length);
      }
    }

    const confidence = matches / data.keywords.length;
    if (score > highestScore && confidence >= 0.1) {
      highestScore = score;
      bestMatch = {
        category: category as TopicCategory,
        confidence
      };
    }
  }

  return bestMatch?.category || null;
}

export function getTopicKeywords(topic: TopicCategory): string[] {
  return TOPIC_CATEGORIES[topic]?.keywords || [];
}

export function getTopicName(topic: TopicCategory): string {
  return TOPIC_CATEGORIES[topic]?.name || topic;
}

export function getTopicIcon(topic: TopicCategory): string {
  return TOPIC_CATEGORIES[topic]?.icon || '✨';
}

export function isTopicRelevant(message: Message, topic: TopicCategory): boolean {
  if (!message.content) return false;
  
  const detectedTopic = detectTopic(message.content);
  if (!detectedTopic) return false;
  
  return detectedTopic === topic || getRelatedTopics(detectedTopic).includes(topic);
}

export function getRelatedTopics(topic: TopicCategory): TopicCategory[] {
  const relations: Record<TopicCategory, TopicCategory[]> = {
    space: ['science'],
    science: ['space', 'nature', 'technology'],
    nature: ['science'],
    art: ['history'],
    history: ['art'],
    technology: ['science']
  };

  return relations[topic] || [];
}