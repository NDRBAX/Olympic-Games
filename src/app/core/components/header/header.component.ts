import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Observable } from 'rxjs';
import { OlympicService } from '../../services/olympic.service';
import { Statistics } from '../../models/Statistics';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public title!: string;
  public statistics$!: Observable<Statistics[]>;

  constructor(private router: Router, private olympicService: OlympicService) {}

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateData();
      });

    this.updateData();
  }

  private updateData() {
    const currentUrl = this.router.url;
    if (currentUrl.startsWith('/details/')) {
      const id: string = this.router.url
        .split('/details/')[1]
        .replace('%20', ' ');

      this.title = `Details for ${id}`;
      this.statistics$ = this.olympicService.getStatisticsForCountry(id);
    } else if (currentUrl === '/dashboard') {
      this.title = 'Medals per Country';
      this.statistics$ = this.olympicService.getStatisticsForDashboard();
    }
  }
}
