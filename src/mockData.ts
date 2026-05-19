/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Group, Favor, Achievement, ActivityLog, FavorTier, ChatMessage } from './types';

export const FAVOR_TIERS: Record<string, FavorTier> = {
  quick: {
    id: 'quick',
    label: '☕ Quick Favor',
    points: 2,
    description: 'Brought a coffee, picked up packages, held door, quick print jobs.',
    icon: '☕',
  },
  small: {
    id: 'small',
    label: '🚗 Small Assist',
    points: 5,
    description: 'Lunch run, given a brief ride / lift, lent charging cables, simple notes.',
    icon: '🚗',
  },
  medium: {
    id: 'medium',
    label: '📦 Medium Effort',
    points: 15,
    description: 'Helped pick up from airport, assembled IKEA furniture, pet/plant sitting (1 day).',
    icon: '📦',
  },
  large: {
    id: 'large',
    label: '🏡 Heavy Lifting',
    points: 30,
    description: 'Helped move boxes/apartment, weekend pet sat, custom technical setups.',
    icon: '🏡',
  },
  hero: {
    id: 'hero',
    label: '👑 Legend Deed',
    points: 50,
    description: 'Deep cleaned common flat area, emergency tech support at 2 AM, lent car for weekend.',
    icon: '👑',
  },
};

export const INITIAL_USERS: User[] = [
  {
    id: 'u-1',
    name: 'Alex Mercer',
    username: 'alexm',
    email: 'alex.mercer@favorflow.com',
    phone: '+1 (555) 123-4567',
    avatar: 'AM',
    level: 3,
    lifetimeKarma: 112,
    netBalance: 32, // Owed 32 points net
    unlockedAchievementsCount: 4,
  },
  {
    id: 'u-2',
    name: 'Jordan Taylor',
    username: 'jordan_t',
    email: 'jordan.taylor@favorflow.com',
    phone: '+1 (555) 987-6543',
    avatar: 'JT',
    level: 1,
    lifetimeKarma: 15,
    netBalance: -45, // Owes 45 points net
    unlockedAchievementsCount: 1,
  },
  {
    id: 'u-3',
    name: 'Sarah Jenkins',
    username: 'sarah_j',
    email: 'sarah.jenkins@favorflow.com',
    phone: '+1 (555) 234-5678',
    avatar: 'SJ',
    level: 2,
    lifetimeKarma: 65,
    netBalance: 15, // Owed 15 points net
    unlockedAchievementsCount: 3,
  },
  {
    id: 'u-4',
    name: 'Chris Miller',
    username: 'chrism',
    email: 'chris.miller@favorflow.com',
    phone: '+1 (555) 876-5432',
    avatar: 'CM',
    level: 2,
    lifetimeKarma: 48,
    netBalance: -2, // Pretty balanced! Owes 2 net
    unlockedAchievementsCount: 2,
  },
  {
    id: 'u-5',
    name: 'Morgan Patel',
    username: 'morgan_p',
    email: 'morgan.patel@favorflow.com',
    phone: '+1 (555) 345-6789',
    avatar: 'MP',
    level: 2,
    lifetimeKarma: 80,
    netBalance: 0, // Perfectly balanced
    unlockedAchievementsCount: 3,
  },
];

export const INITIAL_GROUPS: Group[] = [
  {
    id: 'g-1',
    name: 'Sunset Roomies 🏠',
    description: 'Keeping track of flat chores, morning coffees, dinner prep, and grocery runs.',
    members: ['u-1', 'u-2', 'u-3'],
    createdAt: '2026-02-15T09:00:00Z',
  },
  {
    id: 'g-2',
    name: 'Roadtrip & Weekend Crew 🚗',
    description: 'Gas splits, driving duties, gear sharing, and emergency roadside rescues.',
    members: ['u-1', 'u-2', 'u-3', 'u-4', 'u-5'],
    createdAt: '2026-03-01T14:30:00Z',
  },
  {
    id: 'g-3',
    name: 'Tech & Study Hub 📚',
    description: 'Helping each other with coding bugs, project handins, and setting up servers.',
    members: ['u-2', 'u-4', 'u-5'],
    createdAt: '2026-04-10T10:15:00Z',
  },
];

