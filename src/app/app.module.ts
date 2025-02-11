import { CUSTOM_ELEMENTS_SCHEMA, NgModule, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { RecordDatailComponent } from './record-datail/record-datail.component';
import { HistoryComponent } from './history/history.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MemberSearchComponent } from './record-search/record-search.component';
import { recordComponent } from './record/record.component';
import { RecordService } from './service/record.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SettingComponent } from './setting/setting.component';
import { CategoryService } from './service/category.service';
import { CreateCategoryDialogComponent } from './createCategory-dialog/createCategory-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    recordComponent,
    RecordDatailComponent,
    HistoryComponent,
    DashboardComponent,
    MemberSearchComponent,
    EditDialogComponent,
    SearchDialogComponent,
    SettingComponent,
    CreateCategoryDialogComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatListModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
  ],
  providers: [RecordService, CategoryService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
  @ViewChild(MatAccordion) accordion!: MatAccordion;
}
