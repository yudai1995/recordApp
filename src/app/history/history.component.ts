import { Component, OnInit } from '@angular/core';
import { MessageService } from '../service/message.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  displayedColumns: string[] = ['No', 'message'];
  constructor(public messageService: MessageService) {}

  dataSource = new MatTableDataSource(this.messageService.messages);
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.messageService.messages);
  }
}
