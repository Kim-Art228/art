export interface ScheduleLesson {
  id: string;
  time: string;
  subject: string;
  room: string;
  teacherOrType: string;
  rescheduled?: boolean;
}

export interface DaySchedule {
  dayIndex: number; // 0 = Mon 23 ... 6 = Sun 29
  shortName: string;
  dateNum: number;
  isoDate: string; // YYYY-MM-DD in Asia/Bishkek
  fullLabel: string;
  lessons: ScheduleLesson[];
}

export interface FeedPost {
  id: string;
  category: 'group' | 'college' | 'event';
  author: string;
  timeLabel: string;
  pinned?: boolean;
  unread?: boolean;
  title?: string;
  body: string;
  attachmentLabel?: string;
  eventDate?: string;
  eventLocation?: string;
  spotsTaken?: number;
  spotsTotal?: number;
  goingCount?: number;
  regDeadline?: string;
  isRegistered?: boolean;
  primaryButton?: boolean;
}

export interface AssignmentQuestion {
  id: string;
  author: string;
  timeAgo: string;
  text: string;
  replyAuthor?: string;
  replyRole?: 'teacher' | 'leader';
  replyTimeAgo?: string;
  replyText?: string;
}

export interface AssignmentExtra {
  description: string;
  files: { name: string; size: string }[];
  verifiedByTeacher: boolean;
  publishedByText: string;
  confusedCount: number;
  userConfused: boolean;
  confusedLabel: string;
  questions: AssignmentQuestion[];
}

export const SUBJECT_TEACHER_MAP: Record<string, string> = {
  'Базы данных': 'Асанова Г.Т.',
  'Веб-программирование': 'Мамытов Б.К.',
  'Высшая математика': 'Ли Е.С.',
  'Английский язык': 'Ахметова Д.Р.',
  'История Кыргызстана': 'Токтосунов А.М.',
};

export const SUBJECT_OPTIONS = Object.keys(SUBJECT_TEACHER_MAP);

export const GROUP_OPTIONS = [
  {
    code: 'CS-1-24',
    college: 'Кыргызско-Корейский колледж',
    activeMembers: 18,
    totalMembers: 24,
    leader: 'Нурлан Токтосунов',
  },
  {
    code: 'CS-2-24',
    college: 'Кыргызско-Корейский колледж',
    activeMembers: 21,
    totalMembers: 25,
    leader: 'Айгерим Бектурова',
  },
  {
    code: 'SE-1-24',
    college: 'Кыргызско-Корейский колледж',
    activeMembers: 15,
    totalMembers: 22,
    leader: 'Данияр Осмонов',
  },
];

export const WEEK_SCHEDULE: DaySchedule[] = [
  {
    dayIndex: 0,
    shortName: 'Пн',
    dateNum: 23,
    isoDate: '2026-11-23',
    fullLabel: 'Понедельник, 23 ноября',
    lessons: [
      { id: 'mon-1', time: '08:00', subject: 'Высшая математика', room: 'ауд. 412', teacherOrType: 'Ли Е.С.' },
      { id: 'mon-2', time: '09:40', subject: 'Английский язык', room: 'ауд. 118', teacherOrType: 'Практическое занятие' },
      { id: 'mon-3', time: '14:20', subject: 'Базы данных', room: 'ауд. 305', teacherOrType: 'Асанова Г.Т.', rescheduled: true },
      { id: 'mon-4', time: '16:00', subject: 'Веб-программирование', room: 'ауд. 307', teacherOrType: 'Мамытов Б.К.' },
    ],
  },
  {
    dayIndex: 1,
    shortName: 'Вт',
    dateNum: 24,
    isoDate: '2026-11-24',
    fullLabel: 'Вторник, 24 ноября',
    lessons: [
      { id: 'tue-1', time: '08:00', subject: 'Базы данных', room: 'ауд. 305', teacherOrType: 'Асанова Г.Т.' },
      { id: 'tue-2', time: '09:40', subject: 'История Кыргызстана', room: 'ауд. 204', teacherOrType: 'Токтосунов А.М.' },
      { id: 'tue-3', time: '11:20', subject: 'Физкультура', room: 'корпус Б', teacherOrType: 'Спортивный зал' },
    ],
  },
  {
    dayIndex: 2,
    shortName: 'Ср',
    dateNum: 25,
    isoDate: '2026-11-25',
    fullLabel: 'Среда, 25 ноября',
    lessons: [
      { id: 'wed-1', time: '09:40', subject: 'Веб-программирование', room: 'ауд. 307', teacherOrType: 'Мамытов Б.К.' },
      { id: 'wed-2', time: '11:20', subject: 'Высшая математика', room: 'ауд. 412', teacherOrType: 'Ли Е.С.' },
    ],
  },
  {
    dayIndex: 3,
    shortName: 'Чт',
    dateNum: 26,
    isoDate: '2026-11-26',
    fullLabel: 'Четверг, 26 ноября',
    lessons: [
      { id: 'thu-1', time: '08:00', subject: 'Английский язык', room: 'ауд. 118', teacherOrType: 'Ахметова Д.Р.' },
      { id: 'thu-2', time: '09:40', subject: 'Веб-программирование', room: 'ауд. 307', teacherOrType: 'Разбор макетов Figma' },
      { id: 'thu-3', time: '13:00', subject: 'Базы данных', room: 'ауд. 305', teacherOrType: 'Асанова Г.Т.' },
    ],
  },
  {
    dayIndex: 4,
    shortName: 'Пт',
    dateNum: 27,
    isoDate: '2026-11-27',
    fullLabel: 'Пятница, 27 ноября',
    lessons: [
      { id: 'fri-1', time: '09:40', subject: 'История Кыргызстана', room: 'ауд. 204', teacherOrType: 'Токтосунов А.М.' },
      { id: 'fri-2', time: '11:20', subject: 'Английский язык', room: 'ауд. 118', teacherOrType: 'Ахметова Д.Р.' },
    ],
  },
  {
    dayIndex: 5,
    shortName: 'Сб',
    dateNum: 28,
    isoDate: '2026-11-28',
    fullLabel: 'Суббота, 28 ноября',
    lessons: [
      { id: 'sat-1', time: '15:00', subject: 'Мастер-класс: Figma для начинающих', room: 'ауд. 210', teacherOrType: 'Студенческий клуб дизайна' },
    ],
  },
  {
    dayIndex: 6,
    shortName: 'Вс',
    dateNum: 29,
    isoDate: '2026-11-29',
    fullLabel: 'Воскресенье, 29 ноября',
    lessons: [],
  },
];

