import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useIsEnglish } from '../hooks/useIsEnglish';
import { supabase } from '../lib/supabaseClient';
import type { CategoryType } from '../types/category';
import CircleViewItem from './CircleViewItem';
import GridViewItem from './GridViewItem';

interface CategoryInterface {
  title: boolean;
  type: 'podcast' | 'radio';
}

function Category({ title, type }: CategoryInterface) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isEnglish } = useIsEnglish();

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

      return data as unknown as CategoryType[];
    },
  });

  const ItemComponent = type === 'radio' ? CircleViewItem : GridViewItem;

  return (
    <>
      {title && <div className="text-lg mb-3 font-semibold">{t('sections.category')}</div>}
      <div className="grid gap-x-2 gap-y-7 grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <ItemComponent isLoading={true} key={index} />
            ))
          : categories.map((item) => (
              <ItemComponent
                key={item.id}
                isLoading={false}
                title={isEnglish ? item.en_title || item.title : item.title}
                img={item.img_url}
                onClick={() => {
                  if (item.programs?.length > 0) {
                    navigate(`/curation/${item.id}`, {
                      state: {
                        title: isEnglish ? item.en_title || item.title : item.title,
                        type: `${type}_category`,
                      },
                    });
                  } else {
                    toast.error(t('toast.no-contents'), { toastId: item.id });
                  }
                }}
              />
            ))}
      </div>
    </>
  );
}

export default Category;