export const INITIAL_FAVORS: Favor[] = [
  {
    id: 'f-1',
    title: 'Assembled Jordan\'s IKEA Desk',
    description: 'Helped Jordan figure out those confusing Swedish diagrams and hold the heavy wooden parts.',
    points: 15,
    giverId: 'u-1', // Alex
    receiverId: 'u-2', // Jordan
    status: 'completed',
    tier: 'medium',
    createdAt: '2026-05-10T11:00:00Z',
    completedAt: '2026-05-10T13:30:00Z',
    groupId: 'g-1',
  },
  {
    id: 'f-2',
    title: 'Airport Ride (JFK at 5 AM)',
    description: 'Woke up at 4 AM to give Sarah a lift so she didn\'t have to pay $80 for a cab.',
    points: 30,
    giverId: 'u-1', // Alex
    receiverId: 'u-3', // Sarah
    status: 'completed',
    tier: 'large',
    createdAt: '2026-05-12T04:20:00Z',
    completedAt: '2026-05-12T05:15:00Z',
    groupId: 'g-2',
  },
  {
    id: 'f-3',
    title: 'Watered plants during trip',
    description: 'Fed the cats and kept the ficus alive for a long weekend in Portland.',
    points: 15,
    giverId: 'u-3', // Sarah
    receiverId: 'u-2', // Jordan
    status: 'completed',
    tier: 'medium',
    createdAt: '2026-05-14T15:00:00Z',
    completedAt: '2026-05-15T18:00:00Z',
    groupId: 'g-1',
  },
  {
    id: 'f-4',
    title: 'Code Debugging / Docker Fix',
    description: 'Sat down to rewrite the compose config. Root cause was volume mounts!',
    points: 15,
    giverId: 'u-4', // Chris
    receiverId: 'u-2', // Jordan
    status: 'completed',
    tier: 'medium',
    createdAt: '2026-05-17T19:22:00Z',
    completedAt: '2026-05-17T20:15:00Z',
    groupId: 'g-3',
  },
  {
    id: 'f-5',
    title: 'Lent Car for Costco Run',
    description: 'Let Jordan borrow the SUV to buy massive bulk groceries for the flat party.',
    points: 15,
    giverId: 'u-5', // Morgan
    receiverId: 'u-2', // Jordan
    status: 'completed',
    tier: 'medium',
    createdAt: '2026-05-18T10:00:00Z',
    completedAt: '2026-05-18T14:00:00Z',
    groupId: 'g-2',
  },
  {
    id: 'f-6',
    title: 'Emergency Cat Food Pick-up',
    description: 'Jordan is running late. Picked up the organic Salmon wet food from pet-store.',
    points: 5,
    giverId: 'u-3', // Sarah
    receiverId: 'u-2', // Jordan
    status: 'pending',
    tier: 'small',
    createdAt: '2026-05-19T08:30:00Z',
    groupId: 'g-1',
  },
  {
    id: 'f-7',
    title: 'Coffee & Donut Delivery',
    description: 'Brought an extra hot Matcha Latte and double choc-chip cookie to study lab.',
    points: 2,
    giverId: 'u-2', // Jordan
    receiverId: 'u-4', // Chris
    status: 'pending',
    tier: 'quick',
    createdAt: '2026-05-19T14:10:00Z',
    groupId: 'g-3',
  },
];

export const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'a-1',
    title: 'First Helping Hand',
    description: 'Complete your first favor for a friend.',
    icon: '🤝',
    pointsReward: 5,
    category: 'giving',
    progress: { current: 1, target: 1 },
  },
  {
    id: 'a-2',
    title: 'Karma Champion',
    description: 'Reach 100+ lifetime Karma points.',
    icon: '😇',
    pointsReward: 25,
    category: 'giving',
    progress: { current: 0, target: 100 },
  },
  {
    id: 'a-3',
    title: 'Airport Guardian',
    description: 'Rescue a friend from paying astronomical rideshare fees to the airport.',
    icon: '✈️',
    pointsReward: 15,
    category: 'giving',
  },
  {
    id: 'a-4',
    title: 'Perfect Settle-Up',
    description: 'Bring your group net favor balance to exactly 0 after exchanging help.',
    icon: '⚖️',
    pointsReward: 10,
    category: 'group',
  },
  {
    id: 'a-5',
    title: 'The Car Benefactor',
    description: 'Lend your vehicle to a friend or give a car ride with heavy equipment.',
    icon: '🚗',
    pointsReward: 10,
    category: 'giving',
  },
  {
    id: 'a-6',
    title: 'Docker Demigod',
    description: 'Help a friend fix server compile issues or complex tech installations.',
    icon: '💻',
    pointsReward: 15,
    category: 'custom',
  },
  {
    id: 'a-7',
    title: 'Master Plant Whisperer',
    description: 'Enter a friend\'s apartment and help keep flora/fauna alive and hydrated.',
    icon: '🌿',
    pointsReward: 10,
    category: 'giving',
  },
  {
    id: 'a-8',
    title: 'Favor Magnet',
    description: 'Receive 5 favors from friends (Remember to start paying back!).',
    icon: '🧲',
    pointsReward: 5,
    category: 'receiving',
  },
];

