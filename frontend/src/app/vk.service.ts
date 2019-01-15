import { Injectable } from '@angular/core';
import { AppConfig } from './app.config';
import { HttpClient, HttpRequest, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Organization } from './models/organization';
import { BehaviorSubject, Observable } from 'rxjs';
import { of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class VkService {

  protected url = AppConfig.settings.config.url;
  private organizations: Array<any>;
  private $organizations: BehaviorSubject<Array<any>>;
  private persons: Array<any>;
  private $persons: BehaviorSubject<Array<any>>;

  constructor(
    private http: HttpClient
  ) {
    this.organizations = [];
    this.persons = [];
    this.$organizations = new BehaviorSubject(this.organizations);
  }

  getOrganizations(): BehaviorSubject<Array<any>> {
    if (!this.organizations.length) {
      console.log('loading');
      this.http.get<Array<Organization>>(this.url + '/organizations').subscribe(
        (res) => {
          console.log(res);
          this.organizations = res;
          this.$organizations.next(this.organizations);
        }
      );
    } else {
      console.log('not loading');
    }
    return this.$organizations;
  }

  getPersons(): BehaviorSubject<Array<any>> {
    if (!this.persons.length) {
      console.log('loading');
      this.http.get<Array<Organization>>(this.url + '/persons').subscribe(
        (res) => {
          console.log(res);
          this.persons = res;
          this.$persons.next(this.persons);
        }
      );
    } else {
      console.log('not loading');
    }
    return this.$persons;
  }

  saveOrganization(org: Organization) {
    if (this.organizations.length) {
      const i = this.organizations.findIndex((o) => o.id === org.id);
      this.organizations[i] = org;
      this.$organizations.next(this.organizations);
    }
    return this.http.put<Organization>(this.url + '/organizations/' + org.id, org);
  }

  getFirstPersonId(id) {
    return this.http.get<{id: number}>(this.url + '/organizations/' + id + '/firstpersonid');
  }


  _getOrganizations() {
    return this.http.get<Array<Organization>>(this.url + '/organizations');
  }

  _getOrganization(id) {
    return this.http.get<Organization>(this.url + '/organizations/' + id);
  }

  _createOrganization(org: Organization) {
    return this.http.post<Organization>(this.url + '/organizations/', org);
  }

  _saveOrganization(org: Organization) {
    return this.http.put<Organization>(this.url + '/organizations/' + org.id, org);
  }

  _deleteOrganization(id) {
    return this.http.delete(this.url + '/organizations/' + id);
  }

  _getStatusOptions() {
    return this.http.get<Array<{ id: number, name: string }>>(this.url + '/organizations/statuses');
  }

  _getSectorOptions() {
    return this.http.get<Array<{ id: number, name: string }>>(this.url + '/organizations/sectors');
  }
}
