import Lottie, { type LottieRefCurrentProps } from 'lottie-react';
import { useEffect, useRef } from 'react';
import { TbPlayerPauseFilled, TbPlayerPlayFilled } from 'react-icons/tb';
import soundWaveData from '../assets/sound-wave_darkmode.json';
import { usePlayer } from '../contexts/PlayerContext';

const LIVE_STREAM_EPISODE = {
  id: 999999,
  title:
    '[#프리한19] 우리가 잘못 알고 있던 상식들, 모두 알려드림! 🎯 알아두면 쓸모 있는 상식 zip | #티전드',
  subtitle: '차 안의 스튜디오, 지금 ON AIR',
  creator: 'tvN D ENT',
  img_url: '/tvN_channel_logo.png',
  audio_file: 'https://pickle-demo.netlify.app/Live_tgend.mp3',
  audioFile_dubbing: null,
  date: null,
  duration: '0',
  type: 'radio',
  created_at: null,
  program_id: 1,
  order_recent: 0,
  programs: {
    id: 1,
    title: 'tvN D ENT',
    img_url: '/tvN_channel_logo.png',
    is_live: true,
    created_at: null,
    broadcasting_id: 1,
    subtitle: 'Live Streaming',
    type: 'radio',
  },
};

function PickleLivePage() {
  const soundWaveRef = useRef<LottieRefCurrentProps | null>(null);

  const { isPlaying, currentEpisodeData, playEpisode, togglePlayPause } = usePlayer();

  const isThisLivePlaying = isPlaying && currentEpisodeData?.id === LIVE_STREAM_EPISODE.id;

  useEffect(() => {
    playEpisode(LIVE_STREAM_EPISODE.id, true, false, null, null, true);
  }, []);

  useEffect(() => {
    if (soundWaveRef.current && soundWaveData) {
      const lottieInstance = soundWaveRef.current;

      if (isThisLivePlaying) {
        lottieInstance.setSpeed(1);
        lottieInstance.play();
      } else {
        lottieInstance.pause();
      }
    }
  }, [isThisLivePlaying]);

  const handleSoundWaveComplete = () => {
    if (soundWaveRef.current && isThisLivePlaying) {
      soundWaveRef.current.goToAndPlay(0, true);
    }
  };

  const handleToggleLivePlay = () => {
    if (isThisLivePlaying) {
      togglePlayPause();
    } else {
      playEpisode(LIVE_STREAM_EPISODE.id, true, false, null, null, true);
    }
  };

  return (
    <div>
      <div className="flex gap-5 mx-8 ">
        {/* 왼쪽 섹션 */}
        <div className="flex-1">
          {/* 왼쪽 상단 - 제목 */}

          <h2 className="flex items-center gap-3 mb-1 font-medium text-md leading-9">
            <img src="/icn_car.png" alt="Car Icon" className="h-4 object-contain" />
            tvN D ENT와 함께 달리는 중
          </h2>

          {/* 왼쪽 하단 - 라이브 카드 */}
          <div className="rounded-2xl h-52 overflow-hidden" style={{ background: '#38426A' }}>
            <div className="flex h-full">
              <div className="flex flex-col flex-1 justify-between p-5">
                <div className="text-white">
                  <h2 className="mt-2 mb-2 font-medium text-lg leading-tight">
                    {LIVE_STREAM_EPISODE.title}
                  </h2>
                  <h3 className="font-light text-gray-400 text-sm">
                    {LIVE_STREAM_EPISODE.creator}
                  </h3>
                </div>

                {/* 하단 컨트롤 영역 */}
                <div className="flex justify-between items-center mt-3 text-white">
                  <div className="flex items-center gap-4">
                    {/* 재생/일시정지 버튼 */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleLivePlay();
                      }}
                      className="hover:bg-white/10 p-2 rounded transition-colors"
                    >
                      {isPlaying ? (
                        <TbPlayerPauseFilled size={30} />
                      ) : (
                        <TbPlayerPlayFilled size={30} />
                      )}
                    </button>
                  </div>

                  {/* 사운드 웨이브 - Lottie 애니메이션 또는 fallback */}
                  <div className="flex justify-center items-center w-auto h-14">
                    {soundWaveData ? (
                      <Lottie
                        key={`soundwave-${isThisLivePlaying}`}
                        lottieRef={soundWaveRef}
                        animationData={soundWaveData}
                        loop={true}
                        autoplay={isThisLivePlaying}
                        onComplete={handleSoundWaveComplete}
                        style={{ width: '100%', height: '100%' }}
                      />
                    ) : (
                      // Fallback: CSS 애니메이션 사운드 웨이브
                      <div className="flex items-center gap-1">
                        {[...Array(12)].map((_, i) => (
                          <div
                            key={i}
                            className={`bg-white rounded-full w-1 ${
                              isThisLivePlaying ? 'animate-pulse' : ''
                            }`}
                            style={{
                              height: `${Math.random() * 20 + 10}px`,
                              animationDelay: `${i * 0.1}s`,
                              opacity: isThisLivePlaying ? 1 : 0.3,
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 카드 우측 - 이미지 영역 */}
              <div className="relative flex-shrink-0 self-stretch w-52">
                <img
                  src="/tvN_channel_logo.png"
                  alt="tvN Channel Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 섹션 */}
        <div className="w-48">
          {/* 오른쪽 상단 - 제목 */}

          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-medium text-sm leading-9"> 오늘 맥드라이브 어때요?</h2>
            <span className="px-[6px] py-[1px] border border-white rounded-full text-[9px] text-white">
              AD
            </span>
          </div>

          {/* 오른쪽 하단 - 이미지 카드 */}
          <div className="rounded-2xl h-52 overflow-hidden">
            <img
              src="/mcdonald_ad.png"
              alt="McDonald's Drive-thru Advertisement"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* 하단 타임라인 이미지 - 전체 너비 */}
      <div className="-mx-6 mt-4">
        <img src="/live_timeline.png" alt="Live Timeline" className="w-full h-auto object-cover" />
      </div>
    </div>
  );
}

export default PickleLivePage;

export { LIVE_STREAM_EPISODE };
