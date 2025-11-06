import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import GridViewItem from './GridViewItem';
import { toast } from 'react-toastify';
import type { CategoryType } from '../types/category';

function Category({ title }: { title: boolean }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  //카테고리 조회
  async function fetchCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*, programs(*)')
      .eq('type', 'podcast')
      .order('order', { ascending: true });

    if (error) {
      console.error('Supabase 연결 실패:', error);
    } else {
      setCategories(data);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      {title && <div className="text-2xl mb-7 font-semibold">카테고리</div>}
      <div className="grid gap-x-4 gap-y-7 mb-16 px-1 grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <GridViewItem isLoading={true} key={index} />
            ))
          : categories.map((item) => (
              <GridViewItem
                key={item.id}
                isLoading={false}
                title={item.title}
                img={item.img_url}
                onClick={() => {
                  if (item.programs?.length > 0) {
                    navigate(`/pickle/curation/${item.id}`, {
                      state: { title: item.title },
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
