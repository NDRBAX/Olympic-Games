import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, delay, map, switchMap, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { Statistics } from '../models/Statistics';
import { CountryDetails } from '../models/CountryDetails';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private readonly olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[] | null>(null);
  private error$ = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {}

  loadInitialData(): Observable<Olympic[]> {
    if (this.olympics$.value) {
      return of(this.olympics$.value); // Use cached data
    }

    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((data) => {
        this.olympics$.next(data); // Set data
        this.error$.next(null); // Reset the error message
      }),
      catchError((error) =>
        this.setError('Failed to load data. Please try again later.')
      )
    );
  }

  getOlympicsData(): Observable<Olympic[]> {
    if (!this.olympics$.value) {
      this.setError('No data available. Please try again later.');
      return of([]);
    }
    return of(this.olympics$.value);
  }

  private setError(errorMessage: string): Observable<never> {
    this.error$.next(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  private getCountryDataById(countryId: string): Observable<Olympic> {
    return this.getOlympicsData().pipe(
      switchMap((olympics: Olympic[]) => {
        const country = olympics.find(
          (olympic) => olympic.country === countryId
        );

        if (!country) {
          return this.setError(
            `Country with ID ${countryId} not found. Please try again later.`
          );
        }

        return of(country);
      })
    );
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
    return this.getOlympicsData().pipe(
      map((olympics) => {
        const citiesSet = new Set();
        olympics.forEach((country) => {
          country.participations.forEach((participation) => {
            citiesSet.add(participation.city);
          });
        });

        return [
          { title: 'Number of JOs', value: citiesSet.size },
          { title: 'Number of countries', value: olympics.length },
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
    return this.getCountryDataById(countryId).pipe(
      map((country) => {
        let totalMedals: number = 0,
          totalAthletes: number = 0;

        country.participations.map((p) => {
          totalMedals += p.medalsCount;
          totalAthletes += p.athleteCount;
        });

        return [
          { title: 'Number of entries', value: country.participations.length },
          { title: 'Total number of medals', value: totalMedals },
          { title: 'Total number of athletes', value: totalAthletes },
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
   */
  getParticipationsByCountryId(
    countryId: string
  ): Observable<CountryDetails[]> {
    return this.getCountryDataById(countryId).pipe(
      map((country) => {
        return country.participations.map((participation) => ({
          name: participation.city,
          value: participation.medalsCount,
          extra: { code: participation.year.toString() },
        }));
      })
    );
  }
}
