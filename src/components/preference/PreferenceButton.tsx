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
        px-4 py-2 rounded-lg transition-all duration-200
        ${
          selected
            ? 'bg-blue-600 text-white border-2 border-blue-600'
            : 'bg-gray-800 text-gray-300 border-2 border-gray-700 hover:border-gray-600'
        }
      `}
    >
      {label}
    </button>
  );
}

export default PreferenceButton;
