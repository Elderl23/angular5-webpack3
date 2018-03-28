import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Headers, RequestOptions} from '@angular/http';
import { Injectable } from '@angular/core';

import CryptoJS from 'crypto-js';

import { DateInterface } from '../interfaces/Date';

import { Observable } from 'rxjs/Observable';

import { Path, Production} from '../interfaces/path';
import { Token } from '../interfaces/token';
import { ConfG, Login} from '../interfaces/ConfGeneral';

import { ValidatorI } from '../interfaces/validator';

export const Environment : Production = {
  production: true
};

export const PathService: Path = {
    path: "http://10.51.193.146:8080/" //desarrollo
    // path: "http://10.51.214.147:8080/"//Productivo desarrollo
    // path: "https://www.bancaempresarialazteca.com.mx/"
};

//ClassGenerica

export class ClassGenerica implements Login, ConfG, Token, ValidatorI, DateInterface{
  today;
  title;
  showMenu;
  all;save;edit;deleteC;
  activateLoading;

	token;
  userKey;
  headersT;

  tecla;
  patron;
  tecla_final;

  fullName;

  dia;mes;anio;fechaEncrypt;



  constructor() {
    this.loading(false);
    this.today = new Date();
  }

    protected loading(parameter): void{
      this.activateLoading= parameter;
    }

    protected addShowToken(): string{
      if(this.sessionToParse() != null){
        return this.token = this.sessionToParse().token;
      }else{
        return this.token = null;
      }
    }
    protected isToken(): boolean{
      if(this.sessionToParse() != null){
        if(this.token = this.sessionToParse().token != null){
          return true;
        }else{
          return false;
        }
      }else{
        return false;
      }
    }

    protected isKeyUser(): string{
      if(this.sessionToParse() != null){
        return this.userKey = this.sessionToParse().keyUser;
      }else{
        return this.userKey = null;
      }
    }

    private sessionToParse(): any{
      if(sessionStorage.getItem('session')){
        return JSON.parse(this.decryptAESLocal(sessionStorage.getItem('session')));
      }else{
        return null;
      }
      
    }

    public haspermiso(): any{
      if(sessionStorage.getItem('permisos')){
        return true;
      }else{
        return false;
      }
    }


    protected datapermisos():any{
      if(sessionStorage.getItem('permisos')){
        let permisos = JSON.parse(this.decryptAESLocal(sessionStorage.getItem('permisos')));
        return permisos.arbol;
      }
    }

    protected getFullName(): string{
      if(this.datapermisos() !== undefined ){
        this.fullName = ""+this.datapermisos().nombre +" "+this.datapermisos().apPaterno +" "+this.datapermisos().apMaterno;
        return this.fullName;
      }
      
    }


    protected delteAllSessionStorage():any{
      sessionStorage.removeItem('permisos');
      sessionStorage.removeItem('session');
      sessionStorage.removeItem('getObject');
      sessionStorage.removeItem('getObjectDos');
      sessionStorage.removeItem('menuNavigation');
      
    }

  	protected headersfunct(): any{
      this.headersT = new Headers({'Content-Type': 'application/json; charset=UTF-8'});
    	let options = new RequestOptions({ headers: this.headersT });

    	return options;
  	}

    public encryptfechaby3(): number{
      this.fechaEncrypt = this.today.getDate() + ""+ ("0" + (this.today.getMonth() + 1)).slice(-2) +""+ this.today.getFullYear();
      this.fechaEncrypt = (+this.fechaEncrypt)*3;
      return this.fechaEncrypt;
    }


    protected encryptAESLocal(cadena): any{

      let string = JSON.stringify(cadena);
      let key = this.encryptfechaby3().toString();

      let encrypted = CryptoJS.AES.encrypt(string, key);
      return encrypted.toString();
    }

    protected decryptAESLocal(cadena): any{

      let key = this.encryptfechaby3().toString();
      let decrypted = CryptoJS.AES.decrypt(cadena, key);
      return decrypted.toString(CryptoJS.enc.Utf8);

    }

