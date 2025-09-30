import PickleLogo from "../assets/pickleLogo.svg";
import SearchIcon from "../assets/searchIcon.svg";
import GearIcon from "../assets/gearIcon.svg";
import GridIcon from "../assets/gridIcon.svg";
import BackArrowIcon from "../assets/backArrowIcon.svg";
import { useNavigate } from "react-router-dom";
import type { HeaderType } from "../types";

interface HeaderProps {
  type: HeaderType;
  title?: string;
}

function Header({ type, title }: HeaderProps) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-row justify-between py-4 px-8 bg-black">
      {/* 왼쪽부분 */}
      {type === "home" ? (
        <div className="flex flex-row sm:gap-7 md:gap-11 lg:gap-20">
          <img src={PickleLogo} />
          <div
            className="flex flex-col items-center gap-1 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="bg-gray-600 w-10 h-10" />
            <p className="text-2xl">홈</p>
          </div>
          <div
            className="flex flex-col items-center gap-1 cursor-pointer"
            onClick={() => navigate("/curation")}
          >
            <div className="bg-gray-600 w-10 h-10" />
            <p className="text-2xl">인기채널</p>
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer">
            <div className="bg-gray-600 w-10 h-10" />
            <p className="text-2xl">라디오</p>
          </div>
          <div
            className="flex flex-col items-center gap-1 cursor-pointer"
            onClick={() => navigate("/channels/detail")}
          >
            <div className="bg-gray-600 w-10 h-10" />
            <p className="text-2xl">최근청취</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-row gap-5">
          <img
            src={BackArrowIcon}
            className="cursor-pointer mr-6"
            onClick={() => navigate(-1)}
          />
          <img src={PickleLogo} />
          <p className="text-[32px]">{title}</p>
        </div>
      )}
      {/* 오른쪽 부분 */}
      {["home", "curation"].includes(type) ? (
        <div className="flex flex-row items-center gap-10">
          <img
            src={SearchIcon}
            className="w-8 h-8 cursor-pointer"
            onClick={() => navigate("/search")}
          />
          <img src={GearIcon} className="w-9 h-9 cursor-pointer" />
          <img src={GridIcon} className="w-7 h-7 cursor-pointer" />
        </div>
      ) : null}
    </div>
  );
}

export default Header;
