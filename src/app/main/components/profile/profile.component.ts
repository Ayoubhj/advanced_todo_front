import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Unsubcriber } from '../../classes/unsubcriber';
import Swal from 'sweetalert2';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends Unsubcriber implements OnInit {

  currentuser: any
  form: FormGroup
  formEdit: FormGroup
  formPassword : FormGroup
  newPassword = new FormControl(null, [
    (c: AbstractControl) => Validators.required(c),
    Validators.pattern(
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/
    ),
  ]);
  confirmPassword = new FormControl(null, [
    (c: AbstractControl) => Validators.required(c),
    Validators.pattern(
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/
    ),
  ]);

  public passwordTextTypeOld = false;
  public passwordTextTypeNew = false;
  public passwordTextTypeRetype = false;

  constructor(private auth: AuthService, private fb: FormBuilder) {
    super()
    this.currentuser = this.auth.userInfo
    this.form = this.fb.group({
      image: []
    })
    this.formEdit = this.fb.group({
      userId: [this.currentuser.userId],
      firstName: [this.currentuser.firstName, Validators.required],
      lastName: [this.currentuser.lastName, Validators.required],
      email: [this.currentuser.email, [Validators.required,Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
      phone: [this.currentuser.phone, [Validators.required,Validators.pattern(/^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/)]],
      image: []
    })
    this.formPassword = this.fb.group({
      oldPassword: ["", Validators.required],
      newPassword: ["", [Validators.required, Validators.minLength(8),Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),]],
      confirmPassword: ["", [Validators.required, Validators.minLength(8),Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),]]
    }, {
      validator: this.ConfirmedValidator('newPassword', 'confirmPassword'),
    })
  }
  get email() {
    return this.formEdit.get('email')
  }
  get phone() {
    return this.formEdit.get('phone')
  }
  get firstName() {
    return this.formEdit.get('firstName')
  }
  get lastName() {
    return this.formEdit.get('lastName')
  }
 
 
  get new() {
    return this.formPassword.get('newPassword')
  }
  get old() {
    return this.formPassword.get('oldPassword')
  }
  get confirmNew() {
    return this.formPassword.get('confirmPassword')
  }

  ngOnInit(): void {

  }

  togglePasswordTextTypeOld() {
    this.passwordTextTypeOld = !this.passwordTextTypeOld;
  }

  /**
   * Toggle Password Text Type New
   */
  togglePasswordTextTypeNew() {
    this.passwordTextTypeNew = !this.passwordTextTypeNew;
  }

  /**
   * Toggle Password Text Type Retype
   */
  togglePasswordTextTypeRetype() {
    this.passwordTextTypeRetype = !this.passwordTextTypeRetype;
  }


  onChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log(reader.result);
      const swalWithBootstrapButtons = Swal.mixin({

        cancelButtonColor: "",
        confirmButtonColor: "#34D399"

      });
      swalWithBootstrapButtons.fire(
        {
          showCloseButton: true,
          title: 'Update image',
          text: 'Are you sure you want to change this image',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          icon: "info",
          cancelButtonText: 'No',
          reverseButtons: false
        }
      ).then((result) => {
        if (result.value) {
          this.form.controls["image"].setValue(reader.result)
          this.anotherSubscription = this.auth.updateUser(this.form.value, this.currentuser.userId).subscribe(res => {
            Swal.fire({
              title: '',
              text: 'Image changed successfully',
              icon: "success",
              confirmButtonText: 'Ok',
              confirmButtonColor: "#34D399"
            });
            this.auth.set(res)
            this.currentuser = this.auth.userInfo
          })
        }
      });
    };
  }

  OnSubmitUserInfo() {
    this.anotherSubscription = this.auth.updateUserInfo(this.formEdit.value).subscribe(res => {
      Swal.fire({
        title: '',
        text: 'User Information changed successfully',
        icon: "success",
        confirmButtonText: 'Ok',
        confirmButtonColor: "#34D399"
      });
      this.auth.set(res)
      this.currentuser = this.auth.userInfo
    })
  }

  OnSubmitPassword() {
    this.anotherSubscription = this.auth.updatePassword(this.formPassword.value,this.currentuser.userId).subscribe(res => {
      Swal.fire({
        title: '',
        text: 'User Information changed successfully',
        icon: "success",
        confirmButtonText: 'Ok',
        confirmButtonColor: "#34D399"
      });
    
    })
  }

  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl  : any = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors.confirmedValidator
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}
