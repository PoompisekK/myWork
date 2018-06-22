import { Component, OnInit } from '@angular/core';
import { IonicPage } from 'ionic-angular';

@Component({
  selector: 'help-page',
  templateUrl: 'help.page.html'
})

export class HelpPage implements OnInit {

  private selectedMenu: number = 1;

  constructor() { }

  public ngOnInit() { }
}