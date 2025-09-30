import { useState } from "react";
import {
  TbPlayerPlayFilled,
  TbPlayerSkipBackFilled,
  TbPlayerSkipForwardFilled,
  TbPlayerPauseFilled,
} from "react-icons/tb";

type BottomPlayerProps = {
  imgUrl?: string;
  title: string;
  channel: string;
};

const BottomPlayer = ({ imgUrl, title, channel }: BottomPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="w-[1027px] h-[126px] flex items-center gap-[15px] py-[15px] px-[23px] cursor-pointer bg-black">
      <div className="flex-shrink-0">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={title}
            className="w-24 h-24 rounded-[11px] object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-md bg-gray-400"></div>
        )}
      </div>

      <div className="flex flex-col flex-grow min-w-0">
        <div className="font-semibold truncate text-[32px]">{title}</div>
        <div className="text-[28px]">{channel}</div>
      </div>

      <div className="flex gap-x-[105px] mr-10">
        <TbPlayerSkipBackFilled size={30} />

        <div className="relative w-6 h-6">
          <TbPlayerPlayFilled
            size={30}
            className={`absolute left-0 top-0 transition-all duration-300 ease-in-out ${
              isPlaying
                ? "opacity-0 scale-90 pointer-events-none"
                : "opacity-100 scale-100"
            }`}
            onClick={() => setIsPlaying(!isPlaying)}
          />
          <TbPlayerPauseFilled
            size={30}
            className={`absolute left-0 top-0 transition-all duration-300 ease-in-out ${
              isPlaying
                ? "opacity-100 scale-100"
                : "opacity-0 scale-90 pointer-events-none"
            }`}
            onClick={() => setIsPlaying(!isPlaying)}
          />
        </div>

        <TbPlayerSkipForwardFilled size={30} />
      </div>
    </div>
  );
};

export default BottomPlayer;
