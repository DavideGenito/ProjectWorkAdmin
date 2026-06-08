import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { trimMinLengthValidator } from '../../models/trim-min-length.validator';

@Component({
  selector: 'app-reset-pass',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-pass.html',
  styleUrl: './reset-pass.css',
})
export class ResetPass {
  @Input() userId!: number;

  @Output() confermato = new EventEmitter<string>();
  @Output() annullato = new EventEmitter<void>();

  password = new FormControl('', [Validators.required, Validators.minLength(8), trimMinLengthValidator(8)]);

  salva() {
    if (this.password.valid && this.password.value) {
      this.confermato.emit(this.password.value.trim());
    }
  }

  annulla() {
    this.annullato.emit();
  }
}