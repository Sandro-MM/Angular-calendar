import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {CalendarPageComponent} from '../../components/calendar-page/calendar-page.component';
import {hours_object} from './hours_object';
import {KeyValuePipe, NgStyle} from '@angular/common';
import {eventsStore} from '../../store/events.store';
import {CdkDrag, CdkDragEnd, CdkDragMove} from '@angular/cdk/drag-drop';
import {EventModel} from '../../store/events.model';

@Component({
  selector: 'app-day-table',
  imports: [
    CalendarPageComponent,
    KeyValuePipe,
    CdkDrag,
    NgStyle
  ],
  templateUrl: './day-table.component.html',
  standalone: true,
  styleUrl: './day-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayTableComponent implements OnInit{
  store = inject(eventsStore);

  selectedDate: string | undefined;
  hoursObject = hours_object

  onSelectedDateChange(date: string) {
    this.selectedDate = date;
    console.log('Selected Date:', this.selectedDate);
  }

  ngOnInit(): void {

  }

  onDragStart(event: DragEvent, draggedEvent: EventModel) {
    event.dataTransfer?.setData("eventId", draggedEvent.id);
  }

  onDragEnd(event: CdkDragEnd, draggedEvent: EventModel) {
    const newY = event.source.getFreeDragPosition().y;

    // 🕒 Convert to nearest hour slot (snapping)
    const slotHeight = 60; // Each hour row is 60px
    const newHour = Math.round(newY / slotHeight); // Snap to nearest hour

    // Update event time
    const newDate = new Date(draggedEvent.date);
    newDate.setHours(newHour);

    // Update store
    this.store.updateEvent({ ...draggedEvent, date: newDate.toISOString() });

    // Reset position to prevent unexpected movement
    event.source.reset();
  }

  onDragMove(event: CdkDragMove<EventModel>) {
    const eventBox = event.source.element.nativeElement;
    const parentTable = document.querySelector('.day-table') as HTMLElement;

    // Prevent moving out of top boundary
    if (eventBox.offsetTop < 0) {
      eventBox.style.top = '0px';
    }

    // Prevent moving out of bottom boundary
    const maxBottom = parentTable.clientHeight - eventBox.clientHeight;
    if (eventBox.offsetTop > maxBottom) {
      eventBox.style.top = maxBottom + 'px';
    }
  }

  getEventStyles(event: EventModel) {
    const eventDate = new Date(event.date);
    const hours = eventDate.getHours();
    const minutes = eventDate.getMinutes();

    // Calculate top position (each hour is 60px)
    const top = hours * 60 + (minutes / 60) * 60;

    // Calculate height based on duration (each hour is 60px)
    const height = Number(event.duration) * 60;

    return {
      top: `${top}px`,
      height: `${height}px`
    };
  }
}
