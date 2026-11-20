import React, { useState } from 'react';
import { Eye, EyeOff, ListChecks, Lock, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LoginViewProps {
  onSuccessLogin: (userId: string, email: string) => Promise<void>;
  onGoToRegister: () => void;
  onShowToast: (msg: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onSuccessLogin,
  onGoToRegister,
  onShowToast,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMsg('Введите почту и пароль');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        if (error.message.toLowerCase().includes('invalid login credentials')) {
          setErrorMsg('Неверный email или пароль');
        } else if (error.message.toLowerCase().includes('email not confirmed')) {
          setErrorMsg('Подтвердите почту по ссылке из письма');
        } else {
          setErrorMsg(error.message);
        }
        return;
      }

      if (data.user) {
        await onSuccessLogin(data.user.id, data.user.email ?? cleanEmail);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Не удалось выполнить вход');
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMsg('Введите почту, чтобы восстановить пароль');
      return;
    }
    setErrorMsg(null);
    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail);
    if (error) {
      setErrorMsg(error.message);
    } else {
      onShowToast(`Письмо для сброса пароля отправлено на ${cleanEmail}`);
    }
  };

  const handleOAuth = async (provider: 'apple' | 'google') => {
    setErrorMsg(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });
    if (error) {
      onShowToast(`Вход через ${provider === 'apple' ? 'Apple' : 'Google'} пока недоступен в этом проекте`);
    }
  };

  return (
    <div className="min-h-screen bg-[#EFECE3] flex flex-col justify-between px-5 py-8 md:py-12">
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-center">
        {/* Brand Lockup */}
        <div className="mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#007AFF] flex items-center justify-center shadow-[0_6px_16px_rgba(0,122,255,0.28)]">
            <ListChecks className="w-6 h-6 text-white" strokeWidth={2.2} />
          </div>
          <div className="font-display font-bold text-[17px] text-[#1E2022] mt-2.5">
            OnTop
          </div>
        </div>

        {/* Hero Copy */}
        <h1 className="font-display font-extrabold text-[30px] leading-[1.15] tracking-tight text-[#1E2022] [text-wrap:balance]">
          Все задания группы — в одном месте
        </h1>
        <p className="text-[14.5px] text-[#6E7480] mt-2.5 leading-snug">
          Без поиска по чатам. Войдите, чтобы увидеть, что задали
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          {errorMsg && (
            <div className="bg-[#FFF4F2] border border-[#F7C7C2] text-[#A92D24] text-[13px] rounded-2xl px-4 py-3">
              {errorMsg}
            </div>
          )}

          <div className="bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(30,32,34,0.04)]">
            <div className="min-h-[52px] px-4 flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#6E7480] shrink-0" />
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aibek.sydykov@gmail.com"
                className="w-full text-[15px] text-[#1E2022] placeholder:text-[#9CA3AF] focus:outline-none"
              />
            </div>

            <div className="min-h-[52px] px-4 border-t border-[#EFECE3] flex items-center gap-3">
              <Lock className="w-4 h-4 text-[#6E7480] shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                className="w-full text-[15px] text-[#1E2022] placeholder:text-[#9CA3AF] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                className="p-1.5 text-[#6E7480] hover:text-[#1E2022] cursor-pointer"
              >
                {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-[13.5px] font-medium text-[#007AFF] hover:underline py-1 cursor-pointer"
            >
              Забыли пароль?
            </button>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full min-h-[52px] rounded-full bg-[#007AFF] hover:bg-[#0066D6] disabled:opacity-60 active:scale-[0.99] text-white font-display font-semibold text-[16px] shadow-[0_6px_20px_rgba(0,122,255,0.28)] transition-all cursor-pointer"
          >
            {submitting ? 'Входим…' : 'Войти'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#DFDBD0]" />
          <span className="text-[12.5px] text-[#6E7480]">или</span>
          <div className="flex-1 h-px bg-[#DFDBD0]" />
        </div>

        {/* Social Providers */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => handleOAuth('apple')}
            className="w-full min-h-[50px] rounded-full bg-[#1E2022] hover:bg-[#2C2F33] text-white font-display font-semibold text-[15px] flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
            </svg>
            <span>Войти через Apple</span>
          </button>

          <button
            type="button"
            onClick={() => handleOAuth('google')}
            className="w-full min-h-[50px] rounded-full bg-white hover:bg-[#FAF8F4] text-[#1E2022] font-display font-semibold text-[15px] flex items-center justify-center gap-2.5 shadow-[0_1px_3px_rgba(30,32,34,0.06)] transition-colors cursor-pointer"
          >
            <span className="font-bold text-[16px]">G</span>
            <span>Войти через Google</span>
          </button>
        </div>
      </div>

      {/* Bottom Footer Link */}
      <div className="w-full max-w-md mx-auto pt-8 text-center text-[14px] text-[#6E7480]">
        Нет аккаунта?{' '}
        <button
          type="button"
          onClick={onGoToRegister}
          className="font-semibold text-[#007AFF] hover:underline cursor-pointer"
        >
          Зарегистрироваться
        </button>
      </div>
    </div>
  );
};
