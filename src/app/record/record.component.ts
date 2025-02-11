import { Component, OnInit, ViewChild } from '@angular/core';
import { RecordModel } from '../model/record.model';
import { RecordService } from '../service/record.service';
import { MessageService } from '../service/message.service';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface RecordList extends RecordModel {
  selected: boolean;
  id: number;
}

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss'],
})
export class recordComponent implements OnInit {
  record: RecordList[] = [];
  selectedRecords: RecordModel[] = [];
  displayedColumns: string[] = [
    'checkBox',
    'id',
    'title',
    'recordDate',
    'deleteBtn',
  ];
  dataSource = new MatTableDataSource(this.record);

  allComplete: boolean = false;

  constructor(
    private recordService: RecordService,
    private messageService: MessageService
  ) {}

  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.getRecord();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  private getRecord(): void {
    this.recordService.getEntitys<RecordList>().subscribe((record) => {
      this.record = record.map((item) => {
        return {
          ...item,
          selected: false,
        };
      });
      this.dataSource = new MatTableDataSource(this.record);
    });
  }

  public sortRecord(sortState: Sort): void {
    if (sortState.direction) {
      const param = sortState.active;
      const order = sortState.direction === 'asc' ? 'ASC' : 'DESC';
      this.recordService.sortRecords(param, order).subscribe((record) => {
        this.record = record.map((item) => {
          return {
            ...item,
            selected: false,
            id: item.id as number,
          };
        });
        this.dataSource = new MatTableDataSource(this.record);
      });
    } else {
      this.getRecord();
    }
  }

  public add(title: string): void {
    title = title.trim();

    if (!title) {
      return;
    }
    this.recordService
      .addRecord({
        id: undefined,
        categoryId: 1,
        title: title,
        recordDate: new Date(),
        lastUpdate: undefined,
      } as RecordModel)
      .subscribe({
        next: (record) => {
          this.getRecord();
        },
        error: (error: any) => {
          console.error('エラーが発生しました:', error);
        },
      });
  }

  public delete(record: RecordList): void {
    this.record = this.record.filter((m) => m !== record);
    this.recordService.deleteEntity<RecordList>(record).subscribe({
      next: () => {
        this.getRecord();
      },
      error: (error: any) => {
        console.error('削除中にエラーが発生しました:', error);
      },
    });
  }

  public selectedDelete(): void {
    const selectedRecord = this.record.filter((m) => m.selected);

    if (selectedRecord.length === 1) {
      this.recordService.deleteEntity<RecordList>(selectedRecord[0]).subscribe({
        next: () => {
          this.getRecord();
        },
        error: (error: any) => {
          console.error('削除中にエラーが発生しました:', error);
        },
      });
    } else {
      this.recordService.deleteEntities<RecordList>(selectedRecord).subscribe({
        next: () => {
          this.getRecord();
        },
        error: (error: any) => {
          console.error('削除中にエラーが発生しました:', error);
        },
      });
    }
  }

  updateAllComplete() {
    this.allComplete =
      this.record != null && this.record.every((t) => t.selected);

    if (this.allComplete) {
      this.messageService.add(`データが全選択されました`);
    } else {
      this.messageService.add(`データが選択されました`);
    }
    this.setSelectedRecord();
  }

  someComplete(): boolean {
    if (this.record == null) {
      return false;
    }
    return (
      this.record.filter((t) => t.selected).length > 0 && !this.allComplete
    );
  }

  setAll(selected: boolean) {
    this.allComplete = selected;
    if (this.record == null) {
      return;
    }
    this.record.forEach((t) => (t.selected = selected));
    this.messageService.add(`データが全選択されました`);
    this.setSelectedRecord();
  }

  private setSelectedRecord(): void {
    this.selectedRecords = this.record.filter((m) => m.selected);
  }
}
