import { InjectionToken } from '@angular/core';

export const ENV_NAME = new InjectionToken<string>('ENV_NAME', {
    providedIn: 'root',
    factory: () => '',
});
