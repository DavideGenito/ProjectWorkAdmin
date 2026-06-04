import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin-service';
import { Router } from '@angular/router';
import { ReservationModel } from '../../models/Reservation-Model';
import { ChangeDetectorRef } from '@angular/core';

type SortColumn = 'userName' | 'userSurname' | 'spaceName' | 'date' | 'time' | 'price';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservations.html',
  styleUrls: ['./reservations.css'],
})
export class Reservations implements OnInit {
  bookings: ReservationModel[] = [];
  fromDate = `${new Date().getFullYear()-100}-${String(new Date().getMonth()).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
  toDate = `${new Date().getFullYear()+100}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
  sortColumn: SortColumn = 'date';
  sortAsc = true;

  constructor(private service: AdminService, private router: Router, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.service.getBookings(this.fromDate, this.toDate).subscribe(
      b => {
        this.bookings = b;
        this.cd.detectChanges();
        console.log(this.bookings);
      }
    );
  }

  formatDateInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  setSort(column: SortColumn) {
    if (this.sortColumn === column) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortColumn = column;
      this.sortAsc = true;
    }
  }

  get sortedBookings() {
    return [...this.bookings].sort((a, b) => {
      const left = this.getSortValue(a);
      const right = this.getSortValue(b);

      if (left === right) {
        return 0;
      }

      const compareResult =
        typeof left === 'number' && typeof right === 'number'
          ? left - right
          : String(left).localeCompare(String(right), 'it', { numeric: true, sensitivity: 'base' });

      return this.sortAsc ? compareResult : -compareResult;
    });
  }

  getSortValue(booking: any): string | number {
    switch (this.sortColumn) {
      case 'userName':
        return this.getUserName(booking).toLowerCase();
      case 'userSurname':
        return this.getUserSurname(booking).toLowerCase();
      case 'spaceName':
        return this.getSpaceName(booking).toLowerCase();
      case 'date':
        return new Date(this.getDateValue(booking)).getTime() || 0;
      case 'price':
        return this.getPrice(booking);
      default:
        return '';
    }
  }

  getUserName(booking: any): string {
    return (
      booking?.user?.firstName ||
      ''
    );
  }

  getUserSurname(booking: any): string {
    return (
      booking?.user?.lastName ||
      ''
    );
  }

  getSpaceName(booking: any): string {
    return (
      booking?.slot?.space?.name ||
      ''
    );
  }

  getDateValue(booking: any): string {
    const value = booking?.start
    if (!value) {
      return '';
    }

    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? String(value) : parsed.toISOString().split('T')[0];
  }

  getPrice(booking: any): number {
    const price = booking?.price ?? booking?.amount ?? booking?.slot?.price ?? booking?.cost;
    return Number(price) || 0;
  }

  cancelReservation(booking: any) {
    const slotId = booking?.id
    if (!slotId) {
      return;
    }

    this.service.removeBooking(slotId).subscribe({
      next: () => this.loadBookings(),
      error: (err) => {
        console.error(err);
      },
    });
  }

  goCreate() {
    this.router.navigate(['/reservations/new']);
  }

  viewDetails(booking: any) { 
    this.router.navigate(['/reservations/view/', booking.id]);
  }
}
