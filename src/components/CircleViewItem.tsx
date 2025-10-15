interface CircleViewItemProps {
  title?: string;
  subTitle?: string;
  img?: string;
  onClick?: () => void;
}

function CircleViewItem({ title, subTitle, img, onClick }: CircleViewItemProps) {
  return (
    <div className="cursor-pointer" onClick={onClick}>
      <img
        src={img}
        className="w-full aspect-square rounded-full mb-4 flex items-center justify-center overflow-hidden"
      />
      <p className="text-[28px] mb-1 px-1 font-semibold truncate">{title}</p>
      <p className="text-[25px] text-gray-400 px-1 truncate">{subTitle}</p>
    </div>
  );
}

export default CircleViewItem;
