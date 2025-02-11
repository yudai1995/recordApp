import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap, timeout } from 'rxjs/operators';
import { RecordModel } from '../model/record.model';
import { BaseService } from './base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class RecordService extends BaseService {
  public override endPoint = `${this.uri}/record`;

  constructor(http: HttpClient, messageService: MessageService) {
    super(http, messageService);
  }

  public addRecord(record: RecordModel): Observable<RecordModel> {
    const options = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Cache-Control': 'no-cache',
        timeout: '10000',
      }),
    };

    return this.http
      .post<RecordModel>(
        this.endPoint,
        {
          categoryId: +record.categoryId,
          title: record.title,
          recordDate: `${record.recordDate.getFullYear()}-${
            record.recordDate.getMonth() + 1
          }-${record.recordDate.getDate()}`,
        },
        options
      )
      .pipe(
        tap((newRecord: RecordModel) =>
          this.log(`データ(id=${newRecord.id})を追加しました`)
        ),
        timeout(10000),
        catchError(this.handleError<RecordModel>('addRecord'))
      );
  }

  public searchRecords(term: string): Observable<RecordModel[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<RecordModel[]>(`${this.endPoint}/?title=${term}`).pipe(
      tap((result) => {
        if (result.length) {
          this.log(`${term}にマッチするデータが見つかりました`);
        } else {
          this.log(`${term}にマッチするデータはありませんでした`);
        }
      }),
      catchError(this.handleError<RecordModel[]>('searchRecord', []))
    );
  }
}
