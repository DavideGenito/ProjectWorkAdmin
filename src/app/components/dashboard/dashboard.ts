import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin-service';
import { ReservationModel } from '../../models/Reservation-Model';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ErrorService } from '../../services/error-service';
import { Space } from '../../models/Space';
import { Slots } from '../../models/Slots';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  constructor(
    private userService: UserService,
    private adminService: AdminService,
    private errorService: ErrorService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getAllUsers();
    this.getTodayReservation();
    this.getRecentReservations();
    this.getSpaceState();
  }

  numberUsers: number = 0;
  recentUsers: any[] = [];
  recentReservations: any[] = [];
  reservationsToday: ReservationModel[] = [];
  todayRevenue: number = 0;
  spaces: any[] = [];
  availabilityList: any[] = [];
  revenueBySpace: { id: number, name: string, totalRevenue: number }[] = [];

  formatDateInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getAllUsers() {
    this.userService.VisualizzaUtenti().subscribe({
      next: (utenti) => {
        this.recentUsers = utenti
          .sort((a, b) => b.id - a.id)
          .slice(0, 3)
          .map((user) => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName
          }));

        this.numberUsers = utenti.length;
        this.cd.detectChanges();
      },
      error: (err: HttpErrorResponse) => this.errorService.error("Errore nel recupero degli utenti", err.message)
    });
  }

  getTodayReservation() {
    const oggi = new Date();
    const dataFormattata = this.formatDateInput(oggi);

    this.adminService.getBookings(dataFormattata, dataFormattata).subscribe({
      next: (res) => {
        this.reservationsToday = res;
        this.getTodayRevenue();
        this.cd.detectChanges();
      },
      error: (err: HttpErrorResponse) => this.errorService.error("Errore nel recupero delle prenotazioni odierne", err.message)
    });
  }

  getTodayRevenue() {
    this.todayRevenue = 0;

    const groupedSpaces: { [key: number]: { id: number, name: string, totalRevenue: number } } = {};

    this.reservationsToday.forEach((res) => {
      if (res.space && res.space.slotPrice) {
        this.todayRevenue += res.space.slotPrice;

        const spaceId = res.space.id;

        if (!groupedSpaces[spaceId]) {
          groupedSpaces[spaceId] = {
            id: spaceId,
            name: res.space.name || 'N/A',
            totalRevenue: 0
          };
        }

        groupedSpaces[spaceId].totalRevenue += res.space.slotPrice;
      }
    });

    this.revenueBySpace = Object.values(groupedSpaces)
      .sort((a, b) => a.id - b.id);
  }

  getRecentReservations() {
    let toDate = new Date();
    toDate.setFullYear(toDate.getFullYear() + 100);

    this.adminService.getBookings(this.formatDateInput(new Date()), this.formatDateInput(toDate)).subscribe({
      next: (res) => {
        this.recentReservations = res
          .sort((a, b) => b.id - a.id)
          .slice(0, 3)
          .map((item: ReservationModel) => ({
            date: item.start,
            nameSpace: item.space.name || 'N/A',
            nameUser: item.user.firstName + ' ' + item.user.lastName || 'N/A',
          }));

        this.cd.detectChanges();
      },
      error: (err: HttpErrorResponse) => this.errorService.error("Errore nel recupero delle prenotazioni recenti", err.message)
    });
  }

  getSpaceState() {
    this.adminService.getAvailability(this.formatDateInput(new Date())).subscribe({
      next: (res: any) => {
        this.spaces = res.map((item: any) => ({
          id: item.id,
          slots: item.slots,
          name: item.name
        }));

        let todayHour = new Date().getHours();

        this.spaces.forEach((item: any) => {
          let available = true;
          item.slots.forEach((slot: any) => {
            let start = new Date(slot.start);
            let end = new Date(slot.end);
            let startHour = start.getHours();
            let endHour = end.getHours();

            if (todayHour >= startHour && todayHour < endHour) {
              available = slot.available;
            }
          });

          this.availabilityList.push({
            id: item.id,
            name: item.name,
            available: available
          });
        });

        this.cd.detectChanges();
      },
      error: (err: HttpErrorResponse) => this.errorService.error("Errore nel recupero degli spazi", err.message)
    });
  }
}