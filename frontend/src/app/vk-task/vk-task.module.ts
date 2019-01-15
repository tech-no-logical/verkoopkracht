import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
// import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';

import { VkTasksComponent } from './vk-tasks/vk-tasks.component';
import { VkTaskComponent } from './vk-task/vk-task.component';
import { VkTaskModalComponent } from './vk-task-modal/vk-task-modal.component';
import { VkTaskService } from './vk-task.service';

// const routes: Routes = [
//   { path: '', component: VkTasksComponent }
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
  declarations: [VkTasksComponent, VkTaskComponent, VkTaskModalComponent],
  providers: [VkTaskService],
  entryComponents: [VkTaskModalComponent],
  exports: [VkTaskComponent, VkTasksComponent]
})
export class VkTaskModule { }
