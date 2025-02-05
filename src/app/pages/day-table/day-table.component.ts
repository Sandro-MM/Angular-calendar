import {Component} from '@angular/core';
import {CalendarPageComponent} from '../../components/calendar-page/calendar-page.component';

@Component({
  selector: 'app-day-table',
  imports: [
    CalendarPageComponent
  ],
  templateUrl: './day-table.component.html',
  standalone: true,
  styleUrl: './day-table.component.css'
})
export class DayTableComponent {
  selectedDate: string | undefined;

  onSelectedDateChange(date: string) {
    this.selectedDate = date;
    console.log('Selected Date:', this.selectedDate);
  }
}
