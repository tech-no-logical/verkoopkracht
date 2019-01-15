import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { VkOrganizationService } from '../vk-organization.service';
import { Organization } from '../../models/organization';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-vk-organization',
  templateUrl: './vk-organization.component.html'
})
export class VkOrganizationComponent implements OnInit {

  organizationForm;
  statusOptions: Array<{ id: number, name: string }>;
  sectorOptions: Array<{ id: number, name: string }>;
  @Input() organization: Organization;

  constructor(
    private organizationService: VkOrganizationService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {

    this.organizationService.getStatusOptions().subscribe(
      (res) => {
        this.statusOptions = res;
      }
    );

    this.organizationService.getSectorOptions().subscribe(
      (res) => {
        this.sectorOptions = res;
      }
    );

    this.organizationForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      address: [''],
      zipcode: [''],
      city: [''],
      postaddress: [''],
      postzip: [''],
      postcity: [''],
      email: [''],
      website: [''],
      status_id: ['', Validators.required],
      phone: this.fb.array(
        this.organization.phone ? this.organization.phone.map(el => new FormControl('')) : []
      ),
      sector_id: this.fb.array(
        this.organization.sector_id ? this.organization.sector_id.map(el => new FormControl('')) : []
      )
    });

    if (this.organization.id) {
      this.organizationForm.setValue(this.organization);
    }

  }


  addPhone() {
    this.organizationForm.get('phone').push(this.fb.control(''));
  }

  delPhone(i) {
    this.organizationForm.get('phone').removeAt(i);
  }

  addSector() {
    this.organizationForm.get('sector_id').push(this.fb.control(''));
  }

  delSector(i) {
    this.organizationForm.get('sector_id').removeAt(i);
  }
  // get phone() {
  //   console.log(this.organizationForm.get('phone') as FormArray);
  //   return this.organizationForm.get('phone') as FormArray;
  // }


}
