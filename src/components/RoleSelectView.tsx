import React, { useState } from 'react';
import { Check, ChevronLeft, Info, Mail } from 'lucide-react';
import { UserRole } from '../lib/supabase';

interface RoleSelectViewProps {
  email: string;
  initialRole: UserRole;
  showEmailBanner: boolean;
  onBack: () => void;
  onNext: (role: UserRole) => void;
}

const ROLE_OPTIONS: {
  id: UserRole;
  title: string;
  subtitle: string;
}[] = [
  {
    id: 'student',
    title: 'Студент',
    subtitle: 'Вижу задания и события своей группы',
  },
  {
    id: 'leader',
    title: 'Староста',
    subtitle: 'Публикую задания для группы',
  },
  {
    id: 'teacher',
    title: 'Преподаватель',
    subtitle: 'Подтверждаю задания и отвечаю на вопросы',
  },
];

export const RoleSelectView: React.FC<RoleSelectViewProps> = ({
  email,
  initialRole,
  showEmailBanner,
  onBack,
  onNext,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole || 'student');

  return (
    <div className="min-h-screen bg-[#EFECE3] flex flex-col justify-between px-5 py-6 md:py-10">
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={onBack}
            aria-label="Назад"
            className="min-w-[44px] min-h-[44px] rounded-full bg-white hover:bg-[#FAF8F4] flex items-center justify-center text-[#1E2022] shadow-[0_1px_4px_rgba(30,32,34,0.06)] cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-[13.5px] font-medium text-[#6E7480]">Шаг 2 из 3</span>
          <span className="w-[44px]" />
        </div>

        {/* Email confirmation info banner */}
        {showEmailBanner && email && (
          <div className="bg-[#DFECF2] rounded-2xl px-4 py-3.5 flex items-start gap-3 mb-6">
            <div className="relative shrink-0 mt-0.5">
              <Mail className="w-4.5 h-4.5 text-[#1E2022]" />
              <span className="w-2 h-2 rounded-full bg-[#007AFF] absolute -top-0.5 -right-0.5 ring-2 ring-[#DFECF2]" />
            </div>
            <p className="text-[13.5px] text-[#1E2022] leading-snug">
              Отправили письмо на <span className="font-medium">{email}</span> — подтвердите
              почту, когда будет удобно
            </p>
          </div>
        )}

        {/* Headline */}
        <h1 className="font-display font-extrabold text-[30px] leading-tight tracking-tight text-[#1E2022] mb-5">
          Кто вы в OnTop?
        </h1>

        {/* Role List Card */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(30,32,34,0.04)] mb-4">
          {ROLE_OPTIONS.map((opt, idx) => {
            const active = selectedRole === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedRole(opt.id)}
                className={`w-full px-4 py-4 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer ${
                  idx > 0 ? 'border-t border-[#EFECE3]' : ''
                } ${active ? 'bg-[#FAFAF8]' : 'hover:bg-[#FAF8F4]'}`}
              >
                <div>
                  <div className="font-display font-bold text-[16px] text-[#1E2022]">
                    {opt.title}
                  </div>
                  <div className="text-[13px] text-[#6E7480] mt-0.5">
                    {opt.subtitle}
                  </div>
                </div>
                {active && <Check className="w-4.5 h-4.5 text-[#007AFF] shrink-0" strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>

        {/* Verification note */}
        <div className="flex items-start gap-2.5 px-1 text-[13px] text-[#6E7480] leading-snug">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <span>Роль старосты и преподавателя подтверждает колледж — это займёт до 1 дня</span>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="w-full max-w-md mx-auto pt-6">
        <button
          type="button"
          onClick={() => onNext(selectedRole)}
          className="w-full min-h-[52px] rounded-full bg-[#007AFF] hover:bg-[#0066D6] active:scale-[0.99] text-white font-display font-semibold text-[16px] shadow-[0_6px_20px_rgba(0,122,255,0.28)] transition-all cursor-pointer"
        >
          Далее
        </button>
      </div>
    </div>
  );
};
