/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Users, Plus, ArrowUpRight, ArrowDownRight, Award, PlusCircle, CheckCircle, Clock } from 'lucide-react';
import { User, Group, Favor, ActivityLog } from '../types';

interface GroupDashboardProps {
  groups: Group[];
  users: User[];
  favors: Favor[];
  activities: ActivityLog[];
  activeUser: User;
  onCreateGroup: (name: string, description: string, memberIds: string[]) => void;
}

export default function GroupDashboard({
  groups,
  users,
  favors,
  activities,
  activeUser,
  onCreateGroup,
}: GroupDashboardProps) {
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.id || '');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([activeUser.id]);

  const activeGroup = groups.find((g) => g.id === selectedGroupId) || groups[0];

  // Calculate Group-Specific Balances (Given inside group - Received inside group)
  const getGroupScores = () => {
    if (!activeGroup) return [];

    const groupFavors = favors.filter(
      (f) => f.groupId === activeGroup.id && f.status === 'completed'
    );

    const scores: Record<string, { given: number; received: number; net: number }> = {};

    // Initialize all group members with 0
    activeGroup.members.forEach((mId) => {
      scores[mId] = { given: 0, received: 0, net: 0 };
    });

    // Populate from favors
    groupFavors.forEach((favor) => {
      if (scores[favor.giverId]) {
        scores[favor.giverId].given += favor.points;
        scores[favor.giverId].net += favor.points;
      }
      if (scores[favor.receiverId]) {
        scores[favor.receiverId].received += favor.points;
        scores[favor.receiverId].net -= favor.points;
      }
    });

    return activeGroup.members.map((mId) => {
      const user = users.find((u) => u.id === mId);
      return {
        id: mId,
        name: user?.name || 'Friend',
        avatar: user?.avatar || '?',
        username: user?.username || 'friend',
        given: scores[mId]?.given || 0,
        received: scores[mId]?.received || 0,
        net: scores[mId]?.net || 0,
        level: user?.level || 1,
      };
    });
  };

  const groupScores = getGroupScores();

  // Find topmost generous player in this group specifically
  const groupChampion = [...groupScores].sort((a, b) => b.net - a.net)[0];

  // Filter Group favors
  const groupFavors = favors.filter((f) => f.groupId === (activeGroup?.id || ''));

  const handleMemberToggle = (memberId: string) => {
    if (memberId === activeUser.id) return; // Always keep active user in the group
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  const handleCreateGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim() || selectedMembers.length < 2) return;

    onCreateGroup(newGroupName, newGroupDesc, selectedMembers);

    // Reset Form
    setNewGroupName('');
    setNewGroupDesc('');
    setSelectedMembers([activeUser.id]);
    setShowCreateForm(false);
  };

  return (
    <div id="group-dashboard" className="space-y-6 animate-slide-up select-none">
      {/* Group Switcher header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl">
            <Users size={22} />
          </div>
          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Currently Viewing</label>
            <select
              id="group-dashboard-selector"
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="font-bold text-slate-800 text-base focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-lg p-0.5 border-none cursor-pointer bg-transparent"
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          id="btn-toggle-create-group"
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer self-start"
        >
          <Plus size={18} />
          Establish New Circle
        </button>
      </div>

      {/* Dynamic Creation Drawer/Form Panel */}
      {showCreateForm && (
        <div className="bg-white border border-indigo-100 rounded-2xl p-6 md:p-8 shadow-md border-t-4 border-t-indigo-500 animate-scale-up">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Establish a Friend Circle Group</h3>
          <p className="text-xs text-slate-500 mb-6">Split flat duties, study notes, or fuel pools together in a dedicated visual Ledger!</p>

          <form onSubmit={handleCreateGroupSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Circle Name</label>
                <input
                  id="new-group-name"
                  type="text"
                  required
                  placeholder="e.g. Baker Street Roomies 🥯"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-550 transition-all font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Summary / Mission Statement</label>
                <input
                  id="new-group-desc"
                  type="text"
                  placeholder="e.g. Watering flowers, morning flat coffees, grocery loads"
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-550 transition-all font-medium text-sm"
                />
              </div>
            </div>

            {/* Members checkboxes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Select Circle Buddies</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {users.map((user) => {
                  const isActive = user.id === activeUser.id;
                  const isChecked = selectedMembers.includes(user.id);

                  return (
                    <button
                      id={`btn-select-member-${user.id}`}
                      key={user.id}
                      type="button"
                      disabled={isActive}
                      onClick={() => handleMemberToggle(user.id)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isActive
                          ? 'bg-slate-50 border-slate-200 cursor-not-allowed text-slate-400'
                          : isChecked
                          ? 'border-indigo-300 bg-indigo-50/50 text-slate-800 font-semibold'
                          : 'border-slate-150 bg-white hover:bg-slate-50/20 text-slate-650'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-200 font-extrabold text-[10px] flex items-center justify-center">
                          {user.avatar}
                        </span>
                        <div>
                          <span className="text-xs truncate block w-24">{user.name}</span>
                          {isActive && <span className="text-[8px] font-mono text-indigo-400 font-bold uppercase">Creator (You)</span>}
                        </div>
                      </div>
                      {!isActive && (
                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                          isChecked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'
                        }`}>
                          {isChecked && <Plus size={10} className="bold" />}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                id="btn-cancel-new-group"
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-5 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="btn-submit-new-group"
                type="submit"
                className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all cursor-pointer"
              >
                Establish Circle
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Circle Statistics & Balance values */}
      {activeGroup ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* NET BALANCE SCOREBOARD LISTS */}
          <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900">Ledger Balances for {activeGroup.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">Who is contributing vs consuming inside this circle.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {groupScores.map((scoreCard) => {
                const isChampion = groupChampion && scoreCard.id === groupChampion.id && scoreCard.net > 0;

                return (
                  <div
                    key={scoreCard.id}
                    className={`border rounded-xl p-4 flex items-center justify-between relative overflow-hidden transition-all hover:bg-slate-50/50 ${
                      scoreCard.id === activeUser.id
                        ? 'border-indigo-100 bg-indigo-50/10'
                        : 'border-slate-100 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-105 border border-slate-200 text-indigo-700 font-black flex items-center justify-center text-sm shadow-sm relative">
                        {scoreCard.avatar}
                        {isChampion && (
                          <span className="absolute -top-1 -right-1 text-base select-none animate-bounce">👑</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1">
                          {scoreCard.name}
                          {scoreCard.id === activeUser.id && (
                            <span className="text-[8px] bg-slate-200 text-slate-600 px-1 rounded font-mono font-medium">You</span>
                          )}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-mono">
                          Lvl {scoreCard.level} • Given: {scoreCard.given} / Recv: {scoreCard.received}
                        </p>
                      </div>
                    </div>

                    <div className="text-right font-mono font-black text-sm">
                      {scoreCard.net > 0 ? (
                        <span className="text-emerald-600 flex items-center justify-end font-bold">
                          <ArrowUpRight size={14} className="mr-0.5" />
                          +{scoreCard.net}
                        </span>
                      ) : scoreCard.net < 0 ? (
                        <span className="text-rose-600 flex items-center justify-end font-bold">
                          <ArrowDownRight size={14} className="mr-0.5" />
                          {scoreCard.net}
                        </span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                      <span className="text-[9px] text-slate-400 font-sans block mt-0.5 font-normal uppercase">Net balance</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Group specific feed */}
            <div className="mt-8">
              <h4 className="text-sm font-extrabold text-slate-800 mb-3 block">Completed Circle favour logs</h4>

              {groupFavors.length === 0 ? (
                <div className="border border-dashed border-slate-200 rounded-xl p-6 text-center text-xs text-slate-400">
                  No completed favors inside this specific circle.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {groupFavors.map((favor) => {
                    const giverName = users.find((u) => u.id === favor.giverId)?.name || 'Someone';
                    const receiverName = users.find((u) => u.id === favor.receiverId)?.name || 'Someone';

                    return (
                      <div
                        key={favor.id}
                        className="bg-slate-50/50 hover:bg-slate-50 border border-slate-100 p-3 rounded-lg flex items-center justify-between text-xs"
                      >
                        <div className="flex h-5 items-center gap-2">
                          <span className="font-sans font-bold text-slate-800 italic">{favor.title}</span>
                          <span className="text-slate-300">|</span>
                          <span className="text-slate-500">
                            <strong>{giverName}</strong> helped <strong>{receiverName}</strong>
                          </span>
                        </div>
                        <div className="font-bold text-slate-700 font-mono">
                          {favor.status === 'completed' ? (
                            <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                              +{favor.points} XP
                            </span>
                          ) : (
                            <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded">Pending</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* CIRCLE CHAMPION & DETAILS PANEL */}
          <div className="lg:col-span-4 space-y-6">
            {activeGroup && (
              <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-sm border border-slate-800 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

                <div className="relative z-10 space-y-5">
                  <div>
                    <span className="text-[10px] bg-slate-850 px-2.5 py-1 text-slate-400 rounded-md uppercase font-semibold block w-max mb-2">
                      Circle Champion
                    </span>
                    {groupChampion && groupChampion.net > 0 ? (
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-yellow-500/15 border-2 border-yellow-400/80 rounded-xl text-yellow-400 flex items-center justify-center text-2xl animate-bounce">
                          👑
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-base">{groupChampion.name}</h4>
                          <p className="text-xs text-indigo-300">
                            Holds (+{groupChampion.net} Points) outstanding goodwill in this group!
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 italic">No undisputed favor champions yet. Help out to claim the top spot!</div>
                    )}
                  </div>

                  <div className="border-t border-slate-800 pt-4 space-y-3 text-xs leading-normal">
                    <h5 className="font-bold text-slate-100 uppercase tracking-widest text-[9px]">CIRCLE INFORMATION</h5>
                    <div>
                      <strong className="text-slate-300 block">Mission Description:</strong>
                      <span className="text-slate-400">{activeGroup.description || 'None provided'}</span>
                    </div>

                    <div className="flex justify-between border-t border-slate-800/80 pt-3">
                      <span className="text-slate-400">Established:</span>
                      <span className="font-mono text-slate-300">
                        {new Date(activeGroup.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Members:</span>
                      <span className="font-mono text-slate-300">{activeGroup.members.length} friends</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-10 text-center text-slate-500">
          No Groups created. Click "Establish New Circle" to design your friendly squad!
        </div>
      )}
    </div>
  );
}
