import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobRequest } from './models/job-requests';
import { JobRequestService } from './services/job-request.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'two-tone-job-requests';
//this part is for the job requests and the search and filter functionality

  jobs: JobRequest[] = [];
  searchTerm = '';
  selectedStatus = 'All';

  loading = true;
  errorMessage = '';

  showForm = false;
  submitted = false;

  newJob = {
    client: '',
    title: '',
    dueDate: '',
    status: 'Pending' as JobRequest['status'],
    owner: '',
  };
  get today(): string {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  constructor(private jobRequestService: JobRequestService) {}

  ngOnInit(): void {
    this.loadJobs();
  }
// this section is for the loading of the jobs and the error handling
  loadJobs(): void {
    this.loading = true;
    this.errorMessage = '';

    this.jobRequestService
      .getJobs()
      .then((jobs) => {
        this.jobs = jobs;
        this.loading = false;
      })
      .catch((error) => {
        console.error('Error loading job requests:', error);
        this.errorMessage = 'Failed to load job requests. Please try again.';
        this.loading = false;
      });
  }
  // this section is for the opening and closing of the form and the adding of a new job request. The form will only be submitted if all the required fields are filled out. The new job request will be added to the top of the list and the form will be reset.
  openForm(): void {
    this.showForm = true;
    this.submitted = false;
  }

  closeForm(): void {
    this.showForm = false;
    this.submitted = false;
  }

  addJob(): void {
    this.submitted = true;

    if (
      !this.newJob.client.trim() ||
      !this.newJob.title.trim() ||
      !this.newJob.dueDate ||
      !this.newJob.owner.trim()
    ) {
      return;
    }

    const newId =
      this.jobs.length > 0
        ? Math.max(...this.jobs.map((job) => job.id)) + 1
        : 1;

    const job: JobRequest = {
      id: newId,
      client: this.newJob.client.trim(),
      title: this.newJob.title.trim(),
      dueDate: this.newJob.dueDate,
      status: this.newJob.status,
      owner: this.newJob.owner.trim(),
    };

    this.jobs = [job, ...this.jobs];
//the pending status will be the default status for a new job request. The form will be reset after the new job request is added to the list.
    this.newJob = {
      client: '',
      title: '',
      dueDate: '',
      status: 'Pending',
      owner: '',
    };

    this.showForm = false;
    this.submitted = false;
  }
  get filteredJobs(): JobRequest[] {
    return this.jobs.filter((job) => {
      const matchesSearch =
        job.client.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        job.title.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus =
        this.selectedStatus === 'All' || job.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }
// this section is for the counts of the jobs based on their status

  get pendingCount(): number {
    return this.jobs.filter((job) => job.status === 'Pending').length;
  }

  get inProgressCount(): number {
    return this.jobs.filter((job) => job.status === 'In progress').length;
  }

  get doneCount(): number {
    return this.jobs.filter((job) => job.status === 'Done').length;
  }
}
