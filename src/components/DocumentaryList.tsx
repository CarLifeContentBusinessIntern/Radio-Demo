import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import GridViewItem from './GridViewItem';
import type { RadioType } from '../types/radio';
import type { ThemeType } from '../types/theme';

interface DocumentaryInterface {
  radios: RadioType;
  themes: ThemeType;
}

function DocumentaryList() {
  const [documentaries, setDocumentaries] = useState<DocumentaryInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  //인기 라디오 조회
  async function fetchDoucumentaries() {
    const { data, error } = await supabase
      .from('radio_themes')
      .select(
        `
      radios(*, channels(*)),
      themes!inner(*)
    `
      )
      .eq('themes.id', 6);

    if (error) {
      console.error('Supabase 연결 실패:', error);
      setIsLoading(false);
    } else {
      setDocumentaries(data as unknown as DocumentaryInterface[]);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchDoucumentaries();
  }, []);

  return (
    <>
      <div className="text-2xl mb-7 font-semibold">라디오 다큐멘터리</div>
      <div className="grid gap-x-4 gap-y-7 mb-16 px-1 grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <GridViewItem isLoading={true} key={index} />
            ))
          : documentaries.map((item) => (
              <GridViewItem
                key={item.radios.id}
                title={item.radios.title}
                subTitle={`${item.radios.channels?.broadcasting} ${item.radios.channels?.channel ? item.radios.channels?.channel : ''}`}
                img={item.radios.img_url}
              />
            ))}
      </div>
    </>
  );
}

export default DocumentaryList;
