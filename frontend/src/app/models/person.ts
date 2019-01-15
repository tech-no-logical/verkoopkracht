import { Task } from './task';
import { Note } from './note';

export class Person {
    id: number = null;
    firstname: string = null;
    lastname: string = null;
    insertion: string = null;
    salutation?: string = null;
    position?: string = null;
    email?: string = null;
    archived: false;
    created: string;
    modified: string;
    organization_id: number = null;
    phone?: Array<string> = [];
    // notes?: Array<Note>;
    // tasks?: Array<Task>;
}
