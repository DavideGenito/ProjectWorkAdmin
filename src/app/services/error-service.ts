import { Injectable, signal } from '@angular/core';

export type ToastType = 'error' | 'warning' | 'info' | 'success';

export interface AppToast {
  id: number;
  visual: string;
  type: ToastType;
  timestamp: Date;
}

@Injectable({ providedIn: 'root' })
export class ErrorService {
  private _toasts = signal<AppToast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  private counter = 0;
  private readonly DURATION_MS = 6000;
  private readonly MAX_TOASTS = 5;

  error(visualMessage: string, consoleMessage?: string): void {
    console.error(`[ERROR] ${consoleMessage ?? visualMessage}`);
    this.push(visualMessage, 'error');
  }

  warn(visualMessage: string, consoleMessage?: string): void {
    console.warn(`[WARN] ${consoleMessage ?? visualMessage}`);
    this.push(visualMessage, 'warning');
  }

  info(visualMessage: string, consoleMessage?: string): void {
    console.info(`[INFO] ${consoleMessage ?? visualMessage}`);
    this.push(visualMessage, 'info');
  }

  success(visualMessage: string, consoleMessage?: string): void {
    console.log(`[SUCCESS] ${consoleMessage ?? visualMessage}`);
    this.push(visualMessage, 'success');
  }

  dismiss(id: number): void {
    this._toasts.update(list => list.filter(t => t.id !== id));
  }

  private push(visual: string, type: ToastType): void {
    const toast: AppToast = {
      id: ++this.counter,
      visual,
      type,
      timestamp: new Date(),
    };

    this._toasts.update(list => [...list, toast].slice(-this.MAX_TOASTS));
    setTimeout(() => this.dismiss(toast.id), this.DURATION_MS);
  }
}