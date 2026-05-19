/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

// Raw representation of mock data directly defined on the server side to load if database.json doesn't exist
const INITIAL_USERS = [
  {
    id: 'u-1',
    name: 'Alex Mercer',
    username: 'alexm',
    email: 'alex.mercer@favorflow.com',
    phone: '+1 (555) 123-4567',
    avatar: 'AM',
    level: 3,
    lifetimeKarma: 112,
    netBalance: 32,
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
    netBalance: -45,
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
    netBalance: 15,
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
    netBalance: -2,
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
    netBalance: 0,
    unlockedAchievementsCount: 3,
  },
];

const INITIAL_GROUPS = [
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

const INITIAL_FAVORS = [
  {
    id: 'f-1',
    title: 'Assembled Jordan\'s IKEA Desk',
    description: 'Helped Jordan figure out those confusing Swedish diagrams and hold the heavy wooden parts.',
    points: 15,
    giverId: 'u-1',
    receiverId: 'u-2',
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
    giverId: 'u-1',
    receiverId: 'u-3',
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
    giverId: 'u-3',
    receiverId: 'u-2',
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
    giverId: 'u-4',
    receiverId: 'u-2',
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
    giverId: 'u-5',
    receiverId: 'u-2',
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
    giverId: 'u-3',
    receiverId: 'u-2',
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
    giverId: 'u-2',
    receiverId: 'u-4',
    status: 'pending',
    tier: 'quick',
    createdAt: '2026-05-19T14:10:00Z',
    groupId: 'g-3',
  },
];

const INITIAL_ACTIVITIES = [
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

const INITIAL_CHAT_MESSAGES = [
  {
    id: 'm-1',
    senderId: 'u-2',
    groupId: 'g-1',
    text: 'Hey flatmates! Who took my breakfast bagel from the counter? 🥯',
    timestamp: '2026-05-10T10:15:00Z'
  },
  {
    id: 'm-2',
    senderId: 'u-1',
    groupId: 'g-1',
    text: 'Oops, my bad Jordan! I was running super late. Let me buy you an extra hot Matcha Latte and double cookie at study lab to settle up! 🍪',
    timestamp: '2026-05-10T10:18:00Z'
  },
  {
    id: 'm-3',
    senderId: 'u-1',
    groupId: 'g-1',
    text: 'Just logged the desk assembly too. That wooden IKEA plan was intense!',
    timestamp: '2026-05-10T13:31:00Z',
    mediaEmoji: '👑'
  },
  {
    id: 'm-4',
    senderId: 'u-1',
    groupId: 'g-1',
    text: 'Alex Mercer completed favor "Assembled Jordan\'s IKEA Desk" (+15 Brownie Points)',
    timestamp: '2026-05-10T13:32:00Z',
    isSystem: true
  },
  {
    id: 'm-5',
    senderId: 'u-2',
    groupId: 'g-1',
    text: 'Approved! You are an absolute legend. The study desk is perfect! Karma Champion badge is well deserved! 😇',
    timestamp: '2026-05-10T13:35:00Z'
  },
  {
    id: 'm-6',
    senderId: 'u-3',
    groupId: 'g-2',
    text: 'Anyone free for an early ride to JFK airport this week? Uber is quoted at $85 😭✈️',
    timestamp: '2026-05-11T18:40:00Z'
  },
  {
    id: 'm-7',
    senderId: 'u-1',
    groupId: 'g-2',
    text: 'I can do it! I love dawn car drives anyway. Just request the favor in our Circle!',
    timestamp: '2026-05-11T19:00:00Z'
  },
  {
    id: 'm-8',
    senderId: 'u-1',
    groupId: 'g-2',
    text: 'Alex Mercer completed favor "Airport Ride (JFK at 5 AM)" (+30 Brownie Points)',
    timestamp: '2026-05-12T05:15:00Z',
    isSystem: true
  },
  {
    id: 'm-9',
    senderId: 'u-3',
    groupId: 'g-2',
    text: 'Easiest airport trip of my life. Thank you so much Alex! Coffee is on me next week!',
    timestamp: '2026-05-12T08:00:00Z',
    mediaEmoji: '☕'
  },
  {
    id: 'm-10',
    senderId: 'u-4',
    groupId: 'g-3',
    text: 'Hey Jordan, let me know if those custom Docker compose scripts build fine on your end.',
    timestamp: '2026-05-17T20:16:00Z'
  },
  {
    id: 'm-11',
    senderId: 'u-2',
    groupId: 'g-3',
    text: 'They compiled beautifully! Absolute Docker Demigod! Life is so much better without memory leaks.',
    timestamp: '2026-05-17T20:45:00Z',
    mediaEmoji: '💻'
  }
];

const DB_FILE = path.join(process.cwd(), 'database.json');

// Memory DB cache
interface DatabaseSchema {
  users: any[];
  groups: any[];
  favors: any[];
  activities: any[];
  chatMessages: any[];
}

let db: DatabaseSchema = {
  users: [],
  groups: [],
  favors: [],
  activities: [],
  chatMessages: []
};

// Pure DB read/write helper functions
function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      db = JSON.parse(data);
    } else {
      resetToDefault();
    }
  } catch (error) {
    console.error("Error reading db file, seeding defaults:", error);
    resetToDefault();
  }
}

