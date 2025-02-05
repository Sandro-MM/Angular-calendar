import { Component } from '@angular/core';
import {CalendarPageComponent} from '../../components/calendar-page/calendar-page.component';

@Component({
  selector: 'app-week-table',
  imports: [
    CalendarPageComponent
  ],
  templateUrl: './week-table.component.html',
  standalone: true,
  styleUrl: './week-table.component.css'
})
export class WeekTableComponent {
  selectedDate: string | undefined;

  onSelectedDateChange(date: string) {
    this.selectedDate = date;
    console.log('Selected Date:', this.selectedDate);
  }
}
