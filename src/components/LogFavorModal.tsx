/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Trophy, HelpCircle, Check, Info, ShieldAlert, BadgeCheck } from 'lucide-react';
import { User, Group, FavorTierId } from '../types';
import { FAVOR_TIERS } from '../mockData';

interface LogFavorModalProps {
  onClose: () => void;
  activeUser: User;
  users: User[];
  groups: Group[];
  onSubmitFavor: (data: {
    title: string;
    description: string;
    points: number;
    giverId: string;
    receiverId: string;
    tier: FavorTierId;
    groupId: string;
    status: 'completed' | 'pending';
  }) => void;
}

export default function LogFavorModal({
  onClose,
  activeUser,
  users,
  groups,
  onSubmitFavor,
}: LogFavorModalProps) {
  const [mode, setMode] = useState<'give' | 'request'>('give');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFriendId, setSelectedFriendId] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.id || '');
  const [selectedTier, setSelectedTier] = useState<FavorTierId>('small');

  const otherFriends = users.filter((u) => u.id !== activeUser.id);

  // Auto-fill selected friend in group if group is selected, and vice versa
  const handleGroupChange = (groupId: string) => {
    setSelectedGroupId(groupId);
    const group = groups.find((g) => g.id === groupId);
    if (group && !group.members.includes(selectedFriendId)) {
      // Pick first member in this group that's not activeUser
      const appropriateMember = group.members.find((mId) => mId !== activeUser.id);
      if (appropriateMember) setSelectedFriendId(appropriateMember);
    }
  };

  const handleFriendChange = (friendId: string) => {
    setSelectedFriendId(friendId);
    // Find a group containing both activeUser and this friend
    const commonGroup = groups.find(
      (g) => g.members.includes(activeUser.id) && g.members.includes(friendId)
    );
    if (commonGroup) {
      setSelectedGroupId(commonGroup.id);
    }
  };

  // Set default targets on mount
  React.useEffect(() => {
    if (otherFriends.length > 0 && !selectedFriendId) {
      handleFriendChange(otherFriends[0].id);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedFriendId) return;

    const pointsValue = FAVOR_TIERS[selectedTier].points;

    // "give" mode -> I did a favor for friend (GIVER is me, RECEIVER is friend, completed)
    // "request" mode -> I request friend to do a favor (GIVER is friend, RECEIVER is me, pending)
    const giverId = mode === 'give' ? activeUser.id : selectedFriendId;
    const receiverId = mode === 'give' ? selectedFriendId : activeUser.id;
    const status = mode === 'give' ? 'completed' : 'pending';

    onSubmitFavor({
      title,
      description,
      points: pointsValue,
      giverId,
      receiverId,
      tier: selectedTier,
      groupId: selectedGroupId,
      status,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        id="modal-backdrop"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      ></div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden relative z-10 animate-scale-up flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-b border-slate-100 shrink-0">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Record custom deeds</h3>
            <p className="text-xs text-slate-500 mt-0.5">Keep credits and karma points balanced</p>
          </div>
          <button
            id="close-modal-x"
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Toggle Mode */}
        <div className="p-6 pb-0 flex gap-2 shrink-0">
          <button
            id="tab-mode-give"
            type="button"
            onClick={() => setMode('give')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm tracking-tight border flex items-center justify-center gap-2 transition-all cursor-pointer ${
              mode === 'give'
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-extrabold shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <BadgeCheck size={18} />
            I Did a Favor (Complete)
          </button>
          <button
            id="tab-mode-request"
            type="button"
            onClick={() => setMode('request')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm tracking-tight border flex items-center justify-center gap-2 transition-all cursor-pointer ${
              mode === 'request'
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-extrabold shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle size={18} />
            Request a Favor (Pending)
          </button>
        </div>

        {/* Form Scrollable */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 select-none">
          {/* Group and Friend context alignment */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Group Circle
              </label>
              <select
                id="modal-group-select"
                value={selectedGroupId}
                onChange={(e) => handleGroupChange(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-50/50 font-medium"
              >
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                {mode === 'give' ? 'Recipient Friend' : 'Target Friend'}
              </label>
              <select
                id="modal-friend-select"
                value={selectedFriendId}
                onChange={(e) => handleFriendChange(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-50/50 font-medium"
                required
              >
                {otherFriends.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} (@{f.username})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              What is the Deed?
            </label>
            <input
              id="modal-title-input"
              type="text"
              required
              placeholder={
                mode === 'give'
                  ? 'e.g. Bought Starbucks / Helped debug Docker error'
                  : 'e.g. Need a ride to terminal / Lift heavy bookshelf'
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              Fun details or Proof (Optional)
            </label>
            <textarea
              id="modal-desc-input"
              rows={2}
              placeholder="Provide a quick funny summary or describe the agreement details."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
            />
          </div>

          {/* Value Tiers Slider/Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex justify-between items-center">
              <span>Favor Score & Effort valuation</span>
              <span className="text-indigo-600 font-extrabold font-mono text-xs bg-indigo-50 px-2 py-0.5 rounded">
                {FAVOR_TIERS[selectedTier].points} points value
              </span>
            </label>

            <div className="grid grid-cols-5 gap-2">
              {(Object.keys(FAVOR_TIERS) as FavorTierId[]).map((tierId) => {
                const tier = FAVOR_TIERS[tierId];
                const active = selectedTier === tierId;

                return (
                  <button
                    id={`btn-tier-select-${tierId}`}
                    key={tierId}
                    type="button"
                    onClick={() => setSelectedTier(tierId)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col justify-between items-center h-22 ${
                      active
                        ? 'bg-gradient-to-b from-indigo-50 to-indigo-100/50 border-indigo-300 text-indigo-800 scale-[1.03] shadow-xs'
                        : 'border-slate-150 bg-white hover:bg-slate-50/50 text-slate-600'
                    }`}
                  >
                    <span className="text-xl shrink-0">{tier.icon}</span>
                    <span className="text-[10px] font-black tracking-tight tracking-tighter truncate block w-full">
                      {tier.label.split(' ')[1]}
                    </span>
                    <span className="text-xs font-extrabold font-mono block">+{tier.points}p</span>
                  </button>
                );
              })}
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex gap-2 mt-3">
              <Info size={16} className="text-indigo-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-500 leading-normal">
                <strong>{FAVOR_TIERS[selectedTier].label}:</strong> {FAVOR_TIERS[selectedTier].description}
              </p>
            </div>
          </div>

          {/* Validation Notice footer inside modal form */}
          {mode === 'give' ? (
            <div className="bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100 p-3.5 flex items-start gap-2.5 text-xs">
              <Trophy size={16} className="text-emerald-500 shrink-0 mt-0.5 animate-bounce" />
              <div>
                <strong className="block font-bold">Instant Balancer</strong>
                Logging this completes the favor. You immediately gain{' '}
                <strong>{FAVOR_TIERS[selectedTier].points} XP</strong>, your net balance increases, and your helper stats update!
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 text-amber-800 rounded-xl border border-amber-100 p-3.5 flex items-start gap-2.5 text-xs">
              <ShieldAlert size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Requires Verification</strong>
                This enters the group feed as a pending request. The selected friend can click "Fulfill favor" to claim their XP points and level credits.
              </div>
            </div>
          )}

          {/* Footer controls */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              id="btn-cancel-modal"
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="btn-submit-modal"
              type="submit"
              className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check size={16} />
              {mode === 'give' ? 'Log Completed Deed' : 'Post Favor Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
