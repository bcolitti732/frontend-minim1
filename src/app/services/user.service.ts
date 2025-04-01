import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  private apiUrl = "http://localhost:4000/api/users";

  getUsers(page: number = 1, limit: number = 3): Observable<{ data: User[]; totalUsers: number; currentPage: number }> {
    return this.http.get<{ data: User[]; totalUsers: number; currentPage: number }>(
      `${this.apiUrl}?page=${page}&limit=${limit}`
    );
  }

  // Obtener un usuario por su ID
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // Crear un usuario
  createUser(userData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, userData);
  }

  // Crear un usuario con más control sobre los datos
  createUser2(credentials: { name: string; email: string; password: string; phone: string; available: boolean; packets: string[]; ratings: string[] }): Observable<any> {
    credentials.available = true;
    console.log("credentials:", credentials);
    return this.http.post(this.apiUrl, credentials);
  }

  // Crear un usuario (otra variante)
  createUser3(credentials: { name: string; email: string; password: string; phone: string; packets: string[]; ratings: string[] }): Observable<any> {
    return this.http.post(this.apiUrl, credentials);
  }

  // Eliminar un usuario por su ID
  deleteUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Desactivar un usuario
  deactivateUsuario(id: number, user: User): Observable<any> {
    user.available = false; // Cambia el estado a no disponible
    return this.http.put(`${this.apiUrl}/${id}`, { available: false }).pipe(
      tap(response => console.log('Server response:', response)) // Escribe la respuesta en la consola
    );
  }

  // Obtener los paquetes de un usuario
  getPaquetesUsuario(userId: string): Observable<any[]> {
    console.log('ID del usuario:', userId); // Verifica que el ID no sea null o undefined
    return this.http.get<any[]>(`${this.apiUrl}/${userId}/packets`).pipe(
      tap(paquetes => console.log(`Paquetes del usuario ${userId}:`, paquetes))
    );
  }

  // Obtener las valoraciones (ratings) de un usuario
  getRatingsUsuario(userId: string): Observable<any[]> {
    console.log('ID del usuario:', userId); // Verifica que el ID no sea null o undefined
    return this.http.get<any[]>(`${this.apiUrl}/${userId}/ratings`).pipe(
      tap(ratings => console.log(`Valoraciones del usuario ${userId}:`, ratings))
    );
  }

  // Obtener un usuario por su nombre
  getUserByName(userName: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/name/${userName}`);
  }

  // Asignar un paquete a un usuario
  assignPacketsToUser(userName: string, packetId: string): Observable<any> {
    console.log(`${this.apiUrl}/${userName}/packets`);
    return this.http.post<any>(`${this.apiUrl}/${userName}/packets`, { packetId });
  }

  // Asignar una valoración (rating) a un usuario
  assignRatingToUser(userId: string, ratingId: string): Observable<any> {
    console.log(`${this.apiUrl}/${userId}/ratings`);
    return this.http.post<any>(`${this.apiUrl}/${userId}/ratings`, { ratingId });
  }
}