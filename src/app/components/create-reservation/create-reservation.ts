import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin-service';
import { User } from '../../models/User';
import { UserService } from '../../services/user-service';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-create-reservation',
  templateUrl: './create-reservation.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./create-reservation.css'],
})
export class CreateReservation implements OnInit {
  prenotazione = {
    utenteId: '',
    tipoPostazione: '',
    data: '',
    slotOrario: '',
  };

  listaUtenti: User[] = [];
  slotOrariSala: string[] = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  constructor(private service: AdminService,private userService: UserService, private cd: ChangeDetectorRef, private router: Router) {}

  ngOnInit() {
    this.loadUsers();
  }

  addBooking() {
    const uid = Number(this.prenotazione.utenteId);
    const slotId = 1

    this.service.newBooking(uid, slotId).subscribe({
      next: () => {
        this.router.navigate(['/reservations']);
      },
      error: (err) => {
        console.error('Errore nella creazione della prenotazione', err);
      }
    });
  }

  onTipoPostazioneChange() {
    if (this.prenotazione.tipoPostazione !== 'sala_riunioni') {
      this.prenotazione.slotOrario = '';
    }
  }
  loadUsers() {
    this.userService.VisualizzaUtenti().subscribe(users => this.listaUtenti = users)
    this.cd.detectChanges();
  }
}
