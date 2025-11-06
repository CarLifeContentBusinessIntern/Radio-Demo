import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSection } from '../hooks/useSection';
import CircleViewItem from './CircleViewItem';

function TimeSlot() {
  const navigate = useNavigate();
  // const [timeSlots, setTimeSlots] = useState<TimeSlotType[]>([]);
  // const [isLoading, setIsLoading] = useState(true);

  const { data: sectionData, isLoading } = useSection(8);

  // useEffect(() => {
  //   async function fetchTimeSlotData() {
  //     const { data: timeSlotData, error: timeSlotError } = await supabase
  //       .from('time_slots')
  //       .select(`*, episodes(*)`)
  //       .order('order', { ascending: true });

  //     if (timeSlotError) {
  //       console.log('❌ Error fetching timeSlot data:', timeSlotError.message);
  //       setIsLoading(false);
  //       return;
  //     }
  //     setTimeSlots(timeSlotData);
  //     setIsLoading(false);
  //   }
  //   fetchTimeSlotData();
  // }, []);

  return (
    <div>
      <div className="text-2xl mb-7 font-semibold">시간대별 몰아보기</div>
      <div className="grid gap-x-4 gap-y-7 mb-16 px-1 grid-cols-4">
        {' '}
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <CircleViewItem isLoading={true} key={index} />
            ))
          : sectionData.map((item, index) => (
              <CircleViewItem
                key={`${item.id}-${index}`}
                title={item.title}
                subTitle={item.subtitle}
                img={item.img_url}
                onClick={() => {
                  if (item.has_episodes) {
                    navigate(`/episodes/timeslot/${item.id}`, { state: { title: item.title } });
                  } else {
                    toast.error(`콘텐츠 준비 중입니다`, { toastId: item.id });
                  }
                }}
              />
            ))}
      </div>
    </div>
  );
}

export default TimeSlot;
