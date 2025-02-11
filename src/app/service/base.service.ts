import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';
import { environment } from 'src/environments/environment';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { RecordModel } from '../model/record.model';
import { EntityWithId } from '../model/entity';
import { Status } from '../model/status';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  public uri: string = environment.uri;
  public endPoint: string = `${this.uri}/api/`;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-type': 'application/json',
      'Cache-Control': 'no-cache',
      timeout: '6000000',
    }),
  };

  constructor(public http: HttpClient, public messageService: MessageService) {}

  public getRecordEntitys<T>(): Observable<T[]> {
    const result = this.http.get<Status & { records: T[] }>(this.endPoint).pipe(
      map((response: Status & { records: T[] }) => response.records), // itemsを抽出
      tap((_) => this.log(`データを取得しました`)),
      catchError(this.handleError<T[]>('getRecords', []))
    );
    console.log(result.subscribe());

    return result;
  }

  public getRecordEntity<T>(id: number): Observable<T | undefined> {
    this.messageService.add(`Service: データ(id = ${id})を取得しました`);
    const url = `${this.endPoint}/${id}`;

    return this.http.get<Status & { record: T }>(url).pipe(
      map((response: Status & { record: T }) => response.record), // itemsを抽出
      tap((_) => this.log(`データ(id=${id})を取得しました`)),
      catchError(this.handleError<T>(`getRecord id=${id}`))
    );
  }

  public sortRecords(
    sortName: string,
    order: 'ASC' | 'DESC'
  ): Observable<RecordModel[]> {
    const param = order === 'ASC' ? `+${sortName}` : `-${sortName}`;
    return this.http.get<RecordModel[]>(`${this.endPoint}/?sort=${param}`).pipe(
      tap((result) => {
        this.log(`${sortName}でソートしました`);
      }),
      catchError(this.handleError<RecordModel[]>('searchRecord', []))
    );
  }

  public updateEntity<T extends EntityWithId>(record: T): Observable<any> {
    const url = `${this.endPoint}/${record.id}`;

    return this.http.patch(url, record, this.httpOptions).pipe(
      tap((_) => this.log(`データ(id=${record.id})を変更しました`)),
      catchError(this.handleError<any>('updateRecord'))
    );
  }

  public deleteEntity<T extends EntityWithId>(
    record: T
  ): Observable<RecordModel> {
    const id = typeof record === 'number' ? record : record.id;
    const url = `${this.endPoint}/${id}`;

    return this.http
      .delete<RecordModel>(url, this.httpOptions)
      .pipe(
        tap(
          (_) => this.log(`データ(id=${id}}を削除しました)`),
          catchError(this.handleError<RecordModel>('deleteRecord'))
        )
      );
  }

  public deleteEntities<T extends EntityWithId>(entities: T[]): Observable<T> {
    const idsToDelete = entities.map((entity) => entity.id);

    if (idsToDelete.length === 0) {
      return of();
    }

    return this.http
      .request<T>('delete', this.endPoint, {
        body: idsToDelete,
        headers: this.httpOptions.headers,
      })
      .pipe(
        tap(
          (_) => this.log(`データを一括削除しました)`),
          catchError(this.handleError<T>('deleteRecord'))
        )
      );
  }

  public log(message: string) {
    this.messageService.add(`${message}`);
  }

  public handleError<T>(opration = 'oparation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      this.log(`${opration} 失敗: ${error.body.error}`);
      return of(result as T);
    };
  }
}
