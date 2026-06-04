import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../services/admin-service';
import { ReservationModel } from '../../models/Reservation-Model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-reservation',
  imports: [DatePipe],
  templateUrl: './view-reservation.html',
  styleUrl: './view-reservation.css',
})
export class ViewReservation implements OnInit {
  reservation: ReservationModel | undefined

  constructor(private service: AdminService, private route: ActivatedRoute, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    let idParam = this.route.snapshot.paramMap.get('id')
    let bookingId = idParam ? Number(idParam) : NaN;

    if (!isNaN(bookingId)) {
      this.getReservation(bookingId);
    } else {
      idParam;
    }
  }

  getReservation(bookingId: number) {
    this.service.getBooking(bookingId).subscribe(reservation => {
      this.reservation = reservation;
      this.cd.detectChanges()
    })
  }
}
  