export const INITIAL_FEED_POSTS: FeedPost[] = [
  {
    id: 'feed-1',
    category: 'college',
    author: 'Учебная часть',
    timeLabel: 'сегодня, 10:42',
    pinned: true,
    body: 'Зимняя сессия начинается 21 декабря. Расписание экзаменов — в файле',
    attachmentLabel: 'raspisanie_sessii_2026.pdf',
  },
  {
    id: 'feed-2',
    category: 'group',
    author: 'Староста · CS-1-24',
    timeLabel: '09:15',
    unread: true,
    body: 'Завтра физкультура в спортзале корпуса Б, форма обязательна',
  },
  {
    id: 'feed-3',
    category: 'event',
    author: 'Событие',
    timeLabel: '5 декабря, 10:00',
    title: 'Хакатон ККС Code Camp',
    body: 'Командный хакатон по веб- и мобильной разработке для студентов 1–3 курсов.',
    eventDate: '5 декабря, 10:00',
    eventLocation: 'Актовый зал',
    spotsTaken: 33,
    spotsTotal: 40,
    goingCount: 56,
    regDeadline: 'Регистрация до 1 декабря',
    isRegistered: false,
    primaryButton: true,
  },
  {
    id: 'feed-4',
    category: 'event',
    author: 'Событие',
    timeLabel: '28 ноября, 15:00',
    title: 'Мастер-класс: Figma для начинающих',
    body: '28 ноября, 15:00 · ауд. 210',
    eventDate: '28 ноября, 15:00',
    eventLocation: 'ауд. 210',
    spotsTaken: 13,
    spotsTotal: 25,
    isRegistered: false,
    primaryButton: false,
  },
  {
    id: 'feed-5',
    category: 'group',
    author: 'Мамытов Б.К. · Веб-программирование',
    timeLabel: 'вчера, 18:20',
    unread: true,
    body: 'Ссылки на макеты в Figma прикрепляйте к заданию до среды, разберём на паре в четверг.',
  },
  {
    id: 'feed-6',
    category: 'college',
    author: 'Библиотека колледжа',
    timeLabel: '19 ноября',
    body: 'Выдача учебников по базам данных и компьютерным сетям на второй семестр открыта в читальном зале до пятницы с 09:00 до 16:30.',
  },
];

export const DEFAULT_LAB4_EXTRA: AssignmentExtra = {
  description:
    'Приведите исходную схему базы данных библиотеки к третьей нормальной форме (3НФ):\n\n' +
    '• Выпишите все атрибуты читателей, книг и выдач в единую ненормализованную таблицу (0НФ).\n' +
    '• Уберите повторяющиеся группы и приведите схему к 1НФ, задав первичный ключ.\n' +
    '• Устраните частичные функциональные зависимости от составного ключа для перехода ко 2НФ.\n' +
    '• Вынесите транзитивные зависимости (издательство, кафедра) в отдельные таблицы и оформите ER-диаграмму до 3НФ.',
  files: [
    { name: 'lab4_zadanie.pdf', size: '312 КБ' },
    { name: 'shablon_otcheta.docx', size: '48 КБ' },
  ],
  verifiedByTeacher: true,
  publishedByText: 'Опубликовала староста · подтвердили 5 одногруппников',
  confusedCount: 9,
  userConfused: false,
  confusedLabel: '9 человек не поняли пункт 3',
  questions: [
    {
      id: 'q-1',
      author: 'Анонимно',
      timeAgo: '2 ч назад',
      text: 'В пункте 3 таблицу издательств нужно связывать с книгой по ID или можно оставить название в таблице книг?',
      replyAuthor: 'Асанова Г.Т.',
      replyRole: 'teacher',
      replyTimeAgo: 'Ответ преподавателя',
      replyText: 'Обязательно по внешнему ключу publisher_id, иначе при изменении названия издательства появятся аномалии обновления.',
    },
    {
      id: 'q-2',
      author: 'Тимур М.',
      timeAgo: '5 ч назад',
      text: 'Отчёт сдавать в PDF или можно прикрепить .docx сразу из шаблона?',
      replyAuthor: 'Староста',
      replyRole: 'leader',
      replyTimeAgo: '4 ч назад',
      replyText: 'Лучше экспортировать в PDF, чтобы таблицы и ER-схема не съехали при проверке.',
    },
  ],
};

