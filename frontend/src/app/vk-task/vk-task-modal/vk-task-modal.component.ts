import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Task } from '../../models/task';

@Component({
  selector: 'app-vk-task-modal',
  templateUrl: './vk-task-modal.component.html',
  styles: []
})
export class VkTaskModalComponent implements OnInit {

  task: Task;

  constructor(
    public modalRef: NgbActiveModal
  ) { }

  ngOnInit() {
  }

}

