import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-country-details',
  templateUrl: './country-details.component.html',
  styleUrls: ['./country-details.component.scss'],
})
export class CountryDetailsComponent implements OnInit {
  public countryDetails$!: Observable<
    {
      name: string;
      value: number;
      extra: {
        code: string;
      };
    }[]
  >;

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const countryId = this.route.snapshot.params['id'];
    this.countryDetails$ =
      this.olympicService.getParticipationsByCountryId(countryId);
  }
}
