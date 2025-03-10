// Type definitions for the quiz platform

export interface Tryout {
    id: string;
    title: string;
    description: string;
    category: string;
    duration: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface TryoutInput {
    title: string;
    description: string;
    category: string;
    duration: number;
  }