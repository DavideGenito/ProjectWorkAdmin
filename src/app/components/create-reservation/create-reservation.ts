import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin-service';

@Component({
  selector: 'app-create-reservation',
  templateUrl: './create-reservation.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./create-reservation.css'],
})
export class CreateReservation {
  prenotazione = {
    utenteId: '',
    tipoPostazione: '',
    data: '',
    slotOrario: '',
  };

  listaUtenti: Array<{ id: number; nome: string; cognome: string }> = [];
  slotOrariSala: string[] = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  constructor(private service: AdminService) {}

  addBooking() {
    const uid = Number(this.prenotazione.utenteId);
    const slotId = Number(this.prenotazione.slotOrario || 0);
    this.service.newBooking(uid, slotId);
  }

  onTipoPostazioneChange() {
    if (this.prenotazione.tipoPostazione !== 'sala_riunioni') {
      this.prenotazione.slotOrario = '';
    }
  }
}
