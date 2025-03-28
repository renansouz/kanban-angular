import { Component } from '@angular/core';

@Component({
  selector: 'app-about-us',
  imports: [],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css',
})
export class AboutUsComponent {
  devs = [
    {
      name: 'Renan Silva',
      image: 'https://github.com/renansouz.png',
      github: 'https://github.com/renansouz',
    },
    {
      name: 'Koffi Samuel',
      image: 'https://github.com/akirem20.png',
      github: 'https://github.com/akirem20',
    },
    {
      name: 'Victor Alexandre',
      image: 'https://github.com/victorcostanova.png',
      github: 'https://github.com/victorcostanova',
    },
    {
      name: 'Gabriel Melo',
      image: 'https://github.com/gbmeloo.png',
      github: 'https://github.com/gbmeloo',
    },
  ];
}
