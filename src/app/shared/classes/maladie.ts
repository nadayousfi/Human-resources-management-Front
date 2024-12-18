import { User } from './user';

export interface Maladie {
  id: number;
  user: User;
  daysRequested: number;
  startDate: string;
  endDate: string;
}
