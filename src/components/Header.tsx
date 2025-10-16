import { useState } from 'react';
import { IoClose, IoSearch } from 'react-icons/io5';
import { RiPlayListFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import BackArrowIcon from '../assets/backArrowIcon.svg';
import GearIcon from '../assets/gearIcon.svg';
import GridIcon from '../assets/gridIcon.svg';
import PickleLogo from '../assets/pickleLogo.svg';
import SearchIcon from '../assets/searchIcon.svg';
import type { HeaderType } from '../types';
import RadioIcon from '../assets/ic_radio.png';

const navLinks = [
  { name: '홈', path: '/', icon: '' },
  { name: '라디오', path: '/radio', icon: RadioIcon },
  {
    name: '인기채널',
    path: '/curation/1',
    state: { type: 'channel', title: '인기 채널' },
    icon: '',
  },
  { name: '최근청취', path: '/episodes/channel/11', state: { title: '최근 청취' }, icon: '' },
];

// 홈 헤더
const HomeHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-row justify-between items-center w-full">
      <div className="flex flex-row items-center sm:gap-7 md:gap-11 lg:gap-20">
        <button>
          <img src={PickleLogo} alt="Pickle Logo" />
        </button>
        {navLinks.map((link) => (
          <button
            key={link.name}
            className="flex flex-col items-center gap-1"
            onClick={() => navigate(link.path, { state: link.state })}
          >
            {link.icon ? (
              <img src={link.icon} className="h-10" />
            ) : (
              <div className="bg-gray-600 w-10 h-10" />
            )}
            <p className="text-2xl">{link.name}</p>
          </button>
        ))}
      </div>
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
  return (
    <div className="flex flex-row justify-between items-center w-full">
      <div className="flex flex-row items-center">
        <button onClick={() => navigate(-1)} className="pr-11">
          <img src={BackArrowIcon} alt="Back" />
        </button>
        <img src={PickleLogo} alt="Pickle Logo" className="pr-5" />
        <p className="text-[32px]">{title}</p>
      </div>
      {isPlayer ? (
        <button className="cursor-pointer">
          <RiPlayListFill size={30} color="white" />
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

  return <div className="flex py-4 px-10 bg-black h-[100px] items-center">{renderHeader()}</div>;
}

export default Header;
