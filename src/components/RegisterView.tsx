import React, { useState } from 'react';
import { Check, ChevronLeft, Eye, EyeOff, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface RegisterViewProps {
  onBack: () => void;
  onRegistered: (payload: {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    hasSession: boolean;
  }) => void;
  onShowToast: (msg: string) => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({
  onBack,
  onRegistered,
  onShowToast,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const hasMinLength = password.length >= 8;
  const hasDigit = /\d/.test(password);
  const hasUppercase = /[A-ZА-ЯЁ]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const strengthScore =
    (hasMinLength ? 1 : 0) +
    (hasDigit ? 1 : 0) +
    (hasUppercase ? 1 : 0) +
    (password.length >= 10 ? 1 : 0);

  const strengthLabel =
    strengthScore === 0
      ? 'введите пароль'
      : strengthScore === 1
        ? 'слабая'
        : strengthScore === 2
          ? 'средняя'
          : strengthScore === 3
            ? 'хорошая'
            : 'надёжная';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanFirst = firstName.trim();
    const cleanLast = lastName.trim();
    const cleanEmail = email.trim();

    if (!cleanFirst || !cleanLast) {
      setErrorMsg('Укажите имя и фамилию');
      return;
    }
    if (!cleanEmail) {
      setErrorMsg('Укажите электронную почту');
      return;
    }
    if (!hasMinLength || !hasDigit) {
      setErrorMsg('Пароль должен содержать минимум 8 символов и хотя бы одну цифру');
      return;
    }
    if (!passwordsMatch) {
      setErrorMsg('Пароли не совпадают');
      return;
    }
    if (!acceptedTerms) {
      setErrorMsg('Примите Условия использования и Политику конфиденциальности');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            first_name: cleanFirst,
            last_name: cleanLast,
          },
        },
      });

      if (error) {
        if (error.message.toLowerCase().includes('already registered')) {
          setErrorMsg('Аккаунт с такой почтой уже зарегистрирован');
        } else {
          setErrorMsg(error.message);
        }
        return;
      }

      const userId = data.user?.id;
      if (!userId) {
        setErrorMsg('Не удалось создать учётную запись');
        return;
      }

      onRegistered({
        userId,
        email: cleanEmail,
        firstName: cleanFirst,
        lastName: cleanLast,
        hasSession: Boolean(data.session),
      });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Ошибка регистрации');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EFECE3] flex flex-col justify-between px-5 py-6 md:py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md mx-auto flex-1 flex flex-col justify-between"
      >
        <div>
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-5">
            <button
              type="button"
              onClick={onBack}
              aria-label="Назад ко входу"
              className="min-w-[44px] min-h-[44px] rounded-full bg-white hover:bg-[#FAF8F4] flex items-center justify-center text-[#1E2022] shadow-[0_1px_4px_rgba(30,32,34,0.06)] cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-[13.5px] font-medium text-[#6E7480]">Шаг 1 из 3</span>
            <span className="w-[44px]" />
          </div>

          <h1 className="font-display font-extrabold text-[28px] leading-tight tracking-tight text-[#1E2022] mb-5">
            Создайте аккаунт
          </h1>

          {errorMsg && (
            <div className="mb-4 bg-[#FFF4F2] border border-[#F7C7C2] text-[#A92D24] text-[13px] rounded-2xl px-4 py-3">
              {errorMsg}
            </div>
          )}

          {/* Name Card */}
          <div className="mb-4">
            <div className="text-[13px] font-medium text-[#6E7480] mb-1.5 px-1">
              Имя и фамилия
            </div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(30,32,34,0.04)]">
              <input
                type="text"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Айбек"
                className="w-full min-h-[50px] px-4 text-[15px] text-[#1E2022] placeholder:text-[#9CA3AF] focus:outline-none"
              />
              <input
                type="text"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Сыдыков"
                className="w-full min-h-[50px] px-4 border-t border-[#EFECE3] text-[15px] text-[#1E2022] placeholder:text-[#9CA3AF] focus:outline-none"
              />
            </div>
          </div>

          {/* Credentials Card */}
          <div className="mb-3">
            <div className="text-[13px] font-medium text-[#6E7480] mb-1.5 px-1">
              Вход
            </div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(30,32,34,0.04)]">
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aibek.sydykov@gmail.com"
                className="w-full min-h-[50px] px-4 text-[15px] text-[#1E2022] placeholder:text-[#9CA3AF] focus:outline-none"
              />

              <div className="relative border-t border-[#EFECE3] focus-within:ring-2 focus-within:ring-inset focus-within:ring-[#007AFF]">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Придумайте пароль"
                  className="w-full min-h-[50px] pl-4 pr-12 text-[15px] text-[#1E2022] placeholder:text-[#9CA3AF] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#6E7480] hover:text-[#1E2022] cursor-pointer"
                >
                  {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>

              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Повторите пароль"
                className="w-full min-h-[50px] px-4 border-t border-[#EFECE3] text-[15px] text-[#1E2022] placeholder:text-[#9CA3AF] focus:outline-none"
              />
            </div>
          </div>

          {/* Password strength bar */}
          <div className="grid grid-cols-4 gap-1.5 px-1 mb-2">
            {[1, 2, 3, 4].map((seg) => (
              <div
                key={seg}
                className={`h-1 rounded-full transition-colors ${
                  strengthScore >= seg ? 'bg-[#72B0B9]' : 'bg-[#DEDAD0]'
                }`}
              />
            ))}
          </div>
          <div className="text-[12.5px] text-[#6E7480] px-1 mb-3">
            Надёжность: {strengthLabel}
          </div>

          {/* Checklist */}
          <div className="space-y-2 px-1 mb-4">
            <div className="flex items-center gap-2.5 text-[13.5px]">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                  hasMinLength ? 'bg-[#007AFF] text-white' : 'border border-[#9CA3AF]'
                }`}
              >
                {hasMinLength && <Check className="w-3 h-3" strokeWidth={3} />}
              </span>
              <span className={hasMinLength ? 'text-[#1E2022]' : 'text-[#6E7480]'}>
                Не меньше 8 символов
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-[13.5px]">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                  hasDigit ? 'bg-[#007AFF] text-white' : 'border border-[#9CA3AF]'
                }`}
              >
                {hasDigit && <Check className="w-3 h-3" strokeWidth={3} />}
              </span>
              <span className={hasDigit ? 'text-[#1E2022]' : 'text-[#6E7480]'}>
                Есть цифра
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-[13.5px]">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                  hasUppercase ? 'bg-[#007AFF] text-white' : 'border border-[#9CA3AF]'
                }`}
              >
                {hasUppercase && <Check className="w-3 h-3" strokeWidth={3} />}
              </span>
              <span className={hasUppercase ? 'text-[#1E2022]' : 'text-[#6E7480]'}>
                Есть заглавная буква
              </span>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="flex items-start gap-2.5 px-1 text-[12.5px] text-[#6E7480] leading-snug">
            <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>Почту не увидят одногруппники. Без рассылок и рекламы</span>
          </div>
        </div>

        {/* Bottom Terms & CTA */}
        <div className="pt-6 space-y-4">
          <div className="flex items-start gap-3 px-1">
            <button
              type="button"
              role="checkbox"
              aria-checked={acceptedTerms}
              onClick={() => setAcceptedTerms((v) => !v)}
              className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors cursor-pointer ${
                acceptedTerms
                  ? 'bg-[#007AFF] text-white'
                  : 'bg-white border border-[#C8C3B4]'
              }`}
            >
              {acceptedTerms && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
            </button>
            <span className="text-[12.5px] text-[#6E7480] leading-snug">
              Принимаю{' '}
              <button
                type="button"
                onClick={() => onShowToast('Условия использования OnTop: учебное расписание и задания группы')}
                className="text-[#007AFF] hover:underline cursor-pointer"
              >
                Условия использования
              </button>{' '}
              и{' '}
              <button
                type="button"
                onClick={() => onShowToast('Политика конфиденциальности: данные хранятся в защищённом профиле')}
                className="text-[#007AFF] hover:underline cursor-pointer"
              >
                Политику конфиденциальности
              </button>
            </span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full min-h-[52px] rounded-full bg-[#007AFF] hover:bg-[#0066D6] disabled:opacity-60 active:scale-[0.99] text-white font-display font-semibold text-[16px] shadow-[0_6px_20px_rgba(0,122,255,0.28)] transition-all cursor-pointer"
          >
            {submitting ? 'Создаём аккаунт…' : 'Создать аккаунт'}
          </button>
        </div>
      </form>
    </div>
  );
};