function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error saving to db file:", error);
  }
}

function resetToDefault() {
  db = {
    users: JSON.parse(JSON.stringify(INITIAL_USERS)),
    groups: JSON.parse(JSON.stringify(INITIAL_GROUPS)),
    favors: JSON.parse(JSON.stringify(INITIAL_FAVORS)),
    activities: JSON.parse(JSON.stringify(INITIAL_ACTIVITIES)),
    chatMessages: JSON.parse(JSON.stringify(INITIAL_CHAT_MESSAGES))
  };
  saveDatabase();
}

// Perform initial boot database setup
loadDatabase();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API ROUTES

  // API Health Indicator
  app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', database: 'ready', port: PORT });
  });

  // Fetch full synchronized database
  app.get('/api/data', (req, res) => {
    loadDatabase(); // ensures freshly synced data
    res.json(db);
  });

  // Reset sandbox databases
  app.post('/api/reset', (req, res) => {
    resetToDefault();
    res.json({ success: true, ...db });
  });

  // Post/log new favor
  app.post('/api/favors', (req, res) => {
    const { title, description, points, giverId, receiverId, tier, groupId, status } = req.body;
    const isCompleted = status === 'completed';

    const favorId = 'f-' + Date.now();
    const newFavor = {
      id: favorId,
      title,
      description,
      points: Number(points),
      giverId,
      receiverId,
      status,
      tier,
      groupId,
      createdAt: new Date().toISOString(),
      completedAt: isCompleted ? new Date().toISOString() : undefined
    };

    db.favors.unshift(newFavor);

    const giver = db.users.find(u => u.id === giverId);
    const receiver = db.users.find(u => u.id === receiverId);
    const giverName = giver ? giver.name : 'Someone';
    const receiverName = receiver ? receiver.name : 'Someone';

    // Activity Feed Log
    const logId = 'l-' + Date.now();
    const newLog = {
      id: logId,
      userId: giverId,
      type: isCompleted ? 'favor_completed' : 'favor_created',
      message: isCompleted
        ? `${giverName} did "${title}" for ${receiverName} (+${points} points Completed)`
        : `${receiverName} requested "${title}" from ${giverName} (Verification Pending)`,
      timestamp: new Date().toISOString(),
      groupId
    };
    db.activities.unshift(newLog);

    // Chat Message Notification Log
    const chatMsgId = 'm-system-' + Date.now();
    const chatMsg = {
      id: chatMsgId,
      senderId: giverId,
      groupId,
      text: isCompleted
        ? `📢 ${giverName} completed favor "${title}" for ${receiverName} (+${points} Brownie Points)`
        : `⏳ ${receiverName} requested favor "${title}" from ${giverName} (Verification Pending)`,
      timestamp: new Date().toISOString(),
      isSystem: true
    };
    db.chatMessages.push(chatMsg);

    // If favor was immediate, update net balances on the spot
    if (isCompleted) {
      db.users = db.users.map((u) => {
        let level = u.level;
        let karma = u.lifetimeKarma;
        let balance = u.netBalance;

        if (u.id === giverId) {
          karma += Number(points);
          balance += Number(points);
          level = Math.max(u.level, Math.floor(karma / 50) + 1);
        }
        if (u.id === receiverId) {
          balance -= Number(points);
        }

        return {
          ...u,
          lifetimeKarma: karma,
          netBalance: balance,
          level
        };
      });
    }

    saveDatabase();
    res.json({ success: true, ...db });
  });

  // Verify/fulfill pending favor request
  app.post('/api/favors/fulfill', (req, res) => {
    const { favorId, activeUserId } = req.body;
    
    const favorIndex = db.favors.findIndex(f => f.id === favorId);
    if (favorIndex === -1) {
      return res.status(404).json({ error: 'Favor not found' });
    }

    const favor = db.favors[favorIndex];
    favor.status = 'completed';
    favor.completedAt = new Date().toISOString();

    const points = Number(favor.points);
    const giverId = favor.giverId;
    const receiverId = favor.receiverId;

    const giver = db.users.find(u => u.id === giverId);
    const receiver = db.users.find(u => u.id === receiverId);
    const helperName = giver ? giver.name : 'Helper';
    const recipientName = receiver ? receiver.name : 'Recipient';

    // Activity log entry
    const logId = 'l-' + Date.now();
    const newLog = {
      id: logId,
      userId: activeUserId,
      type: 'favor_completed',
      message: `${helperName} completed pending request "${favor.title}" for ${recipientName} (+${points} Karma completed)`,
      timestamp: new Date().toISOString(),
      groupId: favor.groupId
    };
    db.activities.unshift(newLog);

    // Live chat system message broadcast
    const chatMsgId = 'm-system-' + Date.now();
    const chatMsg = {
      id: chatMsgId,
      senderId: giverId,
      groupId: favor.groupId,
      text: `📢 ${helperName} verified & completed pending request "${favor.title}" for ${recipientName} (+${points} Brownie Points)`,
      timestamp: new Date().toISOString(),
      isSystem: true
    };
    db.chatMessages.push(chatMsg);

    // Apply currency settlement balances
    db.users = db.users.map((u) => {
      let level = u.level;
      let karma = u.lifetimeKarma;
      let balance = u.netBalance;

      if (u.id === giverId) {
        karma += points;
        balance += points;
        level = Math.max(u.level, Math.floor(karma / 50) + 1);
      }
      if (u.id === receiverId) {
        balance -= points;
      }

      return {
        ...u,
        lifetimeKarma: karma,
        netBalance: balance,
        level
      };
    });

    saveDatabase();
    res.json({ success: true, ...db });
  });

  // Cancel/reject pending favor request
  app.post('/api/favors/decline', (req, res) => {
    const { favorId, activeUserId } = req.body;

    const favor = db.favors.find(f => f.id === favorId);
    if (!favor) {
      return res.status(404).json({ error: 'Favor not found' });
    }

    // Filter it out
    db.favors = db.favors.filter(f => f.id !== favorId);

    const receiver = db.users.find(u => u.id === favor.receiverId);
    const requesterName = receiver ? receiver.name : 'Requester';

    // Log decline activity
    const logId = 'l-' + Date.now();
    const newLog = {
      id: logId,
      userId: activeUserId,
      type: 'favor_created',
      message: `Pending request "${favor.title}" by ${requesterName} was declined/cancelled.`,
      timestamp: new Date().toISOString(),
      groupId: favor.groupId
    };
    db.activities.unshift(newLog);

    saveDatabase();
    res.json({ success: true, ...db });
  });

  // Posting chat message
  app.post('/api/chat', (req, res) => {
    const { groupId, senderId, text, mediaEmoji } = req.body;

    const newMsg = {
      id: 'm-' + Date.now(),
      senderId,
      groupId,
      text,
      timestamp: new Date().toISOString(),
      mediaEmoji
    };

    db.chatMessages.push(newMsg);
    saveDatabase();
    res.json({ success: true, ...db });
  });

  // Create a new roomie Circle
  app.post('/api/groups', (req, res) => {
    const { name, description, members, activeUserId } = req.body;

    const newGroup = {
      id: 'g-' + Date.now(),
      name,
      description,
      members,
      createdAt: new Date().toISOString()
    };

    db.groups.push(newGroup);

    // Log circle created activity
    const logId = 'l-' + Date.now();
    const creator = db.users.find(u => u.id === activeUserId)?.name || 'Someone';
    const newLog = {
      id: logId,
      userId: activeUserId,
      type: 'group_created',
      message: `${creator} created new circle "${name}"`,
      timestamp: new Date().toISOString(),
      groupId: newGroup.id
    };
    db.activities.unshift(newLog);

    saveDatabase();
    res.json({ success: true, ...db });
  });

  // Add/invite a simulated user friend to circles
  app.post('/api/invite', (req, res) => {
    const { name, username, email, phone, avatar, initialGroupIds } = req.body;

    const userId = 'u-' + Date.now();
    const newUser = {
      id: userId,
      name,
      username,
      email,
      phone,
      avatar,
      level: 1,
      lifetimeKarma: 0,
      netBalance: 0,
      unlockedAchievementsCount: 0
    };

    db.users.push(newUser);

    // Register them to selected groups/circles
    if (initialGroupIds && Array.isArray(initialGroupIds)) {
      db.groups = db.groups.map(g => {
        if (initialGroupIds.includes(g.id)) {
          return {
            ...g,
            members: [...g.members, userId]
          };
        }
        return g;
      });
    }

    // Activity log record
    const logId = 'l-' + Date.now();
    const newLog = {
      id: logId,
      userId: 'u-1', // recorded by first user sandbox
      type: 'user_joined',
      message: `${name} (@${username}) joined the Brownie Points circle! 🥳`,
      timestamp: new Date().toISOString()
    };
    db.activities.unshift(newLog);

    saveDatabase();
    res.json({ success: true, ...db });
  });


  // VITE DEV SERVER OR STATIC FILES BUILD CONFIGURATION

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Brownie Points Server] Running hot on port http://0.0.0.0:${PORT}`);
  });
}

startServer();
