
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

// import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';

import { VkNotesComponent } from './vk-notes/vk-notes.component';
import { VkNoteComponent } from './vk-note/vk-note.component';
import { VkNoteModalComponent } from './vk-note-modal/vk-note-modal.component';
import { VkNoteService } from './vk-note.service';

// const routes: Routes = [
//   { path: '', component: VkNotesComponent }
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
  declarations: [VkNotesComponent, VkNoteComponent, VkNoteModalComponent],
  providers: [ VkNoteService ],
  entryComponents: [ VkNoteModalComponent ],
  exports: [VkNoteComponent, VkNotesComponent]
})
export class VkNoteModule { }
