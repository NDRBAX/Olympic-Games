import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);

  constructor(private http: HttpClient) {}

  /**
   * Charge les données initiales des Jeux Olympiques depuis le fichier JSON.
   * Utilise un appel HTTP GET pour récupérer les données et les stocke dans le BehaviorSubject olympics$.
   * Gère également les erreurs en renvoyant un tableau vide et en loggant l'erreur dans la console.
   */
  loadInitialData(): Observable<Olympic[]> {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      // `tap` permet d'effectuer des effets de bord, ici pour mettre à jour le BehaviorSubject avec les données reçues
      tap((value) => this.olympics$.next(value)),
      // `catchError` permet de capturer les erreurs et d'effectuer des actions spécifiques, ici l'envoi d'un tableau vide dans olympics$
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next([]);
        return caught;
      })
    );
  }

  getOlympics(): Observable<Olympic[]> {
    return this.olympics$.asObservable();
  }
}
