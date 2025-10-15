import { useNavigate } from 'react-router-dom';
import type { CategoryType } from '../types/category';
import CircleViewItem from './CircleViewItem';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

function Category() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  async function fetchCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('order', { ascending: true });
    if (error) {
      console.error('Supabase 연결 실패:', error);
    } else {
      setCategories(data);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <div className="text-2xl mb-7 font-semibold">카테고리</div>
      <div className="grid gap-x-4 gap-y-7 mb-16 px-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((item) => (
          <CircleViewItem
            key={item.id}
            title={item.title}
            img={item.img_url}
            onClick={() =>
              navigate(`/curation/${item.id}`, {
                state: { title: item.title.replace('/', '・'), type: 'category' },
              })
            }
          />
        ))}
      </div>
    </>
  );
}
export default Category;
