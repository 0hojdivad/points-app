/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import {
  TrendingUp,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { User, Favor, ActivityLog, Group } from '../types';
import { FAVOR_TIERS } from '../mockData';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#fbbf24', '#ec4899', '#8b5cf6', '#06b6d4', '#f43f5e'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl text-[11px] font-sans shadow-xl">
        <p className="font-extrabold">{payload[0].name}</p>
        <p className="text-slate-300 mt-0.5 font-bold">{payload[0].value} Brownie Points</p>
      </div>
    );
  }
  return null;
};

interface DashboardProps {
  activeUser: User;
  users: User[];
  favors: Favor[];
  groups: Group[];
  activities: ActivityLog[];
  onFulfillFavor: (favorId: string) => void;
  onDeclineFavor: (favorId: string) => void;
}

export default function Dashboard({
  activeUser,
  users,
  favors,
  groups,
  activities,
  onFulfillFavor,
  onDeclineFavor,
}: DashboardProps) {
  const [filter, setFilter] = useState<'all' | 'given' | 'received' | 'pending'>('all');
  const [chartView, setChartView] = useState<'given' | 'received'>('given');

  // Dynamic calculations of completed favor points given to other individual friends
  const givenData = users
    .filter((u) => u.id !== activeUser.id)
    .map((otherUser) => {
      const value = favors
        .filter((f) => f.giverId === activeUser.id && f.receiverId === otherUser.id && f.status === 'completed')
        .reduce((sum, f) => sum + f.points, 0);
      return { name: otherUser.name, value };
    })
    .filter((item) => item.value > 0);

  // Dynamic calculations of completed favor points received from other individual friends
  const receivedData = users
    .filter((u) => u.id !== activeUser.id)
    .map((otherUser) => {
      const value = favors
        .filter((f) => f.giverId === otherUser.id && f.receiverId === activeUser.id && f.status === 'completed')
        .reduce((sum, f) => sum + f.points, 0);
      return { name: otherUser.name, value };
    })
    .filter((item) => item.value > 0);

  const activeCharData = chartView === 'given' ? givenData : receivedData;
  const hasChartData = activeCharData.length > 0;

  // Use dynamic data if available; fallback to demo setup if user hasn't completed any favors yet
  const displayChartData = hasChartData
    ? activeCharData
    : chartView === 'given'
    ? [
        { name: 'Sarah Jenkins', value: 15 },
        { name: 'Chris Miller', value: 10 },
      ]
    : [
        { name: 'Alex Mercer', value: 30 },
        { name: 'Morgan Patel', value: 15 },
      ];

  // Filter favors relevant to the active user
  const userFavors = favors.filter(
    (f) => f.giverId === activeUser.id || f.receiverId === activeUser.id
  );

  const filteredFavors = userFavors.filter((f) => {
    if (filter === 'given') return f.giverId === activeUser.id && f.status === 'completed';
    if (filter === 'received') return f.receiverId === activeUser.id && f.status === 'completed';
    if (filter === 'pending') return f.status === 'pending';
    return true; // 'all'
  });

  // Calculate stats
  const totalGiven = userFavors.filter((f) => f.giverId === activeUser.id && f.status === 'completed').length;
  const totalReceived = userFavors.filter((f) => f.receiverId === activeUser.id && f.status === 'completed').length;
  const pendingRequests = userFavors.filter((f) => f.status === 'pending').length;

  const getUserName = (id: string) => users.find((u) => u.id === id)?.name || 'Deleted Friend';
  const getGroupName = (id: string) => groups.find((g) => g.id === id)?.name || 'General';

  // Level XP calculations (each level is 50 XP, let's say)
  const xpPerLevel = 50;
  const currentLevelXP = activeUser.lifetimeKarma % xpPerLevel;
  const nextLevelXPNeeded = xpPerLevel - currentLevelXP;
  const levelProgressPercent = Math.min(100, Math.round((currentLevelXP / xpPerLevel) * 100));

  return (
    <div id="personal-dashboard" className="space-y-6 animate-slide-up select-none">
      {/* Overview stats grids */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* LEDGER NET BALANCE CARD */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full blur-xl -mr-12 -mt-12"></div>
          <div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Net Ledger Balance</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span
                id="dashboard-net-balance"
                className={`text-3xl font-black font-mono tracking-tight ${
                  activeUser.netBalance > 0
                    ? 'text-emerald-600'
                    : activeUser.netBalance < 0
                    ? 'text-rose-600'
                    : 'text-slate-600'
                }`}
              >
                {activeUser.netBalance > 0 ? `+${activeUser.netBalance}` : activeUser.netBalance}
              </span>
              <span className="text-slate-500 font-semibold text-xs">Points Balance</span>
            </div>
          </div>
          <div className="mt-4 pt-3.5 border-t border-slate-50 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {activeUser.netBalance > 0 ? (
                <span className="text-emerald-600 font-medium">✨ Friends owe you favors</span>
              ) : activeUser.netBalance < 0 ? (
                <span className="text-rose-500 font-medium">⚠️ You owe friends favors</span>
              ) : (
                <span className="text-slate-500">⚖️ Perfect balance in flat group</span>
              )}
            </span>
            {activeUser.netBalance > 0 ? (
              <ArrowUpRight size={18} className="text-emerald-500" />
            ) : activeUser.netBalance < 0 ? (
              <ArrowDownRight size={18} className="text-rose-400" />
            ) : null}
          </div>
        </div>

        {/* LIFETIME KARMA XP */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Lifetime Karma XP</span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-3xl font-black font-mono tracking-tight text-indigo-900">{activeUser.lifetimeKarma}</span>
              <span className="text-slate-400 text-xs">XP</span>
            </div>
            {/* Level progression bar */}
            <div className="mt-3">
              <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-1 font-mono">
                <span>LVL {activeUser.level}</span>
                <span>{currentLevelXP}/{xpPerLevel} XP FOR LVL {activeUser.level + 1}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden p-[1px] border border-slate-200/50">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${levelProgressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* COMPLETED RATIO */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Completed Exchanges</span>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="bg-emerald-50 border border-emerald-100/50 rounded-xl p-2.5">
                <span className="text-[10px] font-bold text-emerald-700 block uppercase tracking-wider">Done for Friends</span>
                <span className="text-xl font-bold text-emerald-800 font-mono tracking-tight block mt-0.5">{totalGiven}</span>
              </div>
              <div className="bg-indigo-50 border border-indigo-100/50 rounded-xl p-2.5">
                <span className="text-[10px] font-bold text-indigo-700 block uppercase tracking-wider">Done for Me</span>
                <span className="text-xl font-bold text-indigo-800 font-mono tracking-tight block mt-0.5">{totalReceived}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ACHIEVEMENTS COUNT */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-20 h-20 bg-yellow-50 rounded-full blur-xl -mr-10 -mb-10 pointer-events-none"></div>
          <div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Badges Unlocked</span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-3xl font-black font-mono tracking-tight text-yellow-600">
                {activeUser.unlockedAchievementsCount}
              </span>
              <span className="text-slate-400 font-bold text-xs uppercase font-sans">/ 8 Trophies</span>
            </div>
          </div>
          <div className="mt-4 pt-3.5 border-t border-slate-50 flex items-center gap-1.5 text-xs text-slate-500">
            <Award size={15} className="text-yellow-500 shrink-0" />
            <span>Unlocked {Math.round((activeUser.unlockedAchievementsCount / 8) * 100)}% of total awards</span>
          </div>
        </div>
      </div>

      {/* Main ledger grid splits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Favor Ledger Transactions */}
        <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Your Favor Logs</h3>
              <p className="text-xs text-slate-500">Review outstanding requests and complete balance records</p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start">
              <button
                id="filter-tab-all"
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                id="filter-tab-given"
                onClick={() => setFilter('given')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  filter === 'given' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Given
              </button>
              <button
                id="filter-tab-received"
                onClick={() => setFilter('received')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  filter === 'received' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Received
              </button>
              <button
                id="filter-tab-pending"
                onClick={() => setFilter('pending')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer relative ${
                  filter === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pending
                {pendingRequests > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 border border-white rounded-full animate-ping"></span>
                )}
              </button>
            </div>
          </div>

          {/* List items */}
          {filteredFavors.length === 0 ? (
            <div className="border border-dashed border-slate-200 rounded-2xl p-10 text-center flex-1 flex flex-col justify-center items-center">
              <HelpCircle size={40} className="text-slate-300 mb-3 animate-pulse" />
              <h4 className="font-bold text-slate-800 text-sm">No favours found matching query</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Try switching the filters, or try logging a new completed deed using the button in the upper right corner!
              </p>
            </div>
          ) : (
            <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[500px] pr-1">
              {filteredFavors.map((favor) => {
                const isGiver = favor.giverId === activeUser.id;
                const otherPartyId = isGiver ? favor.receiverId : favor.giverId;
                const otherPartyName = getUserName(otherPartyId);
                const tierInfo = FAVOR_TIERS[favor.tier] || FAVOR_TIERS.quick;
                const grpName = getGroupName(favor.groupId);

                return (
                  <div
                    key={favor.id}
                    id={`favor-card-${favor.id}`}
                    className={`border rounded-xl p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all hover:border-slate-300 ${
                      favor.status === 'pending'
                        ? 'border-amber-200 bg-amber-50/10'
                        : 'border-slate-100 bg-white shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Tier Icon Indicator */}
                      <span className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xl shrink-0 mt-0.5 select-none shadow-xxs">
                        {tierInfo.icon}
                      </span>

                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-bold text-sm text-slate-800 tracking-tight">{favor.title}</h4>
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono font-medium">
                            {grpName}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {favor.description || 'No additional notes provided.'}
                        </p>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-2 font-medium">
                          <Clock size={12} />
                          <span>
                            {new Date(favor.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <span className="text-slate-200">•</span>
                          <span>
                            {isGiver ? (
                              <span>
                                Done by You for <strong className="font-sm font-bold text-slate-700">{otherPartyName}</strong>
                              </span>
                            ) : (
                              <span>
                                Done by <strong className="font-sm font-bold text-slate-700">{otherPartyName}</strong> for You
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-end gap-3 justify-between shrink-0 pl-14 sm:pl-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-55/65">
                      {/* Points value tag */}
                      <div className="text-right">
                        <span className={`font-mono text-sm font-black px-2.5 py-1 rounded-lg ${
                          favor.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : isGiver
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isGiver ? '+' : '-'}
                          {favor.points} XP
                        </span>
                      </div>

                      {/* Status and Action Buttons */}
                      <div className="text-right">
                        {favor.status === 'completed' ? (
                          <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold uppercase tracking-wider font-mono">
                            <CheckCircle size={14} />
                            Completed
                          </span>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-center justify-end gap-1 text-xs text-amber-600 font-bold uppercase tracking-wider font-mono mb-1">
                              <AlertCircle size={14} className="animate-spin" />
                              Pending Verification
                            </div>

                            {/* Verification action: Show Fulfill/Approve button only if ACTIVE user is supposed to be receiving it, or giver can mark fulfilled */}
                            {favor.receiverId === activeUser.id ? (
                              <div className="flex items-center gap-1.5 justify-end">
                                <button
                                  id={`btn-decline-favor-${favor.id}`}
                                  onClick={() => onDeclineFavor(favor.id)}
                                  className="px-2.5 py-1 text-[11px] font-semibold bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                                >
                                  Decline
                                </button>
                                <button
                                  id={`btn-fulfill-favor-${favor.id}`}
                                  onClick={() => onFulfillFavor(favor.id)}
                                  className="px-3 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer"
                                >
                                  Fulfill Request
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-400 italic block">
                                Waiting for @{users.find((u) => u.id === favor.receiverId)?.username}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Global Group Quick Links & Personal Feed */}
        <div className="lg:col-span-4 space-y-6">
          {/* Animated Donut Chart of Favor Balances */}
          <div id="favor-distribution-card" className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Favor Balance Index</h3>
              <div className="flex bg-slate-100 rounded-lg p-0.5">
                <button
                  id="chart-tab-given"
                  onClick={() => setChartView('given')}
                  className={`px-2 py-1 text-[10px] font-extrabold rounded-md transition-all cursor-pointer ${
                    chartView === 'given' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Given
                </button>
                <button
                  id="chart-tab-received"
                  onClick={() => setChartView('received')}
                  className={`px-2 py-1 text-[10px] font-extrabold rounded-md transition-all cursor-pointer ${
                    chartView === 'received' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Received
                </button>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 block tracking-normal mb-1">
              {chartView === 'given'
                ? 'Individual brownie points earned by providing help:'
                : 'Individual brownie points owed by benefiting from help:'}
            </p>

            <div className="h-[200px] w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={displayChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                    isAnimationActive={true}
                    animationBegin={50}
                    animationDuration={650}
                  >
                    {displayChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              {/* Central readout of points */}
              <div className="absolute flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 font-mono">
                  {chartView === 'given' ? 'Sent' : 'Got'}
                </span>
                <span className="text-xl font-black font-mono text-slate-800">
                  {activeCharData.reduce((sum, item) => sum + item.value, 0)} Pts
                </span>
              </div>
            </div>

            {/* Custom Legend details */}
            <div className="mt-2 space-y-1.5 max-h-[110px] overflow-y-auto pr-1">
              {displayChartData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full block"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></span>
                    <span className="font-extrabold text-slate-700">{item.name}</span>
                  </div>
                  <span className="font-mono font-black text-slate-500">{item.value} XP</span>
                </div>
              ))}
            </div>

            {!hasChartData && (
              <div className="absolute inset-0 bg-white/94 backdrop-blur-xs flex flex-col items-center justify-center text-center p-6 rounded-2xl">
                <span className="text-xl animate-bounce">⚖️</span>
                <span className="font-black text-slate-800 text-xs mt-1.5">Sandbox Dynamic Fallback</span>
                <span className="text-[10px] text-slate-400 mt-1 max-w-[200px] leading-normal">
                  You haven't completed any favors in this category yet! Showing demo ratios.
                </span>
              </div>
            )}
          </div>

          {/* Active Groups List */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider text-slate-400">Your Circles</h3>
            <div className="space-y-2">
              {groups
                .filter((g) => g.members.includes(activeUser.id))
                .map((g) => {
                  return (
                    <div
                      key={g.id}
                      className="group p-3 border border-slate-100 rounded-xl hover:bg-slate-50/50 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-xs flex items-center justify-center">
                          💡
                        </span>
                        <div>
                          <span className="font-bold text-slate-800 text-xs tracking-tight block group-hover:text-indigo-600 transition-colors">
                            {g.name}
                          </span>
                          <span className="text-[10px] text-slate-400">{g.members.length} active friends</span>
                        </div>
                      </div>
                      <span className="text-xs text-slate-300 font-mono">
                        {favors.filter((f) => f.groupId === g.id && f.status === 'completed').length} completed
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Activity Feed and history logs */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm-sm flex flex-col h-96 overflow-hidden">
            <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider text-slate-400 shrink-0">Recent Action Log</h3>
            <div className="space-y-4 flex-1 overflow-y-auto pr-1">
              {activities.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center text-xs text-slate-400 italic">
                  No activities in log
                </div>
              ) : (
                activities.slice(0, 10).map((activity) => {
                  const relativeTime = new Date(activity.timestamp).toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div key={activity.id} className="flex gap-3 text-xs items-start leading-relaxed">
                      <div className="shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full bg-indigo-400 ring-4 ring-indigo-50"></div>
                      <div className="flex-1">
                        <p className="text-slate-600 text-[11px] medium">
                          {activity.message}
                        </p>
                        <span className="text-[9px] text-slate-400 font-mono uppercase block mt-0.5">{relativeTime}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
