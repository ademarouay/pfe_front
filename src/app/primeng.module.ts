import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TabViewModule } from 'primeng/tabview';
import { FileUploadModule } from 'primeng/fileupload';
import { ChartModule } from 'primeng/chart';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputNumberModule } from 'primeng/inputnumber';
import { PanelModule } from 'primeng/panel';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { RemboursementCnamComponent } from './remboursement-cnam/remboursement-cnam.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    CalendarModule,
    InputTextModule,
    DropdownModule,
    CardModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    TabViewModule,
    FileUploadModule,
    ChartModule,
    ProgressSpinnerModule,
    InputNumberModule,
    PanelModule,
    ChipModule,
    TooltipModule,
    TagModule,
    RemboursementCnamComponent,
  ],
  exports: [
    ButtonModule,
    TableModule,
    CalendarModule,
    InputTextModule,
    DropdownModule,
    CardModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    TabViewModule,
    FileUploadModule,
    ChartModule,
    ProgressSpinnerModule,
    InputNumberModule,
    PanelModule,
    ChipModule,
    TooltipModule,
    TagModule,
  ],
  providers: [MessageService, ConfirmationService],
  declarations: [
    
  ],
})
export class PrimeNGModule {}