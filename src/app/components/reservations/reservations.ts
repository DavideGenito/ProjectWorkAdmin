import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin-service';

type SortColumn = 'userName' | 'userSurname' | 'spaceName' | 'date' | 'time' | 'price';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservations.html',
  styleUrls: ['./reservations.css'],
})
export class Reservations implements OnInit {
  bookings: any[] = [];
  fromDate = this.formatDateInput(new Date(Date.now()));
  toDate = this.formatDateInput(new Date());
  sortColumn: SortColumn = 'date';
  sortAsc = true;

  constructor(private service: AdminService) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {

    this.service.getBookings(new Date(this.fromDate), new Date(this.toDate)).subscribe({
      next: (data) => {
        this.bookings = Array.isArray(data) ? data : [];
      },
      error: (err) => {
        console.error(err);
      },
    });
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
    const slotId = booking?.slotId || booking?.id || booking?.bookingId;
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
}
