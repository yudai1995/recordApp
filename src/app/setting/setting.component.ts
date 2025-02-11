import { Component, OnInit, ViewChild } from '@angular/core';
import { CategoryModel } from '../model/category.model';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryService } from '../service/category.service';
import { MessageService } from '../service/message.service';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CreateCategoryDialogComponent } from '../createCategory-dialog/createCategory-dialog.component';

export interface CategoryList extends CategoryModel {
  selected: boolean;
  id: number;
}

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  category: CategoryList[] = [];
  selectedCategorys: CategoryList[] = [];
  displayedColumns: string[] = [
    'checkBox',
    'categoryId',
    'categoryName',
    'deleteBtn',
  ];
  dataSource = new MatTableDataSource(this.category);

  allComplete: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private messageService: MessageService,
    public dialog: MatDialog
  ) {}

  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.getCategory();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  private getCategory(): void {
    this.categoryService.getCategory<CategoryList>().subscribe((category) => {
      this.category = category.map((item) => {
        return {
          ...item,
          selected: false,
          id: item.categoryId ? item.categoryId : 0,
        };
      });
      this.dataSource = new MatTableDataSource(this.category);
    });
  }

  public add(categoryName: string): void {
    categoryName = categoryName.trim();

    if (!categoryName) {
      return;
    }
    this.categoryService
      .addCategory({
        categoryId: undefined,
        categoryName: categoryName,
      } as CategoryModel)
      .subscribe({
        next: (category) => {
          this.getCategory();
        },
        error: (error: any) => {
          console.error('エラーが発生しました:', error);
        },
      });
  }

  public delete(category: CategoryList): void {
    this.category = this.category.filter((m) => m !== category);
    this.categoryService.deleteEntity<CategoryList>(category).subscribe({
      next: () => {
        this.getCategory();
      },
      error: (error: any) => {
        console.error('削除中にエラーが発生しました:', error);
      },
    });
  }

  public selectedDelete(): void {
    const selectedCategory = this.category.filter((m) => m.selected);

    if (selectedCategory.length === 1) {
      this.categoryService
        .deleteEntity<CategoryList>(selectedCategory[0])
        .subscribe({
          next: () => {
            this.getCategory();
          },
          error: (error: any) => {
            console.error('削除中にエラーが発生しました:', error);
          },
        });
    } else {
      this.categoryService
        .deleteEntities<CategoryList>(selectedCategory)
        .subscribe({
          next: () => {
            this.getCategory();
          },
          error: (error: any) => {
            console.error('削除中にエラーが発生しました:', error);
          },
        });
    }
  }

  updateAllComplete() {
    this.allComplete =
      this.category != null && this.category.every((t) => t.selected);

    if (this.allComplete) {
      this.messageService.add(`データが全選択されました`);
    } else {
      this.messageService.add(`データが選択されました`);
    }
    this.setSelectedCategory();
  }

  someComplete(): boolean {
    if (this.category == null) {
      return false;
    }
    return (
      this.category.filter((t) => t.selected).length > 0 && !this.allComplete
    );
  }

  setAll(selected: boolean) {
    this.allComplete = selected;
    if (this.category == null) {
      return;
    }
    this.category.forEach((t) => (t.selected = selected));
    this.messageService.add(`データが全選択されました`);
    this.setSelectedCategory();
  }

  private setSelectedCategory(): void {
    this.selectedCategorys = this.category.filter((m) => m.selected);
  }

  public openCreateCategoryDialog(): void {
    const dialogRef = this.dialog.open(CreateCategoryDialogComponent, {
      data: undefined,
    });

    dialogRef.afterClosed().subscribe((_) => {
      console.log('The dialog was closed');
    });
  }
}
