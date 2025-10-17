// import { useVersion } from '../contexts/VersionContext';

interface CircleViewItemProps {
  isLoading?: boolean;
  title?: string;
  subTitle?: string;
  img?: string;
  onClick?: () => void;
}

function CircleViewItem({ title, subTitle, img, onClick }: CircleViewItemProps) {
  const trimedTitle = title?.trimEnd();

  //방송사 조건 추가
  // const { isLiveVersion } = useVersion();
  // let finalImg = img;
  // if (isLiveVersion) {
  //   if (trimedTitle === 'MBC') {
  //     finalImg = 'https://radio-web-demo.netlify.app/img/logo/MBC1.png';
  //   } else if (trimedTitle === 'SBS') {
  //     finalImg = 'https://radio-web-demo.netlify.app/img/logo/SBS1.png';
  //   } else if (trimedTitle === 'KBS') {
  //     finalImg = 'https://radio-web-demo.netlify.app/img/logo/KBS1.png';
  //   }
  // } else {
  //   if (trimedTitle === 'MBC') {
  //     finalImg = 'https://radio-web-demo.netlify.app/img/logo/MBC2.png';
  //   } else if (trimedTitle === 'SBS') {
  //     finalImg = 'https://radio-web-demo.netlify.app/img/logo/SBS2.png';
  //   } else if (trimedTitle === 'KBS') {
  //     finalImg = 'https://radio-web-demo.netlify.app/img/logo/KBS2.png';
  //   }
  // }
  return (
    <div className="cursor-pointer" onClick={onClick}>
      <img
        src={img}
        className="w-full aspect-square rounded-full mb-4 flex items-center justify-center overflow-hidden"
      />
      <p className="text-[28px] mb-1 px-1 font-semibold truncate">{trimedTitle}</p>
      <p className="text-[25px] text-gray-400 px-1 truncate">{subTitle}</p>
    </div>
  );
}

export default CircleViewItem;
