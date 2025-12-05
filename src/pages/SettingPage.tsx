import { useNavigate } from 'react-router-dom';
import RightArrowIcon from '../assets/rightArrowIcon.svg';
import { useTranslation } from 'react-i18next';

const profileImage = 'https://pub-a45bc992c0594356a8d32a71510a246b.r2.dev/images/profile.webp';

function SettingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'preference',
      label: t('setting.set-preference'),
      onClick: () =>
        navigate('/setting/preference', { state: { title: t('setting.set-preference') } }),
      showArrow: true,
    },
    {
      id: 'notice',
      label: t('setting.notice'),
      showArrow: true,
    },
    {
      id: 'terms',
      label: t('setting.terms-info'),
      showArrow: true,
    },
    {
      id: 'version',
      label: t('setting.version-info'),
      rightContent: <p className="text-lg font-bold text-white">v.2.0.0</p>,
    },
    {
      id: 'function',
      label: t('setting.setting-function'),
      onClick: () =>
        navigate('/setting/function', { state: { title: t('setting.setting-function') } }),
      showArrow: true,
    },
    {
      id: 'demo',
      label: t('setting.setting-demo'),
      onClick: () => navigate('/setting/demo', { state: { title: t('setting.setting-demo') } }),
      textColor: 'text-gray-400',
    },
    {
      id: 'withdrawal',
      label: t('setting.delete-account'),
      textColor: 'text-gray-400',
      height: 'h-[80px]',
      justify: 'justify-center',
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center bg-gray-800 h-36 pl-16 pr-8">
        <div className="flex items-center">
          <img src={profileImage} className="w-24 h-24 rounded-full mr-7" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <p className="text-xl text-white font-bold">{t('user.name')}</p>
              <p>👑</p>
            </div>
            <p className="text-base text-[#979DA9]">pickle@obigo.com</p>
          </div>
        </div>
        <button className="bg-gray-500 rounded-xl h-16 px-16 flex items-center justify-center cursor-pointer">
          <p className="text-base font-bold">{t('setting.logout')}</p>
        </button>
      </div>

      <div className="px-9">
        {menuItems.map((item, index) => (
          <div key={item.id}>
            <div
              className={`flex px-4 items-center ${item.height || 'h-[90px]'} ${item.justify || 'justify-between'} ${item.textColor || ''} ${item.onClick ? 'cursor-pointer' : ''}`}
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
