import React, { useState } from 'react';
import { Check, ChevronRight, UserPlus } from 'lucide-react';
import { GROUP_OPTIONS } from '../data/ontopData';

interface ProfileViewProps {
  firstName: string;
  lastName: string;
  role: string;
  groupCode: string;
  doneCount: number;
  overdueOrActiveCount: number;
  eventsCount: number;
  onSignOut: () => void;
}

const ROLE_LABELS: Record<string, string> = {
  student: 'Студент',
  leader: 'Староста',
  teacher: 'Преподаватель',
};

const DEFAULT_NOTIF_SUBJECTS = [
  { id: 'db', label: 'Базы данных', enabled: true },
  { id: 'web', label: 'Веб-программирование', enabled: true },
  { id: 'math', label: 'Высшая математика', enabled: true },
  { id: 'hist', label: 'История Кыргызстана', enabled: false },
  { id: 'sched', label: 'Изменения в расписании', enabled: true },
];

const REMINDER_OPTIONS = ['За 3 дня', 'За 1 день', 'За 3 часа'];
const QUIET_HOURS_OPTIONS = ['22:00–08:00', '23:00–07:00', 'Выкл'];
const LANGUAGE_OPTIONS = ['Русский', 'Кыргызча', 'English'];

export const ProfileView: React.FC<ProfileViewProps> = ({
  firstName,
  lastName,
  role,
  groupCode,
  doneCount,
  overdueOrActiveCount,
  eventsCount,
  onSignOut,
}) => {
  const [notifSettings, setNotifSettings] = useState(DEFAULT_NOTIF_SUBJECTS);
  const [selectedReminders, setSelectedReminders] = useState<string[]>([
    'За 1 день',
    'За 3 часа',
  ]);
  const [quietIdx, setQuietIdx] = useState(0);
  const [langIdx, setLangIdx] = useState(0);
  const [inviteCopied, setInviteCopied] = useState(false);

  const groupInfo =
    GROUP_OPTIONS.find((g) => g.code === groupCode) ?? GROUP_OPTIONS[0];
  const fullName = `${firstName} ${lastName}`.trim() || 'Айбек Сыдыков';
  const initials =
    `${firstName?.[0] ?? 'А'}${lastName?.[0] ?? 'С'}`.toUpperCase();
  const roleLabel = ROLE_LABELS[role] ?? role ?? 'Студент';

  const toggleNotif = (id: string) => {
    setNotifSettings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
  };

  const toggleReminder = (label: string) => {
    setSelectedReminders((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const handleInvite = () => {
    navigator.clipboard?.writeText(`https://ontop.edu.kg/join/${groupInfo.code}`).catch(() => {});
    setInviteCopied(true);
    setTimeout(() => setInviteCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Avatar & Identity */}
      <div className="flex flex-col items-center text-center pt-2">
        <div className="w-20 h-20 rounded-full bg-[#DCE9EE] flex items-center justify-center font-display font-bold text-[26px] text-[#23272B]">
          {initials}
        </div>
        <h1 className="font-display font-bold text-[22px] text-[#1E2022] mt-3">
          {fullName}
        </h1>
        <p className="text-[13.5px] text-[#6E7480] mt-0.5">
          {groupInfo.code} · {groupInfo.college}
        </p>
        <span className="mt-2 inline-block px-3 py-1 rounded-full bg-[#E1EAEF] text-[12px] font-medium text-[#3C4B57]">
          {roleLabel}
        </span>
      </div>

      {/* Stats Summary */}
      <div className="bg-white rounded-2xl py-4 px-2 shadow-[0_1px_3px_rgba(30,32,34,0.04)] grid grid-cols-3 divide-x divide-[#EFECE3] max-w-2xl mx-auto">
        <div className="text-center px-2">
          <div className="font-display font-bold text-[22px] text-[#1E2022] tabular-nums">
            {30 + doneCount}
          </div>
          <div className="text-[12px] text-[#6E7480] mt-0.5">сдано</div>
        </div>
        <div className="text-center px-2">
          <div className="font-display font-bold text-[22px] text-[#1E2022] tabular-nums">
            {overdueOrActiveCount}
          </div>
          <div className="text-[12px] text-[#6E7480] mt-0.5">активных</div>
        </div>
        <div className="text-center px-2">
          <div className="font-display font-bold text-[22px] text-[#1E2022] tabular-nums">
            {4 + eventsCount}
          </div>
          <div className="text-[12px] text-[#6E7480] mt-0.5">события</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Notifications */}
        <div>
          <h2 className="text-[13px] font-medium text-[#6E7480] mb-2 px-1">
            Уведомления
          </h2>
          <div className="bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(30,32,34,0.04)]">
            {notifSettings.map((item, idx) => (
              <div
                key={item.id}
                className={`min-h-[50px] px-4 flex items-center justify-between gap-3 ${
                  idx > 0 ? 'border-t border-[#F0EDE4]' : ''
                }`}
              >
                <span className="text-[15px] text-[#1E2022]">{item.label}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={item.enabled}
                  onClick={() => toggleNotif(item.id)}
                  className={`w-12 h-7 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                    item.enabled ? 'bg-[#007AFF]' : 'bg-[#DEDAD0]'
                  }`}
                >
                  <span
                    className={`block w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
                      item.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => setQuietIdx((i) => (i + 1) % QUIET_HOURS_OPTIONS.length)}
              className="w-full min-h-[50px] px-4 border-t border-[#F0EDE4] flex items-center justify-between hover:bg-[#FAF8F4] transition-colors cursor-pointer"
            >
              <span className="text-[15px] text-[#1E2022]">Тихие часы</span>
              <span className="flex items-center gap-1 text-[14px] text-[#6E7480] tabular-nums">
                {QUIET_HOURS_OPTIONS[quietIdx]}
                <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
              </span>
            </button>
          </div>
        </div>

        {/* Reminders, Group, Language & Logout */}
        <div className="space-y-6">
          <div>
            <h2 className="text-[13px] font-medium text-[#6E7480] mb-2 px-1">
              Напоминать о дедлайне
            </h2>
            <div className="bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(30,32,34,0.04)]">
              {REMINDER_OPTIONS.map((opt, idx) => {
                const checked = selectedReminders.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleReminder(opt)}
                    className={`w-full min-h-[50px] px-4 flex items-center justify-between text-left hover:bg-[#FAF8F4] transition-colors cursor-pointer ${
                      idx > 0 ? 'border-t border-[#F0EDE4]' : ''
                    }`}
                  >
                    <span className="text-[15px] text-[#1E2022]">{opt}</span>
                    {checked && (
                      <Check className="w-4 h-4 text-[#007AFF]" strokeWidth={2.5} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-[13px] font-medium text-[#6E7480] mb-2 px-1">
              Группа
            </h2>
            <div className="bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(30,32,34,0.04)]">
              <div className="min-h-[50px] px-4 flex items-center justify-between gap-2">
                <span className="text-[15px] text-[#1E2022]">Староста</span>
                <span className="text-[14px] text-[#6E7480]">{groupInfo.leader}</span>
              </div>
              <button
                type="button"
                onClick={handleInvite}
                className="w-full min-h-[50px] px-4 border-t border-[#F0EDE4] flex items-center gap-2.5 text-[#007AFF] hover:bg-[#FAF8F4] transition-colors cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span className="text-[15px] font-medium">
                  {inviteCopied ? 'Ссылка-приглашение скопирована' : 'Пригласить одногруппника'}
                </span>
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-[13px] font-medium text-[#6E7480] mb-2 px-1">
              Язык
            </h2>
            <button
              type="button"
              onClick={() => setLangIdx((i) => (i + 1) % LANGUAGE_OPTIONS.length)}
              className="w-full min-h-[50px] bg-white hover:bg-[#FAF8F4] rounded-2xl px-4 flex items-center justify-between shadow-[0_1px_3px_rgba(30,32,34,0.04)] transition-colors cursor-pointer"
            >
              <span className="text-[15px] text-[#1E2022]">Язык приложения</span>
              <span className="flex items-center gap-1 text-[14px] text-[#6E7480]">
                {LANGUAGE_OPTIONS[langIdx]}
                <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={onSignOut}
            className="w-full min-h-[50px] bg-white hover:bg-[#FFF5F5] rounded-2xl text-[15px] font-medium text-[#DF443A] shadow-[0_1px_3px_rgba(30,32,34,0.04)] transition-colors cursor-pointer"
          >
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
};
