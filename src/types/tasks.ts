export interface TaskRead {
    task_id: string;
    name: string;
    description: string | null;
    link: string;
    type: string;
}
