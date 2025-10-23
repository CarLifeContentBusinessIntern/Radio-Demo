import LiveRadio from '../components/LiveRadio';
import Category from '../components/Category';
import ChannelList from '../components/ChannelList';
import RadioMix from '../components/RadioMix';
import TimeSlot from '../components/TimeSlot';
import DocumentaryList from '../components/DocumentaryList';
// import LiveChannel from '../components/LiveChannel';

function RadioLiveVersion() {
  return (
    <div className="pr-28 pt-7">
      {/* ON-AIR */}
      <LiveRadio />

      {/* 라디오 믹스 */}
      <RadioMix />

      {/* 방송사별 라디오 */}
      <ChannelList />

      {/* 방송사별 생방송 */}
      {/* <LiveChannel /> */}

      {/* 라디오 다큐 */}
      <DocumentaryList />

      {/* 카테고리 */}
      <Category />

      {/* 시간별 몰아보기 */}
      <TimeSlot />
    </div>
  );
}

export default RadioLiveVersion;
