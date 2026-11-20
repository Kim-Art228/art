import React, { useState } from 'react';
import {
  BadgeCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  MoreHorizontal,
  Send,
  Trash2,
} from 'lucide-react';
import { Assignment } from '../lib/supabase';
import {
  AssignmentExtra,
  formatCountdown,
  formatDueLong,
} from '../data/ontopData';

interface AssignmentDetailModalProps {
  assignment: Assignment;
  extra: AssignmentExtra;
  isUpdating: boolean;
  onClose: () => void;
  onToggleDone: (assignment: Assignment) => void;
  onDelete: (assignmentId: number) => void;
  onToggleConfused: (assignmentId: number) => void;
  onAskQuestion: (assignmentId: number, questionText: string) => void;
  onShowToast: (msg: string) => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export const AssignmentDetailModal: React.FC<AssignmentDetailModalProps> = ({
  assignment,
  extra,
  isUpdating,
  onClose,
  onToggleDone,
  onDelete,
  onToggleConfused,
  onAskQuestion,
  onShowToast,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [askingMode, setAskingMode] = useState(false);
  const [questionDraft, setQuestionDraft] = useState('');

  const countdown = formatCountdown(assignment.due_date, true);
  const isDone = assignment.status === 'done';

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = questionDraft.trim();
    if (!trimmed) return;
    onAskQuestion(assignment.id, trimmed);
    setQuestionDraft('');
    setAskingMode(false);
    onShowToast('Вопрос отправлен анонимно');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#EFECE3] md:bg-[#1E2022]/35 md:backdrop-blur-xs flex justify-center overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={assignment.title}
    >
      <div className="w-full md:max-w-2xl md:my-6 md:rounded-3xl bg-[#EFECE3] min-h-screen md:min-h-0 md:max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top App Bar */}
        <header className="sticky top-0 z-20 bg-[#EFECE3]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-[#E3DFD3]">
          <button
            type="button"
            onClick={onClose}
            aria-label="Назад"
            className="min-w-[44px] min-h-[44px] rounded-full bg-white hover:bg-[#FAF8F4] flex items-center justify-center text-[#1E2022] shadow-[0_1px_4px_rgba(30,32,34,0.06)] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="font-display font-semibold text-[16px] text-[#1E2022]">
            Задание
          </span>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu((v) => !v)}
              aria-label="Действия с заданием"
              className="min-w-[44px] min-h-[44px] rounded-full bg-white hover:bg-[#FAF8F4] flex items-center justify-center text-[#1E2022] shadow-[0_1px_4px_rgba(30,32,34,0.06)] transition-colors cursor-pointer"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-xl border border-[#E5E0D3] p-1.5 z-30">
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    navigator.clipboard?.writeText(window.location.href).catch(() => {});
                    onShowToast('Ссылка на задание скопирована');
                  }}
                  className="w-full min-h-[42px] px-3 rounded-xl text-left text-[14px] text-[#1E2022] hover:bg-[#F5F2EA] transition-colors cursor-pointer"
                >
                  Поделиться ссылкой
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onDelete(assignment.id);
                  }}
                  className="w-full min-h-[42px] px-3 rounded-xl text-left text-[14px] text-[#DF443A] hover:bg-[#FFF3F2] flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  Удалить задание
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 pt-4 pb-28 space-y-5">
          {/* Title & Teacher */}
          <div>
            <div className="text-[13px] font-medium text-[#6E7480]">
              {assignment.subject}
            </div>
            <h1 className="font-display font-extrabold text-[24px] leading-[1.2] text-[#1E2022] mt-1 [text-wrap:balance]">
              {assignment.title}
            </h1>

            <div className="flex items-center flex-wrap gap-2.5 mt-3.5">
              <span className="w-7 h-7 rounded-full bg-[#DEDAD0] text-[11px] font-bold text-[#1E2022] flex items-center justify-center shrink-0">
                {getInitials(assignment.teacher)}
              </span>
              <span className="text-[14.5px] font-medium text-[#1E2022]">
                {assignment.teacher}
              </span>
              {extra.verifiedByTeacher && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#007AFF] text-white text-[11.5px] font-semibold">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  От преподавателя
                </span>
              )}
            </div>
            <p className="text-[12.5px] text-[#6E7480] mt-2">
              {extra.publishedByText}
            </p>
          </div>

          {/* Due Date */}
          <div>
            <h2 className="text-[13px] font-medium text-[#6E7480] mb-1.5">Срок</h2>
            <div className="bg-white rounded-2xl px-4 py-3.5 flex items-center justify-between gap-2 shadow-[0_1px_2px_rgba(30,32,34,0.04)]">
              <span className="text-[15px] text-[#1E2022] tabular-nums">
                Сдать до {formatDueLong(assignment.due_date)}
              </span>
              <span
                className={`text-[13.5px] font-semibold tabular-nums shrink-0 ${
                  isDone
                    ? 'text-[#72B0B9]'
                    : countdown.isUrgent
                      ? 'text-[#DF443A]'
                      : 'text-[#6E7480]'
                }`}
              >
                {isDone ? 'Сдано' : countdown.label}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-[13px] font-medium text-[#6E7480] mb-1.5">Описание</h2>
            <div className="bg-white rounded-2xl p-4 text-[14.5px] leading-relaxed text-[#1E2022] whitespace-pre-line shadow-[0_1px_2px_rgba(30,32,34,0.04)]">
              {extra.description}
            </div>
          </div>

          {/* Files */}
          {extra.files.length > 0 && (
            <div>
              <h2 className="text-[13px] font-medium text-[#6E7480] mb-1.5">Файлы</h2>
              <div className="bg-white rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(30,32,34,0.04)]">
                {extra.files.map((file, idx) => (
                  <button
                    key={file.name}
                    type="button"
                    onClick={() => onShowToast(`Файл ${file.name} (${file.size}) открыт`)}
                    className={`w-full min-h-[50px] px-4 flex items-center justify-between gap-3 hover:bg-[#FAF8F4] transition-colors cursor-pointer ${
                      idx > 0 ? 'border-t border-[#F0EDE4]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="w-4 h-4 text-[#6E7480] shrink-0" />
                      <span className="text-[14.5px] text-[#1E2022] truncate tabular-nums">
                        {file.name} · {file.size}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Group progress */}
          <div>
            <h2 className="text-[13px] font-medium text-[#6E7480] mb-1.5">Группа</h2>
            <div className="bg-white rounded-2xl px-4 py-3 flex items-center justify-between gap-3 shadow-[0_1px_2px_rgba(30,32,34,0.04)]">
              <span className="text-[15px] text-[#1E2022] tabular-nums">
                Сдали {assignment.submissions_count} из {assignment.total_students}
              </span>
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
            </div>
          </div>

          {/* Group Q&A */}
          <div>
            <h2 className="text-[13px] font-medium text-[#6E7480] mb-1.5">
              Вопросы группы
            </h2>
            <div className="bg-white rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(30,32,34,0.04)]">
              {/* Top callout */}
              <div className="bg-[#DCE9EE]/70 p-4 space-y-3">
                <div className="font-display font-bold text-[15.5px] text-[#1E2022] tabular-nums">
                  {extra.confusedCount}{' '}
                  {extra.confusedCount === 1 ? 'человек не понял' : 'человек не поняли'} детали
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={() => onToggleConfused(assignment.id)}
                    className={`min-h-[38px] px-4 rounded-full text-[13.5px] font-semibold transition-colors cursor-pointer ${
                      extra.userConfused
                        ? 'bg-[#1E2022] text-white'
                        : 'bg-[#E8E3D5] text-[#1E2022] hover:bg-[#DDD7C5]'
                    }`}
                  >
                    Я тоже
                  </button>
                  <button
                    type="button"
                    onClick={() => setAskingMode((v) => !v)}
                    className="min-h-[38px] px-2 text-[14px] font-semibold text-[#007AFF] hover:underline cursor-pointer"
                  >
                    Спросить анонимно
                  </button>
                </div>

                {askingMode && (
                  <form onSubmit={handleSubmitQuestion} className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={questionDraft}
                      onChange={(e) => setQuestionDraft(e.target.value)}
                      placeholder="Ваш вопрос по заданию…"
                      className="flex-1 min-h-[42px] bg-white rounded-xl px-3.5 text-[14px] text-[#1E2022] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30"
                    />
                    <button
                      type="submit"
                      aria-label="Отправить вопрос"
                      className="min-w-[44px] min-h-[42px] rounded-xl bg-[#007AFF] text-white flex items-center justify-center hover:bg-[#0066D6] cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>

              {/* Questions list */}
              {extra.questions.length > 0 ? (
                extra.questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className={`p-4 space-y-2.5 ${idx > 0 ? 'border-t border-[#F0EDE4]' : ''}`}
                  >
                    <div className="text-[12.5px] text-[#6E7480]">
                      {q.author} · {q.timeAgo}
                    </div>
                    <p className="text-[14.5px] text-[#1E2022] leading-snug">{q.text}</p>
                    {q.replyText && (
                      <div className="bg-[#F4F8FA] border border-[#DCEAF0] rounded-xl p-3 space-y-1">
                        <div className="text-[12px] flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`font-semibold ${
                              q.replyRole === 'teacher' ? 'text-[#007AFF]' : 'text-[#6E7480]'
                            }`}
                          >
                            {q.replyRole === 'teacher' ? q.replyTimeAgo : q.replyAuthor}
                          </span>
                          <span className="text-[#6E7480]">
                            {q.replyRole === 'teacher' ? q.replyAuthor : `· ${q.replyTimeAgo}`}
                          </span>
                        </div>
                        <p className="text-[13.5px] text-[#1E2022] leading-snug">
                          {q.replyText}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-4 text-[13.5px] text-[#6E7480]">
                  Вопросов по этому заданию пока нет — задайте первый анонимно.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sticky Bottom CTA */}
        <div className="sticky bottom-0 z-20 px-4 md:px-6 py-3.5 bg-gradient-to-t from-[#EFECE3] via-[#EFECE3] to-[#EFECE3]/80 border-t border-[#E3DFD3]">
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => onToggleDone(assignment)}
            className={`w-full min-h-[50px] rounded-full font-display font-semibold text-[16px] flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isDone
                ? 'bg-[#72B0B9] text-white hover:bg-[#5E9EA7]'
                : 'bg-[#007AFF] text-white hover:bg-[#0066D6] shadow-[0_6px_18px_rgba(0,122,255,0.28)]'
            } disabled:opacity-60`}
          >
            {isDone ? (
              <>
                <Check className="w-5 h-5" strokeWidth={2.5} />
                <span>Сдано · Отменить</span>
              </>
            ) : (
              <span>{isUpdating ? 'Сохранение…' : 'Отметить как сделано'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
