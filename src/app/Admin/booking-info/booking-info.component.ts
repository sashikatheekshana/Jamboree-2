import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore} from '@angular/fire/firestore' ;
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference} from '@angular/fire/storage'
import { DataSource } from '@angular/cdk/collections' ;
import { MatSort } from '@angular/material/sort';
import { GetUserService } from './../../Shared/get-user.service' ;
import { MatTableDataSource } from '@angular/material';

import { Observable } from 'rxjs';
import { finalize } from "rxjs/operators";

@Component({
  selector: 'app-booking-info',
  templateUrl: './booking-info.component.html',
  styleUrls: ['./booking-info.component.scss']
})
export class BookingInfoComponent implements OnInit {

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  
  UserDetails = { 
    FirstName : '',
    LastName : '' ,
    Email : '' , 
    Mobile :'',
    UserType : '',
    Password: '',
    Etype : '',
    District : '',
    Description : '',
    DisplayPic : ''
  }

  displayedColumns  = ['FirstName' , 'LastName' , 'Email' , 'Mobile' , 'UserType','Etype','District','DisplayPic'];
  dataSource = new UserDataSource(this.User); 
  
  defaultImage : string  = '/assets/img/default-avatar.png' ;
  SelectedImage : any = null ;

  constructor(
    private User : GetUserService ,
    private Data : AngularFirestore ,
    private afStorage: AngularFireStorage
  ) { }

  showPreview(event : any){
    if(event.target.files && event.target.files[0]){
      const reader = new FileReader();
      reader.onload = (e:any) => this.defaultImage = e.target.result ;
      reader.readAsDataURL(event.target.files[0]);
      this.SelectedImage = event.target.files[0];
    }
    else{
      this.defaultImage = '/assets/img/default-avatar.png' ;
      this.SelectedImage = null ;
    }
  }

  addUser(){
    const imagePath = "DisplayPictures/"  + this.UserDetails.UserType + "/" + this.UserDetails.Email ;
    const imageRef = this.afStorage.ref(imagePath);
    const task = this.afStorage.upload(imagePath,this.SelectedImage);



    task.snapshotChanges().pipe(
        finalize(() => {
          imageRef.getDownloadURL().subscribe((url) => {
            this.UserDetails.DisplayPic = url ;
            this.User.addUser(this.UserDetails);    
          })
        })
     )
    .subscribe()
  }
  
  ngOnInit() {
    //this.dataSource.sort = this.sort;
  }

}


export class UserDataSource extends DataSource<any>{
    constructor (private user : GetUserService){
      super();
    }

    connect(){
      return this.user.getUsers();
    }
    disconnect(){}
}