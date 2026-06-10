import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin-service';
import { Router } from '@angular/router';
import { ReservationModel } from '../../models/Reservation-Model';
import { minDateValidator } from '../../models/min-date.validator';
import { ErrorService } from '../../services/error-service';
import { HttpErrorResponse } from '@angular/common/http';

type SortColumn = 'id' | 'date' | 'spaceName' | 'userName';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reservations.html',
  styleUrls: ['./reservations.css'],
})
export class Reservations implements OnInit {
  bookings: ReservationModel[] = [];
  sortedBookings: ReservationModel[] = [];

  searchControl = new FormControl('');

  sortKey: SortColumn = 'date';
  sortDirection: 'asc' | 'desc' = 'asc';

  fromDate = new FormControl('');
  toDate = new FormControl('', minDateValidator(new Date(this.fromDate.value ? this.fromDate.value : new Date())));

  dateForm = new FormGroup({
    fromDate: this.fromDate,
    toDate: this.toDate,
  });

  constructor(private service: AdminService, private router: Router, private cd: ChangeDetectorRef, private errorService: ErrorService) { }

  ngOnInit() {
    let fromDate = new Date();
    fromDate.setFullYear(fromDate.getFullYear());

    let toDate = new Date();
    toDate.setFullYear(toDate.getFullYear() + 100);

    this.dateForm.controls.fromDate.setValue(this.formatDateInput(fromDate));
    this.dateForm.controls.toDate.setValue(this.formatDateInput(toDate));

    this.loadBookings();

    this.searchControl.valueChanges.subscribe(() => {
      this.applyFilterAndSort();
    });
  }

  loadBookings() {
    const from = this.dateForm.value.fromDate;
    const to = this.dateForm.value.toDate;

    if (from && to) {
      this.service.getBookings(from, to).subscribe({
        next: (b) => {
          this.bookings = b;
          this.applyFilterAndSort();
          this.cd.detectChanges();
        },
        error: (err: HttpErrorResponse) => this.errorService.error("Errore nel caricamento delle prenotazioni", err.message)
      });
    }
  }

  clearSearch() {
    this.searchControl.setValue('');
  }

  sortBy(key: SortColumn) {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
    this.applyFilterAndSort();
  }

  applyFilterAndSort() {
    let filtered = [...this.bookings];
    const searchText = this.searchControl.value;

    if (this.dateForm.invalid) {
      this.errorService.warn("Date non valide", "Date non valide");
      return;
    }

    if (searchText && searchText.trim() !== '') {
      const search = searchText.toLowerCase().trim();
      filtered = filtered.filter(b => {
        const firstName = (b.user.firstName || '').toLowerCase();
        const lastName = (b.user.lastName || '').toLowerCase();
        const fullName = `${firstName} ${lastName}`;
        return firstName.includes(search) || lastName.includes(search) || fullName.includes(search);
      });
    }

    const key = this.sortKey;
    const isAsc = this.sortDirection === 'asc';

    this.sortedBookings = filtered.sort((a, b) => {
      const valA = this.getSortValue(a, key);
      const valB = this.getSortValue(b, key);

      if (typeof valA === 'string' && typeof valB === 'string') {
        return isAsc ? valA.localeCompare(valB, 'it') : valB.localeCompare(valA, 'it');
      }

      if (valA < valB) return isAsc ? -1 : 1;
      if (valA > valB) return isAsc ? 1 : -1;
      return 0;
    });
  }

  private getSortValue(booking: ReservationModel, key: SortColumn): string | number {
    switch (key) {
      case 'id':
        return Number(booking.id) || 0;
      case 'date':
        const dateVal = booking.start;
        return dateVal ? new Date(dateVal).getTime() : 0;
      case 'spaceName':
        return (booking.space.name).toLowerCase();
      case 'userName':
        const first = booking.user.firstName;
        const last = booking.user.lastName;
        return `${first} ${last}`.toLowerCase().trim();
      default:
        return '';
    }
  }

  formatDateInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  cancelReservation(booking: ReservationModel) {
    const slotId = booking.id;
    if (!slotId) return;

    this.service.removeBooking(slotId).subscribe({
      next: () => {
        this.loadBookings();
        this.errorService.success("Prenotazione cancellata con successo");
      },
      error: (err: HttpErrorResponse) => this.errorService.error("Errore nel cancellare la prenotazione", err.message),
    });
  }

  goCreate() {
    this.router.navigate(['/reservations/new']);
  }

  viewDetails(booking: ReservationModel) {
    this.router.navigate(['/reservations/view/', booking.id]);
  }
}