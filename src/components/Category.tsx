import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { supabase } from '../lib/supabaseClient';
import type { CategoryType } from '../types/category';
import CircleViewItem from './CircleViewItem';
import GridViewItem from './GridViewItem';
import { useTranslation } from 'react-i18next';

interface CategoryInterface {
  title: boolean;
  type: 'podcast' | 'radio';
}

function Category({ title, type }: CategoryInterface) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isKorean = i18n.language === 'ko';

  const { data: categories = [], isLoading } = useQuery<CategoryType[]>({
    queryKey: ['categories', type],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*, programs(*)')
        .eq('type', type)
        .order('order', { ascending: true });

      if (error) {
        console.error('Supabase 연결 실패:', error);
        throw error;
      }

      console.log('cate', data);

      return data as unknown as CategoryType[];
    },
  });

  const ItemComponent = type === 'radio' ? CircleViewItem : GridViewItem;

  return (
    <>
      {title && <div className="text-lg mb-7 font-semibold">{t('sections.category')}</div>}
      <div className="grid gap-x-4 gap-y-7 mb-16 px-1 grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <ItemComponent isLoading={true} key={index} />
            ))
          : categories.map((item) => (
              <ItemComponent
                key={item.id}
                isLoading={false}
                title={isKorean ? item.title : item.en_title || item.title}
                img={item.img_url}
                onClick={() => {
                  if (item.programs?.length > 0) {
                    navigate(`/curation/${item.id}`, {
                      state: { title: item.title, type: `${type}_category` },
                    });
                  } else {
                    toast.error(`콘텐츠 준비 중입니다`, { toastId: item.id });
                  }
                }}
              />
            ))}
      </div>
    </>
  );
}

export default Category;
