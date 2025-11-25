interface PreferenceSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

function PreferenceSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
}: PreferenceSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #2563eb ${percentage}%, #374151 ${percentage}%)`,
          }}
        />
        <div className="flex justify-between mt-2 text-sm text-gray-400">
          <span>{min}</span>
          <span>{value}</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  );
}

export default PreferenceSlider;
