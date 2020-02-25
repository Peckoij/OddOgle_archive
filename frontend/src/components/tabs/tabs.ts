import { Component } from '@angular/core';

import { MePage } from '../../pages/me/me'

import { FeediPage } from '../../pages/feedi/feedi'

import { CamPage } from "../../pages/cam/cam";

// importataan sivut tabeja varten

@Component({

  selector: 'tabs',

  templateUrl: 'tabs.html'

})

export class TabsComponent {

  text: string;

  tab1Root = FeediPage;

  tab2Root = CamPage; // määritetään tabeille sivut

  tab3Root = MePage;

  constructor() {

  }

}
