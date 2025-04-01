export interface Rating {
    _id?: string;
    user: string; // ID del usuario relacionado
    score: number; // Puntuación entre 1 y 5
    comment?: string; // Comentario opcional
    createdAt?: Date; // Fecha de creación
    seleccionado?: boolean; // Indica si la valoración está seleccionada
  }
  
  export class Rating implements Rating {
    constructor() {
      this.seleccionado = false; // Valor predeterminado
    }
  }