import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-ratings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-ratings.component.html',
  styleUrls: ['./user-ratings.component.css']
})
export class UserRatingsComponent {
  @Input() ratings: any[] = []; // Recibe las valoraciones desde el componente padre
  @Output() close = new EventEmitter<void>(); // Emite un evento para cerrar el modal

  cerrar(): void {
    this.close.emit(); // Emite el evento de cierre
  }
}