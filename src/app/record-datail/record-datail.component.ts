import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecordModel } from '../model/record.model';
import { RecordService } from '../service/record.service';

interface RecordModelWithId extends RecordModel {
  id: number;
}

@Component({
  selector: 'app-record-datail',
  templateUrl: './record-datail.component.html',
  styleUrls: ['./record-datail.component.scss'],
})
export class RecordDatailComponent implements OnInit {
  @Input() record?: RecordModelWithId;

  constructor(
    private route: ActivatedRoute,
    private recordService: RecordService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = +params.get('id')!;
      this.getRecord(id);
    });
  }

  private getRecord(id: number): void {
    this.recordService
      .getRecordEntity<RecordModelWithId>(id)
      .subscribe((record) => (this.record = record));
  }

  public goBack(): void {
    this.location.back();
  }

  public save(): void {
    this.recordService
      .updateEntity<RecordModelWithId>(this.record!)
      .subscribe(() => this.goBack());
  }
}
