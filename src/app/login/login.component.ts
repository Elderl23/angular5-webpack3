import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../validator/validation.service';

import { ClassGenerica} from '../classGeneric/config';
import { Service } from '../service/service';



@Component({
    selector: 'my-login',
    styleUrls: ['template/login.component.css'],
    templateUrl: 'template/login.component.html',
})

export class LoginComponent extends ClassGenerica{

  showAlert: boolean = false;
  MsgAlert: string;

  userForm: any;

  path: string;

  constructor(
    private service : Service,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    super();

    this.userForm = this.formBuilder.group({
      'user': ['', [Validators.required,ValidationService.validarNumeros]],
      'token': ['', [Validators.required,Validators.maxLength(6)]]
    });

  } 

login() {
    if (this.userForm.dirty && this.userForm.valid) {// Si ya interactuo con el form y es valido
      this.path = 'AsesorBig/api/big/login';
      this.service.post(this.userForm.value,this.path).subscribe(

        data => {
              let object = JSON.parse(JSON.stringify(data));


              if(object.codE === 0){

                let objectSession: any = {};
                objectSession.token = object.jsonResultado;
                objectSession.keyUser = this.userForm.value.user;

                sessionStorage.setItem('session',super.encryptAESLocal(objectSession));

                this.router.navigate(['./dashboard']);

              }else{
                this.MsgAlert = object.msgE;
                this.showAlert = true;
                super.delteAllSessionStorage();
              }
        },
        error => {
              this.MsgAlert = error;
              this.showAlert = true;
              super.loading(false);
              super.delteAllSessionStorage();
        },
        () => super.loading(false)

      );

      super.loading(true);
    }
}
}
