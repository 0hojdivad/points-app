/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  Sparkles,
  Users,
  Award,
  Share2,
  ListTodo,
  Trophy,
  History,
  RotateCcw,
  Check,
  UserCheck,
  Heart,
  Plus,
  Compass,
  MessageSquare,
} from 'lucide-react';

import { User, Group, Favor, ActivityLog, Achievement, FavorTierId, ChatMessage } from './types';
import {
  INITIAL_USERS,
  INITIAL_GROUPS,
  INITIAL_FAVORS,
  INITIAL_ACTIVITIES,
  ALL_ACHIEVEMENTS,
  FAVOR_TIERS,
  INITIAL_CHAT_MESSAGES,
} from './mockData';

import Dashboard from './components/Dashboard';
import GroupDashboard from './components/GroupDashboard';
import Leaderboard from './components/Leaderboard';
import AchievementsGrid from './components/AchievementsGrid';
import InviteFriends from './components/InviteFriends';
import LogFavorModal from './components/LogFavorModal';
import BanterChat from './components/BanterChat';

export default function App() {
  // Global States retrieved from LocalStorage or pre-populated defaults
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('favor_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [groups, setGroups] = useState<Group[]>(() => {
    const saved = localStorage.getItem('favor_groups');
    return saved ? JSON.parse(saved) : INITIAL_GROUPS;
  });

  const [favors, setFavors] = useState<Favor[]>(() => {
    const saved = localStorage.getItem('favor_favors');
    return saved ? JSON.parse(saved) : INITIAL_FAVORS;
  });

  const [activities, setActivities] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('favor_activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('favor_chat_messages');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });

  const [activeUserId, setActiveUserId] = useState<string>(() => {
    const saved = localStorage.getItem('favor_active_user_id');
    return saved || 'u-1'; // Alex Mercer
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'groups' | 'chat' | 'ranks' | 'achievements' | 'invites'>('dashboard');
  const [showLogModal, setShowLogModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('favor_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('favor_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('favor_favors', JSON.stringify(favors));
  }, [favors]);

  useEffect(() => {
    localStorage.setItem('favor_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('favor_chat_messages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('favor_active_user_id', activeUserId);
  }, [activeUserId]);

  // Fetch and sync database with Express backend periodically
  const refreshDatabaseFromServer = async () => {
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const data = await res.json();
        if (data.users) setUsers(data.users);
        if (data.groups) setGroups(data.groups);
        if (data.favors) setFavors(data.favors);
        if (data.activities) setActivities(data.activities);
        if (data.chatMessages) setChatMessages(data.chatMessages);
      }
    } catch (err) {
      console.error('Error syncing backend database:', err);
    }
  };

  useEffect(() => {
    refreshDatabaseFromServer();
    const interval = setInterval(refreshDatabaseFromServer, 4000); // sync every 4 seconds
    return () => clearInterval(interval);
  }, []);

  const activeUser = users.find((u) => u.id === activeUserId) || users[0];

  // Helper to show custom toasts
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Reset sandbox function
  const handleResetSandbox = async () => {
    if (window.confirm('Are you sure you want to reset all sandbox balances, favors, groups, and chats back to default demo state?')) {
      try {
        const res = await fetch('/api/reset', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users);
          setGroups(data.groups);
          setFavors(data.favors);
          setActivities(data.activities);
          setChatMessages(data.chatMessages);
          setActiveUserId('u-1');
          setActiveTab('dashboard');
          triggerToast('🔄 Sandbox database resetting to initial demo state!');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Switch perspective callback
  const handleUserChange = (userId: string) => {
    setActiveUserId(userId);
    const u = users.find((us) => us.id === userId);
    if (u) {
      triggerToast(`👤 Switched account view perspective to ${u.name}!`);
    }
  };

  // Dynamic live calculations for achievements badges
  const getDynamicAchievements = (): Achievement[] => {
    // Current completed lists
    const completedGiven = favors.filter((f) => f.giverId === activeUserId && f.status === 'completed');
    const completedReceived = favors.filter((f) => f.receiverId === activeUserId && f.status === 'completed');

    // Title/Desc keyword scans
    const hasAirport = favors.some(
      (f) =>
        f.giverId === activeUserId &&
        f.status === 'completed' &&
        (f.title.toLowerCase().includes('airport') ||
          f.description.toLowerCase().includes('flight') ||
          f.description.toLowerCase().includes('pick up'))
    );

    const hasCar = favors.some(
      (f) =>
        f.giverId === activeUserId &&
        f.status === 'completed' &&
        (f.title.toLowerCase().includes('car') ||
          f.title.toLowerCase().includes('costco') ||
          f.title.toLowerCase().includes('ride') ||
          f.description.toLowerCase().includes('lift') ||
          f.description.toLowerCase().includes('car'))
    );

    const hasCoding = favors.some(
      (f) =>
        f.giverId === activeUserId &&
        f.status === 'completed' &&
        (f.title.toLowerCase().includes('code') ||
          f.title.toLowerCase().includes('docker') ||
          f.title.toLowerCase().includes('tech') ||
          f.title.toLowerCase().includes('debugging') ||
          f.title.toLowerCase().includes('server'))
    );

    const hasFlora = favors.some(
      (f) =>
        f.giverId === activeUserId &&
        f.status === 'completed' &&
        (f.title.toLowerCase().includes('water') ||
          f.title.toLowerCase().includes('plant') ||
          f.title.toLowerCase().includes('cat') ||
          f.title.toLowerCase().includes('pet') ||
          f.description.toLowerCase().includes('cat') ||
          f.description.toLowerCase().includes('bloom'))
    );

    return ALL_ACHIEVEMENTS.map((tpl) => {
      let isUnlocked = false;
      let currentProgress = 0;
      let targetProgress = 0;

      switch (tpl.id) {
        case 'a-1': // First Helping Hand
          isUnlocked = completedGiven.length >= 1;
          currentProgress = completedGiven.length;
          targetProgress = 1;
          break;
        case 'a-2': // Karma Champion
          isUnlocked = activeUser.lifetimeKarma >= 100;
          currentProgress = activeUser.lifetimeKarma;
          targetProgress = 100;
          break;
        case 'a-3': // Airport Guardian
          isUnlocked = hasAirport;
          break;
        case 'a-4': // Perfect Settle-Up
          isUnlocked = activeUser.netBalance === 0 && (completedGiven.length > 0 || completedReceived.length > 0);
          break;
        case 'a-5': // The Car Benefactor
          isUnlocked = hasCar;
          break;
        case 'a-6': // Docker Demigod
          isUnlocked = hasCoding;
          break;
        case 'a-7': // Master Plant Whisperer
          isUnlocked = hasFlora;
          break;
        case 'a-8': // Favor Magnet
          isUnlocked = completedReceived.length >= 5;
          currentProgress = completedReceived.length;
          targetProgress = 5;
          break;
        default:
          break;
      }

      const progress = targetProgress > 0 ? { current: Math.min(currentProgress, targetProgress), target: targetProgress } : undefined;

      return {
        ...tpl,
        unlockedAt: isUnlocked ? '2026-05-19T10:00:00Z' : undefined,
        progress,
      };
    });
  };

  const dynamicAchievements = getDynamicAchievements();
  const currentUnlockedCount = dynamicAchievements.filter((a) => a.unlockedAt).length;

  // React to change in activeUser level or achievements count
  useEffect(() => {
    if (activeUser.unlockedAchievementsCount !== currentUnlockedCount) {
      // Update achievements tally on active user
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === activeUser.id) {
            return {
              ...u,
              unlockedAchievementsCount: currentUnlockedCount,
            };
          }
          return u;
        })
      );
    }
  }, [currentUnlockedCount, activeUser.id]);

  // Handler to submission of a favor
  const handleSubmitFavor = async (data: {
    title: string;
    description: string;
    points: number;
    giverId: string;
    receiverId: string;
    tier: FavorTierId;
    groupId: string;
    status: 'completed' | 'pending';
  }) => {
    try {
      const res = await fetch('/api/favors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const serverData = await res.json();
        setUsers(serverData.users);
        setGroups(serverData.groups);
        setFavors(serverData.favors);
        setActivities(serverData.activities);
        setChatMessages(serverData.chatMessages);

        if (data.status === 'completed') {
          triggerToast(`✅ Successfully completed & recorded favor! +${data.points} XP added!`);
        } else {
          triggerToast(`⏳ Request posted! Waiting for helper verification.`);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler to fulfill/approve a pending favor request
  const handleFulfillFavor = async (favorId: string) => {
    try {
      const res = await fetch('/api/favors/fulfill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favorId, activeUserId }),
      });

      if (res.ok) {
        const serverData = await res.json();
        setUsers(serverData.users);
        setGroups(serverData.groups);
        setFavors(serverData.favors);
        setActivities(serverData.activities);
        setChatMessages(serverData.chatMessages);
        triggerToast(`🎉 Verified and completed! XP given to helper.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeclineFavor = async (favorId: string) => {
    try {
      const res = await fetch('/api/favors/decline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favorId, activeUserId }),
      });

      if (res.ok) {
        const serverData = await res.json();
        setUsers(serverData.users);
        setGroups(serverData.groups);
        setFavors(serverData.favors);
        setActivities(serverData.activities);
        setChatMessages(serverData.chatMessages);
        triggerToast(`❌ Dismissed favor request.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler to send a chat message
  const handleSendMessage = async (groupId: string, senderId: string, text: string, mediaEmoji?: string) => {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId, senderId, text, mediaEmoji }),
      });

      if (res.ok) {
        const serverData = await res.json();
        setUsers(serverData.users);
        setGroups(serverData.groups);
        setFavors(serverData.favors);
        setActivities(serverData.activities);
        setChatMessages(serverData.chatMessages);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Callback to introduce a simulated dynamic friend from the invitation trigger panel
  const handleAddSimulatedUser = async (
    name: string,
    username: string,
    email: string,
    phone: string,
    groupId: string
  ) => {
    const avatar = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

    try {
      const res = await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          username,
          email,
          phone,
          avatar,
          initialGroupIds: [groupId],
        }),
      });

      if (res.ok) {
        const serverData = await res.json();
        setUsers(serverData.users);
        setGroups(serverData.groups);
        setFavors(serverData.favors);
        setActivities(serverData.activities);
        setChatMessages(serverData.chatMessages);
        triggerToast(`🤝 Invited and registered ${name} to the circle!`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Helper dynamic creation of groups inside Circle view
  const handleCreateGroup = async (name: string, description: string, memberIds: string[]) => {
    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          members: memberIds,
          activeUserId,
        }),
      });

      if (res.ok) {
        const serverData = await res.json();
        setUsers(serverData.users);
        setGroups(serverData.groups);
        setFavors(serverData.favors);
        setActivities(serverData.activities);
        setChatMessages(serverData.chatMessages);
        triggerToast(`🚀 Circle "${name}" coordinates established with ${memberIds.length} members!`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      {/* GLOW DECORATIONS */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-violet-200/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* DYNAMIC COMPREHENSIVE ACTIONS BAR */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 shrink-0 z-40 select-none shadow-xxs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white rounded-xl flex items-center justify-center shadow-md shadow-indigo-100">
              <Sparkles size={18} className="animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 font-sans flex items-center gap-1.5">
                Brownie Points
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                  Sandbox
                </span>
              </h1>
              <p className="text-[11px] font-semibold text-slate-500 font-sans mt-0.5">Friendly Brownie Points Tracker</p>
            </div>
          </div>

          {/* Interactive controls: DROPDOWN SWITCHER & TRIGGER DEED */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Account perspective simulator switcher */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-[2px] pr-2.5 flex items-center gap-2 w-full sm:w-auto">
              <div className="bg-indigo-600 text-white font-black text-xs h-8 px-2.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                <UserCheck size={14} />
                <span>Active Account</span>
              </div>
              <select
                id="switch-active-user-selector"
                value={activeUserId}
                onChange={(e) => handleUserChange(e.target.value)}
                className="text-xs font-bold text-slate-700 focus:outline-none border-none bg-transparent py-1 select-none pr-3 cursor-pointer"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} (Lvl {u.level})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Record custom deeds click */}
            <button
              id="btn-trigger-log-deed"
              onClick={() => setShowLogModal(true)}
              className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-100 hover:shadow-indigo-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus size={16} />
              Record Deeds Favor
            </button>
          </div>
        </div>
      </header>

      {/* DYNAMIC TOAST NOTIFICATOR */}
      {toastMessage && (
        <div id="dynamic-toast" className="fixed top-20 right-4 z-50 bg-slate-900 text-white border border-slate-800 rounded-xl px-4.5 py-3 shadow-2xl flex items-center gap-2.5 text-xs font-medium animate-fade-in">
          <Check size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MAIN CONTAINER PANELS AND VIEWS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full flex flex-col gap-6">
        {/* Navigation Tabs */}
        <div className="bg-white border border-slate-100 p-1 rounded-2xl shadow-xxs max-w-max">
          <div className="flex flex-wrap gap-1">
            <button
              id="tab-btn-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`px-5 py-3.5 rounded-xl font-bold text-xs tracking-tight transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white font-extrabold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Compass size={15} />
              My Profile Dashboard
            </button>

            <button
              id="tab-btn-groups"
              onClick={() => setActiveTab('groups')}
              className={`px-5 py-3.5 rounded-xl font-bold text-xs tracking-tight transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'groups'
                  ? 'bg-indigo-600 text-white font-extrabold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Users size={15} />
              Group Dashboards
            </button>

            <button
              id="tab-btn-chat"
              onClick={() => setActiveTab('chat')}
              className={`px-5 py-3.5 rounded-xl font-bold text-xs tracking-tight transition-all flex items-center gap-2 cursor-pointer relative ${
                activeTab === 'chat'
                  ? 'bg-indigo-600 text-white font-extrabold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <MessageSquare size={15} />
              Circle Banter (Chat)
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
              </span>
            </button>

            <button
              id="tab-btn-ranks"
              onClick={() => setActiveTab('ranks')}
              className={`px-5 py-3.5 rounded-xl font-bold text-xs tracking-tight transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'ranks'
                  ? 'bg-indigo-600 text-white font-extrabold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Trophy size={15} />
              Leaderboards & Settlings
            </button>

            <button
              id="tab-btn-achievements"
              onClick={() => setActiveTab('achievements')}
              className={`px-5 py-3.5 rounded-xl font-bold text-xs tracking-tight transition-all flex items-center gap-2 cursor-pointer relative ${
                activeTab === 'achievements'
                  ? 'bg-indigo-600 text-white font-extrabold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Award size={15} />
              Badge Room (XP)
              {currentUnlockedCount > 0 && (
                <span className="absolute -top-1 -right-1.5 text-[9px] font-black bg-yellow-400 text-slate-900 border-2 border-white rounded-full h-5 w-5 flex items-center justify-center font-mono">
                  {currentUnlockedCount}
                </span>
              )}
            </button>

            <button
              id="tab-btn-invites"
              onClick={() => setActiveTab('invites')}
              className={`px-5 py-3.5 rounded-xl font-bold text-xs tracking-tight transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'invites'
                  ? 'bg-indigo-600 text-white font-extrabold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Share2 size={15} />
              Link Friends (Invite)
            </button>
          </div>
        </div>

        {/* Tab Routing Panes */}
        <div className="flex-1 min-h-[500px]">
          {activeTab === 'dashboard' && (
            <Dashboard
              activeUser={activeUser}
              users={users}
              favors={favors}
              groups={groups}
              activities={activities}
              onFulfillFavor={handleFulfillFavor}
              onDeclineFavor={handleDeclineFavor}
            />
          )}

          {activeTab === 'groups' && (
            <GroupDashboard
              groups={groups}
              users={users}
              favors={favors}
              activities={activities}
              activeUser={activeUser}
              onCreateGroup={handleCreateGroup}
            />
          )}

          {activeTab === 'chat' && (
            <BanterChat
              activeUser={activeUser}
              users={users}
              groups={groups}
              chatMessages={chatMessages}
              onSendMessage={handleSendMessage}
            />
          )}

          {activeTab === 'ranks' && (
            <Leaderboard
              users={users}
              activeUser={activeUser}
            />
          )}

          {activeTab === 'achievements' && (
            <AchievementsGrid
              activeUser={activeUser}
              achievements={dynamicAchievements}
            />
          )}

          {activeTab === 'invites' && (
            <InviteFriends
              activeUser={activeUser}
              groups={groups}
              onAddSimulatedUser={handleAddSimulatedUser}
            />
          )}
        </div>
      </main>

      {/* FOOTER DEMO STATE RESET ACTIONS */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-8 shrink-0 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-bold text-slate-200 text-sm">Brownie Points Interactive Sandbox Engine</h4>
            <p className="text-xs text-slate-500 max-w-xl">
              Simulated with localized state stored in your browser's LocalStorage. Perfect for testing favor completion validation rules, achievements trigger scoring, and balance settlements models.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              id="btn-reset-sandbox"
              onClick={handleResetSandbox}
              className="bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={14} />
              Reset Demo Sandbox Data
            </button>
            <div className="text-xs border border-slate-800 bg-slate-800/20 rounded-xl px-4 py-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
              <span className="text-slate-400">Status: Sandbox Active</span>
            </div>
          </div>
        </div>
      </footer>

      {/* PORTAL RECORD FAVOR DIAL MODALS */}
      {showLogModal && (
        <LogFavorModal
          onClose={() => setShowLogModal(false)}
          activeUser={activeUser}
          users={users}
          groups={groups}
          onSubmitFavor={handleSubmitFavor}
        />
      )}
    </div>
  );
}
