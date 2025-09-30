import CircleViewItem from "../components/CircleViewItem";
import GridViewItem from "../components/GridViewItem";

function Home() {
  return (
    <>
      <div className="px-28 pt-3">
        <div className="text-2xl mb-7 ">추천 기획전</div>
        <div className="grid gap-4 mb-7 px-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <GridViewItem title="TED 큐레이션" subTitle="P!CKLE P!CK" />
          <GridViewItem title="어떻게 살아야 하나" subTitle="P!CKLE P!CK" />
          <GridViewItem title="이동 중인 당신에게" subTitle="P!CKLE P!CK" />
          <GridViewItem
            title="작은 실천, 나를 위한 건강"
            subTitle="P!CKLE P!CK"
          />
        </div>
        <div className="text-2xl mb-7">월간 픽클</div>
        <div className="grid gap-4 mb-7 px-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <CircleViewItem title="월간 6월 호" subTitle="P!CKLE CTO P!CK" />
          <CircleViewItem title="월간 5월 호" subTitle="P!CKLE CEO P!CK 👑" />
          <CircleViewItem
            title="월간 4월 호"
            subTitle="P!CKLE  CURATOR HARPER P!CK"
          />
          <CircleViewItem title="월간 3월 호" subTitle="P!CKLE  PD YENA P!CK" />
        </div>
        <div className="text-2xl mb-7">드라이브 MOOD</div>
        <div className="grid gap-4 mb-7 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <GridViewItem
            title="막히는 길 위에서"
            subTitle="#출근길 #정보교양 "
          />
          <GridViewItem title="캠핑 중, 쉬러갑니다" subTitle="#캠핑중 #예능 " />
          <GridViewItem title="댕댕이와 함께" subTitle="#ASMR" />
          <GridViewItem title="퇴근하겠습니다! " subTitle="#힐링" />
        </div>
      </div>
    </>
  );
}

export default Home;
