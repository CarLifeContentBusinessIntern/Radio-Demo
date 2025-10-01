import { useNavigate } from "react-router-dom";
import CircleViewItem from "../components/CircleViewItem";
import GridViewItem from "../components/GridViewItem";

function HomeNoLiveVersion() {
const radios = [
  { id: 1, title: "MBC FM4U", subTitle: "91.9 MHz" },
  { id: 2, title: "KBS Happy FM", subTitle: "106.1 MHz" },
  { id: 3, title: "SBS 파워FM", subTitle: "107.7 MHz" },
  { id: 4, title: "CBS 표준FM", subTitle: "98.1 MHz" },
  { id: 5, title: "MBC FM4U", subTitle: "91.9 MHz" },
  { id: 6, title: "KBS Happy FM", subTitle: "106.1 MHz" },
  { id: 7, title: "SBS 파워FM", subTitle: "107.7 MHz" },
  { id: 8, title: "CBS 표준FM", subTitle: "98.1 MHz" },
];

const channels = [
  { id: 1, title: "완벽한 하루 이상순입니다", subTitle: "MBC FM4U" },
  { id: 2, title: "윤정수 남창희의 미스터 라디오", subTitle: "KBS 쿨FM" },
  { id: 3, title: "황제성의 황제파워", subTitle: "SBS 파워FM" },
  { id: 4, title: "뉴스(14:00)", subTitle: "MBC 표준FM" },
  { id: 5, title: "이본의 라라랜드", subTitle: "MBC FM4U" },
  { id: 6, title: "하하의 슈퍼라디오", subTitle: "KBS 쿨FM" },
  { id: 7, title: "두시탈출 컬투쇼", subTitle: "SBS 파워FM" },
  { id: 8, title: "더보기", subTitle: "더보기" },
  { id: 9, title: "완벽한 하루 이상순입니다", subTitle: "MBC FM4U" },
  { id: 10, title: "윤정수 남창희의 미스터 라디오", subTitle: "KBS 쿨FM" },
  { id: 11, title: "황제성의 황제파워", subTitle: "SBS 파워FM" },
  { id: 12, title: "뉴스(14:00)", subTitle: "MBC 표준FM" },
  { id: 13, title: "이본의 라라랜드", subTitle: "MBC FM4U" },
  { id: 14, title: "하하의 슈퍼라디오", subTitle: "KBS 쿨FM" },
  { id: 15, title: "두시탈출 컬투쇼", subTitle: "SBS 파워FM" },
  { id: 16, title: "더보기", subTitle: "더보기" },
];

const categories = [
  { id: 1, title: "세상을 브리핑하다", subTitle: "뉴스 / 시사" },
  { id: 2, title: "비즈니스 인사이트", subTitle: "비즈니스" },
  { id: 3, title: "한귀로 듣고 웃어요", subTitle: "엔터테인먼트" },
  { id: 4, title: "삶의 지혜", subTitle: "교양 / 라이프스타일" },
  { id: 5, title: "세상을 브리핑하다", subTitle: "뉴스 / 시사" },
  { id: 6, title: "비즈니스 인사이트", subTitle: "비즈니스" },
  { id: 7, title: "한귀로 듣고 웃어요", subTitle: "엔터테인먼트" },
  { id: 8, title: "삶의 지혜", subTitle: "교양 / 라이프스타일" },
];


  const navigate=useNavigate();
  return <div className="pr-28 pt-7">
        <div className="text-2xl mb-7 ">방송사별 라디오</div>
        <div className="grid gap-x-4 gap-y-7 mb-16 px-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {radios.map((item)=>(
            <CircleViewItem key={item.id} title={item.title} subTitle={item.subTitle} onClick={()=>navigate(`/curation/${item.id}`)} />
          ))}
        </div>
        <div className="text-2xl mb-7">인기 채널</div>
        <div className="grid gap-x-4 gap-y-7 mb-16 px-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {channels.map((item)=>
            <GridViewItem key={item.id} title={item.title} subTitle={item.subTitle} onClick={()=>navigate(`/channels/detail/${item.id}`)}/>
          )}
        </div>
        <div className="text-2xl mb-7">카테고리</div>
        <div className="grid gap-x-4 gap-y-7 mb-16 px-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((item)=>(
                      <CircleViewItem key={item.id} title={item.title} subTitle={item.subTitle} onClick={()=>navigate(`/curation/${item.id}`)}  />
          ))}
        </div>
      </div> 
}

export default HomeNoLiveVersion;
