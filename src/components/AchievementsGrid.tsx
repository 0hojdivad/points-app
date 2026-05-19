/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Award, CheckCircle2, Trophy, Flame, ChevronRight, Lock } from 'lucide-react';
import { User, Achievement } from '../types';

interface AchievementsGridProps {
  activeUser: User;
  achievements: Achievement[];
}

export default function AchievementsGrid({ activeUser, achievements }: AchievementsGridProps) {
  // Sort achievements: unlocked first, then by category
  const sortedAchievements = [...achievements].sort((a, b) => {
    const aUnlocked = !!a.unlockedAt;
    const bUnlocked = !!b.unlockedAt;
    if (aUnlocked && !bUnlocked) return -1;
    if (!aUnlocked && bUnlocked) return 1;
    return a.title.localeCompare(b.title);
  });

  const unlockedCount = achievements.filter((a) => a.unlockedAt).length;
  const totalCount = achievements.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div id="achievements-section" className="space-y-6 animate-slide-up">
      {/* Gamification Level Card */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800 text-white rounded-2xl p-6 md:p-8 shadow-md relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none -mr-20 -mb-20"></div>
        <div className="absolute left-1/3 top-1/4 w-32 h-32 bg-indigo-505/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-4 flex items-center gap-4">
            <div className="p-4 bg-white/10 backdrop-blur-md text-yellow-300 rounded-2xl border border-white/10 shrink-0">
              <Trophy size={40} className="animate-pulse" />
            </div>
            <div>
              <span className="text-indigo-200 text-xs font-semibold uppercase tracking-wider">Active Persona Level</span>
              <h3 className="text-2xl font-extrabold text-white mt-0.5">{activeUser.name}</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="px-2 py-0.5 bg-yellow-400 text-slate-900 font-extrabold text-xs rounded-full">
                  LEVEL {activeUser.level}
                </span>
                <span className="text-indigo-200 text-xs">{activeUser.lifetimeKarma} Lifetime Karma</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 space-y-2">
            <div className="flex justify-between text-xs font-semibold text-indigo-100">
              <span>ACHIEVEMENTS COMPLETED</span>
              <span>{unlockedCount} / {totalCount} Badges</span>
            </div>
            <div className="h-3 w-full bg-indigo-950/40 rounded-full overflow-hidden p-[2px] border border-white/5">
              <div
                id="achievement-progress-bar"
                className="h-full bg-gradient-to-r from-yellow-300 to-amber-400 rounded-full shadow-[0_0_12px_rgba(250,204,21,0.5)] transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-indigo-200">
              Unlocking badges rewards virtual points that boost your friend category ranking!
            </p>
          </div>

          <div className="md:col-span-3 flex justify-end">
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 px-5 py-4 rounded-xl text-center w-full md:w-auto">
              <div className="text-2xl font-black text-yellow-300">
                +{achievements.reduce((acc, curr) => acc + (curr.unlockedAt ? curr.pointsReward : 0), 0)}
              </div>
              <div className="text-[11px] font-bold text-indigo-100 uppercase tracking-widest mt-0.5">Bonus Points Value</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of badges */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-800">Your Badge Accomplishments</h3>
          <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-medium">Auto-unlocks through favor details</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sortedAchievements.map((achievement) => {
            const isUnlocked = !!achievement.unlockedAt;

            return (
              <div
                key={achievement.id}
                id={`achievement-card-${achievement.id}`}
                className={`group border rounded-xl p-5 transition-all text-left relative overflow-hidden flex flex-col justify-between ${
                  isUnlocked
                    ? 'border-indigo-150 bg-gradient-to-b from-indigo-50/20 to-white shadow-sm hover:shadow-md'
                    : 'border-slate-150 bg-slate-50 opacity-75'
                }`}
              >
                {/* Points Tag info */}
                <span className={`absolute right-3 top-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isUnlocked
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  +{achievement.pointsReward} XP
                </span>

                <div className="space-y-3">
                  {/* Badge Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all shadow-sm ${
                    isUnlocked
                      ? 'bg-indigo-100 text-indigo-600 scale-100 group-hover:scale-110'
                      : 'bg-slate-200 text-slate-400 rotate-0'
                  }`}>
                    {isUnlocked ? achievement.icon : <Lock size={18} className="text-slate-400" />}
                  </div>

                  <div>
                    <h4 className={`font-bold text-sm tracking-tight flex items-center gap-1.5 ${
                      isUnlocked ? 'text-slate-800' : 'text-slate-500'
                    }`}>
                      {achievement.title}
                      {isUnlocked && <CheckCircle2 size={14} className="text-indigo-600" />}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {achievement.description}
                    </p>
                  </div>
                </div>

                {/* Progress bar or Unlock status */}
                <div className="mt-5 pt-3 border-t border-slate-100">
                  {isUnlocked ? (
                    <div className="text-[10px] font-bold text-indigo-600 uppercase flex items-center gap-1">
                      <span>Unlocked</span>
                      <span className="font-normal text-slate-400 font-sans tracking-tight">
                        • {new Date(achievement.unlockedAt!).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  ) : achievement.progress ? (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500">
                        <span>PROGRESS</span>
                        <span>{achievement.progress.current} / {achievement.progress.target}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              (achievement.progress.current / achievement.progress.target) * 100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Locked</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
