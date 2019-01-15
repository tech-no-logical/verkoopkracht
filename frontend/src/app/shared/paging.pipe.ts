import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paging',
  pure: false
})
export class PagingPipe implements PipeTransform {

  transform(items: any[], pagesize: number, page: number): any[] {
    if (items) {
      return items.slice((page - 1) * pagesize, page * pagesize);
    } else {
      return [];
    }
  }

}
