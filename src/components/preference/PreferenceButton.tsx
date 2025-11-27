interface PreferenceButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

function PreferenceButton({ label, selected, onClick }: PreferenceButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-10 py-5 rounded-[10px] transition-all duration-300 text-md leading-none font-bold
        ${selected ? 'bg-[#B978FF] text-[#232323]' : 'bg-[#232323] text-[#9CA3AF]'}
      `}
    >
      {label}
    </button>
  );
}

export default PreferenceButton;
