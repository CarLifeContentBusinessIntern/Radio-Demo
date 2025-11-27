import Category from '../components/Category';
import ChannelList from '../components/ChannelList';
import DocumentaryList from '../components/DocumentaryList';
import LiveRadio from '../components/LiveRadio';
import RadioMix from '../components/RadioMix';
import TimeSlot from '../components/TimeSlot';
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

      {/* 시간별 몰아보기 */}
      <TimeSlot />

      {/* 카테고리 */}
      <Category type="radio" title={true} />
    </div>
  );
}

export default RadioLiveVersion;
