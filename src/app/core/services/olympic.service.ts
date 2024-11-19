import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { Participation } from '../models/Participation';

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

  getStatisticsForDashboard(): Observable<{ title: string; value: number }[]> {
    return this.olympics$.pipe(
      map((olympics) => {
        if (!olympics) {
          return [];
        }

        const citiesSet = new Set();
        olympics.forEach((country) => {
          country.participations.forEach((participation) => {
            citiesSet.add(participation.city);
          });
        });

        return [
          {
            title: 'Number of JOs',
            value: citiesSet.size,
          },
          {
            title: 'Number of countries',
            value: olympics.length,
          },
        ];
      })
    );
  }

  getStatisticsForCountry(
    countryId: string
  ): Observable<{ title: string; value: number }[]> {
    return this.olympics$.pipe(
      map((olympics) => {
        if (!olympics) {
          return [];
        }

        const country = olympics.find(
          (olympic) => olympic.country === countryId
        );

        if (!country) {
          return [];
        }

        let totalMedals: number = 0,
          totalAthletes: number = 0;

        country.participations.map((p) => {
          totalMedals += p.medalsCount;
          totalAthletes += p.athleteCount;
        });

        return [
          {
            title: 'Number of entries',
            value: country.participations.length,
          },
          {
            title: 'Total number of medals',
            value: totalMedals,
          },
          {
            title: 'Total number of athletes',
            value: totalAthletes,
          },
        ];
      })
    );
  }

  getParticipationsByCountryId(countryId: string): Observable<
    {
      name: string;
      value: number;
      extra: {
        code: string;
      };
    }[]
  > {
    console.log('getParticipationsByCountryId');
    return this.olympics$.pipe(
      map((olympics) => {
        if (!olympics) {
          return [];
        }

        const country = olympics.find(
          (olympic) => olympic.country === countryId
        );

        if (!country) {
          return [];
        }

        const participations = country.participations.map((participation) => {
          return {
            name: participation.city,
            value: participation.medalsCount,
            extra: {
              code: participation.year.toString(),
            },
          };
        });

        return participations;
      })
    );
  }
}
