import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(private http : HttpClient) { }
  

  getAllPage(search : any,pagination : any){
    return this.http.post(environment.url + 'todo/all/page' +`?page=${pagination.page}&size=${pagination.size}` ,search)
  }
  getById(id : any){
    return this.http.get(environment.url + `todo/get-by/${id}`)
  }
  createTodo(form : any){
    return this.http.post(environment.url + 'todo/create',form)
  }
  updateTodo(form : any,id : any){
    return this.http.put(environment.url + `todo/update/${id}`,form)
  }
  deleteTodo(id : any){
    return this.http.delete(environment.url + `todo/delete/${id}`)
  }

}
