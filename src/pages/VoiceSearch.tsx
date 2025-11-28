import Lottie from 'lottie-react';
import animationData from '../assets/VoiceSearch_new.json';

function VoiceSearch() {
  return (
    <div className="flex flex-col h-full pb-10 justify-center items-center cursor-pointer">
      <Lottie
        animationData={animationData}
        loop
        autoplay
        className="w-full max-w-44 h-auto object-contain"
      />
    </div>
  );
}

export default VoiceSearch;
