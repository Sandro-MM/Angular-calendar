import {ActivatedRoute, Router} from '@angular/router';
import {ChangeDetectionStrategy, Component, computed, inject, input, OnInit, output, signal} from '@angular/core';
import { addDays, addWeeks, addMonths, addYears, format } from 'date-fns';
import {DatePipe} from '@angular/common';
import {MatFormField} from '@angular/material/form-field';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {MatButton} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {AddEventModalComponent} from '../add-event-modal/add-event-modal.component';

@Component({
  selector: 'app-calendar-page',
  imports: [
    DatePipe,
    MatFormField,
    MatOption,
    MatSelect,
    MatButton,
  ],
  templateUrl: './calendar-page.component.html',
  standalone: true,
  styleUrl: './calendar-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class CalendarPageComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  dialog = inject(MatDialog);

  dateOptions = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' },
  ];

  currentDate = signal<Date>(new Date());
  selectedDate = output<string>();
  selectedType = input<string>();


  calendarType = signal<string>('day');
  ngOnInit(): void {
    this.initializeDateFromQuery();
    this.getRoute()
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
        date: format(date, 'yyyy-MM-dd'),
      },
      queryParamsHandling: 'preserve',
    });
  }


  calendarTypeComputed = computed(() => {
    const currentCalendarType = this.calendarType();
    if (currentCalendarType) {
      this.router.navigate([currentCalendarType], {
        queryParams: { date: format(this.currentDate(), 'yyyy-MM-dd') },
        queryParamsHandling: 'merge',
      });
    }
    return currentCalendarType;
  });

  previous() {
    const newDate = this.calculateNewDate(-1);
    this.updateDate(newDate, false);
  }

  next() {
    const newDate = this.calculateNewDate(1);
    this.updateDate(newDate, false);
  }

  private calculateNewDate(offset: number): Date {
    const current = this.currentDate();
    switch (this.calendarTypeComputed()) {
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

  getRoute(){
    this.route.url.subscribe((segments) => {
      const routeSegment = segments[0]?.path;
      if (routeSegment) {
        this.calendarType.set(routeSegment);
      }
    });
  }

  private updateDate(newDate: Date, shouldNavigateToType = true) {
    this.currentDate.set(newDate);
    this.selectedDate.emit(format(newDate, 'yyyy-MM-dd'));

    this.router.navigate([], {
      queryParams: { date: format(newDate, 'yyyy-MM-dd') },
      queryParamsHandling: 'merge',
    });
  }

  navigateTo(value: string) {
    this.calendarType.set(value);
    this.router.navigate([value], {
      queryParams: { date: format(this.currentDate(), 'yyyy-MM-dd') },
      queryParamsHandling: 'merge',
    });
  }

  openDialog() {
    let dialogRef = this.dialog.open(AddEventModalComponent, {
      height: '800px',
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log( result,'The dialog was closed');
    });
  }
}

