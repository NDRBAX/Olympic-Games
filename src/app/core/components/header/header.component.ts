import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { OlympicService } from '../../services/olympic.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public title!: string;

  public statistics$!: Observable<
    {
      title: string;
      value: number;
    }[]
  >;

  constructor(private olympicService: OlympicService) {}

  ngOnInit() {
    this.updateData();
  }

  private updateData() {
    this.title = 'Medals per Country';
    this.statistics$ = this.olympicService.getStatisticsForDashboard();
  }
}
