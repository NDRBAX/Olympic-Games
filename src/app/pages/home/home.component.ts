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
  // ? Observable contenant la liste des Jeux Olympiques, chaque élément étant de type Olympic[]
  public olympics$!: Observable<Olympic[]>;

  // ? Observable contenant les données formatées pour le graphique en camembert.
  public medalsData$!: Observable<
    {
      name: string;
      value: number;
    }[]
  >;

  // ! Observable contenant les données formatées pour le graphique en camembert.
  constructor(private olympicService: OlympicService) {}

  // Initialisation du composant : appel des Observables pour récupérer les données.
  ngOnInit(): void {
    // Récupération des données des Jeux Olympiques avec plusieurs transformations et gestion des erreurs.
    this.olympics$ = this.olympicService.getOlympics().pipe(
      delay(2000), // Ajoute un délai artificiel de 2 secondes pour simuler le chargement
      map((data) => data || []), // Transformation des données : retourne un tableau vide si data est null ou undefined
      catchError(() => of([])) // Gestion des erreurs : retourne un tableau vide en cas d'erreur dans la récupération des données
    );

    // Transformation des données olympiques pour formater les informations de médailles pour le graphique
    this.medalsData$ = this.olympics$.pipe(
      map((olympics: Olympic[]) => {
        // Mapping des données : chaque élément est transformé en un objet contenant le pays et le total de médailles
        return olympics.map((olympic: Olympic) => {
          return {
            name: olympic.country, // Utilisation du nom du pays comme label dans le graphique
            value: olympic.participations.reduce(
              (acc: number, participation: Participation) =>
                acc + participation.medalsCount, // Calcul du total de médailles pour chaque pays
              0
            ),
          };
        });
      }),
      startWith([]) // Commencer avec un tableau vide le temps que les données soient chargées, pour éviter les erreurs de rendu
    );
  }

  // Schéma de couleurs personnalisé pour le graphique en camembert
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#FF8C00'],
  };
}
