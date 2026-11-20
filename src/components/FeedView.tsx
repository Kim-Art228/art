import React, { useState } from 'react';
import { Calendar, MapPin, Pin } from 'lucide-react';
import { FeedPost } from '../data/ontopData';

interface FeedViewProps {
  posts: FeedPost[];
  onToggleRegister: (postId: string) => void;
  onMarkRead: (postId: string) => void;
}

type FeedFilter = 'all' | 'group' | 'college' | 'event';

const FILTER_TABS: { id: FeedFilter; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'group', label: 'Группа' },
  { id: 'college', label: 'Колледж' },
  { id: 'event', label: 'События' },
];

export const FeedView: React.FC<FeedViewProps> = ({
  posts,
  onToggleRegister,
  onMarkRead,
}) => {
  const [filter, setFilter] = useState<FeedFilter>('all');

  const visiblePosts =
    filter === 'all' ? posts : posts.filter((p) => p.category === filter);

  return (
    <div className="space-y-5">
      {/* Header */}
      <h1 className="font-display text-[32px] leading-tight font-extrabold tracking-tight text-[#1E2022]">
        Лента
      </h1>

      {/* Segmented Filter */}
      <div className="bg-[#E5E1D5] p-1 rounded-full grid grid-cols-4 gap-1 max-w-md">
        {FILTER_TABS.map((tab) => {
          const active = filter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`min-h-[36px] px-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-all cursor-pointer ${
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

      {/* Posts Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {visiblePosts.map((post) => {
          if (post.category === 'event') {
            const total = post.spotsTotal ?? 40;
            const taken = post.spotsTaken ?? 0;
            const remaining = Math.max(0, total - taken);
            const pct = Math.min(100, Math.round((taken / total) * 100));

            return (
              <div
                key={post.id}
                className="bg-white rounded-2xl p-4 shadow-[0_1px_3px_rgba(30,32,34,0.04)] space-y-3"
              >
                <div>
                  {post.primaryButton && (
                    <div className="text-[12px] font-medium text-[#6E7480] mb-1">
                      Событие
                    </div>
                  )}
                  <h2 className="font-display font-bold text-[18px] leading-snug text-[#1E2022]">
                    {post.title}
                  </h2>
                </div>

                {post.primaryButton ? (
                  <div className="space-y-1.5 text-[13.5px] text-[#1E2022]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#6E7480] shrink-0" />
                      <span>{post.eventDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#6E7480] shrink-0" />
                      <span>{post.eventLocation}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-[13.5px] text-[#6E7480]">
                    {post.eventDate} · {post.eventLocation}
                  </p>
                )}

                {/* Seat Progress */}
                <div>
                  <div className="h-1.5 w-full rounded-full bg-[#EAE6DA] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#72B0B9] transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="text-[12.5px] text-[#6E7480] mt-1.5 tabular-nums">
                    Осталось {remaining} {post.primaryButton ? 'мест ' : ''}из {total}
                  </div>
                </div>

                {post.goingCount && (
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <span className="text-[13.5px] text-[#1E2022] leading-snug">
                      Идут {post.goingCount} студентов вашего курса
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
                )}

                {post.regDeadline && (
                  <div className="text-[12px] text-[#6E7480]">{post.regDeadline}</div>
                )}

                <div className="pt-1 space-y-2">
                  <button
                    type="button"
                    onClick={() => onToggleRegister(post.id)}
                    className={`w-full min-h-[46px] rounded-full font-display font-semibold text-[15px] transition-all cursor-pointer ${
                      post.isRegistered
                        ? 'bg-[#E5F0F4] text-[#2B3A42] hover:bg-[#D8E8EE]'
                        : post.primaryButton
                          ? 'bg-[#007AFF] text-white hover:bg-[#0066D6] shadow-[0_4px_14px_rgba(0,122,255,0.22)]'
                          : 'bg-[#EAE6DA] text-[#1E2022] hover:bg-[#E0DBCC]'
                    }`}
                  >
                    {post.isRegistered ? 'Вы записаны · Отменить' : 'Записаться'}
                  </button>
                  {post.primaryButton && (
                    <p className="text-center text-[12px] text-[#6E7480]">
                      Отменить запись можно за 24 часа
                    </p>
                  )}
                </div>
              </div>
            );
          }

          return (
            <div key={post.id} className="space-y-2">
              {post.pinned && (
                <div className="flex items-center gap-1.5 text-[12.5px] font-medium text-[#6E7480] px-1">
                  <Pin className="w-3.5 h-3.5" />
                  <span>Закреплено</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => onMarkRead(post.id)}
                className="w-full text-left bg-white hover:bg-[#FAF8F4] rounded-2xl p-4 shadow-[0_1px_3px_rgba(30,32,34,0.04)] transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    {post.unread && (
                      <span className="w-2 h-2 rounded-full bg-[#007AFF] shrink-0" />
                    )}
                    <span
                      className={`text-[14.5px] truncate ${
                        post.pinned || post.unread
                          ? 'font-display font-bold text-[#1E2022]'
                          : 'font-medium text-[#6E7480]'
                      }`}
                    >
                      {post.author}
                    </span>
                  </div>
                  <span className="text-[12px] text-[#6E7480] shrink-0 tabular-nums">
                    {post.timeLabel}
                  </span>
                </div>
                <p
                  className={`text-[14px] leading-relaxed mt-2 ${
                    post.pinned || post.unread ? 'text-[#1E2022]' : 'text-[#6E7480]'
                  }`}
                >
                  {post.body}
                </p>
                {post.attachmentLabel && (
                  <div className="mt-2.5 text-[12.5px] font-medium text-[#007AFF]">
                    {post.attachmentLabel}
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
