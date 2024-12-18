import { Etat } from '../services/etat.model';
import { User } from './user';

export interface LeaveHour {
  id: number;
  user: User;
  hoursRequested: number;
  cause: string;
  ett: Etat;
  startHour: string;
  endHour: string;
}