export function getFallbackExtraForAssignment(title: string, subject: string): AssignmentExtra {
  if (title.includes('нормализация') || subject === 'Базы данных') {
    return DEFAULT_LAB4_EXTRA;
  }

  if (title.includes('Figma')) {
    return {
      description:
        'Подготовьте интерактивный прототип главного экрана мобильного приложения в Figma:\n\n' +
        '• Используйте сетку 4 колонки и отступы 16px.\n' +
        '• Настройте Auto Layout для всех карточек и списков.\n' +
        '• Прикрепите публичную ссылку на макет перед парой в четверг.',
      files: [{ name: 'figma_checklist.pdf', size: '184 КБ' }],
      verifiedByTeacher: true,
      publishedByText: 'Опубликовала староста · подтвердили 3 одногруппника',
      confusedCount: 3,
      userConfused: false,
      confusedLabel: '3 человека уточнили требования к Auto Layout',
      questions: [
        {
          id: 'q-figma-1',
          author: 'Анонимно',
          timeAgo: '3 ч назад',
          text: 'Нужно делать только светлую тему или тёмную тоже?',
          replyAuthor: 'Мамытов Б.К.',
          replyRole: 'teacher',
          replyTimeAgo: 'Ответ преподавателя',
          replyText: 'Достаточно одной темы, главное — аккуратная типографика и контраст.',
        },
      ],
    };
  }

  return {
    description: `Выполните задание «${title}» по предмету «${subject}» и прикрепите готовый файл до указанного срока.`,
    files: [],
    verifiedByTeacher: false,
    publishedByText: 'Опубликовала староста группы CS-1-24',
    confusedCount: 2,
    userConfused: false,
    confusedLabel: '2 человека задали вопрос по формату сдачи',
    questions: [],
  };
}

const BISHKEK_TZ = 'Asia/Bishkek';

export function getBishkekDateKey(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: BISHKEK_TZ,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(d);
    const y = parts.find((p) => p.type === 'year')?.value;
    const m = parts.find((p) => p.type === 'month')?.value;
    const day = parts.find((p) => p.type === 'day')?.value;
    return `${y}-${m}-${day}`;
  } catch {
    return '';
  }
}

export function formatDueShort(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  const day = new Intl.DateTimeFormat('ru-RU', { timeZone: BISHKEK_TZ, day: 'numeric' }).format(d);
  const monthRaw = new Intl.DateTimeFormat('ru-RU', { timeZone: BISHKEK_TZ, month: 'short' }).format(d);
  const month = monthRaw.replace(/\.$/, '').slice(0, 4) + '.';
  return `${day} ${month}`;
}

export function formatDueFull(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  const datePart = formatDueShort(iso);
  const timePart = new Intl.DateTimeFormat('ru-RU', {
    timeZone: BISHKEK_TZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d);
  return `${datePart}, ${timePart}`;
}

export function formatDueLong(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  const dayMonth = new Intl.DateTimeFormat('ru-RU', {
    timeZone: BISHKEK_TZ,
    day: 'numeric',
    month: 'long',
  }).format(d);
  const timePart = new Intl.DateTimeFormat('ru-RU', {
    timeZone: BISHKEK_TZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d);
  return `${dayMonth}, ${timePart}`;
}

export function formatCountdown(iso: string, detailed = false): { label: string; isUrgent: boolean } {
  const target = new Date(iso).getTime();
  if (Number.isNaN(target)) return { label: '', isUrgent: false };

  const diffMs = target - Date.now();
  if (diffMs <= 0) {
    return { label: 'Срок прошёл', isUrgent: true };
  }

  const totalMinutes = Math.floor(diffMs / 60000);
  const totalHours = Math.floor(totalMinutes / 60);
  const days = Math.floor(totalHours / 24);
  const remHours = totalHours % 24;
  const remMins = totalMinutes % 60;

  if (totalHours < 24) {
    return {
      label: detailed ? `${totalHours} ч ${remMins} мин` : `через ${Math.max(1, totalHours)} ч`,
      isUrgent: true,
    };
  }

  if (days <= 4) {
    return {
      label: detailed ? `${days} дн ${remHours} ч` : `через ${days} дн.`,
      isUrgent: days <= 1,
    };
  }

  return {
    label: formatDueShort(iso),
    isUrgent: false,
  };
}
