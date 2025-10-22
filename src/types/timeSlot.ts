import type { Episode } from './episode';

export interface TimeSlotType {
  id: number;
  title: string;
  time_slot: string;
  img_url: string;
  episodes?: Episode[];
}
