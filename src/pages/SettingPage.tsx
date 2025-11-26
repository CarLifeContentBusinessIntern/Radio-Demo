import { useNavigate } from 'react-router-dom';
import RightArrowIcon from '../assets/rightArrowIcon.svg';

function SettingPage() {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'preference',
      label: '취향 관리',
      onClick: () => navigate('/setting/preference', { state: { title: '취향 설정' } }),
      showArrow: true,
    },
    {
      id: 'notice',
      label: '공지사항',
      showArrow: true,
    },
    {
      id: 'terms',
      label: '약관 정보',
      showArrow: true,
    },
    {
      id: 'version',
      label: '버전 정보',
      rightContent: <p className="text-lg font-bold text-white">v.3.0.0</p>,
    },
    {
      id: 'function',
      label: '기능 설정',
      onClick: () => navigate('/setting/function', { state: { title: '기능 설정' } }),
      showArrow: true,
    },
    {
      id: 'demo',
      label: '데모 세팅',
      onClick: () => navigate('/setting/demo', { state: { title: '데모 세팅' } }),
      textColor: 'text-gray-400',
    },
    {
      id: 'withdrawal',
      label: '서비스 탈퇴',
      textColor: 'text-gray-400',
      height: 'h-[120px]',
      justify: 'justify-center',
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center bg-gray-800 h-40 pl-16 pr-8">
        <div className="flex items-center">
          <div className="w-24 h-24 rounded-full bg-gray-300 mr-7" />
          <p className="text-base text-[#979DA9] font-bold">pickle@obigo.com</p>
        </div>
        <button className="bg-gray-500 rounded-xl h-16 px-16 flex items-center justify-center cursor-pointer">
          <p className="text-base font-bold">로그아웃</p>
        </button>
      </div>

      <div className="px-9">
        {menuItems.map((item, index) => (
          <div key={item.id}>
            <div
              className={`flex px-4 items-center ${item.height || 'h-32'} ${item.justify || 'justify-between'} ${item.textColor || ''} ${item.onClick ? 'cursor-pointer' : ''}`}
              onClick={item.onClick}
            >
              <p className="text-lg font-bold text-white">{item.label}</p>
              {item.showArrow && (
                <img src={RightArrowIcon} className="cursor-pointer w-4 h-4" alt="arrow" />
              )}
              {item.rightContent}
            </div>
            {index < menuItems.length - 1 && (
              <div className="border-t border-gray-400 border-[1px] w-full" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SettingPage;
