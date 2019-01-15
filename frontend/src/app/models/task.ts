export class Task {
    id: number = null;
    organization_id?: number = null;
    person_id?: number = null;
    description: string = null;
    details?: string = null;
    created: string;
    modified: string;
    planning: string = null;
    done = false;
    archived = false;
    // person?: number;
    // organization?: number;
}
