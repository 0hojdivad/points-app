/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Award, ArrowUpRight, ArrowDownRight, Lightbulb, Users, CheckCircle2 } from 'lucide-react';
import { User } from '../types';

interface LeaderboardProps {
  users: User[];
  activeUser: User;
}

export default function Leaderboard({ users, activeUser }: LeaderboardProps) {
  const [sortBy, setSortBy] = useState<'karma' | 'balance'>('karma');

  // Sort list
  const sortedUsers = [...users].sort((a, b) => {
    if (sortBy === 'karma') {
      return b.lifetimeKarma - a.lifetimeKarma;
    } else {
      return b.netBalance - a.netBalance;
    }
  });

  // Calculate settlement path algorithm
  const generateSettlementSteps = () => {
    // Collect creditors (positive balance) and debtors (negative balance)
    const creditors = users
      .filter((u) => u.netBalance > 0)
      .map((u) => ({ ...u }))
      .sort((a, b) => b.netBalance - a.netBalance);
    const debtors = users
      .filter((u) => u.netBalance < 0)
      .map((u) => ({ ...u, netBalance: Math.abs(u.netBalance) }))
      .sort((a, b) => b.netBalance - a.netBalance);

    const steps: { debtorName: string; creditorName: string; points: number }[] = [];

    let cIndex = 0;
    let dIndex = 0;

    // Greedy matching
    while (cIndex < creditors.length && dIndex < debtors.length) {
      const creditor = creditors[cIndex];
      const debtor = debtors[dIndex];

      const settleValue = Math.min(creditor.netBalance, debtor.netBalance);
      if (settleValue > 0) {
        steps.push({
          debtorName: debtor.name,
          creditorName: creditor.name,
          points: settleValue,
        });

        creditor.netBalance -= settleValue;
        debtor.netBalance -= settleValue;
      }

      if (creditor.netBalance === 0) cIndex++;
      if (debtor.netBalance === 0) dIndex++;
    }

    return steps;
  };

  const settlementSteps = generateSettlementSteps();

  return (
    <div id="leaderboard-section" className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-slide-up">
      {/* Main Leaderboard Table */}
      <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Friend Rankings</h2>
            <p className="text-xs text-slate-500 mt-1">
              Who is the most generous friend? Filter by Karma or Ledger Balance.
            </p>
          </div>

          <div className="bg-slate-100 p-1 rounded-xl flex self-start">
            <button
              id="btn-sort-karma"
              onClick={() => setSortBy('karma')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                sortBy === 'karma'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Lifetime Karma
            </button>
            <button
              id="btn-sort-balance"
              onClick={() => setSortBy('balance')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                sortBy === 'balance'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Net Balance
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase font-extrabold">
                <th className="pb-3 text-center w-12">Rank</th>
                <th className="pb-3 px-4">Friend</th>
                <th className="pb-3 px-4 text-center">Level</th>
                <th className="pb-3 px-4 text-right">Lifetime XP</th>
                <th className="pb-3 px-4 text-right">Net Balance Ledger</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user, index) => {
                const isCurrentUser = user.id === activeUser.id;
                const rank = index + 1;

                let medal = '';
                if (rank === 1) medal = '🥇';
                else if (rank === 2) medal = '🥈';
                else if (rank === 3) medal = '🥉';

                return (
                  <tr
                    key={user.id}
                    className={`border-b border-slate-50/80 hover:bg-slate-50/50 transition-colors ${
                      isCurrentUser ? 'bg-indigo-50/20' : ''
                    }`}
                  >
                    <td className="py-4 text-center font-bold text-slate-700 text-sm">
                      {medal ? (
                        <span className="text-xl">{medal}</span>
                      ) : (
                        <span className="text-slate-400">#{rank}</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm relative">
                          {user.avatar}
                          {isCurrentUser && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                            {user.name}
                            {isCurrentUser && (
                              <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded font-medium font-mono uppercase">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 font-mono">@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded-full font-extrabold font-mono select-none">
                        Lvl {user.level}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-slate-800 text-sm font-mono">
                      {user.lifetimeKarma} <span className="text-xs font-sans text-slate-400 font-normal">pts</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1 font-mono font-bold text-sm">
                        {user.netBalance > 0 ? (
                          <span className="text-emerald-600 flex items-center">
                            <ArrowUpRight size={16} className="inline mr-0.5" />
                            +{user.netBalance}
                          </span>
                        ) : user.netBalance < 0 ? (
                          <span className="text-rose-600 flex items-center">
                            <ArrowDownRight size={16} className="inline mr-0.5" />
                            {user.netBalance}
                          </span>
                        ) : (
                          <span className="text-slate-500">0</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Settle Up suggestions & stats panel */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-slate-900 text-slate-100 border border-slate-800 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          {/* Background overlay */}
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 text-indigo-400 font-bold mb-3">
              <Lightbulb size={18} />
              <span className="text-xs tracking-wider uppercase">Settle-Up Suggestions</span>
            </div>

            <h3 className="text-lg font-bold text-white tracking-tight">Deed Settler Plan</h3>
            <p className="text-xs text-slate-400 mt-1 mb-5 leading-relaxed">
              Based on active debts, here are the minimum favor points exchanges recommended to bring everyone to perfect equality:
            </p>

            {settlementSteps.length === 0 ? (
              <div className="bg-slate-800/60 rounded-xl p-4 text-center border border-slate-800">
                <CheckCircle2 size={24} className="text-emerald-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-200">Perfectly Settle Up!</h4>
                <p className="text-xs text-slate-500 mt-1 leading-normal">
                  All credits and debts are beautifully balanced. Nobody owes anything!
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                {settlementSteps.map((step, index) => (
                  <div
                    key={index}
                    className="bg-slate-800/40 border border-slate-850/85 rounded-xl p-3.5 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-300">{step.debtorName}</span>
                      <span className="text-[10px] text-slate-500 font-mono uppercase">OWES</span>
                      <span className="font-bold text-emerald-300">{step.creditorName}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-800">
                      <span className="text-slate-400">Total Points Settle:</span>
                      <span className="font-mono font-bold text-slate-200 bg-slate-800 px-2 py-0.5 rounded-md">
                        {step.points} Favs
                      </span>
                    </div>

                    {/* Fun Suggestion actions based on points */}
                    <div className="text-[11px] text-slate-400 italic font-sans flex items-start gap-1">
                      <span>💡</span>
                      <span>
                        Can settle with:{' '}
                        {step.points >= 30
                          ? 'Moving boxes/Help clean flat area (Large/Hero)'
                          : step.points >= 15
                          ? 'IKEA table assembly or an Airport lift (Medium)'
                          : step.points >= 5
                          ? 'A nice lunch delivery or car lift (Small)'
                          : 'A hot coffee or print out papers (Quick)'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Global Summary Badge achievements */}
        <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg shrink-0">
              <Users size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Group Unity Stats</h4>
              <p className="text-[11px] text-slate-400">Summary across the group networks</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50/50 hover:bg-slate-50 rounded-xl p-3 border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Exchange</span>
              <div className="text-lg font-black font-mono text-slate-850 mt-1">
                {users.reduce((acc, u) => acc + u.lifetimeKarma, 0)} pts
              </div>
            </div>
            <div className="bg-slate-50/50 hover:bg-slate-50 rounded-xl p-3 border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Avg Level</span>
              <div className="text-lg font-black font-mono text-slate-850 mt-1">
                {(users.reduce((acc, u) => acc + u.level, 0) / users.length).toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
