/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Smile,
  ShieldCheck,
  User,
  Coffee,
  Heart,
  Volume2,
  Tv,
} from 'lucide-react';
import { User as UserType, Group, ChatMessage } from '../types';

interface BanterChatProps {
  activeUser: UserType;
  users: UserType[];
  groups: Group[];
  chatMessages: ChatMessage[];
  onSendMessage: (groupId: string, senderId: string, text: string, mediaEmoji?: string) => void;
}

const FUN_BANTER_PROMPTS = [
  "Pay me back in donuts next time! 🍩",
  "You're a lifesaver, genuinely! Settle charts are looking good now. 🙌",
  "Don't worry about it, what are friends for? 😇",
  "Outstanding Move! Carbon emission index credits claimed! 🚗💨",
  "I am entering this into the blockchain of brownie points. 🪙",
  "Who's doing the coffee run today? I am severely under-caffeinated. ☕",
  "My net balance is in the red. Someone please let me do a favor for you! 😭",
  "No problem! Just wash the mugs next time. 🧼",
  "Perfect. This counts towards my Karma Champion badge! 🏆",
  "That was literally a hero tier deed! Pizza is on me later. 🍕"
];

const EMOJI_STICKERS = ['🍪', '🥯', '🍩', '☕', '🚗', '💻', '✈️', '🍕', '👑', '👍', '🔥', '👀', '💡'];

