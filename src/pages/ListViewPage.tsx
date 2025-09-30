import ListViewItem from "../components/ListViewItem";

export const mockData = [
  {
    id: 1,
    imgUrl: "https://picsum.photos/id/10/112/112",
    title: "첫 번째 아이템: 모든 데이터가 완벽하게 들어간 일반적인 케이스",
    channel: "React 컴포넌트 월드",
    playTime: "15:30",
    totalTime: "45:12",
  },
  {
    id: 2,
    // imgUrl을 일부러 생략하여 플레이스홀더가 잘 나오는지 확인
    title: "두 번째 아이템: 썸네일 이미지가 없는 경우",
    channel: "Tailwind CSS 마스터",
    playTime: "01:10",
    totalTime: "10:05",
  },
  {
    id: 3,
    imgUrl: "https://picsum.photos/id/20/112/112",
    title:
      "세 번째 아이템은 제목이 아주 아주 아주 아주 길어서 말줄임표(truncate)가 정상적으로 표시되는지 확인하기 위한 것입니다.",
    channel: "정말 정말 긴 채널명을 가진 방송국 채널",
    // playTime을 생략하여 전체 시간만 표시되는지 확인
    totalTime: "01:12:30",
  },
  {
    id: 4,
    imgUrl: "https://picsum.photos/id/30/112/112",
    title: "네 번째 아이템: 심플한 데이터",
    channel: "Vite 개발 채널",
    playTime: "00:00",
    totalTime: "22:40",
  },
  {
    id: 5,
    title: "오늘은 뭐 듣지?",
    channel: "P!CKLE",
    playTime: "00:00",
    totalTime: "22:40",
  },
  {
    id: 6,
    imgUrl: "https://picsum.photos/id/10/112/112",
    title: "첫 번째 아이템: 모든 데이터가 완벽하게 들어간 일반적인 케이스",
    channel: "React 컴포넌트 월드",
    playTime: "15:30",
    totalTime: "45:12",
  },
  {
    id: 7,
    // imgUrl을 일부러 생략하여 플레이스홀더가 잘 나오는지 확인
    title: "두 번째 아이템: 썸네일 이미지가 없는 경우",
    channel: "Tailwind CSS 마스터",
    playTime: "01:10",
    totalTime: "10:05",
  },
  {
    id: 8,
    imgUrl: "https://picsum.photos/id/20/112/112",
    title:
      "세 번째 아이템은 제목이 아주 아주 아주 아주 길어서 말줄임표(truncate)가 정상적으로 표시되는지 확인하기 위한 것입니다.",
    channel: "정말 정말 긴 채널명을 가진 방송국 채널",
    // playTime을 생략하여 전체 시간만 표시되는지 확인
    totalTime: "01:12:30",
  },
  {
    id: 9,
    imgUrl: "https://picsum.photos/id/30/112/112",
    title: "네 번째 아이템: 심플한 데이터",
    channel: "Vite 개발 채널",
    playTime: "00:00",
    totalTime: "22:40",
  },
  {
    id: 10,
    title: "오늘은 뭐 듣지?",
    channel: "P!CKLE",
    playTime: "00:00",
    totalTime: "22:40",
  },
];

function ListViewPage() {
  return (
    <div className="flex flex-col gap-y-1 px-[33px] pb-[126px]">
      {mockData.map((item) => (
        <ListViewItem
          key={item.id}
          imgUrl={item.imgUrl}
          title={item.title}
          channel={item.channel}
          playTime={item.playTime}
          totalTime={item.totalTime}
        />
      ))}
    </div>
  );
}

export default ListViewPage;
