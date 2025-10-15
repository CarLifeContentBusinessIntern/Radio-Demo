import { useEffect, useState } from 'react';
import type { timeSlot } from '../types/timeSlot';
import { supabase } from '../lib/supabaseClient';
import CircleViewItem from './CircleViewItem';
import { useNavigate } from 'react-router-dom';

function TimeSlot() {
  const navigate = useNavigate();
  const [timeSlot, setTimeSlot] = useState<timeSlot[]>([]);

  useEffect(() => {
    async function fetchTimeSlotData() {
      const { data: timeSlotData, error: timeSlotError } = await supabase
        .from('time_slots')
        .select(`*`)
        .order('id', { ascending: true });

      if (timeSlotError) {
        console.log('❌ Error fetching timeSlot data:', timeSlotError.message);
        return;
      }
      setTimeSlot(timeSlotData);
    }
    fetchTimeSlotData();
  }, []);

  return (
    <div>
      <div className="text-2xl mb-7 font-semibold">시간별 몰아보기</div>
      <div className="grid gap-x-4 gap-y-7 mb-16 px-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {timeSlot.map((item, index) => (
          <CircleViewItem
            key={`${item.id}-${index}`}
            title={item.title}
            subTitle={item.time_slot}
            img={item.img_url}
            onClick={() => navigate(`/episodes/timeslot/${item.id}`)}
          />
        ))}
      </div>
    </div>
  );
}

export default TimeSlot;
