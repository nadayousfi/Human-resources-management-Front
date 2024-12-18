import { Image } from './image';
import { Leave } from './leave';
import { LeaveHour } from './leave-hour';

export interface User {
  id: number;
  name: string;
  email: string;
  // leaveBalance: number; // Solde de congés
  adresse: string;
  cnr: string;
  role: string[];
  leaveRequests: Leave[];
  leaveHours: LeaveHour[];
  image: Image;
  imageStr: string;
}
