import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {CalendarPageComponent} from '../../components/calendar-page/calendar-page.component';
import {hoursArray} from './hours_object';
import {DatePipe, NgStyle} from '@angular/common';
import {eventsStore} from '../../store/events.store';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragEnd,
  CdkDropList,
  CdkDropListGroup,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import {EventModel} from '../../store/events.model';

@Component({
  selector: 'app-day-table',
  imports: [
    CalendarPageComponent,
    CdkDrag,
    NgStyle,
    DatePipe,
    CdkDropListGroup,
    CdkDropList,
  ],
  templateUrl: './day-table.component.html',
  standalone: true,
  styleUrl: './day-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayTableComponent implements OnInit {
  store = inject(eventsStore);
  selectedDate: string | undefined;
  hoursArray = hoursArray;
  ngOnInit(): void {
  }
  onSelectedDateChange(date: string) {
    this.selectedDate = date;
    console.log('Selected Date:', this.selectedDate);
  }

  get eventsByHour() {
    return hoursArray.map(hour => ({
      ...hour,
      events: this.store.eventItems().filter(event => {
        const eventHour = new Date(event.date).getHours();
        return eventHour === hour.id;
      }),
    }));
  }

  get connectedDropLists() {
    return this.eventsByHour.map(hour => `hour-${hour.id}`);
  }

  getEventStyles(event: EventModel) {
    const eventDate = new Date(event.date);
    const hours = eventDate.getHours();
    const minutes = eventDate.getMinutes();
    const top = hours * 60 + (minutes / 60) * 60;
    const height = Number(event.duration) * 60;

    return {
      top: `${top}px`,
      height: `${height}px`,
    };
  }

  dropped(event: CdkDragDrop<any[]>) {
    if (event.previousContainer !== event.container) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const movedEvent = event.container.data[event.currentIndex];
      const newHour = Number(event.container.id.split('-')[1]); // Extract hour from ID

      this.store.updateEventTime(movedEvent.id, newHour);
    }
    console.log(event);
  }

  getEventWidth(eventCount: number): string {
    return eventCount > 0 ? `calc(100% / ${eventCount})` : '100%';
  }
}

