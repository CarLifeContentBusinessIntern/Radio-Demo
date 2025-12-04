import type { ReactNode } from 'react';

interface PreferenceSectionProps {
  question: string;
  children: ReactNode;
}

function PreferenceSection({ question, children }: PreferenceSectionProps) {
  return (
    <div className="flex mb-6 w-full h-fit justify-between items-start">
      <h2 className="text-lg font-medium text-white w-[35%]">{question}</h2>
      <div className="flex flex-wrap justify-end gap-2 w-[60%] h-fit">{children}</div>
    </div>
  );
}

export default PreferenceSection;
