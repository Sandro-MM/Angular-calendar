import {ChangeDetectionStrategy, Component, computed, inject, signal, WritableSignal} from '@angular/core';
import {CalendarPageComponent} from '../../components/calendar-page/calendar-page.component';
import {hoursArray} from '../day-table/hours_object';
import {eventsStore} from '../../store/events.store';
import {CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, transferArrayItem} from '@angular/cdk/drag-drop';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-week-table',
  imports: [
    CalendarPageComponent,
    CdkDropList,
    CdkDrag,
    CdkDropListGroup,
    DatePipe
  ],
  templateUrl: './week-table.component.html',
  standalone: true,
  styleUrl: './week-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeekTableComponent {
  hoursArray = hoursArray;
  store = inject(eventsStore);
  router = inject(Router);
  selectedDate: WritableSignal<string> = signal('');
  weekDays = computed(() => {
    const date = new Date(this.selectedDate());
    const dayOfWeek = date.getDay();
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  });

  eventsByDayAndHour = computed(() => {
    if (!this.selectedDate()) return [];
    return this.hoursArray.map(hour => {
      return {
        ...hour,
        eventsByDay: this.weekDays().map(day => {
          const eventDateString = day.toDateString();
          return {
            date: day,
            events: this.store.eventItems().filter(event => {
              const eventDate = new Date(event.date).toDateString();
              const eventHour = new Date(event.date).getHours();
              return eventDate === eventDateString && eventHour === hour.id;
            }),
          };
        }),
      };
    });
  });

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
  }
  dropped(event: CdkDragDrop<any[]>, day: string, hour: string) {
    if (event.previousContainer !== event.container) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const movedEvent = event.container.data[event.currentIndex];
      const [hours, minutes] = hour.split(':').map(Number);
      const updatedDate = new Date(day);
      updatedDate.setHours(hours, minutes, 0, 0);
      this.store.updateEventTime(movedEvent.id, updatedDate.toISOString());
    }
  }
  onSelectedDateChange(date: string) {
    this.selectedDate.set(date)
  }
  getEventWidth(eventCount: number): string {
    return eventCount > 0 ? `calc(100% / ${eventCount})` : '100%';
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
