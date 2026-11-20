import React, { useState } from 'react';
import { Check, ChevronRight, List, Plus } from 'lucide-react';
import { Assignment } from '../lib/supabase';
import {
  WEEK_SCHEDULE,
  formatCountdown,
  formatDueShort,
  getBishkekDateKey,
} from '../data/ontopData';

interface CalendarViewProps {
  assignments: Assignment[];
  onSelectAssignment: (assignment: Assignment) => void;
  onToggleAssignment: (assignment: Assignment) => void;
  onOpenCreate: () => void;
  onOpenFeedEvent: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  assignments,
  onSelectAssignment,
  onToggleAssignment,
  onOpenCreate,
  onOpenFeedEvent,
}) => {
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [compactListMode, setCompactListMode] = useState(false);

  const selectedDay = WEEK_SCHEDULE[selectedDayIdx];
  const totalLessons = WEEK_SCHEDULE.reduce((acc, d) => acc + d.lessons.length, 0);
  const activeDeadlinesCount = assignments.filter((a) => a.status !== 'done').length;

  const deadlineDateKeys = new Set(assignments.map((a) => getBishkekDateKey(a.due_date)));

  const displayedAssignments = compactListMode
    ? assignments
    : assignments;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-[32px] leading-tight font-extrabold tracking-tight text-[#1E2022]">
          Ноябрь
        </h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenCreate}
            aria-label="Создать публикацию"
            className="min-w-[44px] min-h-[44px] rounded-full bg-white hover:bg-[#FAF8F4] flex items-center justify-center text-[#1E2022] shadow-[0_2px_8px_rgba(30,32,34,0.06)] transition-colors cursor-pointer"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setCompactListMode((v) => !v)}
            aria-label="Переключить вид списка"
            className={`min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(30,32,34,0.06)] transition-colors cursor-pointer ${
              compactListMode ? 'bg-[#007AFF] text-white' : 'bg-white text-[#1E2022] hover:bg-[#FAF8F4]'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Week Strip */}
      <div className="bg-white rounded-2xl p-3 shadow-[0_1px_3px_rgba(30,32,34,0.04)]">
        <div className="grid grid-cols-7 gap-1">
          {WEEK_SCHEDULE.map((day, idx) => {
            const isSelected = idx === selectedDayIdx;
            const hasDeadline = deadlineDateKeys.has(day.isoDate);
            return (
              <button
                key={day.isoDate}
                type="button"
                onClick={() => setSelectedDayIdx(idx)}
                className="min-h-[62px] flex flex-col items-center justify-start pt-1.5 pb-1 rounded-xl hover:bg-[#FAF8F4] transition-colors cursor-pointer"
              >
                <span
                  className={`text-[11px] font-medium mb-1 ${
                    isSelected ? 'text-[#007AFF]' : 'text-[#6E7480]'
                  }`}
                >
                  {day.shortName}
                </span>
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[14px] font-semibold tabular-nums transition-colors ${
                    isSelected
                      ? 'bg-[#007AFF] text-white'
                      : day.dayIndex === 6
                        ? 'text-[#6E7480]'
                        : 'text-[#1E2022]'
                  }`}
                >
                  {day.dateNum}
                </span>
                <span className="h-2 flex items-center justify-center mt-0.5">
                  {hasDeadline && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DF443A]" />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary text */}
      <div className="text-[13px] text-[#6E7480] px-1 tabular-nums">
        На неделе: {activeDeadlinesCount} дедлайна · 1 событие · {totalLessons} пар
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Schedule Column */}
        {!compactListMode && (
          <div className="lg:col-span-6 space-y-2.5">
            <h2 className="text-[13.5px] font-medium text-[#6E7480] px-1">
              {selectedDay.fullLabel}
            </h2>

            <div className="bg-white rounded-2xl p-4 shadow-[0_1px_3px_rgba(30,32,34,0.04)] space-y-3">
              {selectedDay.lessons.length > 0 ? (
                selectedDay.lessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-start gap-3">
                    <span className="w-11 pt-2.5 text-[12.5px] font-medium text-[#6E7480] tabular-nums shrink-0">
                      {lesson.time}
                    </span>
                    <div className="flex-1 bg-[#E5F0F4] rounded-xl px-3.5 py-2.5 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-display font-semibold text-[14.5px] text-[#1E2022] leading-snug">
                          {lesson.subject} · {lesson.room}
                        </div>
                        {lesson.rescheduled && (
                          <span className="text-[11.5px] font-semibold text-[#007AFF] shrink-0 pt-0.5">
                            Перенесено
                          </span>
                        )}
                      </div>
                      <div className="text-[12.5px] text-[#6E7480] mt-0.5">
                        {lesson.teacherOrType}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-[13.5px] text-[#6E7480]">
                  В этот день занятий по расписанию нет
                </div>
              )}
            </div>
          </div>
        )}

        {/* Deadlines + Events Column */}
        <div className={`${compactListMode ? 'lg:col-span-12' : 'lg:col-span-6'} space-y-6`}>
          <div>
            <h2 className="text-[13.5px] font-medium text-[#6E7480] mb-2.5 px-1">
              Дедлайны недели
            </h2>
            <div className="bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(30,32,34,0.04)]">
              {displayedAssignments.length > 0 ? (
                displayedAssignments.map((item, idx) => {
                  const countdown = formatCountdown(item.due_date);
                  const isDone = item.status === 'done';
                  const isUrgent = item.status === 'urgent';
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-[#FAF8F4] transition-colors ${
                        idx > 0 ? 'border-t border-[#F0EDE4]' : ''
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => onSelectAssignment(item)}
                        className="flex-1 min-w-0 text-left cursor-pointer"
                      >
                        <div
                          className={`text-[15px] font-medium leading-snug ${
                            isDone ? 'text-[#6E7480] line-through' : 'text-[#1E2022]'
                          }`}
                        >
                          {item.title}
                        </div>
                        <div className="text-[12.5px] text-[#6E7480] mt-0.5">
                          {item.subject}
                        </div>
                      </button>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <span
                          className={`text-[12.5px] font-medium tabular-nums ${
                            isDone
                              ? 'text-[#72B0B9]'
                              : isUrgent
                                ? 'text-[#DF443A]'
                                : 'text-[#6E7480]'
                          }`}
                        >
                          {isDone
                            ? 'Сдано'
                            : isUrgent
                              ? countdown.label
                              : formatDueShort(item.due_date)}
                        </span>
                        <button
                          type="button"
                          onClick={() => onToggleAssignment(item)}
                          aria-label={isDone ? 'Снять отметку' : 'Отметить выполненным'}
                          className="min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer"
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                              isDone
                                ? 'bg-[#72B0B9] text-white'
                                : 'border border-[#C8C3B4] hover:border-[#007AFF]'
                            }`}
                          >
                            {isDone && <Check className="w-3 h-3" strokeWidth={3} />}
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-5 text-center text-[13.5px] text-[#6E7480]">
                  Дедлайнов на этой неделе нет
                </div>
              )}
            </div>
          </div>

          {/* Events */}
          <div>
            <h2 className="text-[13.5px] font-medium text-[#6E7480] mb-2.5 px-1">
              События
            </h2>
            <button
              type="button"
              onClick={onOpenFeedEvent}
              className="w-full bg-white hover:bg-[#FAF8F4] rounded-2xl px-4 py-3.5 shadow-[0_1px_3px_rgba(30,32,34,0.04)] flex items-center justify-between gap-3 text-left transition-colors cursor-pointer"
            >
              <span className="text-[15px] font-medium text-[#1E2022] tabular-nums">
                28 нояб. · Мастер-класс: Figma
              </span>
              <ChevronRight className="w-4 h-4 text-[#9CA3AF] shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
