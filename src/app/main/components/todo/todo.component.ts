import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Unsubcriber } from '../../classes/unsubcriber';
import { TodoService } from '../../services/todo.service';
import Swal from 'sweetalert2';



@Component({
   selector: 'app-todo',
   templateUrl: './todo.component.html',
   styleUrls: ['./todo.component.scss']
})
export class TodoComponent extends Unsubcriber implements OnInit {

   formAdd: FormGroup;
   formEdit: FormGroup;
   searchForm: FormGroup;
   searchText : string =  ""
   descreption: string = "";
   todo: any;
   totalPages = 0
   pagenation = {
      page: 0,
      size: 6
   };
   todos: Array<any> = new Array<any>();

   constructor(private todoService: TodoService, private fb: FormBuilder) {
      super()
      this.formAdd = this.fb.group({
         title: ["", [Validators.required, Validators.min(3), Validators.max(255)]],
         descreption: ["", [Validators.required, Validators.min(3), Validators.max(255)]]
      })
      this.formEdit = this.fb.group({
         title: ["", [Validators.required, Validators.min(3), Validators.max(255)]],
         descreption: ["", [Validators.required, Validators.min(3), Validators.max(255)]]
      })
      this.searchForm = this.fb.group({
         search: ["", [Validators.min(3), Validators.max(255)]],
      })
   }

   ngOnInit(): void {
      this.getData()
   }

   getData() {

      this.anotherSubscription = this.todoService.getAllPage(this.searchForm.value, this.pagenation).subscribe((todos: any) => {
         this.todos = todos.content
         this.totalPages = todos.totalPages

      })
   }



   previous() {
      this.pagenation.page--
      this.getData()
   }

   next() {
      this.pagenation.page++
      this.getData()

   }

   addTodo() {
      this.todoService.createTodo(this.formAdd.value).subscribe(todo => {
         Swal.fire({
            title: 'Added Successfuly',
            text: 'Todo element added successfuly',
            icon: "success",
            confirmButtonText: 'Ok',
            confirmButtonColor : "rgb(59,130,246)"
          });
         this.getData()
      })
   }
   editTodo() {
      this.todoService.updateTodo(this.formEdit.value, this.todo.id).subscribe(todo => {
         Swal.fire({
            title: 'Updated Successfuly',
            text: 'Todo element updated successfuly',
            icon: "success",
            confirmButtonText: 'Ok',
            confirmButtonColor : "rgb(59,130,246)"
          });
         this.getData()
      })
   }
   reset() {
      this.formAdd.reset()
   }

   edit(todo: any) {
      this.todo = todo
   }

   search(){
       this.searchForm.controls["search"].setValue(this.searchText)
       this.getData()
   }

   deleteTodo(todo:any){
      const swalWithBootstrapButtons = Swal.mixin({
          
          cancelButtonColor : "",
          confirmButtonColor : "rgb(59,130,246)"
        
       });
       swalWithBootstrapButtons.fire(
       {
         showCloseButton: true,
         title: 'Delete todo',
         text: 'Are you sure you want to dlete this todo',
         showCancelButton: true,
         confirmButtonText: 'Yes',
         icon: "info",
         cancelButtonText: 'No',
         reverseButtons: false
       }
       ).then((result) => {
         if (result.value) {
            this.anotherSubscription = this.todoService.deleteTodo(todo.id).subscribe(res => {
               Swal.fire({
                  title: 'Deleted Successfuly',
                  text: 'Todo element deleted successfuly',
                  icon: "success",
                  confirmButtonText: 'Ok',
                  confirmButtonColor : "rgb(59,130,246)"
                });
               this.getData()
            })
         }
       });
   }
}

