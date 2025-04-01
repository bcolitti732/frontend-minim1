import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Rating } from '../models/ratings.model';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RatingService {
  private apiUrl = 'http://localhost:4000/api/ratings';

  constructor(private http: HttpClient) {}

  getRatings(page: number = 1, limit: number = 5): Observable<{ data: Rating[]; totalRatings: number; currentPage: number }> {
    return this.http.get<{ data: Rating[]; totalRatings: number; currentPage: number }>(
      `${this.apiUrl}?page=${page}&limit=${limit}`
    );
  }

  createRating(rating: Rating): Observable<Rating> {
    return this.http.post<Rating>(this.apiUrl, rating).pipe(
      tap((newRating) => console.log('Nueva valoración creada:', newRating))
    );
  }

  getRatingById(id: string): Observable<Rating> {
    return this.http.get<Rating>(`${this.apiUrl}/${id}`).pipe(
      tap((rating) => console.log('Valoración obtenida:', rating))
    );
  }

  updateRating(id: string, rating: Partial<Rating>): Observable<Rating> {
    return this.http.put<Rating>(`${this.apiUrl}/${id}`, rating).pipe(
      tap((updatedRating) => console.log('Valoración actualizada:', updatedRating))
    );
  }

  deleteRating(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => console.log(`Valoración con ID ${id} eliminada`))
    );
  }

  // Buscar valoraciones por usuario
  searchRatingsByUser(userId: string): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.apiUrl}/user/${userId}`).pipe(
      tap((ratings) => console.log(`Valoraciones del usuario ${userId}:`, ratings))
    );
  }
}