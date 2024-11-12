import { Component, OnInit } from '@angular/core';
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
  public olympics$!: Observable<Olympic[]>;
  public medalsData$!: Observable<
    {
      name: string;
      value: number;
    }[]
  >;

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics().pipe(
      delay(2000),
      map((data) => data || []), // Si data est null ou undefined, retourne un tableau vide
      catchError(() => of([])) // En cas d'erreur, retourne un tableau vide
    );

    this.medalsData$ = this.olympics$.pipe(
      map((olympics: Olympic[]) => {
        return olympics.map((olympic: Olympic) => {
          return {
            name: olympic.country,
            value: olympic.participations.reduce(
              (acc: number, participation: Participation) =>
                acc + participation.medalsCount,
              0
            ),
          };
        });
      }),
      startWith([]) // Commencer avec un tableau vide le temps que les données soient chargées
    );
  }

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#FF8C00'],
  };
}
