export const mockChannelWithEpisodes = [
  {
    id: 'mbc-fm4u',
    channel: 'MBC FM4U',
    frequency: '91.9MHz',
    imgUrl: '',
    episodes: [
      {
        id: 101,
        imgUrl:
          'https://img.imbc.com/broad/radio/fm4u/perfect/v2/setting/homepage/__icsFiles/afieldfile/2024/10/30/640X360.jpg',
        title: '완벽한 하루 이상순입니다',
        playTime: '15:30',
        totalTime: '45:12',
        isLive: true,
      },
      {
        id: 102,
        imgUrl: '',
        title: '정오의 희망곡 김신영입니다',
        playTime: '00:00',
        totalTime: '55:00',
        isLive: false,
      },
    ],
  },
  {
    id: 'kbs-coolfm',
    channel: 'KBS 쿨FM',
    frequency: '89.1MHz',
    imgUrl: '',
    episodes: [
      {
        id: 201,
        imgUrl: '',
        title: '윤정수 남창희의 미스터 라디오',
        playTime: '15:30',
        totalTime: '45:12',
        isLive: false,
      },
      {
        id: 202,
        imgUrl: '',
        title: '하하의 슈퍼라디오',
        playTime: '25:10',
        totalTime: '50:00',
        isLive: true,
      },
    ],
  },
  {
    id: 'sbs-powerfm',
    channel: 'SBS 파워FM',
    frequency: '107.7 MHz',
    imgUrl: '',
    episodes: [
      {
        id: 301,
        imgUrl: '',
        title: '황제성의 황제파워',
        playTime: '15:30',
        totalTime: '45:12',
        isLive: false,
      },
      {
        id: 302,
        imgUrl: '',
        title: '두시탈출 컬투쇼',
        playTime: '01:30:00',
        totalTime: '01:55:00',
        isLive: true,
      },
    ],
  },
  {
    id: 'cbs-standardfm',
    channel: 'CBS 표준FM',
    frequency: '98.1 MHz',
    imgUrl: '',
    episodes: [
      {
        id: 401,
        imgUrl: '',
        title: '김윤주의 랄랄라',
        playTime: '15:30',
        totalTime: '45:12',
        isLive: false,
      },
      {
        id: 402,
        imgUrl: '',
        title: '최강희의 영화음악',
        playTime: '01:30:00',
        totalTime: '01:55:00',
        isLive: true,
      },
    ],
  },
];

export const mockChannelData = mockChannelWithEpisodes.map((channel) => {
  const liveEpisode = channel.episodes.find((ep) => ep.isLive);

  return {
    id: channel.id,
    imgUrl: channel.imgUrl,
    channelName: channel.channel,
    frequency: channel.frequency,
    liveEpisodeId: liveEpisode?.id,
  };
});
