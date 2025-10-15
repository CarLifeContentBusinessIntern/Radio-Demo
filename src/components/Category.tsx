import { useNavigate } from 'react-router-dom';
import type { CategoryType } from '../types/category';
import CircleViewItem from './CircleViewItem';

interface CategoryProps {
  categories: CategoryType[];
}

function Category({ categories }: CategoryProps) {
  const navigate = useNavigate();
  return (
    <>
      <div className="text-2xl mb-7 font-semibold">카테고리</div>
      <div className="grid gap-x-4 gap-y-7 mb-16 px-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((item) => (
          <CircleViewItem
            key={item.id}
            title={item.title}
            subTitle={item.category}
            img={item.img_url}
            onClick={() => navigate(`/curation/${item.id}`)}
          />
        ))}
      </div>
    </>
  );
}
export default Category;
