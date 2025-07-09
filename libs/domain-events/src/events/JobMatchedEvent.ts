export interface JobInfo {
  id: string;
  title: string;
  company: string;
  url: string;
}

export interface JobMatchedEvent {
  userId: string;
  email: string;
  jobs: JobInfo[];
}
