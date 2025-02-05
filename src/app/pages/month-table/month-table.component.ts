import { Component } from '@angular/core';
import {CalendarPageComponent} from "../../components/calendar-page/calendar-page.component";

@Component({
  selector: 'app-month-table',
    imports: [
        CalendarPageComponent
    ],
  templateUrl: './month-table.component.html',
  standalone: true,
  styleUrl: './month-table.component.css'
})
export class MonthTableComponent {
  selectedDate: string | undefined;

  onSelectedDateChange(date: string) {
    this.selectedDate = date;
    console.log('Selected Date:', this.selectedDate);
  }
}
