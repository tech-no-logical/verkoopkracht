import { Injectable } from '@angular/core';
import { AppConfig } from '../app.config';
import { HttpClient, HttpRequest, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Person } from '../models/person';
import { Organization } from '../models/organization';

@Injectable({
  providedIn: 'root'
})
export class VkPersonService {

  protected url = AppConfig.settings.config.url;

  constructor(
    private http: HttpClient
  ) { }

  getPersons(organization_id?: number) {

    let qs = '';
    if (organization_id) {
      qs = '?org=' + organization_id.toString();
    }
    return this.http.get<Array<Person>>(this.url + '/persons' + qs);
  }

  getPerson(id) {
    return this.http.get<Person>(this.url + '/persons/' + id);
  }

  createPerson(org: Person) {
    return this.http.post<Person>(this.url + '/persons/', org);
  }

  savePerson(org: Person) {
    return this.http.put<Person>(this.url + '/persons/' + org.id, org);
  }

  deletePerson(id) {
    return this.http.delete(this.url + '/persons/' + id);
  }

  getOrganizationFromPerson(id) {
    return this.http.get<Organization>(this.url + '/persons/' + id + '/organization');
  }

  getOrganizationOptions() {
    return this.http.get<Array<{ id: number, name: string }>>(this.url + '/organizations/list');
  }
}
