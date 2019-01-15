import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
// import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';

import { VkPersonService } from './vk-person.service';
import { VkPersonComponent } from './vk-person/vk-person.component';
import { VkPersonsComponent } from './vk-persons/vk-persons.component';
import { VkPersonModalComponent } from './vk-person-modal/vk-person-modal.component';

// const routes: Routes = [
//   { path: '', component: VkPersonsComponent }
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
  declarations: [VkPersonComponent, VkPersonsComponent, VkPersonModalComponent],
  providers: [ VkPersonService ],
  entryComponents: [ VkPersonModalComponent ],
  exports: [ VkPersonComponent, VkPersonsComponent ]
})
export class VkPersonModule { }
