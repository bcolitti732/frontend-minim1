import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Rating } from '../models/ratings.model';
import { RatingService } from '../services/ratings.service';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { User } from '../models/user.model';

@Component({
  selector: 'app-ratings',
  imports: [CommonModule, MatPaginatorModule, FormsModule],
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.css'],
  standalone: true,
})
export class RatingsComponent implements OnInit {
  searchTerm: string = ''; // Término de búsqueda
  mostrarModal: boolean = false; // Controla la visibilidad del modal
  ratingsList: Rating[] = []; // Lista completa de valoraciones
  displayedRatings: Rating[] = []; // Valoraciones visibles en la página actual
  totalItems = 0; // Número total de elementos
  itemsPerPage = 5; // Elementos por página
  currentPage = 0; // Página actual
  valoracionesSeleccionadas: Rating[] = []; // Almacena las valoraciones seleccionadas
  usuariosEncontrados: User[] = []; // Lista de usuarios encontrados en la búsqueda

  constructor(private cdr: ChangeDetectorRef) {}

  ratingService = inject(RatingService);
  userService = inject(UserService);

  ngOnInit(): void {
    this.obtenerValoraciones();
  }

  // Obtener todas las valoraciones con paginación
  obtenerValoraciones(): void {
    this.ratingService.getRatings(this.currentPage + 1, this.itemsPerPage).subscribe({
      next: (response) => {
        this.ratingsList = response.data.map((rating) => ({
          ...rating,
        }));
        this.displayedRatings = this.ratingsList; // Actualiza las valoraciones mostradas
        this.totalItems = response.totalRatings;
        console.log(this.ratingsList, this.totalItems);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener valoraciones:', error);
      },
    });
  }

  // Cambiar de página en la paginación
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    this.obtenerValoraciones(); // Llama a la función para obtener las valoraciones de la nueva página
  }

  // Identificar valoraciones por ID
  trackByRatingId(index: number, rating: any): string {
    return rating?._id || index.toString(); // Asegura que siempre se devuelva un valor válido
  }

  // Alternar selección de valoraciones
  toggleSeleccion(rating: Rating): void {
    rating.seleccionado = !rating.seleccionado;
    console.log(rating.seleccionado);
  }

  // Confirmar asignación de valoraciones
  confirmarAsignacion(): void {
    this.valoracionesSeleccionadas = this.ratingsList.filter((rating) => rating.seleccionado); // Filtra las valoraciones seleccionadas
    console.log('Valoraciones seleccionadas:', this.valoracionesSeleccionadas);
    if (this.valoracionesSeleccionadas.length === 0) {
      alert('No hay valoraciones seleccionadas para asignar.');
      return;
    }
    this.mostrarModal = true; // Muestra el modal
  }

  // Buscar usuarios por nombre
  search(): void {
    console.log(this.searchTerm);
    this.userService.getUserByName(this.searchTerm).subscribe({
      next: (usuarios) => {
        this.usuariosEncontrados = usuarios;
        console.log('Usuarios encontrados:', this.usuariosEncontrados);
      },
      error: (error) => {
        console.error('Error al buscar usuarios:', error);
        alert('Error al buscar usuarios.');
      },
    });
  }

  // Asignar valoraciones a un usuario
  asignarValoraciones(usuario: User): void {
    console.log('Asignando valoraciones al usuario:', usuario);
    this.valoracionesSeleccionadas.forEach((rating) => {
      this.ratingService.updateRating(rating._id!, { user: usuario._id! }).subscribe({
        next: (response) => {
          console.log('Valoración asignada:', response);
          alert('Valoración asignada correctamente.');
          this.mostrarModal = false; // Oculta el modal
        },
        error: (error) => {
          console.error('Error al asignar valoración:', error);
          alert('Error al asignar valoración.');
        },
      });
    });
  }

  // Cerrar el modal
  cerrarModal(): void {
    this.mostrarModal = false;
  }
}