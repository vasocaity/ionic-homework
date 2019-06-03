import { Component, ViewChild } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { Person } from '../person';
import { Platform, NavController, IonInput } from '@ionic/angular';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  jc: string = "";
  loading = false;
  persons: Array<Person> = [];
  corps: Array<Person> = [];
  @ViewChild('myInput') myInput: IonInput;

  constructor(private http: HTTP,
    private platform: Platform,
    private nav: NavController,
    private contacts: Contacts,
    private keyboard: Keyboard) { }

  ngOnInit(): void {
    this.platform.is('tablet');
    this.platform.ready().then(() => {
      this.getData();
    })
  }

  isTablet() {
    return this.platform.is('tablet');
  }

  getData() {
    this.http.get('http://www.mocky.io/v2/5cf0ac7f3000004b0000b9e1', {}, {})
      .then((data) => {
        this.persons = JSON.parse(data.data).results.filter(value => value.type === '01');
        this.corps = JSON.parse(data.data).results.filter(value => value.type === '02');
        this.persons = this.persons.filter(value => value.firstname.includes(this.jc) || value.lastname.includes(this.jc));
        this.corps = this.corps.filter(value => value.firstname.includes(this.jc) || value.lastname.includes(this.jc));
        this.loading = false;
      });
  }

  goToContactPage() {
    this.contacts.pickContact()
      .then((response) => {
        console.log(response)
        this.jc = response.name.formatted;
        this.getData();
      });
  }

  goToDetail() {
    this.nav.navigateForward('/detail');
  }

  search() {
    this.loading = true;
    this.getData()
  }
}
