import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {CalendarPageComponent} from '../../components/calendar-page/calendar-page.component';
import {hoursArray} from './hours_object';
import {NgStyle} from '@angular/common';
import {eventsStore} from '../../store/events.store';
import {CdkDrag, CdkDragEnd, CdkDropList} from '@angular/cdk/drag-drop';
import {EventModel} from '../../store/events.model';

@Component({
  selector: 'app-day-table',
  imports: [
    CalendarPageComponent,
    CdkDrag,
    NgStyle,
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
    const newY = event.source.getFreeDragPosition().y;

    // Convert Y position to time
    const time = this.getTimeFromPosition(newY);

    console.log("New time:", time);

    // Update event time
    const newDate = new Date(draggedEvent.date);
    const [hours, minutes] = time.split(":").map(Number);
    newDate.setHours(hours, minutes, 0, 0);

    // Update store with new time


  }
  getTimeFromPosition(y: number): string {
    const minY = this.tableOffsetTop; // Ensure correct start point
    const hourHeight = 60; // Each hour row is 60px
    const stepSize = 15; // Each 15px = 15 minutes

    // Find how many 15-minute steps have passed
    const totalMinutes = Math.round((y - minY) / stepSize) * 15;

    // Convert total minutes to HH:MM format
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    // Format as "HH:MM"
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
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

