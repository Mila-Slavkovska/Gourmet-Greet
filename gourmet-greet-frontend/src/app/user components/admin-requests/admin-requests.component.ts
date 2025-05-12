import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ChefRequestService } from '../../services/chef-request.service';
import { RequestStatus } from '../../interfaces/request-status.interface';
import { ChefRequestDto } from '../../interfaces/chef-request.interface';

@Component({
  selector: 'app-admin-requests',
  imports: [DatePipe],
  templateUrl: './admin-requests.component.html',
  styleUrl: './admin-requests.component.css'
})
export class AdminRequestsComponent implements OnInit {

  chefRequestService = inject(ChefRequestService)

  requests: ChefRequestDto[] = []


  loadPendingRequests(): void {
    this.chefRequestService.getAllRequestsByStatus(RequestStatus.PENDING)
      .subscribe(chefRequests => this.requests = chefRequests);
  }

  ngOnInit(): void {
    this.loadPendingRequests();
  }

  approve(request: ChefRequestDto): void {
    this.chefRequestService.approveRequest(request.id).subscribe({
      next: () => this.loadPendingRequests(),
      error: (err) => console.error('Approval failed', err)
    });
  }

  reject(request: any) {
    this.chefRequestService.rejectRequest(request.id).subscribe({
      next: () => this.loadPendingRequests(),
      error: (err) => console.error('rejec failed', err)
    });
  }
}
