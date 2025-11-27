import type { ReactNode } from 'react';

interface PreferenceSectionProps {
  question: string;
  children: ReactNode;
}

function PreferenceSection({ question, children }: PreferenceSectionProps) {
  return (
    <div className="flex mb-9 w-full h-fit justify-between items-start">
      <h2 className="text-[26px] font-medium text-white w-[35%]">{question}</h2>
      <div className="flex flex-wrap justify-end gap-3 w-[60%] h-fit">{children}</div>
    </div>
  );
}

export default PreferenceSection;
