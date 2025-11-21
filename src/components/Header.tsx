import { useMemo, useState } from 'react';
import { FaAngleDown } from 'react-icons/fa6';
import { IoClose, IoSearch } from 'react-icons/io5';
import { RiPlayListFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import BackArrowIcon from '../assets/backArrowIcon.svg';
import GearIcon from '../assets/gearIcon.svg';
import GridIcon from '../assets/gridIcon.svg';
import CategoryIcon from '../assets/ic_category.svg';
import HomeIcon from '../assets/ic_home.svg';
import PopularIcon from '../assets/ic_popular.svg';
import RadioIcon from '../assets/ic_radio.png';
import RecentIcon from '../assets/ic_recent.svg';
import PickleLogo from '../assets/pickleLogo.svg';
import SearchIcon from '../assets/searchIcon.svg';
import { usePlayer } from '../contexts/PlayerContext';
import { useVersion } from '../contexts/VersionContext';
import { supabase } from '../lib/supabaseClient';
import type { HeaderType } from '../types';

// 홈 헤더
const HomeHeader = () => {
  const navigate = useNavigate();
  const { isRadioVersion } = useVersion();
  const navLinks = useMemo(
    () => [
      { name: '홈', path: '/', icon: HomeIcon },
      isRadioVersion === true
        ? { name: '라디오', path: '/category-radio', icon: RadioIcon }
        : { name: '카테고리', path: '/category-radio', icon: CategoryIcon },
      {
        name: '인기채널',
        path: '/popular',
        icon: PopularIcon,
      },
      {
        name: '최근청취',
        path: '/episodes/recent',
        icon: RecentIcon,
      },
    ],
    [isRadioVersion]
  );

  return (
    <div className="flex flex-row justify-between items-center w-full">
      {/* 왼쪽 전체 네비게이션 */}
      <div className="flex flex-row items-center gap-4 sm:gap-7 md:gap-11 lg:gap-20">
        {/* 로고 */}
        <button className="flex-shrink-0">
          <img src={PickleLogo} alt="Pickle Logo" />
        </button>

        {/* 네비게이션 버튼들 */}
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;

          return (
            <button
              key={link.name}
              className={`flex flex-col items-center gap-1 transition-opacity pt-2 group ${
                isActive ? 'opacity-100' : 'opacity-60'
              }`}
              onClick={() => navigate(link.path)}
            >
              {link.icon ? (
                <img
                  src={link.icon}
                  alt={link.name}
                  className="h-6 sm:h-7 md:h-8 lg:h-9 w-auto transition-all "
                />
              ) : (
                <div className="bg-gray-600 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9" />
              )}
              <p className="text-xs sm:text-sm md:text-lg lg:text-2xl whitespace-nowrap transition-all ">
                {link.name}
              </p>
            </button>
          );
        })}
      </div>

      {/* 오른쪽 액션 영역 */}
      <RightActions />
    </div>
  );
};

// 검색 헤더
const SearchHeader = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex flex-row w-full items-center">
      <button onClick={() => navigate(-1)} className="pr-11">
        <img src={BackArrowIcon} alt="Back" />
      </button>
      <img src={PickleLogo} alt="Pickle Logo" className="pr-5" />
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
        {searchQuery && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <button onClick={() => setSearchQuery('')}>
              <IoClose size={30} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// 서브 페이지 헤더 (뒤로가기, 타이틀)
const SubPageHeader = ({ title, isPlayer }: { title?: string; isPlayer?: boolean }) => {
  const navigate = useNavigate();
  const { togglePlaylist, isPlaylistOpen, isOpenChannelList, currentEpisodeData } = usePlayer();
  const [isLiked, setIsLiked] = useState(currentEpisodeData?.programs?.is_liked ?? false);

  const handleClickLike = async () => {
    if (!currentEpisodeData?.programs?.id) return;

    const programId = currentEpisodeData.programs.id;
    const newIsLiked = !isLiked;

    setIsLiked(newIsLiked);

    const { error } = await supabase
      .from('programs')
      .update({ is_liked: newIsLiked })
      .eq('id', programId);

    if (error) {
      console.error('좋아요 업데이트 실패:', error);
      setIsLiked(!newIsLiked);
    }
  };

  return (
    <div className="flex flex-row justify-between items-center w-full z-30">
      <div className="flex flex-row items-center">
        <button onClick={() => navigate(-1)} className="pr-11">
          {isPlayer ? <FaAngleDown size={30} /> : <img src={BackArrowIcon} alt="Back" />}
        </button>
        <img src={PickleLogo} alt="Pickle Logo" className="pr-5" />
        <p className="text-[32px] whitespace-pre mr-6">{title}</p>
        {isPlayer && isOpenChannelList && (
          <button
            className={`rounded-full px-4 py-3 flex gap-4 items-center border text-lg font-normal transition-colors ${
              isLiked ? 'border-red-500 bg-red-500/10' : 'border-[#8C8C8C]'
            }`}
            onClick={handleClickLike}
          >
            <img src="/favorite.png" alt="좋아요" className="w-8 h-8" />
            {isLiked ? '좋아요 취소' : '좋아요'}
          </button>
        )}
      </div>
      {isPlayer ? (
        <button className="cursor-pointer" onClick={togglePlaylist}>
          <div
            className={`w-12 h-12 flex items-center justify-center ${isPlaylistOpen ? 'rounded-full bg-white' : ''}`}
          >
            <RiPlayListFill size={30} color={isPlaylistOpen ? 'black' : 'white'} />
          </div>
        </button>
      ) : (
        <RightActions />
      )}
    </div>
  );
};

// 오른쪽 액션 아이콘 그룹
const RightActions = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-row items-center gap-10">
      <button onClick={() => navigate('/search')}>
        <img src={SearchIcon} alt="Search" className="w-8 h-8" />
      </button>
      <button onClick={() => navigate('/setting')}>
        <img src={GearIcon} alt="Settings" className="w-9 h-9" />
      </button>
      <button>
        <img src={GridIcon} alt="More" className="w-7 h-7" />
      </button>
    </div>
  );
};

interface HeaderProps {
  type: HeaderType;
  title?: string;
  isPlayer?: boolean;
}

function Header({ type, title, isPlayer }: HeaderProps) {
  const renderHeader = () => {
    switch (type) {
      case 'home':
      case 'radio':
        return <HomeHeader />;
      case 'search':
        return <SearchHeader />;
      default:
        return <SubPageHeader title={title} isPlayer={isPlayer} />;
    }
  };

  return <div className="flex py-4 px-10 h-[100px] items-center">{renderHeader()}</div>;
}

export default Header;
