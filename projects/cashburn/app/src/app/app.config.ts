import { provideHttpClient, withFetch } from '@angular/common/http';
import {
    ApplicationConfig,
    inject,
    provideAppInitializer,
    provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { AppConfigStore, ENV_NAME } from '@cashburn/core';
import { firstValueFrom } from 'rxjs';

import { environment } from '../environments/environment';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes),
        provideHttpClient(withFetch()),
        provideAppInitializer(() => {
            const configService = inject(AppConfigStore);
            return firstValueFrom(configService.loadConfig());
        }),

        /** Set the env name in ../environments/environment.ts
         * When set to 'dev' it will use config.dev.json
         * When set to '' it will use config.json (created by CI/CD)
         */
        { provide: ENV_NAME, useValue: environment.envName },
    ],
};
