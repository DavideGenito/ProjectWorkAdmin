import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly host = 'https://pascal2026-434310448117.europe-west12.run.app';

  constructor(private http: HttpClient) {}

  getBookings(from: Date, to: Date): Observable<any[]> {
    return this.http.get<any[]>(`${this.host}/admin/bookings?from=${from.toISOString()}&to=${to.toISOString()}`);
  }

  getBooking(slotId: number): Observable<any> {
    return this.http.get<any>(`${this.host}/admin/bookings/${slotId}`);
  }

  newBooking(uid: number, sId: number) {
    const body = {
      userId: uid,
      slotId: sId,
    };

    return this.http.post(`${this.host}/admin/bookings`, body);
  }

  removeBooking(slotId: number) {
    return this.http.delete(`${this.host}/admin/bookings/${slotId}`);
  }
}
