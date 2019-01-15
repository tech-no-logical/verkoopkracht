import { Component, OnInit, ViewChild } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { VkOrganizationService } from '../vk-organization/vk-organization.service';
import { VkOrganizationComponent } from '../vk-organization/vk-organization/vk-organization.component';
import { VkService } from '../vk.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vk-overview',
  templateUrl: './vk-overview.component.html'
})
export class VkOverviewComponent implements OnInit {

  public organization;
  @ViewChild('orga') orga: VkOrganizationComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private organizationService: VkOrganizationService,
    private service: VkService,
    private toastService: ToastrService
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => this.organizationService.getOrganization(params.get('id'))))
      .subscribe((organization) => {
        this.organization = organization;

      });
  }

  saveOrganization() {
    this.organizationService.saveOrganization(this.orga.organizationForm.value).subscribe(
      (res) => {
        // ok
        this.toastService.success('Organisatie opgeslagen');
      },
      (err) => {
        this.toastService.error('Er is iets misgegaan');
        // err
      }
    );
  }

  deleteOrganization() {
    if (window.confirm('Verwijderen ?')) {
      this.organizationService.deleteOrganization(this.organization.id).subscribe(
        (res) => {
          this.router.navigateByUrl('/');
        });
    }
  }
}
