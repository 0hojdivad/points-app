/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type FavorTierId = 'quick' | 'small' | 'medium' | 'large' | 'hero';

export interface FavorTier {
  id: FavorTierId;
  label: string;
  points: number;
  description: string;
  icon: string; // Emoji or Lucide name
}

export interface User {
  id: string;
  name: string;
  avatar: string; // URL or letter indicator
  email: string;
  phone?: string;
  username: string;
  level: number;
  lifetimeKarma: number; // Sum of points for all favors given
  netBalance: number; // Given points - Received points
  unlockedAchievementsCount: number;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  members: string[]; // User IDs
  createdAt: string;
}

export interface Favor {
  id: string;
  title: string;
  description: string;
  points: number;
  giverId: string; // Who did the favor
  receiverId: string; // Who received/benefited from the favor
  status: 'pending' | 'completed' | 'declined';
  tier: FavorTierId;
  createdAt: string;
  completedAt?: string;
  groupId: string; // Which group dashboard this belongs to
  evidenceUrl?: string; // Optional fun photo proof
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Icon or emoji
  pointsReward: number;
  unlockedAt?: string; // If unlocked for active user, date
  progress?: {
    current: number;
    target: number;
  };
  category: 'giving' | 'receiving' | 'streak' | 'group' | 'custom';
}

export interface ActivityLog {
  id: string;
  userId: string;
  type: 'favor_created' | 'favor_completed' | 'achievement_unlocked' | 'group_joined' | 'invite_sent';
  message: string;
  timestamp: string;
  groupId?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  groupId: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
  mediaEmoji?: string; // Optional fun emoji reaction sticker attached
}

