import { useLocation } from 'react-router-dom';
import GridViewItem from '../components/GridViewItem';
import { useFetchThemePrograms } from '../hooks/useFetchThemePrograms';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

function AudioDramaPage() {
  const location = useLocation();
  const { id } = location.state;
  const { t } = useTranslation();

  const { data, isLoading, error, isError } = useFetchThemePrograms(id);
  if (isError) {
    return (
      <div className="pr-28 pt-3 p-4">
        <div className="text-red-500">에러가 발생했습니다: {error?.message}</div>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="pr-28 pt-3">
        <div className="grid gap-x-4 gap-y-7 mb-16 px-1 grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <GridViewItem isLoading={true} key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (data?.length === 0) {
    return (
      <div className="pr-28 pt-3">
        <div className="grid gap-x-4 gap-y-7 mb-16 px-1 grid-cols-4">
          <div className="col-span-4 text-center text-gray-400">데이터가 없습니다</div>
        </div>
      </div>
    );
  }
  return (
    <div className="pr-20">
      <div className="grid gap-x-4 gap-y-7 mb-16 px-1 grid-cols-4">
        {data?.map((item) => {
          const program = item.programs;
          return (
            <GridViewItem
              key={item.id}
              isLoading={false}
              title={program.title}
              subTitle={program.subtitle}
              img={program.img_url}
              isRounded={false}
              onClick={() => {
                toast.error(t('toast.no-contents'), { toastId: item.id });
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default AudioDramaPage;
