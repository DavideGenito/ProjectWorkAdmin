import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReservationModel } from '../models/Reservation-Model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly host = 'https://pascal2026-434310448117.europe-west12.run.app';

  constructor(private http: HttpClient) {}

  getBookings(from: Date, to: Date): Observable<ReservationModel[]> {
    return this.http.get<ReservationModel []>(`${this.host}/admin/bookings?from=${from.toISOString()}&to=${to.toISOString()}`);
  }

  getBooking(bookingId:number): Observable<ReservationModel> {
    return this.http.get<ReservationModel>(`${this.host}/admin/bookings/${bookingId}`);
  }

  newBooking(uid: number, sId: number) {
    const body = {
      userId: uid,
      slotId: sId,
    };

    return this.http.post(`${this.host}/admin/bookings`, body);
  }

  removeBooking(bookingId: number) {
    return this.http.delete(`${this.host}/admin/bookings/${bookingId}`);
  }

  getUser(id: number) {
    return this.http.get(`${this.host}/admin/users/${id}`);
  }

}
