import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-vk-grid',
  templateUrl: './vk-grid.component.html',
  styles: []
})

export class VkGridComponent implements OnInit, OnChanges {

  @Input() columns: Array<any>;
  @Input() rows: Array<any>;
  @Input() canDelete = false;
  @Input() baseSortOrder: Array<string> = [];
  @Input() pageSize = 20;
  @Input() filter = { filters: {}, quickFilter: '' };
  @Input() hidePager = false;

  @Output() rowClicked = new EventEmitter<any>();
  @Output() cellClicked = new EventEmitter<any>();
  @Output() deleteClicked = new EventEmitter<any>();

  // private baseSortOrder = [];
  private sortOrder = [];
  public filtered = [];
  public page = 1;

  constructor() { }

  ngOnInit() {
    this.sortOrder = this.baseSortOrder;
    console.log(this.canDelete);
  }

  ngOnChanges() {

    this.filtered = this.rows.filter((row) => {
      let state = true;

      if (this.filter.quickFilter) {
        state = this.columns
          .filter((c => c.qf === true)) // select cols with qf option set
          .some( // match any of the found cols against qf value
            (c) => row[c.field] ? row[c.field].toLowerCase().indexOf(this.filter.quickFilter.toLowerCase()) > -1 : false
          );
      }


      if (this.filter.filters) {
        const keys = Object.keys(this.filter.filters);
        state = state && keys.every((field) => {
          if (this.filter.filters[field] !== null) {
            return row[field] === this.filter.filters[field];
          } else {
            return true;
          }
        });
      }

      return state;
    });

  }

  clicked(id) {
    this.rowClicked.emit(id);
  }

  cell($event, rowid, field) {
    if (this.columns.find((c) => c.field === field).emitclick === true) {
      this.cellClicked.emit({ id: rowid, field: field});
      $event.stopPropagation();
    }
  }

  delete($event, id) {
    this.deleteClicked.emit(id);
    $event.stopPropagation();
  }

  sortByAttribute(array, ...attrs) {
    // generate an array of predicate-objects contains
    // property getter, and descending indicator
    const predicates = attrs.map(pred => {
      const descending = pred.charAt(0) === '-' ? -1 : 1;
      pred = pred.replace(/^-/, '');
      return {
        getter: o => typeof o[pred] === 'string' ? o[pred].toLowerCase() : o[pred], // case insensitive sort
        descend: descending
      };
    });
    // schwartzian transform idiom implementation. aka: "decorate-sort-undecorate"
    return array.map(item => {
      return {
        src: item,
        compareValues: predicates.map(predicate => predicate.getter(item))
      };
    })
      .sort((o1, o2) => {
        let i = -1, result = 0;
        while (++i < predicates.length) {
          if (o1.compareValues[i] < o2.compareValues[i]) { result = -1; }
          if (o1.compareValues[i] > o2.compareValues[i]) { result = 1; }
          if (result *= predicates[i].descend) { break; }
        }
        return result;
      })
      .map(item => item.src);
  }


  getSortState(field) {

    if (field === 'hastasks') {
      // console.log('found '+field);
    }
    if (this.baseSortOrder.findIndex((value) => new RegExp('^-{0,1}' + field).test(value)) === -1) {
      return '';
    }

    if (this.sortOrder[0].replace(/^-/, '') === field) {
      if (!this.sortOrder[0].startsWith('-')) {
        return '⭡';
      } else {
        return '⭣';
      }
    } else {
      return '⮃';
    }
  }


  sortBy(field) {
    // asked to sort on a particular fiels. based on the baseSortOrder, find this field and place first. unless it already is.
    if (this.sortOrder[0].replace(/^-{0,1}/, '') === field) {
      console.log('flipping for ' + field);
      // flip the sort order
      if (!this.sortOrder[0].startsWith('-')) {
        this.sortOrder[0] = '-' + this.sortOrder[0];
      } else {
        this.sortOrder[0] = this.sortOrder[0].slice(1);
      }
    } else {
      // find the field in the baseSortOption, put it first.
      this.sortOrder = this.baseSortOrder;
      const match = this.baseSortOrder.findIndex((value) => new RegExp('^-{0,1}' + field).test(value));

      if (match > -1) {
        const tmp = [...this.baseSortOrder];
        this.sortOrder = [...tmp.splice(match, 1), ...tmp];
      }
    }

    console.log(this.sortOrder);
    this.filtered = this.sortByAttribute(this.filtered, ...this.sortOrder);


  }
}
