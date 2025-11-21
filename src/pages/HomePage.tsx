import DriveMood from '../components/DriveMood';
import MonthlyPickle from '../components/MonthlyPickle';
import PicklePick from '../components/PicklePick';
import Category from '../components/Category';
import { useVersion } from '../contexts/VersionContext';
import RecentEpisode from '../components/RecentEpisode';
import LikedChannel from '../components/LikedChannel';

function HomePage() {
  const { isRadioVersion } = useVersion();

  return (
    <div className="pr-28 pt-7">
      {/* 최근 들은 에피소드 */}
      <RecentEpisode />

      {/* 좋아요한 채널 */}
      <LikedChannel />

      {/* P!ckle P!ck */}
      <PicklePick />

      {/* 월간 픽클 */}
      <MonthlyPickle />

      {/* Drive Mood */}
      <DriveMood />

      {/* 라디오 버전인 경우에만 카테고리 섹션 */}
      {isRadioVersion && <Category title={true} type="podcast" />}
    </div>
  );
}

export default HomePage;
