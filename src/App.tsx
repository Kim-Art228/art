import { useCallback, useEffect, useState } from 'react';
import { CalendarDays, Home, Newspaper, Plus, User } from 'lucide-react';
import {
  Assignment,
  NewAssignmentInput,
  createAssignment,
  deleteAssignment,
  fetchAssignments,
  updateAssignmentStatus,
} from './lib/supabase';
import {
  AssignmentExtra,
  FeedPost,
  INITIAL_FEED_POSTS,
  getFallbackExtraForAssignment,
} from './data/ontopData';
import { OnboardingScreen } from './components/OnboardingScreen';
import { TodayView } from './components/TodayView';
import { CalendarView } from './components/CalendarView';
import { FeedView } from './components/FeedView';
import { ProfileView } from './components/ProfileView';
import { AssignmentDetailModal } from './components/AssignmentDetailModal';
import { CreatePublicationModal } from './components/CreatePublicationModal';

type TabId = 'today' | 'calendar' | 'feed' | 'profile';

const NAV_ITEMS: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: 'today', label: 'Сегодня', icon: Home },
  { id: 'calendar', label: 'Календарь', icon: CalendarDays },
  { id: 'feed', label: 'Лента', icon: Newspaper },
  { id: 'profile', label: 'Профиль', icon: User },
];

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeGroup, setActiveGroup] = useState('CS-1-24');
  const [activeTab, setActiveTab] = useState<TabId>('today');

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>(INITIAL_FEED_POSTS);
  const [extrasById, setExtrasById] = useState<Record<number, AssignmentExtra>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2800);
  }, []);

  const loadAssignments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await fetchAssignments();
      setAssignments(rows);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Ошибка подключения к Supabase';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  const getExtraForAssignment = (assignment: Assignment): AssignmentExtra => {
    return (
      extrasById[assignment.id] ??
      getFallbackExtraForAssignment(assignment.title, assignment.subject)
    );
  };

  const handleToggleAssignment = async (assignment: Assignment) => {
    const isCurrentlyDone = assignment.status === 'done';
    const targetMs = new Date(assignment.due_date).getTime();
    const hoursLeft = (targetMs - Date.now()) / 3600000;
    const restoredStatus = hoursLeft <= 24 ? 'urgent' : 'pending';
    const nextStatus = isCurrentlyDone ? restoredStatus : 'done';
    const nextCount = isCurrentlyDone
      ? Math.max(0, assignment.submissions_count - 1)
      : Math.min(assignment.total_students, assignment.submissions_count + 1);

    setTogglingId(assignment.id);
    // Optimistic update
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === assignment.id
          ? { ...a, status: nextStatus, submissions_count: nextCount }
          : a
      )
    );

    try {
      const updated = await updateAssignmentStatus(assignment.id, nextStatus, nextCount);
      setAssignments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      showToast(nextStatus === 'done' ? 'Задание отмечено как сданное' : 'Отметка снята');
    } catch {
      // Revert on failure
      setAssignments((prev) =>
        prev.map((a) => (a.id === assignment.id ? assignment : a))
      );
      showToast('Не удалось обновить статус в Supabase');
    } finally {
      setTogglingId(null);
    }
  };

  const handleCreateAssignment = async (
    payload: NewAssignmentInput,
    extra: { description: string; files: { name: string; size: string }[] }
  ) => {
    setIsCreating(true);
    try {
      const created = await createAssignment(payload);
      setExtrasById((prev) => ({
        ...prev,
        [created.id]: {
          description: extra.description,
          files: extra.files,
          verifiedByTeacher: false,
          publishedByText: `Опубликовано для группы ${created.group_name}`,
          confusedCount: 0,
          userConfused: false,
          confusedLabel: 'Вопросов пока нет',
          questions: [],
        },
      }));
      setAssignments((prev) =>
        [...prev, created].sort(
          (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
        )
      );
      setShowCreateModal(false);
      showToast('Задание сохранено в Supabase');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Ошибка создания задания';
      showToast(msg);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId: number) => {
    const prevList = assignments;
    setAssignments((curr) => curr.filter((a) => a.id !== assignmentId));
    setSelectedAssignmentId(null);
    try {
      await deleteAssignment(assignmentId);
      showToast('Задание удалено');
    } catch {
      setAssignments(prevList);
      showToast('Не удалось удалить задание');
    }
  };

  const handleToggleConfused = (assignmentId: number) => {
    const target = assignments.find((a) => a.id === assignmentId);
    if (!target) return;
    const current = getExtraForAssignment(target);
    const nextUserConfused = !current.userConfused;
    const nextCount = Math.max(0, current.confusedCount + (nextUserConfused ? 1 : -1));
    setExtrasById((prev) => ({
      ...prev,
      [assignmentId]: {
        ...current,
        userConfused: nextUserConfused,
        confusedCount: nextCount,
      },
    }));
  };

  const handleAskQuestion = (assignmentId: number, questionText: string) => {
    const target = assignments.find((a) => a.id === assignmentId);
    if (!target) return;
    const current = getExtraForAssignment(target);
    setExtrasById((prev) => ({
      ...prev,
      [assignmentId]: {
        ...current,
        questions: [
          {
            id: `q-${Date.now()}`,
            author: 'Анонимно',
            timeAgo: 'только что',
            text: questionText,
          },
          ...current.questions,
        ],
      },
    }));
  };

  const handleCreateFeedItem = (
    type: 'announcement' | 'event',
    title: string,
    body: string
  ) => {
    const newPost: FeedPost =
      type === 'event'
        ? {
            id: `feed-${Date.now()}`,
            category: 'event',
            author: 'Событие',
            timeLabel: 'Скоро',
            title,
            body,
            eventDate: 'На следующей неделе',
            eventLocation: 'Актовый зал',
            spotsTaken: 1,
            spotsTotal: 30,
            isRegistered: true,
            primaryButton: true,
          }
        : {
            id: `feed-${Date.now()}`,
            category: 'group',
            author: `Староста · ${activeGroup}`,
            timeLabel: 'только что',
            unread: true,
            body: `${title}: ${body}`,
          };

    setFeedPosts((prev) => [newPost, ...prev]);
    setActiveTab('feed');
    showToast('Опубликовано в ленту');
  };

  const handleToggleEventRegister = (postId: string) => {
    setFeedPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const nextReg = !post.isRegistered;
        const currentTaken = post.spotsTaken ?? 0;
        return {
          ...post,
          isRegistered: nextReg,
          spotsTaken: nextReg ? currentTaken + 1 : Math.max(0, currentTaken - 1),
        };
      })
    );
  };

  const handleMarkFeedRead = (postId: string) => {
    setFeedPosts((prev) =>
      prev.map((post) => (post.id === postId ? { ...post, unread: false } : post))
    );
  };

  if (showOnboarding) {
    return (
      <OnboardingScreen
        selectedGroup={activeGroup}
        onComplete={(groupCode) => {
          setActiveGroup(groupCode);
          setShowOnboarding(false);
          setActiveTab('today');
          showToast(`Вы вошли в группу ${groupCode}`);
        }}
      />
    );
  }

  const groupAssignments = assignments.filter(
    (a) => !a.group_name || a.group_name === activeGroup
  );
  const selectedAssignment = assignments.find((a) => a.id === selectedAssignmentId) ?? null;
  const featuredEvent = feedPosts.find((p) => p.category === 'event');
  const registeredEventsCount = feedPosts.filter(
    (p) => p.category === 'event' && p.isRegistered
  ).length;
  const doneCount = groupAssignments.filter((a) => a.status === 'done').length;
  const activeCount = groupAssignments.filter((a) => a.status !== 'done').length;

  return (
    <div className="min-h-screen bg-[#EFECE3] text-[#1E2022] flex flex-col md:flex-row">
      {/* Desktop Navigation Rail */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:left-0 bg-[#F7F5EE] border-r border-[#E4E0D4] px-4 py-6 justify-between z-30">
        <div className="space-y-6">
          <div className="px-3 flex items-center justify-between">
            <span className="font-display font-extrabold text-[22px] tracking-tight text-[#1E2022]">
              OnTop
            </span>
            <span className="text-[12px] font-medium text-[#6E7480]">{activeGroup}</span>
          </div>

          <nav className="space-y-1.5" aria-label="Основная навигация">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full min-h-[46px] px-3.5 rounded-2xl flex items-center gap-3 text-[15px] font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#007AFF] shadow-[0_2px_8px_rgba(30,32,34,0.06)]'
                      : 'text-[#1E2022] hover:bg-white/60'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" strokeWidth={isActive ? 2.25 : 1.8} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="w-full min-h-[48px] rounded-full bg-[#007AFF] hover:bg-[#0066D6] text-white font-display font-semibold text-[15px] flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(0,122,255,0.24)] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            <span>Новое задание</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className="w-full p-3 rounded-2xl bg-white hover:bg-[#FAF8F4] flex items-center gap-3 text-left shadow-[0_1px_3px_rgba(30,32,34,0.04)] transition-colors cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-[#DCE9EE] flex items-center justify-center font-display font-bold text-[13px] text-[#1E2022] shrink-0">
            АС
          </div>
          <div className="min-w-0">
            <div className="text-[14px] font-semibold text-[#1E2022] truncate">
              Айбек Сыдыков
            </div>
            <div className="text-[12px] text-[#6E7480] truncate">{activeGroup} · Студент</div>
          </div>
        </button>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 md:pl-64 pb-28 md:pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 md:pt-8">
          {activeTab === 'today' && (
            <TodayView
              assignments={groupAssignments}
              loading={loading}
              error={error}
              onRetry={loadAssignments}
              onToggleAssignment={handleToggleAssignment}
              onSelectAssignment={(a) => setSelectedAssignmentId(a.id)}
              onOpenCreate={() => setShowCreateModal(true)}
              onOpenFeedEvent={() => setActiveTab('feed')}
              onOpenCalendar={() => setActiveTab('calendar')}
              featuredEvent={featuredEvent}
              togglingId={togglingId}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView
              assignments={groupAssignments}
              onSelectAssignment={(a) => setSelectedAssignmentId(a.id)}
              onToggleAssignment={handleToggleAssignment}
              onOpenCreate={() => setShowCreateModal(true)}
              onOpenFeedEvent={() => setActiveTab('feed')}
            />
          )}

          {activeTab === 'feed' && (
            <FeedView
              posts={feedPosts}
              onToggleRegister={handleToggleEventRegister}
              onMarkRead={handleMarkFeedRead}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              groupCode={activeGroup}
              doneCount={doneCount}
              overdueOrActiveCount={activeCount}
              eventsCount={registeredEventsCount}
              onSignOut={() => setShowOnboarding(true)}
            />
          )}
        </div>
      </main>

      {/* Mobile Floating Pill Bottom Navigation */}
      <div className="md:hidden fixed bottom-3 left-3 right-3 z-40 pointer-events-none">
        <nav
          aria-label="Мобильная навигация"
          className="pointer-events-auto max-w-md mx-auto bg-white/95 backdrop-blur-md rounded-full p-1.5 shadow-[0_8px_28px_rgba(30,32,34,0.12)] border border-[#E6E2D6] grid grid-cols-4 gap-1"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`min-h-[48px] rounded-full flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                  isActive ? 'bg-[#ECECEF] text-[#007AFF]' : 'text-[#1E2022] hover:bg-[#F7F5EE]'
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.2 : 1.8} />
                <span className="text-[10.5px] font-medium tracking-tight leading-none">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Assignment Detail Modal */}
      {selectedAssignment && (
        <AssignmentDetailModal
          assignment={selectedAssignment}
          extra={getExtraForAssignment(selectedAssignment)}
          isUpdating={togglingId === selectedAssignment.id}
          onClose={() => setSelectedAssignmentId(null)}
          onToggleDone={handleToggleAssignment}
          onDelete={handleDeleteAssignment}
          onToggleConfused={handleToggleConfused}
          onAskQuestion={handleAskQuestion}
          onShowToast={showToast}
        />
      )}

      {/* Create Publication Modal */}
      {showCreateModal && (
        <CreatePublicationModal
          defaultGroup={activeGroup}
          isSubmitting={isCreating}
          onClose={() => setShowCreateModal(false)}
          onCreateAssignment={handleCreateAssignment}
          onCreateFeedItem={handleCreateFeedItem}
        />
      )}

      {/* Subtle Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] bg-[#1E2022] text-white text-[13.5px] font-medium px-4 py-2.5 rounded-full shadow-lg whitespace-nowrap"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
