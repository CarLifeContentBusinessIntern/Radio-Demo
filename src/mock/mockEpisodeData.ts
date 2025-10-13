import { mockChannelWithEpisodes } from './mockChannelData';

export const mockEpisodeData = [
  {
    id: 101,
    imgUrl: 'https://picsum.photos/id/10/200/200',
    title: '완벽한 하루 이상순입니다',
    channel: 'MBC FM4U',
    playTime: '15:30',
    totalTime: '45:12',
  },
  {
    id: 201,
    imgUrl: '',
    title: '윤정수 남창희의 미스터 라디오',
    channel: 'KBS 쿨FM',
    playTime: '15:30',
    totalTime: '45:12',
  },
  {
    id: 301,
    imgUrl: '',
    title: '황제성의 황제파워',
    channel: 'SBS 파워FM',
    playTime: '15:30',
    totalTime: '45:12',
  },
  {
    id: 103,
    imgUrl: '',
    title: '뉴스(14:00)',
    channel: 'MBC 표준FM',
    playTime: '15:30',
    totalTime: '45:12',
  },
  {
    id: 104,
    imgUrl: '',
    title: '이본의 라라랜드',
    channel: 'KBS HappyFM',
    playTime: '15:30',
    totalTime: '45:12',
  },
  {
    id: 202,
    imgUrl: '',
    title: '하하의 슈퍼라디오',
    channel: 'KBS 쿨FM',
    playTime: '15:30',
    totalTime: '45:12',
  },
  {
    id: 302,
    imgUrl: '',
    title: '두시탈출 컬투쇼',
    channel: 'SBS 파워FM',
    playTime: '15:30',
    totalTime: '45:12',
  },
  {
    id: 102,
    imgUrl: '',
    title: '정오의 희망곡 김신영입니다',
    channel: 'MBC FM4U',
    playTime: '00:00',
    totalTime: '55:00',
  },
  {
    id: 401,
    imgUrl: '',
    title: '김윤주의 랄랄라',
    channel: 'CBS 표준FM',
    playTime: '15:30',
    totalTime: '45:12',
  },
  {
    id: 402,
    imgUrl: '',
    title: '최강희의 영화음악',
    channel: 'CBS 표준FM',
    playTime: '01:30:00',
    totalTime: '01:55:00',
  },
];

export const mockLiveEpisodesData = mockChannelWithEpisodes.flatMap((channel) =>
  channel.episodes
    .filter((episode) => episode.isLive)
    .map((episode) => ({
      id: episode.id,
      imgUrl: episode.imgUrl,
      title: episode.title,
      channelName: channel.channel,
    }))
);
