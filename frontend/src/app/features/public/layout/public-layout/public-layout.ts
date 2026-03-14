import { RouterLink, RouterOutlet } from '@angular/router';

import { Component } from '@angular/core';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.scss',
})
export class PublicLayout {}
