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
  const milestones = [0, 25, 50, 75, 100];

  return (
    <div className="w-[90%] pt-4 ml-auto">
      <div className="relative pb-8">
        <div className="relative h-2 rounded-lg bg-[#3D3D3D]">
          <div
            className="absolute h-2 rounded-lg bg-[#B978FF]"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute top-0 w-full h-2 opacity-0 cursor-pointer"
        />

        <div className="absolute top-0 w-full h-2 pointer-events-none">
          {milestones.map((milestone) => {
            const milestonePercentage = milestone;
            const isActive = value >= milestone;
            const isCurrent = Math.abs(value - milestone) < 5;

            return (
              <div
                key={milestone}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                style={{ left: `${milestonePercentage}%` }}
              >
                <div
                  className={`rounded-full border-2 ${
                    isCurrent
                      ? 'w-6 h-6 border-[#B978FF] bg-[#B978FF]'
                      : isActive
                        ? 'w-4 h-4 border-[#B978FF] bg-[#B978FF]'
                        : 'w-4 h-4 border-[#3D3D3D] bg-[#3D3D3D]'
                  }`}
                />
              </div>
            );
          })}
        </div>

        <div className="relative mt-4 text-sm text-gray-400">
          {milestones.map((milestone) => (
            <span
              key={milestone}
              className="absolute -translate-x-1/2"
              style={{ left: `${milestone}%` }}
            >
              {milestone}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PreferenceSlider;
