import { Component, OnInit, Input, forwardRef, ChangeDetectionStrategy, OnChanges, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, FormGroup, Validators, NG_VALIDATORS } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-vk-typeahead',
  templateUrl: './vk-typeahead.component.html',
  styles: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VkTypeaheadComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => VkTypeaheadComponent),
      multi: true
    }
  ],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class VkTypeaheadComponent implements OnInit, ControlValueAccessor, OnChanges {

  @ViewChild('ss') ss;
  @Input() items: Array<{ id: number, name: string }>;
  @Input() value: number;
  selectedItem: { id?: number, name?: string };

  aheadForm = new FormGroup({
    // aheadItem: new FormControl('', { updateOn: 'change'})
  });

  aheadItem: FormControl;
  typedValue = '';

  onChange: any = () => { };
  onTouched: any = () => { };

  constructor() {
    this.aheadItem = new FormControl('', { updateOn: 'change' });
    this.aheadForm.registerControl('aheadItem', this.aheadItem);
    this.aheadItem.statusChanges.subscribe((status) => { // triggers on keyup, because it's { update: 'change'} in the formcontrol
      // whenever the text input changes, check the value of our typeAhead, and update the global value accordingly
      if (!this.aheadItem.value) {
        this.value = undefined;
      }
      this.onChange(this.value);
    });
  }

  ngOnChanges() {  // triggered when input changes, ie. when items resolves.
    this.selectedItem = this.items.find((item) => item.id === this.value);
    this.aheadForm.patchValue({ aheadItem: this.selectedItem });
  }

  ngOnInit() {
    // this.selectedItem = this.items.find((item) => item.id === this.value);
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  writeValue(value) {
    this.value = value;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  formatter = (item) => item.name ? item.name : '';

  selectItem(payload) {
    this.value = payload.item.id;
    this.onChange(this.value);
  }

  search = term => this._search(term);

  _search = (text$: Observable<string>): Observable<Array<any>> => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 1 ? []
        : this.items.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 20))
    );
  }

  public validate(c: FormControl) {
    let status = null;
    if (this.ss.nativeElement.value && !this.aheadItem.value) {
      status = { 'typeahead': 'error' };
    }
    return status;

  }
}
