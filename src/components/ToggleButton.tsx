import { useState } from 'react';

function ToggleButton({
  language,
  isActivate,
  setIsActivate,
}: {
  language: string | null;
  isActivate: boolean;
  setIsActivate: (isActivate: boolean) => void;
}) {
  const [action, setAction] = useState('');

  const handleToggle = () => {
    if (isActivate) {
      setIsActivate(false);
      setAction('animate-toggle-off');
    }
    if (!isActivate) {
      setIsActivate(true);
      setAction('animate-toggle-on');
    }
  };

  return (
    <div
      className={`${isActivate ? 'box-active' : 'box'} top-[25%] w-[10vh] h-[20vh] scale-[90%] rounded-full flex items-center justify-center p-[2px]`}
    >
      <button
        onClick={handleToggle}
        className={`flex justify-center items-start p-[1vh] w-full h-full rounded-full transition-colors duration-400 overflow-hidden ${isActivate ? 'bg-[#00000090]' : 'bg-[#FFFFFF75]'} relative z-10`}
        style={
          {
            '--toggle-container-height': '20vh',
            '--toggle-padding': '3vh',
          } as React.CSSProperties
        }
      >
        <div className={`w-fit flex items-center justify-center my-[0.5vh] ${action} relative`}>
          <img
            src="/en.png"
            alt="toggle button"
            className="block w-[100%] object-contain rounded-full"
            style={{
              boxShadow: '5px 10px 12px rgba(0, 0, 0, 0.15)',
              opacity: isActivate ? 1 : 0,
              transition: 'opacity 300ms ease-in-out',
            }}
          />
          <img
            src={`/${language}.png`}
            alt="toggle button"
            className="block w-[100%] object-contain rounded-full absolute top-0 left-0"
            style={{
              boxShadow: '5px 10px 12px rgba(0, 0, 0, 0.15)',
              opacity: isActivate ? 0 : 1,
              transition: 'opacity 300ms ease-in-out',
            }}
          />
        </div>
      </button>
    </div>
  );
}

export default ToggleButton;
