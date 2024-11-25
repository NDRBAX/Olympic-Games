import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { Medals } from 'src/app/core/models/Medals';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public medalsData$!: Observable<Medals[]>;

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.medalsData$ = this.olympicService.getOlympics().pipe(
      startWith(null),
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
      })
    );
  }

  onSelectOpenDetailsPageOfTheCountry(event: Medals) {
    const countryId = event.name;
    this.router.navigate([`/details/${countryId}`]);
  }
}
