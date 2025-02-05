import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatFormField} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';


@Component({
  selector: 'app-dropdown',
  imports: [
    MatFormField,
    MatSelect,
    MatOption,
    ReactiveFormsModule,
  ],
  templateUrl: './dropdown.component.html',
  standalone: true,
  styleUrl: './dropdown.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownComponent {
  label = input<string>('Select an option');
  options = input<{ value: string; label: string }[]>([]);
  control = input<FormControl>(new FormControl<string>(''));

}
