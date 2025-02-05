import { Component } from '@angular/core';
import {CalendarPageComponent} from '../../components/calendar-page/calendar-page.component';

@Component({
  selector: 'app-year-table',
  imports: [
    CalendarPageComponent
  ],
  templateUrl: './year-table.component.html',
  standalone: true,
  styleUrl: './year-table.component.css'
})
export class YearTableComponent {
  selectedDate: string | undefined;

  onSelectedDateChange(date: string) {
    this.selectedDate = date;
    console.log('Selected Date:', this.selectedDate);
  }
}
