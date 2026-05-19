/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Phone, Share2, Copy, Check, MessageSquare, Send, UserPlus, Sparkles } from 'lucide-react';
import { User, Group } from '../types';

interface InviteFriendsProps {
  activeUser: User;
  groups: Group[];
  onAddSimulatedUser: (name: string, username: string, email: string, phone: string, groupId: string) => void;
}

export default function InviteFriends({ activeUser, groups, onAddSimulatedUser }: InviteFriendsProps) {
  const [selectedGroup, setSelectedGroup] = useState<string>(groups[0]?.id || '');
  const [inviteName, setInviteName] = useState('');
  const [inviteContact, setInviteContact] = useState('');
  const [inviteType, setInviteType] = useState<'email' | 'phone' | 'social'>('email');
  const [copiedText, setCopiedText] = useState(false);
  const [simulationSucess, setSimulationSuccess] = useState(false);
  const [simulatedUserInfo, setSimulatedUserInfo] = useState<{name: string, username: string} | null>(null);

  const groupName = groups.find(g => g.id === selectedGroup)?.name || 'our group';

  // Generate invitation copy text
  const getInviteMessage = () => {
    const appUrl = window.location.origin;
    const shareMessage = `Hey ${inviteName || 'there'}! I'm using FavorFlow to track coordinates, help, and keep tabs on favours for ${groupName}. Join us so we can settle up, trade helpful deeds, and unlock gamified achievements together! Join here: ${appUrl}/invite?groupId=${selectedGroup}&ref=${activeUser.username}`;
    return shareMessage;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getInviteMessage());
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleSimulateJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim()) return;

    const formattedUsername = inviteName.toLowerCase().replace(/\s+/g, '_');
    const mockEmail = inviteType === 'email' ? inviteContact : `${formattedUsername}@example.com`;
    const mockPhone = inviteType === 'phone' ? inviteContact : '+1 (555) ' + Math.floor(1000000 + Math.random() * 9000000);

    onAddSimulatedUser(
      inviteName,
      formattedUsername,
      mockEmail,
      mockPhone,
      selectedGroup
    );

    setSimulatedUserInfo({ name: inviteName, username: formattedUsername });
    setSimulationSuccess(true);
    setInviteName('');
    setInviteContact('');

    setTimeout(() => {
      setSimulationSuccess(false);
    }, 5000);
  };

  return (
    <div id="invite-friends-section" className="space-y-6 animate-slide-up">
      <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-50 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>

        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Share2 size={20} />
            </span>
            <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">Expand Your Crew</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Invite Companions & Settlers</h2>
          <p className="mt-2 text-slate-500 text-lg">
            FavorFlow is much more rewarding with your inner circle. Send invites via email, phone, or standard social channels to let friends track deeds!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
          {/* Invite Code Generator Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                id="btn-invite-type-email"
                type="button"
                onClick={() => setInviteType('email')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  inviteType === 'email'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Mail size={16} />
                Email
              </button>
              <button
                id="btn-invite-type-phone"
                type="button"
                onClick={() => setInviteType('phone')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  inviteType === 'phone'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Phone size={16} />
                SMS / WhatsApp
              </button>
              <button
                id="btn-invite-type-social"
                type="button"
                onClick={() => setInviteType('social')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  inviteType === 'social'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MessageSquare size={16} />
                Social Link
              </button>
            </div>

            <form onSubmit={handleSimulateJoin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Recipient's Friend Name</label>
                <input
                  id="invite-name-input"
                  type="text"
                  required
                  placeholder="e.g. Taylor Quinn"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-50/50"
                />
              </div>

              {inviteType !== 'social' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    {inviteType === 'email' ? 'Email Address' : 'Phone Number'}
                  </label>
                  <input
                    id="invite-contact-input"
                    type={inviteType === 'email' ? 'email' : 'tel'}
                    required
                    placeholder={inviteType === 'email' ? 'taylor@example.com' : '+1 (555) 765-4321'}
                    value={inviteContact}
                    onChange={(e) => setInviteContact(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-50/50"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Assign to Group Dashboard</label>
                <select
                  id="invite-group-select"
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-50/50"
                >
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  id="btn-simulate-join"
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3.5 rounded-xl transition-all shadow-sm hover:shadow-indigo-100 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserPlus size={18} />
                  Simulate Interactive Join
                </button>

                <button
                  id="btn-copy-link"
                  type="button"
                  onClick={handleCopy}
                  className="sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {copiedText ? <Check className="text-emerald-500" size={18} /> : <Copy size={18} />}
                  {copiedText ? 'Copied Link!' : 'Copy Invite Template'}
                </button>
              </div>
            </form>

            {/* Simulated instant visual proof */}
            {simulationSucess && simulatedUserInfo && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
                <span className="p-2 bg-emerald-100 text-emerald-600 rounded-lg shrink-0 mt-0.5">
                  <Sparkles size={18} />
                </span>
                <div>
                  <h4 className="font-bold text-emerald-900">Success! Simulated User Joined 🎉</h4>
                  <p className="text-emerald-700 text-sm mt-1">
                    <strong>{simulatedUserInfo.name}</strong> (@{simulatedUserInfo.username}) has accepted your invitation, joined the <strong>{groupName}</strong> group, and is now available in the Account Switcher at the top of the screen!
                  </p>
                  <p className="text-emerald-600 text-xs mt-2 italic font-medium">
                    Try selecting `{simulatedUserInfo.name}` in the top switcher to log favours from their perspective!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Code Preview / Message Template Board */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-slate-950 rounded-2xl p-5 flex-1 flex flex-col text-slate-300 font-mono text-sm border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <span className="text-xs text-slate-500 uppercase font-semibold">Message Blueprint</span>
              </div>

              <div className="flex-1 bg-slate-900 border border-slate-800/80 rounded-xl p-4 overflow-y-auto max-h-[220px] mb-4 text-xs text-slate-300 leading-relaxed">
                <span className="block text-slate-500 mb-1">// {inviteType.toUpperCase()} INVITATION TEMPLATE:</span>
                <span className="text-indigo-400">to:</span> {inviteName || 'Friend Name'}
                <br />
                {inviteType === 'email' && (
                  <>
                    <span className="text-indigo-400">subject:</span> Help me balance our karma on FavorFlow! ⚖️
                    <br />
                  </>
                )}
                {inviteType === 'phone' && (
                  <>
                    <span className="text-indigo-400">to_phone:</span> {inviteContact || '+1 (555) 000-0000'}
                    <br />
                  </>
                )}
                <br />
                {getInviteMessage()}
              </div>

              <div className="space-y-4 pt-2 border-t border-slate-800">
                <p className="text-xs text-slate-500 leading-normal">
                  💡 Clicking <strong>"Simulate Interactive Join"</strong> acts as if the friend received this message, opened their browser, pressed the join link, and registered. You can immediately log favors for them or from them!
                </p>

                <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-3.5 gap-3 items-center">
                  <div className="p-2 bg-indigo-950 text-indigo-400 rounded-lg">
                    <Send size={16} />
                  </div>
                  <div>
                    <h5 className="font-sans font-semibold text-slate-100 text-xs">Dynamic sandbox routing</h5>
                    <p className="font-sans text-[11px] text-slate-400 mt-0.5">Invite code links configure the route payload dynamically in LocalStorage.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
