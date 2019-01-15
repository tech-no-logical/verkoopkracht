import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Person } from '../../models/person';

@Component({
  selector: 'app-vk-person-modal',
  templateUrl: './vk-person-modal.component.html',
  styles: []
})
export class VkPersonModalComponent implements OnInit {

  person: Person;

  constructor(
    public modalRef: NgbActiveModal
  ) { }

  ngOnInit() {
  }

}
