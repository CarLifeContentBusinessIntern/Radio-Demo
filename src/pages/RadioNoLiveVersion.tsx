import RadioCategory from '../components/RadioCategory';
import ChannelList from '../components/ChannelList';
import DocumentaryList from '../components/DocumentaryList';
import PopularRadio from '../components/PopularRadio';
import RadioMix from '../components/RadioMix';
import TimeSlot from '../components/TimeSlot';

function RadioNoLiveVersion() {
  return (
    <div className="pr-28 pt-7">
      {/* 인기채널 */}
      <PopularRadio />

      {/* 라디오 믹스 */}
      <RadioMix />

      {/* 방송사별 라디오 */}
      {/* <ChannelList /> */}

      {/* 시간별 몰아보기 */}
      {/* <TimeSlot /> */}

      {/* 라디오 다큐 */}
      {/* <DocumentaryList /> */}

      {/* 카테고리 */}
      {/* <RadioCategory /> */}
    </div>
  );
}

export default RadioNoLiveVersion;
