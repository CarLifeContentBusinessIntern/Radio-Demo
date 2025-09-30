import PickleLogo from "../assets/pickleLogo.svg";
import SearchIcon from "../assets/searchIcon.svg";
import GearIcon from "../assets/gearIcon.svg";
import GridIcon from "../assets/gridIcon.svg";
import BackArrowIcon from "../assets/backArrowIcon.svg";
import { useNavigate } from "react-router-dom";
import type { HeaderType } from "../types";
import { IoClose, IoSearch } from "react-icons/io5";
import { useState } from "react";

interface HeaderProps {
  type: HeaderType;
  title?: string;
}

function Header({ type, title }: HeaderProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex flex-row justify-between py-4 px-10 bg-black h-[100px] items-center">
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
          <div className="flex flex-col items-center gap-1 cursor-pointer">
            <div className="bg-gray-600 w-10 h-10" />
            <p className="text-2xl">라디오</p>
          </div>
          <div
            className="flex flex-col items-center gap-1 cursor-pointer"
            onClick={() => navigate("/curation")}
          >
            <div className="bg-gray-600 w-10 h-10" />
            <p className="text-2xl">인기채널</p>
          </div>
          <div
            className="flex flex-col items-center gap-1 cursor-pointer"
            onClick={() => navigate("/channels/detail")}
          >
            <div className="bg-gray-600 w-10 h-10" />
            <p className="text-2xl">최근청취</p>
          </div>
        </div>
      ) : type === "search" ? (
        <div className="flex flex-row gap-5 w-full">
          <img
            src={BackArrowIcon}
            className="cursor-pointer mr-6"
            onClick={() => navigate(-1)}
          />
          <img src={PickleLogo} />
          <div className="relative flex-grow h-[68px] border-4 border-white rounded-2xl flex items-center">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <IoSearch size={30} />
            </div>
            <input
              type="text"
              placeholder="검색어"
              value={searchQuery}
              onChange={handleSearchQuery}
              className="w-full bg-transparent px-14 text-white text-[26px] focus:outline-none"
              autoFocus
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <button onClick={() => setSearchQuery("")}>
                <IoClose size={30} />
              </button>
            </div>
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
      {["home", "curation", "setting"].includes(type) ? (
        <div className="flex flex-row items-center gap-10">
          <img
            src={SearchIcon}
            className="w-8 h-8 cursor-pointer"
            onClick={() => navigate("/search")}
          />
          <img
            src={GearIcon}
            className="w-9 h-9 cursor-pointer"
            onClick={() => navigate("/setting")}
          />
          <img src={GridIcon} className="w-7 h-7 cursor-pointer" />
        </div>
      ) : null}
    </div>
  );
}

export default Header;
