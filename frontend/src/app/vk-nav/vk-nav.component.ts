import { Component, OnInit } from '@angular/core';
import { VkOrganizationService } from '../vk-organization/vk-organization.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { VkOrganizationModalComponent } from '../vk-organization/vk-organization-modal/vk-organization-modal.component';
import { Organization } from '../models/organization';

@Component({
  selector: 'app-vk-nav',
  templateUrl: './vk-nav.component.html'
})
export class VkNavComponent implements OnInit {

  private modalRef: NgbModalRef;
  private organization: Organization;

  constructor(
    private organizationService: VkOrganizationService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
  }

  addOrganization() {
    this.modalRef = this.modalService.open(VkOrganizationModalComponent, { size: 'lg' });
    this.modalRef.componentInstance.organization = this.organization;
    this.modalRef.result.then(
      (orga) => {
        console.log(orga);
        // this.organizationService.saveOrganization(orga).subscribe(
        //   (res) => {
        //     this.getOrganizations();
        //   });
      },
      (reason) => {
        // dismissed
      }
    );

  }
}
