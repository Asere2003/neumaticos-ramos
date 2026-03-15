import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { Component } from '@angular/core';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.scss',
})
export class PublicLayout {}
