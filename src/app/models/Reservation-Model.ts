import { Space } from './Space';
import { User } from './User';

export class ReservationModel {
  user: User = new User('', '', '', 0, false, '');
  start: Date | undefined = new Date();
  end: Date | undefined = new Date();
  slotId: number = 0;
  space: Space = new Space();
  price: number = 0;
  slot?: any;

  getTimeFromDate(date: Date | undefined): string {
  let hours = date?.getHours().toString().padStart(2, '0');
  let minutes = date?.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
  }
}