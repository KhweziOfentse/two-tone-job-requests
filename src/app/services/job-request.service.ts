import { Injectable } from '@angular/core';
import { JobRequest } from '../models/job-requests';

@Injectable({
  providedIn: 'root',
})
export class JobRequestService {
  private jobsUrl = '/jobs.json';

  getJobs(): Promise<JobRequest[]> {
    return fetch(this.jobsUrl).then((response) => {
      if (!response.ok) {
        throw new Error('Failed to load job requests');
      }

      return response.json();
    });
  }
}
