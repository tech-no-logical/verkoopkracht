export class Note {
    id: number = null;
    person_id?: number = null;
    organization_id?: number = null;
    description: string = null;
    details?: string = null;
    created: string;
    modified: string;
    archived = false;
}