    protected childRouter(data): any{
      if(this.datapermisos() !== undefined){

        let child = this.datapermisos().child;
        
       
        for (var item in child){
          if(child.hasOwnProperty(item)){
            if(data === (child[item].url).split("#").join("")){
              return child[item].child;
            }
          }
        }


      }

    }

    public solonumeros(e):boolean{
      this.tecla = (document.all) ? e.keyCode : e.which;
      //Tecla de retroceso para borrar, siempre la permite
      if (this.tecla === 13 || this.tecla===8 || this.tecla===9 || this.tecla===37 || this.tecla===39){
          return true;
      }
      if(this.tecla >= 96 && this.tecla <= 105){
        return true;
      }
          
      // Patron de entrada, en este caso solo acepta numeros
      this.patron =/[0-9]/;
      this.tecla_final = String.fromCharCode(this.tecla);
      return this.patron.test(this.tecla_final);
  }

  protected getObject(): any{
    if(sessionStorage.getItem('getObject')){
      return JSON.parse(this.decryptAESLocal(sessionStorage.getItem('getObject')));
    }else{
      return null;
    }
  }
  protected delteSessionStorage(data): void{
    sessionStorage.removeItem(data);
  }

  protected getObjectDos(): any{
    if(sessionStorage.getItem('getObjectDos')){
      return JSON.parse(this.decryptAESLocal(sessionStorage.getItem('getObjectDos')));
    }else{
      return null;
    }
  }

  protected menuNavigation(): any{
    if(sessionStorage.getItem('menuNavigation')){
      return JSON.parse(this.decryptAESLocal(sessionStorage.getItem('menuNavigation')));
    }else{
      return null;
    }
  }

  protected procesarPaht(length,paht,namePaht):any{
    let lengthParameter = ((length + 1) - 1);
    let arrayMenu = this.menuNavigation();


    
    arrayMenu.push({ id: lengthParameter, pahtUrl: paht, name:namePaht});
    sessionStorage.setItem('menuNavigation',this.encryptAESLocal(arrayMenu));

  }


  protected getMenuLateral(parameter: number = 0): any {
    if (sessionStorage.getItem('menuLateral')) {
        if (this.decryptAESLocal(sessionStorage.getItem('menuLateral')) !== '') {
            let objectMenu = JSON.parse(this.decryptAESLocal(sessionStorage.getItem('menuLateral')));
            if (parameter === 0) {
                return objectMenu;
            } else {
                console.log("Otra validacion");
            }
        }
    } else {
        return null;
    }
}

}

@Injectable()
export class AuthGuard extends ClassGenerica implements CanActivate {
  public itemQueryChild:Array<Object>;
    constructor(protected router: Router) { 
      super();
    }

    canActivate(AuthGuard) {

      let pathVisit = "/";
        let lengthAuthGuard = AuthGuard.url.length;
        let count = 0;
        for(let i in AuthGuard.url){
          if(AuthGuard.url.hasOwnProperty(i)){
            count = count + 1;
            if(count !== lengthAuthGuard){
              pathVisit = pathVisit + AuthGuard.url[i].path+"/";
            }else{
              pathVisit = pathVisit + AuthGuard.url[i].path;
            }   
          }
        }

        console.log(pathVisit);
        let pahtUrl = "/"+((pathVisit).split('/'))[1];
        console.log(pahtUrl);
        this.itemQueryChild = super.childRouter(pahtUrl);
        console.log(this.itemQueryChild);
        sessionStorage.setItem('menuLateral', this.encryptAESLocal(this.itemQueryChild));

      if(pathVisit !== '/dashboard'){
        if(this.datapermisos() !== undefined){
          let permisos = JSON.parse(this.decryptAESLocal(sessionStorage.getItem('permisos')));
          let countPermiso = 0;
          for(let i in permisos.pathArray){
            if(permisos.pathArray.hasOwnProperty(i)){
              if(pathVisit === permisos.pathArray[i].url){
                countPermiso = countPermiso + 1;
              }
            }
          }
          if(countPermiso !== 0){
            return true;
          }else{
            return false;
          }
        }
      }

      if(super.isToken()){
        return true;
      }else{
        this.router.navigate(['./login']);
        return false;
      }
    }
}

