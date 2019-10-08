import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/finally';
import {AppUser} from '../../models/app-user';
import {Somatotype} from '../../models/somatotype';
import {DropdownListComponent} from '../dropdown-list/dropdown-list.component';
import {AuthService} from '../../services/auth.service';
import {SomatotypesService} from '../../services/somatotypes.service';
import {UserService} from '../../services/user.service';
import {ToastrService} from 'ngx-toastr';
import {MatCheckbox} from '@angular/material';
import {User} from '../../models/user';

@Component({
  selector: 'calories-calculator',
  templateUrl: './calories-calculator.component.html',
  styleUrls: ['./calories-calculator.component.scss']
})
export class CaloriesCalculatorComponent implements OnInit, OnDestroy {

  @ViewChild('dropdownListComponent', {static: false}) private dropdownListComponent: DropdownListComponent;
  @ViewChild('trainingCheckbox', {static: false}) private trainingCheckbox: MatCheckbox;
  @ViewChild('areobicCheckbox', {static: false}) private areobicCheckbox: MatCheckbox;
  @ViewChild('selectSomatotype', {static: false}) private selectSomatotype: HTMLSelectElement;

  appUser$ = {
    uid: null,
    nutrientsPercentage: {},
    maxNutrients: {},
    somatotype: {},
    trainings: {},
  } as AppUser;

  userId: string;
  somatotypes: Array<Somatotype> = [];

  somatotypes$;
  selectError: boolean;

  private userAuthSubscription: Subscription = new Subscription();
  private somatotypeSubscription: Subscription = new Subscription();
  private appUserSubscription: Subscription = new Subscription();
  constructor(private _auth: AuthService,
              private _somatotypeService: SomatotypesService,
              private _userService: UserService,
              private _toastrService: ToastrService) {}

  ngOnInit() {
    this.userAuthSubscription = this._auth.appUser$
      .subscribe(user => {
        if (user)
          this.userId = user.uid
      });

    this.somatotypeSubscription = this._somatotypeService.getAll()
      .first()
      .finally(() => this.subscribeAppUser())
      .subscribe(somatotypes => this.subscribeSomatotype(somatotypes));
  }

  ngOnDestroy() {
    this.userAuthSubscription.unsubscribe();
    this.somatotypeSubscription.unsubscribe();
    this.appUserSubscription.unsubscribe();
  }

  onAccept() {
    this._userService.update(this.appUser$)
      .then(() => this._toastrService.success('Zaktualizowano'));
  }

  getSomatotypes() {
    let array = Array.from(this.somatotypes).map(value => value.name);
    return (array);
  }

  onSomatotypeSelected(type: string) {
    this.appUser$.somatotype = this.somatotypes.find(value => value.name === type);
  }

  handleError($event: boolean) {
    this.selectError = $event;
  }

  onTrainingsFocusOut() {
    if (this.appUser$.trainings.strenghtTime == null) {
      this.appUser$.trainings.strenghtTime = 0;
      this.trainingCheckbox.checked = false;
    }
  }

  onAreobicsFocusOut() {
    if (this.appUser$.trainings.areobicTime == null) {
      this.appUser$.trainings.areobicTime = 0;
      this.areobicCheckbox.checked = false;
    }
  }

  onAutoCounting() {
    let total = this.total;
    this.appUser$.maxNutrients.maxCalories = this.number(total);
  }

  private subscribeAppUser(): Subscription {
    return this.appUserSubscription = this._auth.appUser$$
      .subscribe(appUser => {
        if (appUser) {
          this.appUser$ = appUser;
          this.appUser$.uid = this.userId;
          // this.dropdownListComponent.select(this.appUser$.somatotype.name);
        } else
          this.appUser$ = new User(null,'Gość',null).mockStats();
      });
  }

  private subscribeSomatotype(somatotypes) {
    this.somatotypes$ = somatotypes;
    this.somatotypes$.map((somatotype: Somatotype) => this.somatotypes.push(somatotype));
  }

  private number(num: number): number {
    return Number(num.toFixed(0));
  }

  get total(): number {
    let total = this.bmr + this.totalEat + (this.appUser$.maxNutrients.maxCalories * this.tef) + this.appUser$.somatotype.value;
    return this.number(total);
  }

  get bmr(): number {
    let bmr = (9.99 * this.appUser$.weight) + (6.25 * this.appUser$.height);
    if (this.appUser$.isGender) // for women
      return this.number(bmr - 161);
    else
      return this.number(bmr + 5);
  }

  get epoc(): number {
    return 0.07 *  this.appUser$.maxNutrients.maxCalories;
  }

  get strenghtEat(): number {
    if (this.appUser$.trainings.strenghtIntensity)
      return this.appUser$.trainings.strenghtTime * 9;
    else return this.appUser$.trainings.strenghtTime * 7;
  }

  get areobicEat(): number {
    if (this.appUser$.trainings.areobicIntensity)
      return this.appUser$.trainings.areobicTime * 10;
    else return this.appUser$.trainings.areobicTime * 5;
  }

  get totalEat(): number {
    return ((this.strenghtEat + this.areobicEat + this.epoc) / 7) | 0;
  }

  get somatotype(): number {
    return this.appUser$.somatotype.value;
  }

  get tef(): number {
    return 0.1;
  }

  get userMaxCalories(): number {
   return this.appUser$.maxNutrients.maxCalories;
  }

  get caloriesDescription() {
    return '<b>Kalkulator kalorii</b> oblicza zapotrzebowanie na kalorie Twojego organizmu. Po' +
      '          wypełnieniu wszystkich pól program' +
      '          obliczy za Ciebie <b>TDEE</b>, czyli całkowite dzienne zapotrzebowanie na energię. Wystarczy, że raz na tydzień' +
      '          będziesz aktualizować kalkulator a program dostosuje ponownie zapotrzebowanie Twojego organizmu. Dzięki temu' +
      '          będziesz w stanie utrzymywać wagę ciała na stałym poziomie. Jeżeli jesteś zaawansowanym użytkownikiem to masz' +
      '          możliwość manualnego uzupełnienia "<i>Maksymalnej liczby kalorii</i>"';
  }

  get componentTitle() {
    return 'Kalkulator kalorii';
  }

  onChange(value: any) {
    console.log(value)
  }

  onSelect($event: Event) {
    console.log($event)
  }

  onChanges(value) {
    // this.appUser$.somatotype.name = $event.source.value.name;
    // this.appUser$.somatotype.value = $event.source.value.value;
    console.log(value)
    console.log(this.appUser$.somatotype)
  }
}
