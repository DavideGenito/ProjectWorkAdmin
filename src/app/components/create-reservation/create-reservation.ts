import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin-service';
import { UserService } from '../../services/user-service';
import { User } from '../../models/User';
import { Space } from '../../models/Space';
import { Slots } from '../../models/Slots';
import { ErrorService } from '../../services/error-service';
import { minDateValidator } from '../../models/min-date.validator';

@Component({
  selector: 'app-create-reservation',
  templateUrl: './create-reservation.html',
  styleUrls: ['./create-reservation.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class CreateReservation implements OnInit {

  bookingForm = new FormGroup({
    utenteId: new FormControl('', Validators.required),
    data: new FormControl('', [Validators.required, minDateValidator(new Date())]),
    spaceId: new FormControl('', Validators.required),
    slotId: new FormControl('', Validators.required),
  });

  listaUtenti: User[] = [];
  spaces: Space[] = [];
  slots: Slots[] = [];

  constructor(
    private adminService: AdminService, 
    private userService: UserService, 
    private router: Router,
    private errorService: ErrorService
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.setupFormValueChanges();
  }

  private setupFormValueChanges() {
    this.bookingForm.get('data')?.valueChanges.subscribe(date => {
      this.bookingForm.get('spaceId')?.reset('', { emitEvent: false });
      this.bookingForm.get('slotId')?.reset('', { emitEvent: false });
      this.slots = [];

      if (date) {
        this.loadSpacesAvailable(date);
      } else {
        this.spaces = [];
      }
    });

    this.bookingForm.get('spaceId')?.valueChanges.subscribe(spaceId => {
      this.bookingForm.get('slotId')?.reset('', { emitEvent: false });
      const currentDate = this.bookingForm.get('data')?.value;

      if (spaceId && currentDate) {
        this.loadSlotsAvailable(Number(spaceId), currentDate);
      } else {
        this.slots = [];
      }
    });
  }

  loadUsers() {
    this.userService.VisualizzaUtenti().subscribe({
      next: (users) => this.listaUtenti = users,
      error: (err) => this.errorService.error("Errore nel caricamento di tutti gli user" ,'Errore caricamento utenti ' + err)
    });
  }

  loadSpacesAvailable(date: string) {
    this.adminService.getAvailability(date).subscribe({
      next: (availableSpaces: any) => {
        this.spaces = availableSpaces;
      },
      error: (err) => this.errorService.error("Errore caricamento spazi disponibili", 'Errore caricamento spazi ' + err)
    });
  }

  loadSlotsAvailable(spaceId: number, date: string) {
    this.adminService.getSlotsAvailable(spaceId, date).subscribe({
      next: (res: any) => {
        this.slots = res.slots || res; 
      },
      error: (err) => this.errorService.error("Errore caricamento degli slot disponibili" ,'Errore caricamento slot ' + err)
    });
  }

  addBooking() {
    if (this.bookingForm.invalid) return;

    const { utenteId, slotId } = this.bookingForm.value;

    this.adminService.newBooking(Number(utenteId), Number(slotId)).subscribe({
      next: () => {
        this.errorService.success("Prenotazione creata con successo");
        this.router.navigate(['/reservations']);
      },
      error: (err) => {
        this.errorService.error("Errore nella creazione della prenotazione",'Errore nella creazione della prenotazione ' + err);
      }
    });
  }
}