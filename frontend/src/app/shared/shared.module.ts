import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VkGridComponent } from './vk-grid/vk-grid.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PagingPipe } from './paging.pipe';
import { VkTypeaheadComponent } from './vk-typeahead/vk-typeahead.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule
  ],
  declarations: [VkGridComponent, PagingPipe, VkTypeaheadComponent],
  exports: [ VkGridComponent, VkTypeaheadComponent ]
})
export class SharedModule { }
