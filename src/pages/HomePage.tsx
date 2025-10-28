import DriveMood from '../components/DriveMood';
import MonthlyPickle from '../components/MonthlyPickle';
import PicklePick from '../components/PicklePick';

function HomePage() {
  return (
    <div className="pr-28 pt-7">
      {/* P!ckle P!ck */}
      <PicklePick />

      {/* 월간 픽클 */}
      <MonthlyPickle />

      {/* Drive Mood */}
      <DriveMood />

      {/* 라디오 버전인 경우에만 카테고리 섹션 */}
    </div>
  );
}

export default HomePage;
