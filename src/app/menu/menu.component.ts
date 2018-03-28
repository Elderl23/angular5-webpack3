import { Component, OnInit} from '@angular/core';
import { Router, RouterLink} from '@angular/router';

import { ClassGenerica} from '../classGeneric/config';

import { Service } from '../service/service';



@Component({
  	selector: 'my-menu',
    styleUrls: ['template/header.component.css'],
  	templateUrl: 'template/menu.component.html',
})



export class MenuComponent extends ClassGenerica{
  constructor(){
    super();
  }
}