export default function BanterChat({
  activeUser,
  users,
  groups,
  chatMessages,
  onSendMessage,
}: BanterChatProps) {
  const [selectedGroupId, setSelectedGroupId] = useState<string>(groups[0]?.id || '');
  const [inputText, setInputText] = useState('');
  const [selectedSticker, setSelectedSticker] = useState<string | undefined>(undefined);
  const [activeSenderId, setActiveSenderId] = useState<string>(activeUser.id);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, selectedGroupId]);

  const activeGroup = groups.find((g) => g.id === selectedGroupId) || groups[0];

  if (!activeGroup) {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center max-w-xl mx-auto my-12 shadow-sm">
        <MessageSquare size={48} className="text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-extrabold text-slate-800">No active Group Circles</h3>
        <p className="text-xs text-slate-500 mt-2">
          Create a group circle inside the "Group Dashboards" tab first to initialize banter chat!
        </p>
      </div>
    );
  }

  // Find all members in the current group
  const groupUserProfiles = users.filter((u) => activeGroup.members.includes(u.id));

  // Filter messages for current group
  const filteredMessages = chatMessages.filter((m) => m.groupId === activeGroup.id);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !selectedSticker) return;

    onSendMessage(activeGroup.id, activeSenderId, inputText, selectedSticker);
    setInputText('');
    setSelectedSticker(undefined);
  };

  const getUserProfile = (userId: string) => {
    return users.find((u) => u.id === userId);
  };

  // Simulates a banter reply from a random friend in the group
  const handleAutoBanterReply = () => {
    // Exclude the currently chosen active sender so someone else speaks!
    const otherMembers = groupUserProfiles.filter((u) => u.id !== activeSenderId);
    const speaker = otherMembers.length > 0 
      ? otherMembers[Math.floor(Math.random() * otherMembers.length)]
      : groupUserProfiles[Math.floor(Math.random() * groupUserProfiles.length)];

    if (!speaker) return;

    const randomText = FUN_BANTER_PROMPTS[Math.floor(Math.random() * FUN_BANTER_PROMPTS.length)];
    const randomSticker = Math.random() > 0.6 ? EMOJI_STICKERS[Math.floor(Math.random() * EMOJI_STICKERS.length)] : undefined;

    // Simulate sending after a short delay
    setTimeout(() => {
      onSendMessage(activeGroup.id, speaker.id, randomText, randomSticker);
    }, 400);
  };

  return (
    <div id="banter-chat-container" className="grid grid-cols-1 lg:grid-cols-12 gap-6 select-none animate-slide-up h-[660px]">
      {/* LEFT SIDEBAR: CIRCLES NAVIGATION & PERSONA SWITCHER */}
      <div className="lg:col-span-4 flex flex-col gap-5 h-full">
        {/* CIRCLE SELECTOR LIST */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col flex-1 overflow-hidden">
          <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest px-1 mb-3 flex items-center gap-1.5">
            <Volume2 size={13} className="text-indigo-500" />
            Active Circles
          </h2>
          <div className="space-y-1.5 overflow-y-auto flex-1 pr-1">
            {groups.map((g) => {
              const isSelected = g.id === selectedGroupId;
              const groupMsgCount = chatMessages.filter((m) => m.groupId === g.id).length;
              const lastMsg = chatMessages.filter((m) => m.groupId === g.id).slice(-1)[0];

              return (
                <button
                  key={g.id}
                  onClick={() => {
                    setSelectedGroupId(g.id);
                    // Update active sender if they are not in the new group
                    if (!g.members.includes(activeSenderId)) {
                      setActiveSenderId(activeUser.id);
                    }
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all border flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600/5 hover:bg-indigo-600/10 border-indigo-200 shadow-xxs'
                      : 'border-transparent hover:bg-slate-50/70'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-lg shadow-xxs shrink-0">
                      💬
                    </span>
                    <div className="min-w-0">
                      <span className={`font-bold text-xs tracking-tight block truncate ${isSelected ? 'text-indigo-900 font-extrabold' : 'text-slate-700'}`}>
                        {g.name}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate leading-tight mt-0.5">
                        {lastMsg && !lastMsg.isSystem ? `@${getUserProfile(lastMsg.senderId)?.username || 'user'}: ${lastMsg.text}` : g.description}
                      </span>
                    </div>
                  </div>
                  {groupMsgCount > 0 && (
                    <span className="font-mono text-[9px] font-black bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full shrink-0">
                      {groupMsgCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* PERSONALITY PERSPECTIVE PANEL (SIMULATOR FOR TESTING) */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-4 shadow-md">
          <div className="flex items-start gap-2 mb-2">
            <Sparkles size={16} className="text-yellow-400 animate-pulse mt-0.5 shrink-0" />
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-yellow-400">Sandbox Persona Switcher</h3>
              <p className="text-[10px] text-indigo-200 mt-1 leading-normal">
                Want to test the chat exchange flow? Switch who is typing below, or use the quick reply bot!
              </p>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            <div>
              <label className="text-[10px] font-bold text-indigo-300 block mb-1">Send Message As:</label>
              <div className="bg-indigo-950/50 border border-indigo-800/40 rounded-xl p-1 pr-2.5 flex items-center gap-2">
                <div className="bg-indigo-600 font-bold text-[9px] text-white px-2 py-1 rounded-lg uppercase block shrink-0 font-mono tracking-wider">
                  Speaker
                </div>
                <select
                  value={activeSenderId}
                  onChange={(e) => setActiveSenderId(e.target.value)}
                  className="w-full text-xs font-bold text-slate-200 focus:outline-none border-none bg-transparent py-0.5 cursor-pointer"
                >
                  {/* Only show speakers present in current circle */}
                  {groupUserProfiles.map((member) => (
                    <option key={member.id} value={member.id} className="text-slate-800 font-medium">
                      {member.name} {member.id === activeUser.id ? '(You)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleAutoBanterReply}
              className="w-full py-2 bg-yellow-400 hover:bg-yellow-300 text-slate-900 text-[11px] font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-950"
            >
              <span>🤖 Trigger Random Friend Reply</span>
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT CHAT AREA */}
      <div className="lg:col-span-8 flex flex-col bg-white border border-slate-100 rounded-3xl shadow-sm h-full overflow-hidden">
        {/* GROUP HEADER CHAT BAR */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/35">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-slate-950 tracking-tight">{activeGroup.name}</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">{activeGroup.description}</p>
          </div>

          {/* Member Avatars list */}
          <div className="flex items-center -space-x-1.5">
            {groupUserProfiles.slice(0, 5).map((u) => (
              <div
                key={u.id}
                title={`${u.name} (@${u.username})`}
                className="w-7 h-7 bg-slate-100 border-2 border-white rounded-full flex items-center justify-center font-black text-[9px] text-slate-700"
              >
                {u.avatar}
              </div>
            ))}
            {groupUserProfiles.length > 5 && (
              <div className="w-7 h-7 bg-indigo-100 border-2 border-white rounded-full flex items-center justify-center font-mono font-black text-[9px] text-indigo-700">
                +{groupUserProfiles.length - 5}
              </div>
            )}
          </div>
        </div>

        {/* MESSAGES FEED SCROLLER */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/20">
          {filteredMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-100/70 rounded-2xl">
              <MessageSquare size={36} className="text-slate-300 mb-2 mt-4" />
              <h4 className="font-bold text-slate-700 text-xs">No chatter in this ledger group yet</h4>
              <p className="text-[10px] text-slate-400 mt-1 max-w-xs leading-normal">
                Type a friendly reminder, log some favors, or trigger the friend reply bot above to spark the conversation!
              </p>
            </div>
          ) : (
            filteredMessages.map((msg) => {
              if (msg.isSystem) {
                // SYSTEM REPORT MESSAGE (Inline log of favors)
                return (
                  <div
                    key={msg.id}
                    id={`chat-msg-${msg.id}`}
                    className="flex justify-center my-2 max-w-2xl mx-auto"
                  >
                    <div className="flex items-center gap-2 border border-indigo-100/90 bg-indigo-50/30 text-indigo-900 border-dashed rounded-xl px-4 py-2 text-[11px] font-semibold text-center leading-relaxed max-w-max select-none shadow-xxs">
                      <ShieldCheck size={14} className="text-indigo-500 shrink-0" />
                      <span>{msg.text}</span>
                      <span className="text-[8px] font-mono text-indigo-400 font-bold uppercase ml-2">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              }

              const sender = getUserProfile(msg.senderId);
              const isCurrentUser = msg.senderId === activeUser.id;

              return (
                <div
                  key={msg.id}
                  id={`chat-msg-${msg.id}`}
                  className={`flex gap-3 max-w-[85%] ${
                    isCurrentUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  }`}
                >
                  {/* Sender Avatar */}
                  <div
                    title={sender?.name}
                    className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[10px] font-black border select-none ${
                      isCurrentUser
                        ? 'bg-indigo-600 text-white border-indigo-700'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-100'
                    }`}
                  >
                    {sender?.avatar || '??'}
                  </div>

                  {/* Message Bubble Column */}
                  <div className={`space-y-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-[10px] font-black text-slate-600">
                        {sender?.name || 'Friend'}
                      </span>
                      <span className="text-[8px] font-mono text-slate-400">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div
                      className={`relative p-3 rounded-2xl text-xs leading-relaxed ${
                        isCurrentUser
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-white border border-slate-100 text-slate-800 shadow-xxs rounded-tl-none'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      {/* Optional emoji sticker */}
                      {msg.mediaEmoji && (
                        <div
                          className={`absolute -bottom-2 ${
                            isCurrentUser ? 'left-2' : 'right-2'
                          } text-sm bg-white border border-slate-100 rounded-full h-6 w-6 flex items-center justify-center shadow-xs select-none`}
                        >
                          {msg.mediaEmoji}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* CHAT INPUT AND STICKER PICKER BAR */}
        <div className="p-4 border-t border-slate-100 bg-white space-y-3 shrink-0">
          {/* EMOJI STICKERS LIST SELECTOR */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Smile size={12} className="text-yellow-500" />
              Stickers:
            </span>
            {EMOJI_STICKERS.map((emoji) => {
              const isSelected = selectedSticker === emoji;
              return (
                <button
                  key={emoji}
                  onClick={() => setSelectedSticker(isSelected ? undefined : emoji)}
                  className={`text-slate-700 text-xs h-7 w-7 rounded-lg border flex items-center justify-center hover:bg-slate-50 transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-300 scale-110 shadow-xxs font-extrabold'
                      : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  {emoji}
                </button>
              );
            })}
          </div>

          {/* INPUT FIELD CONTAINER */}
          <form onSubmit={handleSend} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={`Chatting in ${activeGroup.name} as ${
                  getUserProfile(activeSenderId)?.name || 'active account'
                }...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full text-xs font-medium placeholder-slate-400 focus:outline-none border border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white transition-all"
              />
              {selectedSticker && (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-indigo-50 text-xs px-2 py-0.5 rounded-lg border border-indigo-200 flex items-center gap-1 animate-pulse select-none">
                  <span>Sticker:</span>
                  <span>{selectedSticker}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedSticker(undefined)}
                    className="text-[9px] text-indigo-500 font-extrabold ml-1 hover:text-indigo-800"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 px-4 flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-md shadow-indigo-100"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
