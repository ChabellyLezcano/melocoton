import { User } from 'src/app/auth/interfaces/authInterface';
import { Game } from './gameInterface';

export interface ReservationResponse {
  ok: boolean;
  reservations: Reservation[];
  reservation: Reservation;
  msg?: string;
}

export interface Reservation {
  _id: string;
  game: Game;
  user: User;
  status: string;
  code: string;
  date: Date;
  expirationDate?: string;
  rejectionReason?: string;
  endDate?: string;
}
