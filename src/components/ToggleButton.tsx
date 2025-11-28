import { useState } from 'react';

function ToggleButton({
  isActivate,
  setIsActivate,
}: {
  isActivate: boolean;
  setIsActivate: (isActivate: boolean) => void;
}) {
  const [action, setAction] = useState('');
  const [imageSrc, setImageSrc] = useState('/toggle_off.png');

  const handleToggle = () => {
    if (isActivate) {
      setIsActivate(false);
      setAction('animate-toggle-off');
      setTimeout(() => {
        setImageSrc('/toggle_on.png');
      }, 100);
    }
    if (!isActivate) {
      setIsActivate(true);
      setAction('animate-toggle-on');
      setTimeout(() => {
        setImageSrc('/toggle_off.png');
      }, 100);
    }
  };

  return (
    <div className="box top-[25%] w-[10vh] h-[20vh] scale-50 rounded-full flex items-center justify-center">
      <button
        onClick={handleToggle}
        className={`flex justify-center items-start p-[1vh] w-[10vh] h-[20vh] rounded-full transition-colors duration-500 overflow-hidden ${isActivate ? 'bg-[#00000090]' : 'bg-[#FFFFFF75]'} relative z-10`}
        style={
          {
            '--toggle-container-height': '20vh',
            '--toggle-padding': '3vh',
          } as React.CSSProperties
        }
      >
        <div className={`w-fit flex items-center justify-center my-[0.5vh] ${action}`}>
          <img
            src={imageSrc}
            alt="toggle button"
            className="block w-[100%] object-contain rounded-full"
            style={{ boxShadow: '5px 10px 12px rgba(0, 0, 0, 0.15)' }}
          />
        </div>
      </button>
    </div>
  );
}

export default ToggleButton;
