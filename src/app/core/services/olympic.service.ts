import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[] | null>(null);
  private error$ = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {}

  loadInitialData(): Observable<Olympic[]> {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((data) => {
        this.olympics$.next(data); // Met à jour les données si la requête réussit
        this.error$.next(null); // Réinitialise l'état d'erreur
      }),
      catchError((error) => {
        console.error('Erreur lors du chargement des données :', error);
        this.olympics$.next([]); // Définit une liste vide en cas d'erreur
        this.error$.next('Erreur de chargement des données olympiques.');
        return throwError(error); // Propagation de l'erreur pour un traitement ultérieur si nécessaire
      })
    );
  }

  getOlympics(): Observable<Olympic[] | null> {
    return this.olympics$.asObservable();
  }

  getError(): Observable<string | null> {
    return this.error$.asObservable();
  }
}
