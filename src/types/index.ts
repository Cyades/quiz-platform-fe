// Type definitions for the quiz platform

export interface Tryout {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  hasSubmission: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TryoutInput {
  title: string;
  description: string;
  category: string;
  duration: number;
}

export interface Question {
  id: string;
  tryoutId: string;
  text: string;
  isTrue: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionInput {
  text: string;
  isTrue: boolean;
}