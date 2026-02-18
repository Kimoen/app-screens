import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-phone-mockup',
  standalone: true,
  templateUrl: './phone-mockup.component.html',
  styleUrl: './phone-mockup.component.scss',
})
export class PhoneMockupComponent {
  @Input() screenshotSrc = '';
  @Input() width = 700;
  @Input() height = 1400;
}
