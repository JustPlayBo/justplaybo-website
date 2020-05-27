import { Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'justplaybo-website-new';
  isSmallScreen = false;

  constructor(
    private breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit() {
    this.breakpointObserver.observe(['(max-width: 599px)']).subscribe(result => {
      this.isSmallScreen = this.breakpointObserver.isMatched('(max-width: 599px)');
    });
  }

}
