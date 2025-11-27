import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import RadioIcon from '../assets/ic_radio.svg';
import RecentIcon from '../assets/ic_recent.svg';
import PickleLogo from '../assets/pickle_logo.png';
import SearchIcon from '../assets/searchIcon.svg';
import { usePlayer } from '../contexts/PlayerContext';
import { useVersion } from '../contexts/VersionContext';
import type { HeaderType } from '../types';
import CountryToggle from './CountryToggle';

// 홈 헤더
const HomeHeader = () => {
  const navigate = useNavigate();
  const { isRadioVersion } = useVersion();
  const { t, i18n } = useTranslation();

  const navLinks = useMemo(
    () => [
      { name: t('header.home'), path: '/', icon: HomeIcon },
      isRadioVersion === true
        ? { name: t('header.radio'), path: '/category-radio', icon: RadioIcon }
        : { name: t('header.category'), path: '/category-radio', icon: CategoryIcon },
      {
        name: t('header.recent'),
        path: '/episodes/recent',
        icon: RecentIcon,
      },
      {
        name: t('header.ai-pick'),
        path: '/ai-pick',
        icon: PopularIcon,
      },
    ],
    [isRadioVersion, t, i18n.language]
  );

  return (
    <div className="flex flex-row justify-between items-center w-full">
      {/* 왼쪽 전체 네비게이션 */}
      <div className="flex flex-row items-center gap-8 h-14">
        {/* 로고 */}
        <button className="flex-shrink-0">
          <img src={PickleLogo} alt="Pickle Logo" className="w-7 h-7" />
        </button>

        {/* 네비게이션 버튼들 */}
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;

          return (
            <button
              key={link.name}
              className={`flex flex-col items-center gap-1 transition-opacity pt-1 group ${
                isActive ? 'opacity-100' : 'opacity-60'
              }`}
              onClick={() => navigate(link.path)}
            >
              {link.icon ? (
                <img src={link.icon} alt={link.name} className="h-6 w-6 transition-all" />
              ) : (
                <div className="bg-gray-600 w-6 h-6" />
              )}
              <p className="text-base whitespace-nowrap transition-all">{link.name}</p>
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
    <div className="flex flex-row w-full items-center gap-5 h-14">
      <button onClick={() => navigate(-1)} className="flex-shrink-0">
        <img src={BackArrowIcon} alt="Back" className="w-6 h-6" />
      </button>
      <img src={PickleLogo} alt="Pickle Logo" className="w-7 h-7 flex-shrink-0" />
      <div className="relative flex-grow h-10 my-2 border-2  border-white rounded-xl flex items-center">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <IoSearch size={24} className="w-7 h-7" />
        </div>
        <input
          type="text"
          placeholder="검색어"
          value={searchQuery}
          onChange={handleSearchQuery}
          className="w-full bg-transparent px-14 text-white text-base focus:outline-none"
          autoFocus
        />
        {searchQuery && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <button onClick={() => setSearchQuery('')}>
              <IoClose size={24} className="sm:w-7 sm:h-7" />
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
  // const location = useLocation();
  // const { id } = useParams<{ id: string }>();
  const { togglePlaylist, isPlaylistOpen } = usePlayer();
  // const [isLiked, setIsLiked] = useState(false);

  // const isLikePage = location.pathname.startsWith('/like/');
  // const programId = isLikePage && id ? parseInt(id, 10) : null;

  // useEffect(() => {
  //   if (!programId) return;

  //   async function fetchLikeStatus() {
  //     const { data, error } = await supabase
  //       .from('programs')
  //       .select('is_liked')
  //       .eq('id', programId)
  //       .single();

  //     if (error) {
  //       console.error('좋아요 상태 조회 실패:', error);
  //     } else if (data) {
  //       setIsLiked(data.is_liked ?? false);
  //     }
  //   }

  //   fetchLikeStatus();
  // }, [programId]);

  // const handleClickLike = async () => {
  //   if (!programId) return;

  //   const newIsLiked = !isLiked;
  //   setIsLiked(newIsLiked);

  //   const { error } = await supabase
  //     .from('programs')
  //     .update({ is_liked: newIsLiked })
  //     .eq('id', programId);

  //   if (error) {
  //     console.error('좋아요 업데이트 실패:', error);
  //     setIsLiked(!newIsLiked);
  //   }
  // };

  return (
    <div className="flex flex-row justify-between items-center w-full z-40 h-14">
      <div className="flex flex-row items-center gap-5">
        <button onClick={() => navigate(-1)} className="flex-shrink-0">
          {isPlayer ? (
            <FaAngleDown size={24} className="sm:w-7 sm:h-7" />
          ) : (
            <img src={BackArrowIcon} alt="Back" className="w-6 h-6" />
          )}
        </button>
        <img src={PickleLogo} alt="Pickle Logo" className="w-7 h-7 flex-shrink-0" />
        <p className="text-base whitespace-pre">{title}</p>
        {/* {isLikePage && (
          <button
            className="rounded-full p-[2px] bg-gradient-to-tr from-[#3B3B3B] to-[#8C8C8C] flex-shrink-0"
            onClick={handleClickLike}
          >
            <div className="rounded-full px-3 sm:px-4 py-2 flex gap-2 items-center text-sm sm:text-base md:text-lg font-medium bg-[#1B1B1B]">
              <img
                src={isLiked ? '/favorite.png' : '/nonfavorite.png'}
                alt="좋아요"
                className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
              />
              좋아요
            </div>
          </button>
        )} */}
      </div>
      {isPlayer ? (
        <button className="cursor-pointer flex-shrink-0" onClick={togglePlaylist}>
          <div
            className={`w-7 h-7 flex items-center justify-center ${isPlaylistOpen ? 'rounded-full bg-white' : ''}`}
          >
            <RiPlayListFill size={16} color={isPlaylistOpen ? 'black' : 'white'} />
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
    <div className="flex flex-row items-center gap-6 flex-shrink-0">
      <button onClick={() => navigate('/search')}>
        <img src={SearchIcon} alt="Search" className="w-6 h-6" />
      </button>
      <CountryToggle />
      <button onClick={() => navigate('/setting')}>
        <img src={GearIcon} alt="Settings" className="w-6 h-6" />
      </button>
      <button>
        <img src={GridIcon} alt="More" className="w-6 h-6" />
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

  return <div className="flex py-1 px-6 items-center">{renderHeader()}</div>;
}

export default Header;
