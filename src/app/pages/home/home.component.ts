import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, delay, map, Observable, of, startWith } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$!: Observable<Olympic[] | null>;
  public medalsData$!: Observable<{ name: string; value: number }[]>;
  public error$!: Observable<string | null>;
  public isLoading = true;

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    // Charge les données olympiques et gère l'état de chargement et d'erreur
    this.olympicService.loadInitialData().subscribe({
      complete: () => (this.isLoading = false),
      error: () => (this.isLoading = false),
    });

    // Observable pour récupérer les Jeux Olympiques
    this.olympics$ = this.olympicService.getOlympics().pipe(
      map((data) => data || []), // Retourne un tableau vide si data est null ou undefined
      catchError(() => of([])) // Retourne un tableau vide en cas d'erreur
    );

    // Observable pour récupérer les erreurs depuis le service
    this.error$ = this.olympicService.getError();

    // Transformation des données pour le graphique
    this.medalsData$ = this.olympics$.pipe(
      map((olympics: Olympic[] | null) => {
        return olympics
          ? olympics.map((olympic: Olympic) => ({
              name: olympic.country,
              value: olympic.participations.reduce(
                (acc, participation) => acc + participation.medalsCount,
                0
              ),
            }))
          : [];
      }),
      startWith([])
    );
  }

  onSelectOpenDetailsPageOfTheCountry(event: any) {
    const countryId = event.name;
    this.router.navigate([`/details/${countryId}`]);
  }
}
