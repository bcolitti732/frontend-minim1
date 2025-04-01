import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { UserPackagesComponent } from '../user-packages/user-packages.component';
import { UserRatingsComponent } from '../user-ratings/user-ratings.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RatingService } from '../services/ratings.service';

@Component({
  selector: 'app-user',
  imports: [
    CommonModule,
    FormsModule,
    MatPaginatorModule,
    UserPackagesComponent,
    UserRatingsComponent, // Importamos y registramos el componente de valoraciones
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
  standalone: true,
})
export class UserComponent implements OnInit {
  usuarioSeleccionado: User = new User();
  usersList: User[] = [];
  displayedUsers: User[] = [];
  totalItems = 0;
  itemsPerPage = 3;
  currentPage = 0;

  mostrarModal = false; // Controla la visibilidad del modal de paquetes
  mostrarModalRatings = false; // Controla la visibilidad del modal de valoraciones
  paquetesSeleccionados: any[] = []; // Almacena los paquetes del usuario seleccionado
  ratingsSeleccionados: any[] = []; // Almacena las valoraciones del usuario seleccionado

  userService = inject(UserService);
  ratingService = inject(RatingService);

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios(): void {
    this.userService.getUsers(this.currentPage + 1, this.itemsPerPage).subscribe({
      next: (response) => {
        this.usersList = response.data.map((user) => ({
          ...user,
          seleccionado: false, // Inicializa la propiedad seleccionado en false
        }));
        this.displayedUsers = this.usersList;
        this.totalItems = response.totalUsers;
        this.cdr.detectChanges(); // Detecta cambios para actualizar la vista
      },
      error: (error) => {
        console.error('Error al obtener los usuarios:', error);
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    this.obtenerUsuarios();
  }

  trackByUserId(index: number, user: any): string {
    return user?._id || index.toString(); // Asegura que siempre se devuelva un valor válido
  }

  toggleSeleccion(usuario: User): void {
    usuario.seleccionado = !usuario.seleccionado;
    console.log(usuario.seleccionado);
  }

  confirmarEliminacion(): void {
    const usuariosSeleccionados = this.usersList.filter((usuario) => usuario.seleccionado); // Filtra los usuarios seleccionados
    console.log('Usuarios seleccionados:', usuariosSeleccionados);
    if (usuariosSeleccionados.length === 0) {
      alert('No hay usuarios seleccionados para eliminar.');
      return;
    }

    const confirmacion = confirm(`¿Estás seguro de que deseas eliminar ${usuariosSeleccionados.length} usuario(s)?`);
    if (confirmacion) {
      this.eliminarUsuarios(usuariosSeleccionados, 1);
    }
  }

  eliminarUsuarios(usuariosSeleccionados: any[], opcion: number): void {
    usuariosSeleccionados.forEach((usuario) => {
      if (opcion == 1) {
        this.userService.deleteUsuario(usuario._id).subscribe({
          next: () => {
            console.log(`Usuario con ID ${usuario._id} eliminado.`);
            this.usersList = this.usersList.filter((u) => u._id !== usuario._id); // Eliminamos el usuario de la lista local
          },
          error: (error) => {
            console.error(`Error al eliminar el usuario con ID ${usuario._id}:`, error);
          },
        });
      } else if (opcion === 2) {
        this.userService.deactivateUsuario(usuario._id, usuario).subscribe({
          next: () => {
            console.log(`Usuario con ID ${usuario._id} desactivado.`);
          },
          error: (error) => {
            console.error(`Error al desactivar el usuario con ID ${usuario._id}:`, error);
          },
        });
      }
    });
  }

  desactivarUsuarios(): void {
    const usuariosSeleccionados = this.usersList.filter((usuario) => usuario.seleccionado); // Filtra los usuarios seleccionados
    console.log('Usuarios seleccionados:', usuariosSeleccionados);
    if (usuariosSeleccionados.length === 0) {
      alert('No hay usuarios seleccionados para desactivar.');
      return;
    }

    const confirmacion = confirm(`¿Estás seguro de que deseas desactivar ${usuariosSeleccionados.length} usuario(s)?`);
    if (confirmacion) {
      this.eliminarUsuarios(usuariosSeleccionados, 2);
    }
  }

  verPaquetes(usuario: User): void {
    console.log('Usuario seleccionado:', usuario); // Verifica que el método se está llamando
    this.userService.getPaquetesUsuario(usuario._id!).subscribe({
      next: (paquetes) => {
        console.log('Paquetes obtenidos del backend:', paquetes); // Verifica los datos obtenidos
        this.paquetesSeleccionados = paquetes; // Asigna los paquetes obtenidos
        this.mostrarModal = true; // Muestra el modal
      },
      error: (error) => {
        console.error('Error al obtener los paquetes:', error); // Verifica si hay un error
      },
    });
  }

  cerrarModal(): void {
    this.mostrarModal = false; // Oculta el modal
  }

  verRatings(usuario: User): void {
    console.log('Usuario seleccionado para ver valoraciones:', usuario); // Verifica que el método se está llamando
    this.userService.getRatingsUsuario(usuario._id!).subscribe({
      next: (ratings) => {
        console.log('Valoraciones obtenidas del backend:', ratings); // Verifica los datos obtenidos
        this.ratingsSeleccionados = ratings; // Asigna las valoraciones obtenidas
        this.mostrarModalRatings = true; // Muestra el modal
      },
      error: (error) => {
        console.error('Error al obtener las valoraciones:', error); // Verifica si hay un error
      },
    });
  }

  cerrarModalRatings(): void {
    this.mostrarModalRatings = false; // Oculta el modal
  }
}