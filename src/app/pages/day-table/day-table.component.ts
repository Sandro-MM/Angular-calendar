import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import {CalendarPageComponent} from '../../components/calendar-page/calendar-page.component';
import {hoursArray} from './hours_object';
import {DatePipe} from '@angular/common';
import {eventsStore} from '../../store/events.store';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  transferArrayItem
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-day-table',
  imports: [
    CalendarPageComponent,
    CdkDrag,
    DatePipe,
    CdkDropListGroup,
    CdkDropList,
  ],
  templateUrl: './day-table.component.html',
  standalone: true,
  styleUrl: './day-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayTableComponent{
  store = inject(eventsStore);
  selectedDate: WritableSignal<string> = signal<string>('');
  hoursArray = hoursArray;
  onSelectedDateChange(date: string) {
    this.selectedDate.set(date)
  }

  eventsByHour = computed(() => {
    if (!this.selectedDate()) return this.hoursArray;
    const selectedDateString = new Date(this.selectedDate()).toDateString();
    return this.hoursArray.map(hour => ({
      ...hour,
      events: this.store.eventItems().filter(event => {
        const eventDate = new Date(event.date).toDateString();
        const eventHour = new Date(event.date).getHours();
        return eventDate === selectedDateString && eventHour === hour.id;
      }),
    }));
  });


  dropped(event: CdkDragDrop<any[]>) {
    if (event.previousContainer !== event.container) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const movedEvent = event.container.data[event.currentIndex];
      const newHour = Number(event.container.id.split('-')[1]);
      if (newHour){
        const eventDate = new Date(movedEvent.date);
        const localYear = eventDate.getFullYear();
        const localMonth = eventDate.getMonth();
        const localDay = eventDate.getDate();
        const updatedDate = new Date(localYear, localMonth, localDay, newHour, 0, 0, 0);
        this.store.updateEventTime(movedEvent.id, updatedDate.toISOString());
      }
    }
  }
  getEventWidth(eventCount: number): string {
    return eventCount > 0 ? `calc(100% / ${eventCount})` : '100%';
  }
}

