export interface JobRequest {
  id: number;
  client: string;
  title: string;
  dueDate: string;
  status: 'Pending' | 'In progress' | 'Done';
  owner: string;
}
