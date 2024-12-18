import { Etat } from '../services/etat.model';
import { User } from './user';

export interface Leave {
  id: number;
  user: User;
  daysRequested: number;
  ett: Etat; // PENDING, APPROVED, REJECTED
  startDate: string;
  endDate: string;
}
