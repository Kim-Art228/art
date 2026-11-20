import React, { useState } from 'react';
import { Check, ChevronRight, Info, Paperclip, X } from 'lucide-react';
import {
  GROUP_OPTIONS,
  SUBJECT_OPTIONS,
  SUBJECT_TEACHER_MAP,
  formatCountdown,
  formatDueFull,
} from '../data/ontopData';
import { NewAssignmentInput } from '../lib/supabase';

interface CreatePublicationModalProps {
  defaultGroup: string;
  isSubmitting: boolean;
  onClose: () => void;
  onCreateAssignment: (
    payload: NewAssignmentInput,
    extra: { description: string; files: { name: string; size: string }[] }
  ) => Promise<void>;
  onCreateFeedItem: (type: 'announcement' | 'event', title: string, body: string) => void;
}

type PublicationType = 'assignment' | 'announcement' | 'event';

export const CreatePublicationModal: React.FC<CreatePublicationModalProps> = ({
  defaultGroup,
  isSubmitting,
  onClose,
  onCreateAssignment,
  onCreateFeedItem,
}) => {
  const [pubType, setPubType] = useState<PublicationType>('assignment');
  const [subject, setSubject] = useState<string>(SUBJECT_OPTIONS[0]);
  const [teacher, setTeacher] = useState<string>(SUBJECT_TEACHER_MAP[SUBJECT_OPTIONS[0]]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [dueDateStr, setDueDateStr] = useState<string>('2026-11-26');
  const [dueTimeStr, setDueTimeStr] = useState<string>('09:00');
  const [groupName, setGroupName] = useState<string>(defaultGroup || 'CS-1-24');
  const [files, setFiles] = useState<{ name: string; size: string }[]>([
    { name: 'zadanie_material.pdf', size: '240 КБ' },
  ]);
  const [formError, setFormError] = useState<string | null>(null);

  const cycleSubject = () => {
    const idx = SUBJECT_OPTIONS.indexOf(subject);
    const nextSubject = SUBJECT_OPTIONS[(idx + 1) % SUBJECT_OPTIONS.length];
    setSubject(nextSubject);
    setTeacher(SUBJECT_TEACHER_MAP[nextSubject] ?? 'Преподаватель');
  };

  const cycleGroup = () => {
    const idx = GROUP_OPTIONS.findIndex((g) => g.code === groupName);
    const nextGroup = GROUP_OPTIONS[(idx + 1) % GROUP_OPTIONS.length];
    setGroupName(nextGroup.code);
  };

  const handleAddMockFile = () => {
    const index = files.length + 1;
    setFiles((prev) => [...prev, { name: `prilozhenie_${index}.pdf`, size: '128 КБ' }]);
  };

  // Construct ISO timestamp in UTC+6 Bishkek timezone
  const dueIso = `${dueDateStr}T${dueTimeStr}:00+06:00`;
  const previewCountdown = formatCountdown(dueIso);
  const groupObj = GROUP_OPTIONS.find((g) => g.code === groupName) ?? GROUP_OPTIONS[0];

  const handleSubmit = async () => {
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setFormError('Введите название публикации');
      return;
    }

    setFormError(null);

    if (pubType === 'assignment') {
      const targetMs = new Date(dueIso).getTime();
      const hoursLeft = (targetMs - Date.now()) / 3600000;
      const computedStatus = hoursLeft <= 24 ? 'urgent' : 'pending';

      await onCreateAssignment(
        {
          title: cleanTitle,
          subject,
          teacher: teacher.trim() || 'Преподаватель',
          due_date: new Date(dueIso).toISOString(),
          group_name: groupName,
          status: computedStatus,
          submissions_count: 0,
          total_students: groupObj.totalMembers,
        },
        {
          description:
            description.trim() ||
            `Выполните задание «${cleanTitle}» по предмету «${subject}» и прикрепите решение до срока сдачи.`,
          files,
        }
      );
    } else {
      onCreateFeedItem(
        pubType === 'event' ? 'event' : 'announcement',
        cleanTitle,
        description.trim() || cleanTitle
      );
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#EFECE3] md:bg-[#1E2022]/35 md:backdrop-blur-xs flex justify-center overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Новая публикация"
    >
      <div className="w-full md:max-w-xl md:my-6 md:rounded-3xl bg-[#EFECE3] min-h-screen md:min-h-0 md:max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-[#EFECE3]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-[#E3DFD3]">
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="min-w-[44px] min-h-[44px] rounded-full bg-white hover:bg-[#FAF8F4] flex items-center justify-center text-[#1E2022] shadow-[0_1px_4px_rgba(30,32,34,0.06)] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="font-display font-semibold text-[16px] text-[#1E2022]">
            Новая публикация
          </span>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit}
            aria-label="Опубликовать"
            className="min-w-[44px] min-h-[44px] rounded-full bg-[#007AFF] hover:bg-[#0066D6] disabled:opacity-60 flex items-center justify-center text-white shadow-[0_3px_10px_rgba(0,122,255,0.3)] cursor-pointer"
          >
            <Check className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </header>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-5">
          {/* Segmented Type Switcher */}
          <div className="bg-[#E5E1D5] p-1 rounded-full grid grid-cols-3 gap-1">
            {(
              [
                { id: 'assignment', label: 'Задание' },
                { id: 'announcement', label: 'Объявление' },
                { id: 'event', label: 'Событие' },
              ] as const
            ).map((tab) => {
              const active = pubType === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setPubType(tab.id)}
                  className={`min-h-[36px] rounded-full text-[13px] font-medium transition-all cursor-pointer ${
                    active
                      ? 'bg-white text-[#007AFF] shadow-[0_1px_3px_rgba(30,32,34,0.08)]'
                      : 'text-[#6E7480] hover:text-[#1E2022]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {formError && (
            <div className="bg-[#FFF4F2] border border-[#F7C7C2] text-[#A92D24] text-[13px] rounded-2xl px-4 py-3">
              {formError}
            </div>
          )}

          {/* Main Fields Card */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(30,32,34,0.04)]">
            {pubType === 'assignment' && (
              <>
                <button
                  type="button"
                  onClick={cycleSubject}
                  className="w-full min-h-[50px] px-4 flex items-center justify-between text-left hover:bg-[#FAF8F4] transition-colors cursor-pointer"
                >
                  <span className="text-[15px] text-[#1E2022]">Предмет</span>
                  <span className="flex items-center gap-1 text-[14.5px] text-[#6E7480]">
                    {subject}
                    <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
                  </span>
                </button>

                <div className="min-h-[50px] px-4 border-t border-[#F0EDE4] flex items-center justify-between gap-3">
                  <span className="text-[15px] text-[#1E2022] shrink-0">Преподаватель</span>
                  <input
                    type="text"
                    value={teacher}
                    onChange={(e) => setTeacher(e.target.value)}
                    className="text-right text-[14.5px] text-[#6E7480] bg-transparent focus:outline-none focus:text-[#1E2022] w-full"
                  />
                </div>
              </>
            )}

            <div
              className={`px-4 py-3 ${pubType === 'assignment' ? 'border-t border-[#F0EDE4]' : ''}`}
            >
              <label htmlFor="pub-title" className="block text-[12px] text-[#6E7480] mb-1">
                Название
              </label>
              <input
                id="pub-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  pubType === 'assignment'
                    ? 'Например, Лабораторная №5: SQL-запросы'
                    : pubType === 'event'
                      ? 'Название события'
                      : 'Заголовок объявления'
                }
                className="w-full text-[15px] text-[#1E2022] placeholder:text-[#9CA3AF] focus:outline-none"
              />
            </div>

            <div className="px-4 py-3 border-t border-[#F0EDE4]">
              <label htmlFor="pub-desc" className="block text-[12px] text-[#6E7480] mb-1">
                Описание
              </label>
              <textarea
                id="pub-desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Условия, требования к оформлению и ссылка на материалы…"
                className="w-full text-[14.5px] text-[#1E2022] placeholder:text-[#9CA3AF] focus:outline-none resize-none leading-snug"
              />
            </div>
          </div>

          {pubType === 'assignment' && (
            <>
              {/* Due date & time */}
              <div>
                <h2 className="text-[13px] font-medium text-[#6E7480] mb-1.5 px-1">
                  Срок сдачи
                </h2>
                <div className="bg-white rounded-2xl px-4 py-3 flex items-center justify-between gap-2 shadow-[0_1px_3px_rgba(30,32,34,0.04)] flex-wrap">
                  <span className="text-[15px] text-[#1E2022]">Дата и время</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={dueDateStr}
                      onChange={(e) => setDueDateStr(e.target.value)}
                      className="bg-[#EFECE3] rounded-xl px-2.5 py-1.5 text-[13.5px] font-medium text-[#1E2022] tabular-nums focus:outline-none"
                    />
                    <input
                      type="time"
                      value={dueTimeStr}
                      onChange={(e) => setDueTimeStr(e.target.value)}
                      className="bg-[#EFECE3] rounded-xl px-2.5 py-1.5 text-[13.5px] font-medium text-[#1E2022] tabular-nums focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Files */}
              <div>
                <h2 className="text-[13px] font-medium text-[#6E7480] mb-1.5 px-1">
                  Файлы
                </h2>
                <div className="bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(30,32,34,0.04)]">
                  {files.map((file, idx) => (
                    <div
                      key={`${file.name}-${idx}`}
                      className={`min-h-[46px] px-4 flex items-center justify-between gap-2 ${
                        idx > 0 ? 'border-t border-[#F0EDE4]' : ''
                      }`}
                    >
                      <span className="text-[14px] text-[#1E2022] truncate tabular-nums">
                        {file.name} · {file.size}
                      </span>
                      <button
                        type="button"
                        onClick={() => setFiles((prev) => prev.filter((_, i) => i !== idx))}
                        aria-label="Удалить файл"
                        className="p-1.5 text-[#6E7480] hover:text-[#DF443A] cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddMockFile}
                    className={`w-full min-h-[48px] px-4 flex items-center gap-2 text-[#007AFF] hover:bg-[#FAF8F4] transition-colors cursor-pointer ${
                      files.length > 0 ? 'border-t border-[#F0EDE4]' : ''
                    }`}
                  >
                    <Paperclip className="w-4 h-4" />
                    <span className="text-[14.5px] font-medium">Добавить файл</span>
                  </button>
                </div>
              </div>

              {/* Group target */}
              <div>
                <h2 className="text-[13px] font-medium text-[#6E7480] mb-1.5 px-1">
                  Кому
                </h2>
                <button
                  type="button"
                  onClick={cycleGroup}
                  className="w-full min-h-[50px] bg-white hover:bg-[#FAF8F4] rounded-2xl px-4 flex items-center justify-between shadow-[0_1px_3px_rgba(30,32,34,0.04)] transition-colors cursor-pointer"
                >
                  <span className="text-[15px] text-[#1E2022]">
                    Вся группа {groupName}
                  </span>
                  <span className="flex items-center gap-1 text-[14px] text-[#6E7480] tabular-nums">
                    {groupObj.totalMembers} чел.
                    <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
                  </span>
                </button>
                <div className="flex items-start gap-2 text-[12.5px] text-[#6E7480] px-1 mt-2.5 leading-snug">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Преподаватель получит копию и сможет подтвердить задание — появится бейдж
                    «От преподавателя»
                  </span>
                </div>
              </div>

              {/* Live Student Preview */}
              <div>
                <h2 className="text-[13px] font-medium text-[#6E7480] mb-1.5 px-1">
                  Так увидят студенты
                </h2>
                <div className="bg-white rounded-2xl p-4 shadow-[0_1px_3px_rgba(30,32,34,0.04)]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#E1EAEF] text-[12px] font-medium text-[#2B3A42]">
                        {subject}
                      </span>
                      <div className="font-display font-bold text-[16.5px] text-[#1E2022] mt-2 leading-snug">
                        {title.trim() || 'Название задания'}
                      </div>
                      <div className="text-[13px] text-[#007AFF] font-medium mt-1.5 tabular-nums">
                        {previewCountdown.label} · до {formatDueFull(dueIso)}
                      </div>
                    </div>
                    <span className="w-6 h-6 rounded-full border-2 border-[#3C4663] shrink-0 mt-1" />
                  </div>
                  <div className="mt-3.5">
                    <div className="h-1.5 w-full rounded-full bg-[#EAE6DA]" />
                    <div className="text-[12.5px] text-[#6E7480] mt-1.5 tabular-nums">
                      Сдали 0 из {groupObj.totalMembers}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Explicit Bottom Submit CTA as well for thumb reach */}
          <div className="pt-2 pb-4">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="w-full min-h-[50px] rounded-full bg-[#007AFF] hover:bg-[#0066D6] disabled:opacity-60 text-white font-display font-semibold text-[16px] shadow-[0_6px_18px_rgba(0,122,255,0.28)] transition-all cursor-pointer"
            >
              {isSubmitting
                ? 'Сохраняем в Supabase…'
                : pubType === 'assignment'
                  ? 'Опубликовать задание'
                  : 'Опубликовать в ленту'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
