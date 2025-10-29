import DriveMood from '../components/DriveMood';
import MonthlyPickle from '../components/MonthlyPickle';
import PicklePick from '../components/PicklePick';
import Category from '../components/Category';
import { useVersion } from '../contexts/VersionContext';

function HomePage() {
  const { isRadioVersion } = useVersion();

  return (
    <div className="pr-28 pt-7">
      {/* P!ckle P!ck */}
      <PicklePick />

      {/* 월간 픽클 */}
      <MonthlyPickle />

      {/* Drive Mood */}
      <DriveMood />

      {/* 라디오 버전인 경우에만 카테고리 섹션 */}
      {isRadioVersion && <Category />}
    </div>
  );
}

export default HomePage;