export const INITIAL_ACTIVITIES: ActivityLog[] = [
  {
    id: 'l-1',
    userId: 'u-1',
    type: 'favor_completed',
    message: 'Alex Mercer completed Assembled Jordan\'s IKEA Desk (+15 Karma points)',
    timestamp: '2026-05-10T13:30:00Z',
    groupId: 'g-1',
  },
  {
    id: 'l-2',
    userId: 'u-1',
    type: 'achievement_unlocked',
    message: 'Alex Mercer unlocked "Karma Champion" (😇)!',
    timestamp: '2026-05-10T13:30:10Z',
    groupId: 'g-1',
  },
  {
    id: 'l-3',
    userId: 'u-1',
    type: 'favor_completed',
    message: 'Alex Mercer completed Airport Ride (JFK at 5 AM) (+30 Karma points)',
    timestamp: '2026-05-12T05:15:00Z',
    groupId: 'g-2',
  },
  {
    id: 'l-4',
    userId: 'u-3',
    type: 'favor_completed',
    message: 'Sarah Jenkins completed Watered plants during trip (+15 Karma points)',
    timestamp: '2026-05-15T18:00:00Z',
    groupId: 'g-1',
  },
  {
    id: 'l-5',
    userId: 'u-4',
    type: 'favor_completed',
    message: 'Chris Miller completed Code Debugging / Docker Fix (+15 Karma points)',
    timestamp: '2026-05-17T20:15:00Z',
    groupId: 'g-3',
  },
  {
    id: 'l-6',
    userId: 'u-5',
    type: 'favor_completed',
    message: 'Morgan Patel completed Lent Car for Costco Run (+15 Karma points)',
    timestamp: '2026-05-18T14:00:00Z',
    groupId: 'g-2',
  },
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'm-1',
    senderId: 'u-2', // Jordan
    groupId: 'g-1',
    text: 'Hey flatmates! Who took my breakfast bagel from the counter? 🥯',
    timestamp: '2026-05-10T10:15:00Z'
  },
  {
    id: 'm-2',
    senderId: 'u-1', // Alex
    groupId: 'g-1',
    text: 'Oops, my bad Jordan! I was running super late. Let me buy you an extra hot Matcha Latte and double cookie at study lab to settle up! 🍪',
    timestamp: '2026-05-10T10:18:00Z'
  },
  {
    id: 'm-3',
    senderId: 'u-1', // Alex
    groupId: 'g-1',
    text: 'Just logged the desk assembly too. That wooden IKEA plan was intense!',
    timestamp: '2026-05-10T13:31:00Z',
    mediaEmoji: '👑'
  },
  {
    id: 'm-4',
    senderId: 'u-1', // System (Alex completed)
    groupId: 'g-1',
    text: 'Alex Mercer completed favor "Assembled Jordan\'s IKEA Desk" (+15 Brownie Points)',
    timestamp: '2026-05-10T13:32:00Z',
    isSystem: true
  },
  {
    id: 'm-5',
    senderId: 'u-2', // Jordan
    groupId: 'g-1',
    text: 'Approved! You are an absolute legend. The study desk is perfect! Karma Champion badge is well deserved! 😇',
    timestamp: '2026-05-10T13:35:00Z'
  },
  {
    id: 'm-6',
    senderId: 'u-3', // Sarah Jenkins
    groupId: 'g-2',
    text: 'Anyone free for an early ride to JFK airport this week? Uber is quoted at $85 😭✈️',
    timestamp: '2026-05-11T18:40:00Z'
  },
  {
    id: 'm-7',
    senderId: 'u-1', // Alex
    groupId: 'g-2',
    text: 'I can do it! I love dawn car drives anyway. Just request the favor in our Circle!',
    timestamp: '2026-05-11T19:00:00Z'
  },
  {
    id: 'm-8',
    senderId: 'u-1', // System
    groupId: 'g-2',
    text: 'Alex Mercer completed favor "Airport Ride (JFK at 5 AM)" (+30 Brownie Points)',
    timestamp: '2026-05-12T05:15:00Z',
    isSystem: true
  },
  {
    id: 'm-9',
    senderId: 'u-3', // Sarah Jenkins
    groupId: 'g-2',
    text: 'Easiest airport trip of my life. Thank you so much Alex! Coffee is on me next week!',
    timestamp: '2026-05-12T08:00:00Z',
    mediaEmoji: '☕'
  },
  {
    id: 'm-10',
    senderId: 'u-4', // Chris
    groupId: 'g-3',
    text: 'Hey Jordan, let me know if those custom Docker compose scripts build fine on your end.',
    timestamp: '2026-05-17T20:16:00Z'
  },
  {
    id: 'm-11',
    senderId: 'u-2', // Jordan
    groupId: 'g-3',
    text: 'They compiled beautifully! Absolute Docker Demigod! Life is so much better without memory leaks.',
    timestamp: '2026-05-17T20:45:00Z',
    mediaEmoji: '💻'
  }
];

