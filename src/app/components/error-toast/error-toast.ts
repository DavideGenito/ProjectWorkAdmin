import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppToast, ErrorService, ToastType } from '../../services/error-service';

@Component({
  selector: 'app-error-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-toast.html',
  styleUrl: './error-toast.css',
})
export class ErrorToast {
  errorService = inject(ErrorService);

  readonly typeConfig: Record<ToastType, { header: string; icon: string; label: string }> = {
    error:   { header: 'toast-header-error',   icon: 'bi bi-x-circle-fill',        label: 'Errore'    },
    warning: { header: 'toast-header-warning', icon: 'bi bi-exclamation-triangle-fill', label: 'Attenzione' },
    info:    { header: 'toast-header-info',    icon: 'bi bi-info-circle-fill',      label: 'Info'      },
    success: { header: 'toast-header-success', icon: 'bi bi-check-circle-fill',     label: 'Successo'  },
  };

  trackById(_: number, toast: AppToast): number {
    return toast.id;
  }
}