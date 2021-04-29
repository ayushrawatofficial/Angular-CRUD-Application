import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Data } from '@angular/router';
import { Subject } from 'rxjs';
import { CrudService } from '../shared/services/crud.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  dataList: Data[] = [];
  record: Data = {};
  alertText = '';
  addRecordForm: FormGroup | any;
  duplicateData: Data = {};
  tempDuplicateData: Data = {};
  isVisible = false;
  isSuccess = false;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();


  constructor(private crudService: CrudService) { }


  ngOnInit(): void {

    this.dtOptions = {
      pagingType: 'full_numbers',
      paging: true,
      pageLength: 10,
      lengthMenu: [10, 25, 50, 100],
      processing: true,
      columnDefs: [{
        targets: [1, 2, 3, 4, 5],
        orderable: false
      }]
    };

    this.addRecordForm = new FormGroup({
      userId: new FormControl('', [Validators.required, Validators.pattern(/\d/)]),
      title: new FormControl('', Validators.required),
      body: new FormControl('', Validators.required)
    });

    this.fetchData();

  }



  fetchData(): any {
    this.crudService.fetchData()
      .subscribe((res: Data[]) => {
        this.dataList = res;
        this.dtTrigger.next();
      });
  }

  addData(): any {
    this.crudService.addData(this.addRecordForm.value)
      .subscribe((res: Data) => {
        if (res) {
          this.alertText = `Record added with Id ${res.id}`;
          this.isSuccess = true;
          this.isVisible = true;
          setTimeout(() => this.isVisible = false, 4000);

        }
        else {
          this.alertText = 'Unable to add Record';
          this.isSuccess = false;
          this.isVisible = true;
          setTimeout(() => this.isVisible = false, 4000);
        }
      });
  }

  updateData(data: Data): any {
    this.duplicateData = { ...data };
    this.tempDuplicateData = { ...data };
  }

  updateFormReset(): any {
    this.duplicateData = this.tempDuplicateData;
  }

  confirmUpdateData(updatedData: any): any {
    updatedData.id = +updatedData.id;
    this.crudService.updateData(updatedData)
      .subscribe((res: any) => {
        console.log(res);
        if (res) {
          this.alertText = `Record updated with Id ${res.id}`;
          this.isSuccess = true;
          this.isVisible = true;
          setTimeout(() => this.isVisible = false, 4000);
        }
        else {
          this.alertText = 'Unable to update Record';
          this.isSuccess = false;
          this.isVisible = true;
          setTimeout(() => this.isVisible = false, 4000);
        }
      });

  }

  deleteData(data: Data): any{
    this.record = data;
  }


  confirmDeleteData(id: number): any {
    this.crudService.deleteData(id)
      .subscribe((res: any) => {
        if (res) {
          this.alertText = 'Record Deleted';
          this.isSuccess = true;
          this.isVisible = true;
          setTimeout(() => this.isVisible = false, 4000);
        }
        else {
          this.alertText = 'Unable to delete record';
          this.isSuccess = false;
          this.isVisible = true;
          setTimeout(() => this.isVisible = false, 4000);
        }
      });
  }

}
