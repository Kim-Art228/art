import React, { useState } from 'react';
import { Check, ChevronLeft, Info, Search } from 'lucide-react';
import { GROUP_OPTIONS } from '../data/ontopData';

interface OnboardingScreenProps {
  selectedGroup: string;
  saving?: boolean;
  onBack?: () => void;
  onComplete: (groupCode: string, frequencyAnswer: string) => void | Promise<void>;
}

const FREQUENCY_OPTIONS = ['Ни разу', '1–2 раза', '3–5 раз', 'Больше 5'];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  selectedGroup,
  saving = false,
  onBack,
  onComplete,
}) => {
  const [frequency, setFrequency] = useState<string>('3–5 раз');
  const [query, setQuery] = useState<string>(selectedGroup || 'CS-1-24');
  const [chosenGroup, setChosenGroup] = useState<string>(selectedGroup || 'CS-1-24');
  const [inviteCopied, setInviteCopied] = useState(false);

  const filteredGroups = GROUP_OPTIONS.filter(
    (g) =>
      g.code.toLowerCase().includes(query.trim().toLowerCase()) ||
      g.college.toLowerCase().includes(query.trim().toLowerCase())
  );

  const activeGroupObj =
    GROUP_OPTIONS.find((g) => g.code === chosenGroup) ??
    filteredGroups[0] ??
    GROUP_OPTIONS[0];

  const handleCopyInvite = () => {
    navigator.clipboard?.writeText(`https://ontop.edu.kg/join/${activeGroupObj.code}`).catch(() => {});
    setInviteCopied(true);
    setTimeout(() => setInviteCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#EFECE3] flex flex-col justify-between px-5 py-6 md:py-10">
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              aria-label="Назад к выбору роли"
              className="min-w-[44px] min-h-[44px] rounded-full bg-white hover:bg-[#FAF8F4] flex items-center justify-center text-[#1E2022] shadow-[0_1px_4px_rgba(30,32,34,0.06)] cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            <span className="font-display font-bold text-lg tracking-tight text-[#1E2022]">
              OnTop
            </span>
          )}

          {onBack && (
            <span className="text-[13.5px] font-medium text-[#6E7480]">Шаг 3 из 3</span>
          )}

          <div className="flex items-center gap-1.5" aria-label="Шаг 3 из 3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D5D0C3]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#D5D0C3]" />
            <span className="w-4 h-1.5 rounded-full bg-[#007AFF]" />
          </div>
        </div>

        {/* Hero Question */}
        <h1 className="font-display text-[28px] leading-[1.15] font-extrabold tracking-tight text-[#1E2022] mb-6 [text-wrap:balance]">
          Сколько раз на этой неделе вы искали в чате, что задали?
        </h1>

        {/* Frequency options */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(30,32,34,0.04)] mb-6">
          {FREQUENCY_OPTIONS.map((opt, idx) => {
            const isSelected = frequency === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => setFrequency(opt)}
                className={`w-full min-h-[52px] px-4 flex items-center justify-between text-left text-[15px] transition-colors cursor-pointer ${
                  idx > 0 ? 'border-t border-[#EFECE3]' : ''
                } ${isSelected ? 'font-medium text-[#1E2022] bg-[#FAFAF8]' : 'text-[#1E2022] hover:bg-[#FAF8F4]'}`}
              >
                <span>{opt}</span>
                {isSelected && <Check className="w-4 h-4 text-[#007AFF] shrink-0" strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>

        {/* Group search */}
        <div className="mb-3">
          <label
            htmlFor="onboarding-group-search"
            className="block text-[13px] font-medium text-[#6E7480] mb-2"
          >
            Ваша группа
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-[#6E7480] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="onboarding-group-search"
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                const match = GROUP_OPTIONS.find((g) =>
                  g.code.toLowerCase().includes(e.target.value.trim().toLowerCase())
                );
                if (match) setChosenGroup(match.code);
              }}
              placeholder="CS-1-24"
              className="w-full min-h-[48px] bg-white rounded-2xl pl-10 pr-4 text-[15px] text-[#1E2022] placeholder:text-[#9CA3AF] shadow-[0_1px_2px_rgba(30,32,34,0.04)] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30"
            />
          </div>
        </div>

        {/* Group selection card */}
        <div className="space-y-2 mb-4">
          {(filteredGroups.length > 0 ? filteredGroups : [activeGroupObj]).map((grp) => {
            const active = grp.code === activeGroupObj.code;
            return (
              <button
                key={grp.code}
                type="button"
                onClick={() => {
                  setChosenGroup(grp.code);
                  setQuery(grp.code);
                }}
                className={`w-full bg-white rounded-2xl p-4 flex items-center justify-between gap-3 text-left transition-all cursor-pointer shadow-[0_1px_2px_rgba(30,32,34,0.04)] ${
                  active ? 'ring-2 ring-[#007AFF]' : 'hover:bg-[#FAF8F4]'
                }`}
              >
                <div className="min-w-0">
                  <div className="font-display font-bold text-[15px] text-[#1E2022] leading-snug">
                    {grp.code} · {grp.college}
                  </div>
                  <div className="text-[12.5px] text-[#6E7480] mt-1 tabular-nums">
                    {grp.activeMembers} из {grp.totalMembers} одногруппников уже здесь
                  </div>
                </div>
                <div className="flex items-center -space-x-1.5 shrink-0">
                  {['АС', 'КБ', 'ТМ', 'НД'].map((initials) => (
                    <span
                      key={initials}
                      className="w-7 h-7 rounded-full bg-[#DCE9EE] border-2 border-white flex items-center justify-center text-[10px] font-semibold text-[#2B3A42]"
                    >
                      {initials}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* Invite starosta helper */}
        <button
          type="button"
          onClick={handleCopyInvite}
          className="flex items-start gap-2.5 text-left px-1 py-2 text-[13px] text-[#6E7480] hover:text-[#1E2022] transition-colors cursor-pointer"
        >
          <Info className="w-4 h-4 text-[#6E7480] shrink-0 mt-0.5" />
          <span>
            {inviteCopied
              ? 'Ссылка-приглашение для старосты скопирована'
              : 'Старосты ещё нет? Пригласите его одной ссылкой'}
          </span>
        </button>
      </div>

      {/* Bottom CTA */}
      <div className="w-full max-w-md mx-auto pt-6">
        <button
          type="button"
          disabled={saving}
          onClick={() => onComplete(activeGroupObj.code, frequency)}
          className="w-full min-h-[52px] rounded-full bg-[#007AFF] hover:bg-[#0066D6] disabled:opacity-60 active:scale-[0.99] text-white font-display font-semibold text-[16px] shadow-[0_6px_20px_rgba(0,122,255,0.28)] transition-all cursor-pointer"
        >
          {saving ? 'Сохраняем профиль…' : 'Продолжить'}
        </button>
      </div>
    </div>
  );
};
