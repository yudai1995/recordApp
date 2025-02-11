import { Component, OnInit } from '@angular/core';
import { RecordModel } from '../model/record.model';
import { RecordService } from '../service/record.service';
import { Status } from '../model/status';

@Component({
  selector: 'app-dashbord',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  records: RecordModel[] = [];
  error: string = '';

  constructor(private recordService: RecordService) {}

  ngOnInit(): void {
    this.getRecords();
  }
  private getRecords(): void {
    this.recordService.getRecordEntitys<RecordModel>().subscribe({
      next: (record: RecordModel[]) => (this.records = record.slice(0, 5)),
      error: (error: any) => {
        console.error('HTTPリクエストエラー:', error);
        this.error = 'データの取得に失敗しました。';
      },
      complete: () => console.info(this.records),
    });
  }
}
