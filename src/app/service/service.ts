import { Http, Headers, Response, URLSearchParams} from '@angular/http';
import { Injectable } from '@angular/core';
import { Router, RouterLink} from '@angular/router';

import { Path } from '../interfaces/path';
import { Vencriptdecript } from '../interfaces/CryptoJS';
import { PathService} from '../classGeneric/config';

import { CryptoJSi} from '../classGeneric/CryptoJS';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { Observable }     from 'rxjs/Observable';

@Injectable()
export class Service extends CryptoJSi implements Path, Vencriptdecript{


  constructor(
    private http:Http,
    private router: Router,
    ){
    super();
  }

  path;

  encrypt;
  decrypt;

  errMsg: string;

  post(parameter,ruta): Observable<Response> {

    this.encrypt = JSON.stringify(parameter);
    console.log(this.encrypt);
    this.encrypt = this.encryptAES(this.encrypt);
    this.path = PathService.path+ruta;


    let params = new URLSearchParams();
    params.set('ticket', super.addShowToken());
    let headers = super.headersfunct().headers;

    
    
    return this.http.post(this.path,this.encrypt,{search: params,headers})
            .map((res:Response) => {
                  this.decrypt = this.decryptAES(res.text());
                  // console.log('Decrypt: ',this.decrypt);
                  this.decrypt = JSON.parse(this.decrypt);
                  console.log('JSON: ',this.decrypt);
                  return this.decrypt || { };
                 }
              )
            .catch((error) => {
              console.log(error);
              if(error.status === 0){
                this.errMsg = "Conexión rechazada";
                super.delteAllSessionStorage();
                this.router.navigate(['./login']);
                return Observable.throw(this.errMsg);
              }else if(error.status === 302){
                this.errMsg = "Conexión rechazada";
                super.delteAllSessionStorage();
                this.router.navigate(['./login']);
                return Observable.throw(this.errMsg);
              }else if(error.status === 415){
                this.errMsg = "Unsupported Media Type";
                return Observable.throw(this.errMsg);
              }else if(error.status === 417){
                this.errMsg = "Error inesperado";
                return Observable.throw(this.errMsg);
              }
              else if(error.status === 404){
                this.errMsg = "Página no encontrada";
                return Observable.throw(this.errMsg);
              }
              else if(error.status === 500){
                this.errMsg = "Error interno de el servidor";
                return Observable.throw(this.errMsg);
              }
            });
  }


  get (ruta): Observable<Response> {

    this.path = PathService.path+ruta;

    let params = new URLSearchParams();
    params.set('ticket', super.addShowToken());
    let headers = super.headersfunct().headers;

    return this.http.get(this.path,{search: params,headers})
            .map((res:Response) => {
                  this.decrypt = this.decryptAES(res.text());
                  this.decrypt = JSON.parse(this.decrypt);
                  return this.decrypt || { };
                 }
              )
            .catch((error) => {
              console.log(error);
              if(error.status === 0){
                this.errMsg = "Conexión rechazada";
                super.delteAllSessionStorage();
                this.router.navigate(['./login']);
                return Observable.throw(this.errMsg);
              }else if(error.status === 302){
                this.errMsg = "Conexión rechazada";
                super.delteAllSessionStorage();
                this.router.navigate(['./login']);
                return Observable.throw(this.errMsg);
              }else if(error.status === 415){
                this.errMsg = "Unsupported Media Type";
                return Observable.throw(this.errMsg);
              }else if(error.status === 417){
                this.errMsg = "Error inesperado";
                return Observable.throw(this.errMsg);
              }
              else if(error.status === 404){
                this.errMsg = "Página no encontrada";
                return Observable.throw(this.errMsg);
              }
              else if(error.status === 500){
                this.errMsg = "Error interno de el servidor";
                return Observable.throw(this.errMsg);
              }
            });
  }

}


