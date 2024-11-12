import { Component, OnInit } from '@angular/core';
import { catchError, delay, map, Observable, of } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$!: Observable<Olympic[]>;

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics().pipe(
      delay(2000),
      map((data) => data || []), // Si data est null ou undefined, retourne un tableau vide
      catchError(() => of([])) // En cas d'erreur, retourne un tableau vide
    );
  }
}
