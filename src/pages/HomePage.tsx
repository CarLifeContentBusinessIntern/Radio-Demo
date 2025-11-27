import Category from '../components/Category';
import DriveMood from '../components/DriveMood';
import MonthlyPickle from '../components/MonthlyPickle';
import PickleLiveAndRecent from '../components/PickleLiveAndRecent';
import PicklePick from '../components/PicklePick';
import { useVersion } from '../contexts/VersionContext';
// import LikedChannel from '../components/LikedChannel';

function HomePage() {
  const { isRadioVersion } = useVersion();

  return (
    <div className="pt-7 pr-20">
      {/* 실시간 픽클 및 최근 들은 에피소드 */}
      <PickleLiveAndRecent />

      {/* 좋아요한 채널
      <LikedChannel />
      */}

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
