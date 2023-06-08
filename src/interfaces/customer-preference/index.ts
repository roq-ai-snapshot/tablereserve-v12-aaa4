import { ReservationInterface } from 'interfaces/reservation';

export interface CustomerPreferenceInterface {
  id?: string;
  reservation_id: string;
  preference_name: string;
  preference_value: string;
  created_at?: Date;
  updated_at?: Date;

  reservation?: ReservationInterface;
  _count?: {};
}
