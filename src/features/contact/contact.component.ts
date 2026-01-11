import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPhone,
  faEnvelope,
  faLocationDot
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebookF,
  faInstagram,
  faTiktok
} from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-contact',
  imports: [FontAwesomeModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  faPhone = faPhone;
  faEnvelope = faEnvelope
  faLocationDot = faLocationDot;

  faFacebook = faFacebookF;
  faInstagram = faInstagram;
  faTikTok = faTiktok;

}
