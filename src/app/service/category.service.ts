import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap, timeout } from 'rxjs/operators';
import { CategoryModel } from '../model/category.model';
import { BaseService } from './base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService extends BaseService {
  public override endPoint = `${this.uri}/category`;

  constructor(http: HttpClient, messageService: MessageService) {
    super(http, messageService);
  }

  public getCategory<T extends CategoryModel>(): Observable<T[]> {
    return this.http.get<T[]>(this.endPoint).pipe(
      tap((_) => this.log(`データを取得しました`)),
      map((data: T[]) => {
        const exists = data.some(
          (item) => (item as CategoryModel).categoryId === 0
        );
        if (!exists) {
          data.unshift({
            categoryId: 0,
            categoryName: '未設定',
            lastUpdate: undefined,
          } as T);
        }
        return data;
      }),
      catchError(this.handleError<T[]>('getcategorys', []))
    );
  }

  public addCategory(category: CategoryModel): Observable<CategoryModel> {
    const options = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Cache-Control': 'no-cache',
        timeout: '10000',
      }),
    };

    return this.http
      .post<CategoryModel>(
        this.endPoint,
        {
          categoryName: category.categoryName,
        },
        options
      )
      .pipe(
        tap((newCategory: CategoryModel) =>
          this.log(`データ(id=${newCategory.categoryId})を追加しました`)
        ),
        timeout(10000),
        catchError(this.handleError<CategoryModel>('addCategory'))
      );
  }

  public searchCategorys(term: string): Observable<CategoryModel[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http
      .get<CategoryModel[]>(`${this.endPoint}/?categoryName=${term}`)
      .pipe(
        tap((result) => {
          if (result.length) {
            this.log(`${term}にマッチするデータが見つかりました`);
          } else {
            this.log(`${term}にマッチするデータはありませんでした`);
          }
        }),
        catchError(this.handleError<CategoryModel[]>('searchCategory', []))
      );
  }
}
