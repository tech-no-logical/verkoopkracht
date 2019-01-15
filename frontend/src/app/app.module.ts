import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER, Injectable } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppConfig } from './app.config';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateParserFormatter, NgbDateStruct, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';


import { AppComponent } from './app.component';
import { VkNavComponent } from './vk-nav/vk-nav.component';
import { VkHomeComponent } from './vk-home/vk-home.component';
import { VkOverviewComponent } from './vk-overview/vk-overview.component';

import { VkOrganizationModule } from './vk-organization/vk-organization.module';
import { VkPersonModule } from './vk-person/vk-person.module';
import { VkTaskModule } from './vk-task/vk-task.module';
import { VkNoteModule } from './vk-note/vk-note.module';

import { VkOrganizationsComponent } from './vk-organization/vk-organizations/vk-organizations.component';
import { VkPersonsComponent } from './vk-person/vk-persons/vk-persons.component';
import { VkTasksComponent } from './vk-task/vk-tasks/vk-tasks.component';
import { VkNotesComponent } from './vk-note/vk-notes/vk-notes.component';

import { VkService } from './vk.service';

export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
}

const routes: Routes = [
  // { path: 'organization', loadChildren: './vk-organization/vk-organization.module#VkOrganizationModule' },
  { path: 'detail/:id', component: VkOverviewComponent },
  { path: 'organization', component: VkOrganizationsComponent },
  { path: 'person', component: VkPersonsComponent },
  { path: 'task', component: VkTasksComponent },
  { path: 'note', component: VkNotesComponent },
  { path: '', component: VkHomeComponent }
];

function padNumber(value: number) {
  if (isNumber(value)) {
    return `0${value}`.slice(-2);
  } else {
    return '';
  }
}

function isNumber(value: any): boolean {
  return !isNaN(toInteger(value));
}

function toInteger(value: any): number {
  return parseInt(`${value}`, 10);
}

@Injectable()
export class NgbIsoDateAdapter extends NgbDateAdapter<string> {
  fromModel(date: string): NgbDateStruct {

    const parsedDate = /(\d\d\d\d)-(\d\d)-(\d\d)/.exec(date);
    if (parsedDate) {
      return <NgbDateStruct>{ year: Number(parsedDate[1]), month: Number(parsedDate[2]), day: Number(parsedDate[3]) };
    } else {
      return null;
    }
  }
  toModel(date: NgbDateStruct): string {
    if (date) {
      return date.year + '-' + padNumber(date.month) + '-' + padNumber(date.day);
    } else {
      return null;
    }
  }
}

@Injectable()
export class NgbDateIsoParserFormatter extends NgbDateParserFormatter {
  parse(value: string): NgbDateStruct {
    if (value) {
      const dateParts = value.trim().split('-');
      if (dateParts.length === 1 && isNumber(dateParts[0])) {
        return { year: toInteger(dateParts[0]), month: null, day: null };
      } else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
        return { year: toInteger(dateParts[0]), month: toInteger(dateParts[1]), day: null };
      } else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
        return { year: toInteger(dateParts[0]), month: toInteger(dateParts[1]), day: toInteger(dateParts[2]) };
      }
    }
    return null;
  }

  format(date: NgbDateStruct): string {
    let stringDate = '';
    if (date) {
      stringDate += date.year + '-';
      stringDate += isNumber(date.month) ? padNumber(date.month) + '-' : '';
      stringDate += isNumber(date.day) ? padNumber(date.day) : '';
    }
    return stringDate;
  }
}

@NgModule({
  declarations: [
    AppComponent,
    VkNavComponent,
    VkHomeComponent,
    VkOverviewComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule.forRoot(),
    ToastrModule.forRoot(),
    RouterModule.forRoot(
      routes,
      {
        // enableTracing: true
      }
    ),
    VkOrganizationModule,
    VkPersonModule,
    VkNoteModule,
    VkTaskModule
  ],
  providers: [
    AppConfig,
    VkService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfig], multi: true
    },
    { provide: NgbDateParserFormatter, useClass: NgbDateIsoParserFormatter },
    { provide: NgbDateAdapter, useClass: NgbIsoDateAdapter }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
