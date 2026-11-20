import React, { useState } from 'react';
import { Bell, Calendar, Check, ChevronRight, Info, Plus, RefreshCw, X } from 'lucide-react';
import { Assignment } from '../lib/supabase';
import {
  FeedPost,
  formatCountdown,
  formatDueFull,
  formatDueShort,
} from '../data/ontopData';

interface TodayViewProps {
  assignments: Assignment[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onToggleAssignment: (assignment: Assignment) => void;
  onSelectAssignment: (assignment: Assignment) => void;
  onOpenCreate: () => void;
  onOpenFeedEvent: () => void;
  onOpenCalendar: () => void;
  featuredEvent?: FeedPost;
  togglingId: number | null;
}

export const TodayView: React.FC<TodayViewProps> = ({
  assignments,
  loading,
  error,
  onRetry,
  onToggleAssignment,
  onSelectAssignment,
  onOpenCreate,
  onOpenFeedEvent,
  onOpenCalendar,
  featuredEvent,
  togglingId,
}) => {
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(true);
  const [showScheduleAlert, setShowScheduleAlert] = useState(true);

  const urgentAssignments = assignments.filter(
    (a) => a.status === 'urgent'
  );
  const weeklyAssignments = assignments.filter(
    (a) => a.status !== 'urgent'
  );

  // If there are no urgent tasks, keep weekly list clean; if all tasks are done, show them in weekly list
  const urgentActive = urgentAssignments;

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[13px] font-medium text-[#6E7480]">
            Понедельник, 23 ноября
          </p>
          <h1 className="font-display text-[32px] leading-tight font-extrabold tracking-tight text-[#1E2022] mt-0.5">
            Сегодня
          </h1>
        </div>

        <div className="flex items-center gap-2 relative">
          <button
            type="button"
            onClick={onOpenCreate}
            aria-label="Добавить задание"
            className="min-h-[44px] min-w-[44px] rounded-full bg-white hover:bg-[#FAF8F4] flex items-center justify-center text-[#1E2022] shadow-[0_2px_8px_rgba(30,32,34,0.06)] transition-colors cursor-pointer"
          >
            <Plus className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => {
              setShowNotifPanel((prev) => !prev);
              setUnreadNotifs(false);
            }}
            aria-label="Уведомления"
            className="min-h-[44px] min-w-[44px] rounded-full bg-white hover:bg-[#FAF8F4] flex items-center justify-center text-[#1E2022] shadow-[0_2px_8px_rgba(30,32,34,0.06)] transition-colors relative cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifs && (
              <span className="w-2.5 h-2.5 rounded-full bg-[#007AFF] ring-2 ring-white absolute top-2.5 right-2.5" />
            )}
          </button>

          {showNotifPanel && (
            <div className="absolute right-0 top-13 z-30 w-80 bg-white rounded-2xl shadow-[0_12px_32px_rgba(30,32,34,0.14)] border border-[#E5E0D3] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-[14px] text-[#1E2022]">
                  Уведомления
                </span>
                <button
                  type="button"
                  onClick={() => setShowNotifPanel(false)}
                  className="p-1 text-[#6E7480] hover:text-[#1E2022] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2.5 text-[13px]">
                <div className="p-2.5 rounded-xl bg-[#F6F4EE]">
                  <div className="font-semibold text-[#1E2022]">Базы данных перенесли</div>
                  <div className="text-[#6E7480] mt-0.5">Сегодня в 14:20, ауд. 305</div>
                </div>
                {urgentActive[0] && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowNotifPanel(false);
                      onSelectAssignment(urgentActive[0]);
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-[#FFF4F2] hover:bg-[#FFEBE8] transition-colors cursor-pointer"
                  >
                    <div className="font-semibold text-[#DF443A]">Скоро дедлайн</div>
                    <div className="text-[#1E2022] mt-0.5 line-clamp-1">{urgentActive[0].title}</div>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-[#FFF4F2] border border-[#F7C7C2] rounded-2xl p-4 flex items-center justify-between gap-3">
          <div className="text-[13.5px] text-[#A92D24]">
            Не удалось загрузить задания из Supabase: {error}
          </div>
          <button
            type="button"
            onClick={onRetry}
            className="min-h-[40px] px-3.5 rounded-xl bg-white text-[#1E2022] text-[13px] font-medium flex items-center gap-1.5 shadow-sm shrink-0 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Повторить
          </button>
        </div>
      )}

      {/* Main 2-column responsive layout on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column: Schedule Alert + Urgent Assignments */}
        <div className="lg:col-span-6 space-y-6">
          {showScheduleAlert && (
            <div className="bg-white rounded-2xl p-4 shadow-[0_1px_3px_rgba(30,32,34,0.04)] flex items-start gap-3">
              <button
                type="button"
                onClick={onOpenCalendar}
                className="flex-1 flex items-start gap-3 text-left cursor-pointer group"
              >
                <div className="w-6 h-6 rounded-full border-2 border-[#007AFF] text-[#007AFF] flex items-center justify-center shrink-0 mt-0.5">
                  <Info className="w-3.5 h-3.5" strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display font-bold text-[15px] text-[#1E2022] group-hover:text-[#007AFF] transition-colors">
                      Изменение в расписании
                    </span>
                    <span className="text-[12px] font-semibold text-[#007AFF] shrink-0">
                      Новое
                    </span>
                  </div>
                  <p className="text-[13.5px] text-[#6E7480] mt-1 leading-snug">
                    Базы данных перенесли на 14:20, ауд. 305
                  </p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setShowScheduleAlert(false)}
                aria-label="Скрыть уведомление"
                className="p-1 text-[#9CA3AF] hover:text-[#1E2022] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Urgent Section */}
          <div>
            <div className="flex items-center justify-between mb-2.5 px-1">
              <h2 className="text-[13.5px] font-medium text-[#6E7480]">Горит</h2>
              {loading && (
                <span className="text-[12px] text-[#6E7480]">Синхронизация…</span>
              )}
            </div>

            {loading && assignments.length === 0 ? (
              <div className="bg-white rounded-2xl p-5 space-y-3 animate-pulse">
                <div className="h-3.5 w-24 bg-[#EFECE3] rounded" />
                <div className="h-5 w-3/4 bg-[#EFECE3] rounded" />
                <div className="h-3.5 w-1/2 bg-[#EFECE3] rounded" />
                <div className="h-1.5 w-full bg-[#EFECE3] rounded-full" />
              </div>
            ) : urgentActive.length > 0 ? (
              <div className="space-y-3">
                {urgentActive.map((item) => {
                  const countdown = formatCountdown(item.due_date);
                  const pct =
                    item.total_students > 0
                      ? Math.min(100, Math.round((item.submissions_count / item.total_students) * 100))
                      : 0;
                  const isDone = item.status === 'done';

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl p-4 shadow-[0_1px_3px_rgba(30,32,34,0.04)] hover:shadow-[0_4px_14px_rgba(30,32,34,0.06)] transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => onSelectAssignment(item)}
                          className="flex-1 text-left min-w-0 cursor-pointer"
                        >
                          <div className="text-[13px] font-medium text-[#6E7480]">
                            {item.subject}
                          </div>
                          <h3 className="font-display font-bold text-[17px] leading-snug text-[#1E2022] mt-1">
                            {item.title}
                          </h3>
                          <div className="text-[13px] font-medium text-[#DF443A] mt-2 tabular-nums">
                            {countdown.label} · до {formatDueFull(item.due_date)}
                          </div>
                        </button>

                        <button
                          type="button"
                          disabled={togglingId === item.id}
                          onClick={() => onToggleAssignment(item)}
                          aria-label={isDone ? 'Отменить выполнение' : 'Отметить как сделано'}
                          className="min-w-[44px] min-h-[44px] -mt-1 -mr-1 flex items-center justify-center cursor-pointer"
                        >
                          <span
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                              isDone
                                ? 'bg-[#72B0B9] text-white'
                                : 'border-2 border-[#3C4663] hover:border-[#007AFF]'
                            }`}
                          >
                            {isDone && <Check className="w-4 h-4" strokeWidth={2.75} />}
                          </span>
                        </button>
                      </div>

                      <div className="mt-3.5">
                        <div className="h-1.5 w-full rounded-full bg-[#EAE6DA] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#72B0B9] transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="text-[12.5px] text-[#6E7480] mt-2 tabular-nums">
                          Сдали {item.submissions_count} из {item.total_students}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-5 text-center">
                <p className="font-display font-semibold text-[15px] text-[#1E2022]">
                  Срочных дедлайнов нет
                </p>
                <p className="text-[13px] text-[#6E7480] mt-1">
                  Все горящие задания выполнены или перенесены на неделю
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right column: This Week Checklist + College Event */}
        <div className="lg:col-span-6 space-y-6">
          {/* This week */}
          <div>
            <div className="flex items-center justify-between mb-2.5 px-1">
              <h2 className="text-[13.5px] font-medium text-[#6E7480]">
                На этой неделе
              </h2>
              <span className="text-[12.5px] text-[#6E7480] tabular-nums">
                {weeklyAssignments.filter((a) => a.status === 'done').length} из{' '}
                {weeklyAssignments.length} сдано
              </span>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(30,32,34,0.04)]">
              {loading && assignments.length === 0 ? (
                <div className="p-4 space-y-4 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#EFECE3]" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-4 w-2/3 bg-[#EFECE3] rounded" />
                        <div className="h-3 w-1/3 bg-[#EFECE3] rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : weeklyAssignments.length > 0 ? (
                weeklyAssignments.map((item, idx) => {
                  const isDone = item.status === 'done';
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center gap-2 px-3 py-2.5 transition-colors hover:bg-[#FAF8F4] ${
                        idx > 0 ? 'border-t border-[#F0EDE4]' : ''
                      }`}
                    >
                      <button
                        type="button"
                        disabled={togglingId === item.id}
                        onClick={() => onToggleAssignment(item)}
                        aria-label={isDone ? 'Вернуть в активные' : 'Отметить как сделано'}
                        className="min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0 cursor-pointer"
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                            isDone
                              ? 'bg-[#7FB6BE] text-white'
                              : 'border-2 border-[#3C4663] hover:border-[#007AFF]'
                          }`}
                        >
                          {isDone && <Check className="w-3.5 h-3.5" strokeWidth={2.75} />}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onSelectAssignment(item)}
                        className="flex-1 min-w-0 text-left py-1 pr-2 cursor-pointer"
                      >
                        <div
                          className={`text-[15px] font-medium leading-snug truncate ${
                            isDone ? 'text-[#6E7480] line-through decoration-[#9CA3AF]' : 'text-[#1E2022]'
                          }`}
                        >
                          {item.title}
                        </div>
                        <div className="text-[12.5px] text-[#6E7480] mt-0.5 truncate tabular-nums">
                          {item.subject} · {isDone ? 'Сдано' : formatDueShort(item.due_date)}
                        </div>
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-[13.5px] text-[#6E7480]">
                  На этой неделе других заданий пока нет.
                </div>
              )}
            </div>
          </div>

          {/* At College */}
          {featuredEvent && (
            <div>
              <h2 className="text-[13.5px] font-medium text-[#6E7480] mb-2.5 px-1">
                В колледже
              </h2>
              <button
                type="button"
                onClick={onOpenFeedEvent}
                className="w-full bg-white hover:bg-[#FAF8F4] rounded-2xl p-4 shadow-[0_1px_3px_rgba(30,32,34,0.04)] flex items-center justify-between gap-3 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <Calendar className="w-5 h-5 text-[#6E7480] shrink-0" />
                  <div className="min-w-0">
                    <div className="font-medium text-[15px] text-[#1E2022] truncate">
                      {featuredEvent.title}
                    </div>
                    <div className="text-[12.5px] text-[#6E7480] mt-0.5 tabular-nums">
                      5 декабря · осталось{' '}
                      {(featuredEvent.spotsTotal ?? 40) - (featuredEvent.spotsTaken ?? 33)} мест из{' '}
                      {featuredEvent.spotsTotal ?? 40}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#9CA3AF] shrink-0" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
