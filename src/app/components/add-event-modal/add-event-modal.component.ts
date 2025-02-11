import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {MatFormField, MatFormFieldModule, MatHint, MatLabel} from '@angular/material/form-field';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from '@angular/material/datepicker';
import {MatTimepickerModule} from '@angular/material/timepicker';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatSlider, MatSliderThumb} from '@angular/material/slider';
import {MatButton} from '@angular/material/button';
import {provideNativeDateAdapter} from '@angular/material/core';
import {eventsStore} from '../../store/events.store';
import {EventModel} from '../../store/events.model';


@Component({
  selector: 'app-add-event-modal',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput,
    MatInput,
    MatSlider,
    MatButton,
    MatLabel,
    MatSliderThumb,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTimepickerModule
  ],
  templateUrl: './add-event-modal.component.html',
  standalone: true,
  providers: [provideNativeDateAdapter()],

  styleUrl: './add-event-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEventModalComponent{
  store = inject(eventsStore)
  fb = inject(FormBuilder)
  eventForm = this.fb.group({
    id: [crypto.randomUUID(),{nonNullable: true}],
    date: [null],
    title: [''],
    description: [''],
    color: ['#33FF57'],
    duration: [90],
    repeat: 'null'
  });
  submitForm(value: any) {
    console.log(value)
    this.store.addEvent(value as EventModel)
  }
}
