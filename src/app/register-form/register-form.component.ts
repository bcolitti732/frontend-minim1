import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { PacketService } from '../services/packet.service';
import { RatingService } from '../services/ratings.service'; // Importamos el servicio de ratings
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css',
  standalone: true
})
export class RegisterFormComponent {
  registerForm: FormGroup;
  packetForm: FormGroup;
  ratingForm: FormGroup; // Nuevo formulario para ratings
  activeTab: 'user' | 'packet' | 'rating' = 'user'; // Control de pestañas

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private packetService: PacketService,
    private ratingService: RatingService // Inyectamos el servicio de ratings
  ) {
    // Formulario de Usuario
    this.registerForm = this.fb.group({
      name: [''],
      email: [''],
      password: [''],
      phone: [''],
      packets: [''],
      ratings: [''] // Añadimos el campo ratings
    });

    // Formulario de Paquete
    this.packetForm = this.fb.group({
      name: [''],
      description: [''],
      status: ['']
    });

    // Formulario de Rating
    this.ratingForm = this.fb.group({
      user: [''], // ID del usuario
      score: [''], // Puntuación
      comment: [''] // Comentario opcional
    });
  }

  // Cambiar pestañas
  setActiveTab(tab: 'user' | 'packet' | 'rating') {
    this.activeTab = tab;
  }

  // Enviar formulario de usuario
  registerUser() {
    if (this.registerForm.valid) {
      const userData = this.registerForm.value;
      userData.available = true;
      userData.packets = userData.packets || []; // Asegura que sea un array
      userData.ratings = userData.ratings || []; // Asegura que sea un array
      console.log('userData a enviar:', JSON.stringify(userData, null, 2));
      this.userService.createUser2(userData).subscribe({
        next: (response) => {
          console.log('Usuario registrado exitosamente:', response);
        },
        error: (error) => {
          console.error('Error en el registro de usuario:', error);
          alert('Error en el registro de usuario, verifica tus credenciales');
        }
      });
    }
  }

  // Enviar formulario de paquete
  registerPacket() {
    if (this.packetForm.valid) {
      const packetData = this.packetForm.value;
      console.log('packetData:', packetData);
      this.packetService.createPacket(packetData).subscribe({
        next: (response) => {
          console.log('Paquete registrado exitosamente:', response);
        },
        error: (error) => {
          console.error('Error en el registro de paquete:', error);
          alert('Error en el registro de paquete, verifica tus credenciales');
        }
      });
    }
  }

  // Enviar formulario de rating
  registerRating() {
    if (this.ratingForm.valid) {
      const ratingData = this.ratingForm.value;
      console.log('ratingData a enviar:', JSON.stringify(ratingData, null, 2));
      this.ratingService.createRating(ratingData).subscribe({
        next: (response) => {
          console.log('Rating registrado exitosamente:', response);
        },
        error: (error) => {
          console.error('Error en el registro de rating:', error);
          alert('Error en el registro de rating, verifica los datos ingresados');
        }
      });
    }
  }
}