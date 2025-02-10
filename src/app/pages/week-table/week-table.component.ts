import {Component, computed, inject, signal, WritableSignal} from '@angular/core';
import {CalendarPageComponent} from '../../components/calendar-page/calendar-page.component';
import {hoursArray} from '../day-table/hours_object';
import {eventsStore} from '../../store/events.store';
import {CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, transferArrayItem} from '@angular/cdk/drag-drop';
import {DatePipe} from '@angular/common';

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
  styleUrl: './week-table.component.css'
})
export class WeekTableComponent {
  hoursArray = hoursArray;
  store = inject(eventsStore);
  itemObject = [
    {
      "id": "3",
      "date": "Tue Feb 09 2025 21:34:56 GMT+0400",
      "title": "Cycling",
      "description": "Cycling in park",
      "color": "Blue",
      "repeat": "none",
      "duration": "350"
    }
  ]
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

  dropped(event: CdkDragDrop<any[]>) {
    console.log('fropped')
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
        console.log(updatedDate)
        this.store.updateEventTime(movedEvent.id, updatedDate.toISOString());
      }
    }
  }

  onSelectedDateChange(date: string) {
    this.selectedDate.set(date)
    console.log('Selected Date:', this.selectedDate);
  }
}
