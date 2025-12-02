import type { PreferenceQuestion, Translation } from '../types/preference';

export const PREFERENCE_QUESTIONS: PreferenceQuestion[] = [
  {
    id: 'age',
    question: { ko: '연령대를 선택해주세요.', en: 'Please select your age group.' },
    type: 'single',
    options: [
      { label: { ko: '20대', en: '20s' }, value: '20s' },
      { label: { ko: '30대', en: '30s' }, value: '30s' },
      { label: { ko: '40대', en: '40s' }, value: '40s' },
      { label: { ko: '50대', en: '50s' }, value: '50s' },
      { label: { ko: '60대+', en: '60s+' }, value: '60s+' },
    ],
  },
  {
    id: 'genres',
    question: {
      ko: '관심 있는 주제를 선택해주세요.',
      en: 'Please select topics you are interested in.',
    },
    type: 'multiple',
    options: [
      { label: { ko: '영화·드라마', en: 'Movie/Drama' }, value: 'movie_drama' },
      { label: { ko: '경제·투자', en: 'Economy/Investment' }, value: 'economy' },
      { label: { ko: '인문·교양', en: 'Humanities/Culture' }, value: 'humanities' },
      { label: { ko: '언어공부', en: 'Language Study' }, value: 'language' },
      { label: { ko: '키즈', en: 'Kids' }, value: 'kids' },
      { label: { ko: '트렌드', en: 'Trend' }, value: 'trend' },
      { label: { ko: 'ASMR', en: 'ASMR' }, value: 'asmr' },
      { label: { ko: '뮤직', en: 'Music' }, value: 'music' },
      { label: { ko: '시사·정치', en: 'Current affairs·Politics' }, value: 'politics' },
      { label: { ko: '힐링', en: 'Healing' }, value: 'healing' },
      { label: { ko: '뉴스', en: 'News' }, value: 'news' },
      { label: { ko: '일상·토크', en: 'Daily·Talk' }, value: 'daily_talk' },
      { label: { ko: '스포츠', en: 'Sports' }, value: 'sports' },
      { label: { ko: '책', en: 'Books' }, value: 'books' },
      { label: { ko: '미스테리', en: 'Mystery' }, value: 'mystery' },
      { label: { ko: '건강', en: 'Health' }, value: 'health' },
    ],
  },
  {
    id: 'purpose',
    question: {
      ko: '현재 어떤 기분에 어울리는 콘텐츠가 좋나요?',
      en: 'What kind of content suits your current mood?',
    },
    type: 'multiple',
    options: [
      { label: { ko: '기분전환', en: 'Mood Change' }, value: 'mood_change' },
      { label: { ko: '피곤함', en: 'Tired' }, value: 'tired' },
      { label: { ko: '스트레스', en: 'Stress' }, value: 'stress' },
      { label: { ko: '여유로움', en: 'Relaxed' }, value: 'relaxed' },
      { label: { ko: '긴장함', en: 'Tense' }, value: 'tense' },
      { label: { ko: '집중', en: 'Focused' }, value: 'focused' },
      { label: { ko: '호기심', en: 'Curious' }, value: 'curious' },
    ],
  },
  {
    id: 'contentLength',
    question: {
      ko: '어느 정도 길이의 콘텐츠가 편하신가요?',
      en: 'What length of content do you prefer?',
    },
    type: 'multiple',
    options: [
      { label: { ko: '10분 이하', en: 'Under 10 min' }, value: 'under_10' },
      { label: { ko: '10~30분', en: '10 to 30 min' }, value: '10_30' },
      { label: { ko: '30~60분', en: '30 to 60 min' }, value: '30_60' },
      { label: { ko: '60분 이상', en: 'Over 60 min' }, value: 'over_60' },
    ],
  },
  {
    id: 'contentType',
    question: {
      ko: '어떤 콘텐츠 스타일을 더 듣고 싶나요?',
      en: 'What type of content style do you prefer?',
    },
    type: 'multiple',
    options: [
      { label: { ko: '대화형', en: 'Conversation' }, value: 'conversation' },
      { label: { ko: '정보형', en: 'Informational' }, value: 'information' },
      { label: { ko: '스토리형', en: 'Storytelling' }, value: 'story' },
      { label: { ko: '인터뷰형', en: 'Interview' }, value: 'interview' },
    ],
  },
  {
    id: 'mood',
    question: {
      ko: '어떤 상황에서 주로 운전하시나요?',
      en: 'In what situations do you usually drive?',
    },
    type: 'multiple',
    options: [
      { label: { ko: '출퇴근길', en: 'Commute' }, value: 'commute' },
      { label: { ko: '여행 중', en: 'During Travel' }, value: 'travel' },
      { label: { ko: '출장 중', en: 'Business Trip' }, value: 'business' },
      { label: { ko: '드라이브', en: 'Leisure Drive' }, value: 'drive' },
      { label: { ko: '야간 운전', en: 'Night Driving' }, value: 'night' },
      { label: { ko: '초행길', en: 'New/Unfamiliar Route' }, value: 'new_route' },
    ],
  },
  {
    id: 'time',
    question: {
      ko: '주로 어떤 시간대에 운전하시나요?',
      en: 'What time of day do you usually drive?',
    },
    type: 'multiple',
    options: [
      { label: { ko: '아침', en: 'Morning' }, value: 'morning' },
      { label: { ko: '낮', en: 'Daytime' }, value: 'day' },
      { label: { ko: '저녁', en: 'Evening' }, value: 'evening' },
      { label: { ko: '야간', en: 'Night' }, value: 'night' },
      { label: { ko: '새벽', en: 'Dawn/Early Morning' }, value: 'dawn' },
    ],
  },
  {
    id: 'environment',
    question: { ko: '운전 환경은 어떤 편인가요?', en: 'What is your driving environment like?' },
    type: 'multiple',
    options: [
      { label: { ko: '정체가 많아요', en: 'Heavy Traffic' }, value: 'traffic' },
      { label: { ko: '도심 위주', en: 'Mainly City' }, value: 'city' },
      { label: { ko: '고속도로 위주', en: 'Mainly Highway' }, value: 'highway' },
      { label: { ko: '단거리 반복', en: 'Frequent Short Trips' }, value: 'short' },
    ],
  },
  {
    id: 'companion',
    question: { ko: '주로 누구와 함께 운전하시나요?', en: 'Who do you usually drive with?' },
    type: 'multiple',
    options: [
      { label: { ko: '혼자', en: 'Alone' }, value: 'alone' },
      { label: { ko: '친구/지인', en: 'Friend/Acquaintance' }, value: 'friend' },
      { label: { ko: '가족', en: 'Family' }, value: 'family' },
      { label: { ko: '아이', en: 'Child' }, value: 'child' },
      { label: { ko: '반려동물', en: 'Pet' }, value: 'pet' },
    ],
  },
  {
    id: 'diversity',
    question: {
      ko: '해외 콘텐츠 비중을 어떻게 할까요?',
      en: 'What proportion of foreign content would you like?',
    },
    type: 'slider',
    min: 0,
    max: 100,
    step: 25,
  },
];

export const DEFAULT_PREFERENCE_STATE = {
  age: '30s',
  genres: ['movie_drama', 'humanities', 'language', 'trend', 'music', 'daily_talk', 'mystery'],
  purpose: ['tired', 'stress'],
  contentLength: ['10_30', '30_60'],
  contentType: ['conversation', 'story'],
  mood: ['commute'],
  time: ['morning', 'dawn'],
  environment: ['traffic', 'city'],
  companion: ['alone', 'friend', 'pet'],
  diversity: 50,
};

export const MOOD_PREFIX: Record<string, Translation> = {
  mood_change: { ko: '기분전환이 필요한', en: 'Mood-changing' },
  tired: { ko: '피곤한', en: 'Tired' },
  stress: { ko: '스트레스 받은', en: 'Stressed' },
  relaxed: { ko: '여유로운', en: 'Relaxed' },
  tense: { ko: '긴장한', en: 'Tense' },
  focused: { ko: '집중한', en: 'Focused' },
  curious: { ko: '궁금한', en: 'Curious' },
};
