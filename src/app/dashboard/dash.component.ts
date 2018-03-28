import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ClassGenerica} from '../classGeneric/config';
import { Service } from '../service/service';

import { Mensajes } from '../interfaces/mensajes';



@Component({
    selector: 'my-dashboard',
    // styleUrls: ['static/css/flexboxgridDevelopment.css'],
    templateUrl: 'template/dashboard.component.html',
})



export class DashboardComponent extends ClassGenerica implements OnInit, Mensajes{

  QueryArrayObjectMenu:Array<Object>;
  QuerychildArray = new Array();

  constructor(
    private service : Service
    ) {
    super();

    // *******  Menu navegacion *******

    console.log("Dash Componet");


    let contentOrderBy = [{ id: 0, pahtUrl: '/dashboard',name:'Home'}];
    sessionStorage.setItem('menuNavigation',super.encryptAESLocal(contentOrderBy));
  } 

    showAlert;
    MsgAlert;

  	child:Array<Object>;
    path:string;

    


    ngOnInit(): void {
      this.permisos();
      
    }


    permisos(): any{

      super.loading(true);

      this.path = 'AsesorBig/api/portal/menu/permisos';

      let object: any = {};
      object.idUsuario = super.isKeyUser();

      this.service.post(object,this.path).subscribe(
        data=>{
           let object = JSON.parse(JSON.stringify(data));
           if(object.codE === 0){
             console.log(object);

             let arrayRutasPermiso = this.addToArrayChild(object.jsonResultado[0]);
             let permisos: any = {};
              permisos.arbol = object.jsonResultado[0];
              permisos.pathArray = arrayRutasPermiso;

             sessionStorage.setItem('permisos',super.encryptAESLocal(permisos));
             this.child = this.datapermisos().child;
           }
        },
        error=>{

          console.log(error);
          this.MsgAlert = error.msgE;
          this.showAlert = true;
           
        },
        ()=>super.loading(false)
       );
    }


    addToArrayChild(obj):Array<Object>{
      let childArray = this.iterarObj(obj.child);
      let array = [];

      for(let a in childArray){
        if(childArray.hasOwnProperty(a)){
          let object = JSON.parse(JSON.stringify(childArray[a]));
          if(object.url !== null){
            let pathSplit = (object.url.split("#").join("")).trim();
            let validPrimerCaracter = pathSplit.substring(0,1);
            if(validPrimerCaracter !== '/'){
              pathSplit = "/"+pathSplit;
            }
            array.push({url:pathSplit});
          }
        }
      }
      return array;
    }
    
    iterarObj(obj):Array<Object>{
      for (let i in obj){
        if(obj.hasOwnProperty(i)){
          let child;
          this.QuerychildArray.push({url:obj[i].url});
          if(obj[i].child !== null){
            child = obj[i].child;
            this.iterarObj(child);
          }
        }
      }
      return this.QuerychildArray;
    }

}


