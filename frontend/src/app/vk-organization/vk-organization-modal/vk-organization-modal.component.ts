import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Organization } from '../../models/organization';

@Component({
  selector: 'app-vk-organization-modal',
  templateUrl: './vk-organization-modal.component.html',
  styles: []
})
export class VkOrganizationModalComponent implements OnInit {

  organization: Organization;

  constructor(
    public modalRef: NgbActiveModal
  ) { }

  ngOnInit() {
  }
}
