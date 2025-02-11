import {ChangeDetectionStrategy, Component, computed, inject, signal, WritableSignal} from '@angular/core';
import {CalendarPageComponent} from "../../components/calendar-page/calendar-page.component";
import {DatePipe, NgClass} from '@angular/common';
import {eventsStore} from '../../store/events.store';
import {CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, transferArrayItem} from '@angular/cdk/drag-drop';
import {Router} from '@angular/router';

@Component({
  selector: 'app-month-table',
  imports: [
    CalendarPageComponent,
    NgClass,
    DatePipe,
    CdkDrag,
    CdkDropList,
    CdkDropListGroup
  ],
  templateUrl: './month-table.component.html',
  standalone: true,
  styleUrl: './month-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonthTableComponent {
  store = inject(eventsStore);
  router = inject(Router)
  selectedDate: WritableSignal<string> = signal('');
  onSelectedDateChange(date: string) {
    this.selectedDate.set(date)
  }
  monthDays = computed(() => {
    const date = this.parseDate(this.selectedDate());
    return this.generateMonthGrid(date);
  });
  private parseDate(dateString: string): Date {
    return dateString ? new Date(dateString) : new Date();
  }
  private generateMonthGrid(selectedDate: Date) {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const firstWeekday = firstDay.getDay(); // Sunday = 0, Monday = 1, etc.
    let calendar: { date: Date | null; isCurrentMonth: boolean, events: any[] }[][] = [];
    let week: { date: Date | null; isCurrentMonth: boolean, events: any[] }[] = [];
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevMonthYear = month === 0 ? year - 1 : year;
    const prevMonthLastDay = new Date(prevMonthYear, prevMonth + 1, 0);
    const prevMonthDaysCount = prevMonthLastDay.getDate();
    for (let i = 0; i < firstWeekday; i++) {
      week.push({
        date: new Date(prevMonthYear, prevMonth, prevMonthDaysCount - (firstWeekday - 1 - i)),
        isCurrentMonth: false,
        events: []
      });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDay = new Date(year, month, day);
      week.push({
        date: currentDay,
        isCurrentMonth: true,
        events: this.store.eventItems().filter(event => {
          const eventDate = new Date(event.date).toDateString();
          return eventDate === currentDay.toDateString();
        }),
      });
      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextMonthYear = month === 11 ? year + 1 : year;

    let nextMonthDay = 1;
    while (week.length < 7) {
      week.push({
        date: new Date(nextMonthYear, nextMonth, nextMonthDay++),
        isCurrentMonth: false,
        events: []
      });
    }
    if (week.some(day => day.date !== null)) {
      calendar.push(week);
    }
    console.log(calendar)
    return calendar;
  }

  dropped(event: CdkDragDrop<any[]>, day: string) {
    if (event.previousContainer !== event.container) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const movedEvent = event.container.data[event.currentIndex];
      const originalDate = new Date(movedEvent.date);
      const hour = originalDate.getHours();
      const minute = originalDate.getMinutes();
      const updatedDate = new Date(day);
      updatedDate.setHours(hour);
      updatedDate.setMinutes(minute);
      this.store.updateEventTime(movedEvent.id, updatedDate.toISOString());
    }
  }

  navigateToDay(day: string) {
    const date = new Date(day);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dayOfMonth = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${dayOfMonth}`;
    console.log(formattedDate);
    this.router.navigate(['/day'], { queryParams: { date: formattedDate } });
  }

}
