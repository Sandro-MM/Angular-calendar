import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {CalendarPageComponent} from '../../components/calendar-page/calendar-page.component';
import {hoursArray} from './hours_object';
import {DatePipe, NgStyle} from '@angular/common';
import {eventsStore} from '../../store/events.store';
import {CdkDrag, CdkDragEnd, CdkDropList} from '@angular/cdk/drag-drop';
import {EventModel} from '../../store/events.model';

@Component({
  selector: 'app-day-table',
  imports: [
    CalendarPageComponent,
    CdkDrag,
    NgStyle,
    DatePipe,
  ],
  templateUrl: './day-table.component.html',
  standalone: true,
  styleUrl: './day-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayTableComponent implements OnInit, AfterViewInit {


  store = inject(eventsStore);
  selectedDate: string | undefined;
  hoursArray = hoursArray;
  @ViewChild('dayTable') dayTable!: ElementRef;
  tableHeight = 0;
  tableOffsetTop = 0;
  ngOnInit(): void {}
  onSelectedDateChange(date: string) {
    this.selectedDate = date;
    console.log('Selected Date:', this.selectedDate);
  }

  ngAfterViewInit(): void {
    const tableElement = this.dayTable.nativeElement;
    this.tableHeight = tableElement.clientHeight;
    this.tableOffsetTop = tableElement.getBoundingClientRect().top;
  }

  constrainPosition = (point: { x: number; y: number }) => {
    const hourHeight = 60;
    const stepSize = 15;
    const minY = this.tableOffsetTop;
    const maxY = minY + this.tableHeight - hourHeight;
    let snappedY = Math.round((point.y - minY) / stepSize) * stepSize + minY;
    snappedY = Math.max(minY, Math.min(snappedY, maxY));
    return { x: 0, y: snappedY };
  };

  onDragEnd(event: CdkDragEnd, draggedEvent: EventModel) {
    const draggedElement = event.source.getRootElement();
    const dayTable = this.dayTable.nativeElement as HTMLElement;

    // Get final Y position inside `.day-table`
    const draggedElementTop = draggedElement.getBoundingClientRect().top;
    const dayTableTop = dayTable.getBoundingClientRect().top;
    const finalY = draggedElementTop - dayTableTop;

    // Convert Y position to time
    const time = this.getTimeFromPosition(finalY);
    console.log("Final Time:", time);

    // Create a new Date object from the existing event date
    const updatedDate = new Date(draggedEvent.date);

    // Parse the new hours and minutes
    const [hours, minutes] = time.split(":").map(Number);

    // Set the new time while keeping the same date
    updatedDate.setHours(hours, minutes, 0, 0);

    // Update the event object with the new date
    const updatedEvent: EventModel = {
      ...draggedEvent,
      date: updatedDate.toString(), // Ensure date is properly updated
    };

    // Call the store update method
    this.store.updateEvent(updatedEvent);
  }
  getTimeFromPosition(y: number): string {
    const stepSize = 15; // Each 15px = 15 minutes
    const totalMinutes = Math.round(y / stepSize) * 15;

    // Convert total minutes to HH:MM
    let hours = Math.floor(totalMinutes / 60) % 24; // Ensure it loops after 24 hours
    let minutes = totalMinutes % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
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
}

