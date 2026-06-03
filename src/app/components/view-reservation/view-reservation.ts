import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../services/admin-service';
import { ReservationModel } from '../../models/Reservation-Model';

@Component({
  selector: 'app-view-reservation',
  imports: [],
  templateUrl: './view-reservation.html',
  styleUrl: './view-reservation.css',
})
export class ViewReservation implements OnInit {
  reservation: ReservationModel | undefined;

  constructor(private service: AdminService, private route: ActivatedRoute) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const bookingId = idParam ? Number(idParam) : NaN;

    if (!isNaN(bookingId)) {
      this.getReservation(bookingId);
    } else {
      console.error('Booking id non valido:', idParam);
    }
  }

  getReservation(bookingId: number) {
    this.service.getBooking(bookingId).subscribe({
      next: (reservation) => {
        this.reservation = reservation;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
  