import { Location } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('titleInput') titleInput!: ElementRef;

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

  public save(title: string): void {
    if (this.record) {
      this.record.title = title;
    }
    this.recordService
      .updateEntity<RecordModelWithId>(this.record!)
      .subscribe(() => this.goBack());
  }
}
