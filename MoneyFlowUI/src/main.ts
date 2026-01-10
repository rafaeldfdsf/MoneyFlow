import { LOCALE_ID, provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app.config';
import { AppComponent } from './app.component';
import { registerLocaleData } from "@angular/common";
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt);
bootstrapApplication(AppComponent, { ...appConfig, providers: [provideZoneChangeDetection(), { provide: LOCALE_ID, useValue: 'pt-PT' }, ...appConfig.providers] }).catch((err) => console.error(err));
