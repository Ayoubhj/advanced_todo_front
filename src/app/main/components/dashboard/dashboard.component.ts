import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Unsubcriber } from '../../classes/unsubcriber';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends Unsubcriber implements OnInit{

  isList: number = 0;
  isMenu: boolean = false;
  isSearch: boolean = false;
  isClosed = false
  isClosedNotif = false
  currentuser : any
  constructor(private todoService : TodoService,public auth : AuthService,private route : Router){
     super()
  }
  
  ngOnInit(): void {
  
  }


  dropdownHandler(){
    this.isClosed = !this.isClosed
  }
  notificationHandler(){
    this.isClosedNotif = !this.isClosedNotif
  }

  logout(){
     this.anotherSubscription = this.auth.logout().subscribe(res => {
        localStorage.clear();
        this.route.navigate(["/"])
     })
  }
}
