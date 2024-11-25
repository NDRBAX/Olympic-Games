import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { Statistics } from '../models/Statistics';
import { CountryDetails } from '../models/CountryDetails';

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
        this.olympics$.next(data); // Set the data
        this.error$.next(null); // Reset the error message
      }),

      catchError((error) => {
        return of([]).pipe(
          delay(2000), // Simulate network latency
          tap(() => {
            this.olympics$.next([]); // Create an empty array
            this.error$.next('Unable to load data. Please try again later 😕'); // Set an error message
          }),
          map(() => {
            throw new Error(this.error$.value ?? 'Unknown error'); // Throw an error
          })
        );
      })
    );
  }

  getOlympics(): Observable<Olympic[] | null> {
    return this.olympics$.asObservable();
  }

  getError(): Observable<string | null> {
    return this.error$.asObservable();
  }

  /**
   * Retrieves statistics for the dashboard.
   *
   * @returns An observable that emits an array of statistics objects.
   * Each object contains a title and a value representing a specific statistic.
   * - "Number of JOs": The number of unique cities that have hosted the Olympics.
   * - "Number of countries": The number of countries that have participated in the Olympics.
   */
  getStatisticsForDashboard(): Observable<Statistics[]> {
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

  /**
   * Retrieves statistics for a specific country based on its ID.
   *
   * @param {string} countryId - The ID of the country to retrieve statistics for.
   * @returns {Observable<Statistics[]>} An observable that emits an array of statistics objects.
   * Each statistics object contains a title and a value representing different metrics:
   * - Number of entries
   * - Total number of medals
   * - Total number of athletes
   */
  getStatisticsForCountry(countryId: string): Observable<Statistics[]> {
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

  /**
   * Retrieves the participation details of a country by its ID.
   *
   * @param countryId - The ID of the country to retrieve participation details for.
   * @returns An Observable that emits an array of CountryDetails objects, each representing a participation event.
   *
   * The returned array contains objects with the following structure:
   * - `name`: The name of the city where the participation took place.
   * - `value`: The number of medals won during the participation.
   * - `extra`: An object containing additional information, such as the year of the participation.
   *
   * If no olympics data is available or the specified country is not found, an empty array is returned.
   */
  getParticipationsByCountryId(
    countryId: string
  ): Observable<CountryDetails[]> {
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
