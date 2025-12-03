export type ResourceType = 'video' | 'article' | 'pdf';
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface LearningResource {
  id: string;
  title: string;
  source: string;
  type: ResourceType;
  qualityScore: number; // 1-5
  duration: string;
  summary: string[];
  difficulty: Difficulty;
  url: string;
  thumbnail?: string;
  views?: string;
  date?: string;
  tags: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export interface ConceptNode {
  id: string;
  label: string;
  children?: ConceptNode[];
  isExpanded?: boolean;
}

export interface UserStats {
  topicsCompleted: number;
  streakDays: number;
  totalHours: number;
  resourceCompletion: number;
  weeklyActivity: { day: string; hours: number }[];
}

export interface UserProfile {
  name: string;
  goal: string;
  pace: 'Slow' | 'Normal' | 'Fast';
  preferences: ResourceType[];
}
