import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
// import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';

import { VkOrganizationsComponent } from './vk-organizations/vk-organizations.component';
import { VkOrganizationComponent } from './vk-organization/vk-organization.component';
import { VkOrganizationService } from './vk-organization.service';
import { VkOrganizationModalComponent } from './vk-organization-modal/vk-organization-modal.component';

// const routes: Routes = [
//   { path: '', component: VkOrganizationsComponent },
// ];

@NgModule({
  imports: [
    CommonModule,
    // RouterModule.forChild(routes),
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    SharedModule
  ],
  // exports: [
  //   RouterModule
  // ],
  declarations: [
    VkOrganizationsComponent,
    VkOrganizationComponent,
    VkOrganizationModalComponent
  ],
  providers: [VkOrganizationService],
  entryComponents: [VkOrganizationModalComponent],
  exports: [VkOrganizationComponent ]
})
export class VkOrganizationModule { }
