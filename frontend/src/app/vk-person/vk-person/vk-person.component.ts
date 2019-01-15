import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ViewChild } from '@angular/core';
import { VkPersonService } from '../vk-person.service';
import { Person } from '../../models/person';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
// import { Observable } from 'rxjs';
// import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-vk-person',
  templateUrl: './vk-person.component.html',
  styleUrls: ['./vk-person.component.css']
})
export class VkPersonComponent implements OnInit {

  personForm;
  organization: string; // value for the typeahead, which is not strictly
  organizationOptions: Array<{ id: number, name: string }> = [];

  // search = this._search.bind(this);

  @Input() person: Person;

  @ViewChild('orga') orga: NgbTypeahead;

  constructor(
    private personService: VkPersonService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {

    this.personForm = this.fb.group({
      id: [''],
      salutation: [''],
      firstname: [''],
      insertion: [''],
      lastname: ['', Validators.required],
      email: [''],
      position: [''],
      phone: this.fb.array(
        this.person.phone ? this.person.phone.map(el => new FormControl('')) : []
      ),
      organization_id: ['']
    });

    // if (this.person.id) {
      this.personForm.setValue(this.person);
    // }

    this.personService.getOrganizationOptions().subscribe(
      (res) => {
        this.organizationOptions = res;
      }
    );
  }

  addPhone() {
    this.personForm.get('phone').push(this.fb.control(''));
  }

  delPhone(i) {
    this.personForm.get('phone').removeAt(i);
  }
}
