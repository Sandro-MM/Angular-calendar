
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {DropdownComponent} from '../dropdown/dropdown.component';
import {Component, effect, inject, input, OnInit, output, signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import { addDays, addWeeks, addMonths, addYears, format } from 'date-fns';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-calendar-page',
  imports: [
    DropdownComponent,
    DatePipe
  ],
  templateUrl: './calendar-page.component.html',
  standalone: true,
  styleUrl: './calendar-page.component.css'
})
export class CalendarPageComponent implements OnInit{
  router = inject(Router)
  route = inject(ActivatedRoute);

  dateOptions = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' },
  ]
  currentDate = signal<Date>(new Date());
  selectedDate = output<string>()
  selectedType = input<string>()

  calendarTypeControl = new FormControl<string>(this.selectedType.toString());
  calendarType = toSignal(this.calendarTypeControl.valueChanges, {
    initialValue: this.calendarTypeControl.value,
  });
  ngOnInit(): void {
    this.initializeDateFromQuery();
  }

  initializeDateFromQuery() {
    const queryDate = this.route.snapshot.queryParams['date'];
    if (queryDate) {
      const date = new Date(queryDate);
      this.currentDate.set(date);
      this.selectedDate.emit(format(date, 'yyyy-MM-dd'));
    } else {
      this.setTodayDate();
    }
  }


  setTodayDate() {
    const today = new Date();
    this.currentDate.set(today);
    this.updateQueryDate(today);
  }
  private updateQueryDate(date: Date) {
    this.router.navigate([], {
      queryParams: {
        date: format(date, 'yyyy-MM-dd')
      },
      queryParamsHandling: 'preserve',
    });
  }


  eff = effect(() => {
    const currentCalendarType = this.calendarType();
    if (currentCalendarType) {
      this.router.navigate([currentCalendarType], {
        queryParams: {
          date: format(this.currentDate(), 'yyyy-MM-dd'),
        },
        queryParamsHandling: 'merge',
      });
    }
  });

  previous() {
    const newDate = this.calculateNewDate(-1);
    this.updateDate(newDate);
  }

  next() {
    const newDate = this.calculateNewDate(1);
    this.updateDate(newDate);
  }

  private calculateNewDate(offset: number): Date {
    const current = this.currentDate();
    switch (this.calendarType()) {
      case 'day':
        return addDays(current, offset);
      case 'week':
        return addWeeks(current, offset);
      case 'month':
        return addMonths(current, offset);
      case 'year':
        return addYears(current, offset);
      default:
        return current;
    }
  }

  private updateDate(newDate: Date) {
    this.currentDate.set(newDate);
    this.selectedDate.emit(format(newDate, 'yyyy-MM-dd'));
    this.router.navigate([], {
      queryParams: { date: format(newDate, 'yyyy-MM-dd') },
      queryParamsHandling: 'merge',
    });
  }
}
