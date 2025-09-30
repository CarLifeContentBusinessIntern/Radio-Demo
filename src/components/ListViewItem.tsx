type ListViewItemProps = {
  imgUrl?: string;
  title: string;
  subTitle: string;
  playTime?: string;
  totalTime?: string;
};

function ListViewItem({
  imgUrl,
  title,
  subTitle,
  playTime,
  totalTime,
}: ListViewItemProps) {
  return (
    <div className="flex items-center justify-between gap-14 cursor-pointer">
      <div className="flex-shrink-0">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={title}
            className="w-28 h-28 rounded-[11px] object-cover"
          />
        ) : (
          <div className="w-28 h-28 rounded-md bg-gray-400"></div>
        )}
      </div>

      <div className="flex flex-col flex-grow text-[28px] min-w-0">
        <div className="font-semibold truncate">{title}</div>
        <div className="text-[#A6A6A9] truncate">{subTitle}</div>
      </div>

      <div>
        <p className="text-[28px] text-[#A6A6A9] w-[180px] text-right">
          {playTime}
          {totalTime ? ` / ${totalTime}` : ""}
        </p>
      </div>
    </div>
  );
}

export default ListViewItem;
