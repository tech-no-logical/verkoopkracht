import { Component, OnInit } from '@angular/core';
import { Organization } from '../../models/organization';
import { VkOrganizationService } from '../vk-organization.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { VkOrganizationModalComponent } from '../vk-organization-modal/vk-organization-modal.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { VkService } from '../../vk.service';

@Component({
  selector: 'app-vk-organizations',
  templateUrl: './vk-organizations.component.html'
})
export class VkOrganizationsComponent implements OnInit {

  modalRef: NgbModalRef;
  organizations: Array<Organization> = [];
  public filter = { quickFilter: '' };

  columnDefs = [
    { mame: '#', field: 'id' },
    { name: 'Naam', field: 'name', qf: true },
    { name: 'Postcode', field: 'zipcode', qf: true },
    { name: 'Plaats', field: 'city', qf: true },
    // { name: 'Contact', field: 'hascontact' },
    // { name: 'Email', field: 'email', type: 'email' },
    // { name: 'Website', field: 'website', type: 'url' },
    { name: 'Telefoon', field: 'phone' },
    { name: 'Sector', field: 'sector', qf: true },
    { name: 'Status', field: 'status', qf: true },
    { name: 'Gewijzigd', field: 'modified' },
    {
      name: 'Taken', field: 'hastasks', type: 'mapped', map: [
        '<div class="text-center p3 bg-secondary text-white">Geen</div>',
        '<div class="text-center p3 bg-success text-white">Te doen</div>',
        '<div class="text-center p3 bg-danger text-white">Te laat</div>'
      ]
    }
  ];
  baseSortOrder = ['-hastasks', 'name', 'modified', 'sector', 'status', 'zipcode', 'city'];

  constructor(
    private organizationService: VkOrganizationService,
    private modalService: NgbModal,
    private router: Router,
    private toastService: ToastrService,
    private service: VkService
  ) { }

  ngOnInit() {
    this.getOrganizations();
  }

  change(field?) {
    this.filter = JSON.parse(JSON.stringify(this.filter));
  }

  addOrganization() {
    const newOrga = new Organization();
    this.modalRef = this.modalService.open(VkOrganizationModalComponent, { size: 'lg' });
    this.modalRef.componentInstance.organization = newOrga;
    this.modalRef.result.then(
      (orga) => {
        this.organizationService.createOrganization(orga).subscribe(
          (res) => {
            this.toastService.success('Organisatie aangemaakt');
            this.getOrganizations();

          },
          (err) => {
            this.toastService.error('Er is iets misgegaan');
          }
        );
      },
      (reason) => {
        // dismissed
      }
    );
  }

  deleteOrganization(id) {
    if (window.confirm('Verwijderen ?')) {
      this.organizationService.deleteOrganization(id).subscribe(
        (res) => {
          this.toastService.success('Organisatie verwijderd');
          this.getOrganizations();
        },
        (err) => this.toastService.error('Er is iets misgegaan')
      );
    }
  }

  getOrganizations() {

    // this.service.getOrganizations().subscribe(
    //   (res) => {
    //     this.organizations = res; console.log(this.organizations);
    //   }
    // );

    this.organizationService.getOrganizations().subscribe(
      (res) => { this.organizations = res; console.log(this.organizations); },
      (err) => {
        this.toastService.error('Er is iets misgegaan');
        console.log(err);
      }
    );
  }

  rowClicked(id) {
    // this.organizationService.getOrganization(id).subscribe(
    //   (organization) => {
    //     this.modalRef = this.modalService.open(VkOrganizationModalComponent, { size: 'lg' });
    //     this.modalRef.componentInstance.organization = organization;
    //     this.modalRef.result.then(
    //       (orga) => {
    //         this.organizationService.saveOrganization(orga).subscribe(
    //           (res) => {
    //             this.getOrganizations();
    //           });
    //       },
    //       (reason) => {
    //         // dismissed
    //       }
    //     );
    //   }
    // );
    this.router.navigateByUrl('/detail/' + id);
  }

}
