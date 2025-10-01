interface GridViewItemProps {
  title?: string;
  subTitle?: string;
  onClick?: () => void;
}

function GridViewItem({ title, subTitle, onClick }: GridViewItemProps) {
  return (
    <div className="cursor-pointer" onClick={onClick}>
      <div className="bg-gray-600 w-full aspect-square rounded-[45px] mb-4" />
      <p className="text-[28px] mb-2 px-1 font-semibold truncate">{title}</p>
      <p className="text-[25px] text-gray-400 px-1 truncate">{subTitle}</p>
    </div>
  );
}

export default GridViewItem;
