import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import MyPreset from './mypreset';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([])),
    provideRouter(routes),
    provideAnimations(),
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {
            darkModeSelector: '.my-app-dark'
        }
      }
    })
  ]
};
