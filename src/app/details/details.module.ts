import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryDetailsComponent } from './components/country-details/country-details.component';
import { DetailsRoutingModule } from './details.routing.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  declarations: [CountryDetailsComponent],
  imports: [CommonModule, DetailsRoutingModule, NgxChartsModule],
  exports: [CountryDetailsComponent],
})
export class DetailsModule {}
