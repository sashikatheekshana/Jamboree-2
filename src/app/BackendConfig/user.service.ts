import { Injectable } from '@angular/core'; 
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from "./user.model";

@Injectable({
  providedIn: 'root'
})

export class UserService {
  userData : User = new User();

  constructor(private firestore : AngularFirestore) { }

  getUsers(){
    return this.firestore.collection('Users').snapshotChanges();
  }

}
