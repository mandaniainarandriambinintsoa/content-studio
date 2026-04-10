import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function estimateDurationSeconds(text: string): number {
  // ~150 mots / minute à l'oral naturel
  const words = text.trim().split(/\s+/).length;
  return Math.round((words / 150) * 60);
}
