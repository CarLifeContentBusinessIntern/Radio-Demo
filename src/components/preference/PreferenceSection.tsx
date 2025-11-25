import type { ReactNode } from 'react';

interface PreferenceSectionProps {
  question: string;
  children: ReactNode;
}

function PreferenceSection({ question, children }: PreferenceSectionProps) {
  return (
    <div className="mb-12">
      <h2 className="text-lg font-medium text-white mb-4">{question}</h2>
      <div className="flex flex-wrap gap-3">{children}</div>
    </div>
  );
}

export default PreferenceSection;
