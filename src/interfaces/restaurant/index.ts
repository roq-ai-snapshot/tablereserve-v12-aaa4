import { ReservationInterface } from 'interfaces/reservation';
import { TableLayoutInterface } from 'interfaces/table-layout';
import { WaiterInterface } from 'interfaces/waiter';
import { OrganizationInterface } from 'interfaces/organization';
import { UserInterface } from 'interfaces/user';

export interface RestaurantInterface {
  id?: string;
  organization_id: string;
  name: string;
  user_id: string;
  created_at?: Date;
  updated_at?: Date;
  reservation?: ReservationInterface[];
  table_layout?: TableLayoutInterface[];
  waiter?: WaiterInterface[];
  organization?: OrganizationInterface;
  user?: UserInterface;
  _count?: {
    reservation?: number;
    table_layout?: number;
    waiter?: number;
  };
}
