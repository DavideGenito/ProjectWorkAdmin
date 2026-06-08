import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminService } from '../../services/admin-service';
import { ReservationModel } from '../../models/Reservation-Model';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-reservation',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './view-reservation.html',
  styleUrl: './view-reservation.css',
})
export class ViewReservation implements OnInit {
  reservation: ReservationModel | undefined

  constructor(private service: AdminService, private route: ActivatedRoute, private cd: ChangeDetectorRef, private router: Router) {}

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

  BackToReservations()
  {
    this.router.navigate(['/reservations']);
  } 
}
  