import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { VkTaskService } from '../vk-task.service';
import { Task } from '../../models/task';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-vk-task',
  templateUrl: './vk-task.component.html',
  styleUrls: ['./vk-task.component.css']
})

export class VkTaskComponent implements OnInit {

  taskForm;
  personOptions: Array<{id: number, name: string}> = [];
  organizationOptions: Array<{id: number, name: string}> = [];

  @Input() task: Task;

  constructor(
    private taskService: VkTaskService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {

    this.taskForm = this.fb.group({
      id: [''],
      description: ['', Validators.required],
      details: [''],
      planning: [''],
      done: [''],
      person_id: [''],
      organization_id: [''],
      archived: ['']
    });

    // if (this.task.id) {
      this.taskForm.setValue(this.task);
    // }

    this.taskService.getOrganizationOptions().subscribe(
      (res) => {
        this.organizationOptions = res;
      }
    );

    this.taskService.getPersonOptions().subscribe(
      (res) => {
        this.personOptions = res;
      }
    );
  }

}
