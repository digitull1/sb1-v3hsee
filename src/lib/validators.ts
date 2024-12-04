import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(2).max(50),
  age: z.number().int().min(5).max(16),
  level: z.number().int().min(1),
  points: z.number().int().min(0),
  streak: z.number().int().min(0),
});

export const messageSchema = z.object({
  id: z.string(),
  content: z.string().min(1),
  sender: z.enum(['user', 'assistant']),
  timestamp: z.number(),
  blocks: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    points: z.number(),
    icon: z.string().optional(),
    parentId: z.string().optional(),
  })).optional(),
});

export type ValidUser = z.infer<typeof userSchema>;
export type ValidMessage = z.infer<typeof messageSchema>;