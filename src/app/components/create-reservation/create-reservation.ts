import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin-service';
import { User } from '../../models/User';
import { UserService } from '../../services/user-service';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Space } from '../../models/Space';
import { Slots } from '../../models/Slots';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-create-reservation',
  templateUrl: './create-reservation.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  styleUrls: ['./create-reservation.css'],
})
export class CreateReservation implements OnInit {
  select = new FormControl('');
  prenotazione = {
    utenteId: 0,
    tipoPostazione: '',
    postazione: '',
    data: '',
    slotOrario: '',
  };
  Slots: Slots[] = [];
  Spaces: Space[] = []
  SelectedSpace: Space | null = null;
  listaUtenti: User[] = [];
  slotOrariSala: string[] = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
  slotIndex: number = 0 ;
  constructor(private service: AdminService,private userService: UserService, private cd: ChangeDetectorRef, private router: Router) {}

  ngOnInit() {
    this.loadUsers();
    this.loadSpaces();
  }

  addBooking() {
    let uid = Number(this.prenotazione.utenteId);
    let slotId = Number(this.select.value);
    

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
   loadSpaces() {
    this.service.getSpaces().subscribe((spaces: any) => {
      this.Spaces = spaces;
      this.cd.detectChanges();
    });
  }
  getSpaceId(spaceName: string){
    console.log(spaceName);
    let space = this.Spaces.find(s => s.name === spaceName);
    if (space)
      return space.id 
    return -1;
  }

  loadCurrentSpace(id: number) {
    this.SelectedSpace = this.Spaces.find(s => s.id === id) || null;
  }
  
  SpacesAvailable() {
    this.service.getAvailability(this.prenotazione.data).subscribe((availableSpaces: any) => {
      this.Spaces = availableSpaces;
      this.cd.detectChanges();
    })
  }
  SlotsAvailable(id: number) {
    this.Slots = [];
    this.cd.detectChanges();
    this.service.getSlotsAvailable(id || -1, this.prenotazione.data).subscribe((availableSlots: any) => {
      this.Slots = availableSlots.slots;
      console.log(this.Slots);
      this.cd.detectChanges();
    })
  }
  saveIndex(slotId: number) {
    console.log(slotId);
    this.slotIndex = slotId;
  }
}
