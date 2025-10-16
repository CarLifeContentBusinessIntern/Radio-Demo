import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import type { TimeSlotType } from '../types/timeSlot';
import CircleViewItem from './CircleViewItem';

function TimeSlot() {
  const navigate = useNavigate();
  const [timeSlots, setTimeSlots] = useState<TimeSlotType[]>([]);

  useEffect(() => {
    async function fetchTimeSlotData() {
      const { data: timeSlotData, error: timeSlotError } = await supabase
        .from('time_slots')
        .select(`*`)
        .order('order', { ascending: true });

      if (timeSlotError) {
        console.log('❌ Error fetching timeSlot data:', timeSlotError.message);
        return;
      }
      setTimeSlots(timeSlotData);
    }
    fetchTimeSlotData();
  }, []);

  return (
    <div>
      <div className="text-2xl mb-7 font-semibold">시간대별 몰아보기</div>
      <div className="grid gap-x-4 gap-y-7 mb-16 px-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {timeSlots.map((item, index) => (
          <CircleViewItem
            key={`${item.id}-${index}`}
            title={item.title}
            subTitle={item.time_slot}
            img={item.img_url}
            onClick={() =>
              navigate(`/episodes/timeslot/${item.id}`, { state: { title: item.title } })
            }
          />
        ))}
      </div>
    </div>
  );
}

export default TimeSlot;
