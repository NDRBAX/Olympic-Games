import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, delay, filter, Observable, take } from 'rxjs';
import { OlympicService } from './core/services/olympic.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public isLoading$ = new BehaviorSubject<boolean>(true);
  public errorMessage$: Observable<string | null>;

  constructor(private olympicService: OlympicService) {
    this.errorMessage$ = this.olympicService.getError();
  }

  ngOnInit(): void {
    // Load initial data
    this.olympicService.loadInitialData().pipe(take(1)).subscribe();

    // Update loading state
    this.olympicService
      .getOlympics()
      .pipe(
        filter((olympics) => olympics !== null), // Filter out null values
        take(1), // Take only the first value
        delay(1000) // Simulate loading time
      )
      .subscribe((olympics) => {
        // If we have data, set loading to false
        if (olympics !== null && olympics.length > 0) {
          this.isLoading$.next(false);
        }
      });
  }
}
