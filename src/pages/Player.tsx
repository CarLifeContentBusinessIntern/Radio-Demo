import { useParams } from "react-router-dom";
import { mockEpisodeData } from "../mock/mockEpisodeData";
import { RiForward15Fill, RiReplay15Fill } from "react-icons/ri";
import { useEffect, useState } from "react";
import speedIcon from "../assets/speedIcon.svg";
import {
  TbPlayerPauseFilled,
  TbPlayerPlayFilled,
  TbPlayerSkipBackFilled,
  TbPlayerSkipForwardFilled,
} from "react-icons/tb";
import { IoEllipsisVertical } from "react-icons/io5";

function Player() {
  const { id } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(2712);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const intervalId = setInterval(() => {
      setCurrentTime((prevTime) => {
        if (prevTime >= duration) {
          setIsPlaying(false);
          return duration;
        }
        return prevTime + 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isPlaying, duration]);

  if (!id) return;
  const episodeData = mockEpisodeData.find(
    (item) => item.id === parseInt(id, 10)
  );
  if (!episodeData) return;

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(Number(e.target.value));
  };

  const handleSkip = (seconds: number) => {
    setCurrentTime((prevTime) =>
      Math.max(0, Math.min(duration, prevTime + seconds))
    );
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col justify-center items-center h-full gap-[103px]">
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-[52px] w-[80%] max-w-[1025px] max-h-56">
        <div className="flex-shrink-0">
          {episodeData.imgUrl ? (
            <img
              src={episodeData.imgUrl}
              alt={episodeData.title}
              className="w-40 h-40 md:w-56 md:h-56 object-cover"
            />
          ) : (
            <div className="w-40 h-40 md:w-56 md:h-56 bg-gray-400"></div>
          )}
        </div>

        <div className="flex flex-col justify-between h-full text-center md:text-left">
          <p className="text-2xl md:text-5xl line-clamp-2">
            {episodeData.title}
          </p>
          <p className="text-xl md:text-4xl text-[#A6A6A9]">
            {episodeData.channel}
          </p>
          <p className="text-lg md:text-3xl text-[#A6A6A9]">
            {formatTime(currentTime)} / {formatTime(duration)}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-20 w-full w-[80%] max-w-[1025px]">
        <div className="flex flex-col items-center gap-5">
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-white rounded-lg appearance-none cursor-pointer range-sm"
          />

          <div className="flex justify-between w-full w-[60%] max-w-[507px]">
            <button onClick={() => handleSkip(-15)}>
              <RiReplay15Fill size={30} />
            </button>
            <button onClick={() => handleSkip(15)}>
              <RiForward15Fill size={30} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-16">
          <button>
            <img src={speedIcon} />
            <p className="text-[12px]">1.0x</p>
          </button>
          <button>
            <TbPlayerSkipBackFilled size={30} />
          </button>
          <button onClick={togglePlayPause}>
            {isPlaying ? (
              <TbPlayerPauseFilled size={30} />
            ) : (
              <TbPlayerPlayFilled size={30} />
            )}
          </button>
          <button>
            <TbPlayerSkipForwardFilled size={30} />
          </button>
          <button className="text-gray-400">
            <IoEllipsisVertical size={30} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Player;
