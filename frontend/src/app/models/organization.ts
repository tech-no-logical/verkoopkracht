import { Task } from './task';
import { Note } from './note';
import { Person } from './person';

export class Organization {
    isNew?: false;
    id: number;
    created: string;
    modified: string;
    name: string;
    address?: string;
    zipcode?: string;
    city?: string;
    postaddress?: string;
    postzip?: string;
    postcity?: string;
    email?: string;
    website?: string;
    sector_id: Array<number>;
    status_id: number;
    // status: string;
    phone?: Array<string>;
    hastasks: number;
    // notes?: Array<Note>;
    // tasks?: Array<Task>;
    // persons?: Array<Person>;
}
