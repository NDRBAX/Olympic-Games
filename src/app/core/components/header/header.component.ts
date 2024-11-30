import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Observable, Subscription } from 'rxjs';
import { OlympicService } from '../../services/olympic.service';
import { Statistics } from '../../models/Statistics';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  public title!: string;
  public statistics$!: Observable<Statistics[]>;
  private routerSubscription!: Subscription;
  public displayBackButton = false;

  constructor(private router: Router, private olympicService: OlympicService) {}

  ngOnInit() {
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateData();
      });

    this.updateData();
  }

  private updateData() {
    const currentUrl = this.router.url;
    if (currentUrl.startsWith('/details/')) {
      this.displayBackButton = true;
      const id: string = this.router.url
        .split('/details/')[1]
        .replace('%20', ' ');

      this.title = `Details for ${id}`;
      this.statistics$ = this.olympicService.getStatisticsForCountry(id);
    } else if (currentUrl === '/dashboard') {
      this.displayBackButton = false;
      this.title = 'Medals per Country';
      this.statistics$ = this.olympicService.getStatisticsForDashboard();
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
