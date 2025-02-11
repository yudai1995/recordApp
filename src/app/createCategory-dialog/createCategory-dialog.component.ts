import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../service/category.service';
import { CategoryModel } from '../model/category.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-create-category-dialog',
  templateUrl: './createCategory-dialog.component.html',
  styleUrls: ['./createCategory-dialog.component.scss'],
})
export class CreateCategoryDialogComponent implements OnInit {
  categoryFormControl = new FormGroup({
    categoryName: new FormControl('', Validators.required),
  });

  constructor(
    public dialogRef: MatDialogRef<CreateCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategoryModel,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.categoryFormControl.setValue({
        categoryName: this.data.categoryName,
      });
    } else {
      this.categoryFormControl.setValue({
        categoryName: '',
      });
    }
  }

  public addCategory(): void {
    const categoryName =
      this.categoryFormControl.controls['categoryName'].value;

    if (categoryName === '') {
      return;
    }
    this.categoryService
      .addCategory({
        categoryName,
        lastUpdate: undefined,
      } as CategoryModel)
      .subscribe((_) => {
        this.dialogRef.close();
      });
  }

  public onCancel(): void {
    this.dialogRef.close();
  }
}
