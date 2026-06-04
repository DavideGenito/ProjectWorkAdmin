import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin-service';
import { UserService } from '../../services/user-service';
import { User } from '../../models/User';
import { Space } from '../../models/Space';
import { Slots } from '../../models/Slots';

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
    data: new FormControl('', Validators.required),
    spaceId: new FormControl('', Validators.required),
    slotId: new FormControl('', Validators.required),
  });

  listaUtenti: User[] = [];
  spaces: Space[] = [];
  slots: Slots[] = [];

  constructor(private adminService: AdminService, private userService: UserService, private router: Router) { }

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
      error: (err) => console.error('Errore caricamento utenti', err)
    });
  }

  loadSpacesAvailable(date: string) {
    this.adminService.getAvailability(date).subscribe({
      next: (availableSpaces: any) => this.spaces = availableSpaces,
      error: (err) => console.error('Errore caricamento spazi', err)
    });
  }

  loadSlotsAvailable(spaceId: number, date: string) {
    this.adminService.getSlotsAvailable(spaceId, date).subscribe({
      next: (res: any) => {
        this.slots = res.slots
      },
      error: (err) => console.error('Errore caricamento slot', err)
    });
  }

  addBooking() {
    if (this.bookingForm.invalid) return;

    const { utenteId, slotId } = this.bookingForm.value;

    this.adminService.newBooking(Number(utenteId), Number(slotId)).subscribe({
      next: () => {
        this.router.navigate(['/reservations']);
      },
      error: (err) => {
        console.error('Errore nella creazione della prenotazione', err);
      }
    });
  }
}