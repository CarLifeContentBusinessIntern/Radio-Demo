import { useNavigate } from 'react-router-dom';
import RightArrowIcon from '../assets/rightArrowIcon.svg';

function SettingPage() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-between items-center bg-gray-800 h-60 pl-16 pr-8">
        <div className="flex items-center">
          <div className="w-[106px] h-[106px] rounded-full bg-gray-300 mr-7" />
          <div>
            <p className="text-[32px] text-gray-400">이름</p>
            <p className="text-[32px] text-white font-bold">pickle_sound@obigo.com</p>
          </div>
        </div>
        <div className="bg-gray-500 rounded-3xl w-[312px] h-24 flex items-center justify-center cursor-pointer">
          <p className="text-[42px]">로그아웃</p>
        </div>
      </div>

      <div className="px-9">
        <div
          className="flex px-4 items-center h-[170px] justify-between cursor-pointer"
          onClick={() => navigate('/setting/preference', { state: { title: '취향 설정' } })}
        >
          <p className="text-[42px]">취향 관리</p>
          <img src={RightArrowIcon} className="cursor-pointer" />
        </div>

        <div className="border-t border-gray-400 border-[1px] w-full" />

        <div className="flex px-4 items-center h-[170px] justify-between cursor-pointer">
          <p className="text-[42px]">공지사항</p>
          <img src={RightArrowIcon} className="cursor-pointer" />
        </div>

        <div className="border-t border-gray-400 border-[1px] w-full" />

        <div className="flex px-4 items-center h-[170px] justify-between cursor-pointer">
          <p className="text-[42px]">약관 정보</p>
          <img src={RightArrowIcon} className="cursor-pointer" />
        </div>

        <div className="border-t border-gray-400 border-[1px] w-full" />

        <div className="flex px-4 items-center h-[170px] justify-between">
          <p className="text-[42px]">버전 정보</p>
          <p className="text-[42px]">v.3.0.0</p>
        </div>

        <div className="border-t border-gray-400 border-[1px] w-full" />

        <div
          className="flex px-4 items-center h-[170px] justify-between cursor-pointer"
          onClick={() => navigate('/setting/function', { state: { title: '기능 설정' } })}
        >
          <p className="text-[42px]">기능 설정</p>
          <img src={RightArrowIcon} className="cursor-pointer" />
        </div>

        <div className="border-t border-gray-400 border-[1px] w-full" />

        <div
          className="flex px-4 items-center h-[170px] justify-between text-gray-400 cursor-pointer"
          onClick={() => navigate('/setting/demo', { state: { title: '데모 세팅' } })}
        >
          <p className="text-[42px]">데모 세팅</p>
        </div>

        <div className="border-t border-gray-400 border-[1px] w-full" />

        <div className="flex px-4 items-center h-[120px] justify-center text-gray-400 cursor-pointer">
          <p className="text-[42px]">서비스 탈퇴</p>
        </div>
      </div>
    </div>
  );
}

export default SettingPage;
