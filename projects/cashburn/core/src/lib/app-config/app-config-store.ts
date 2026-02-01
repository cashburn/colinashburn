import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ENV_NAME } from './env-name.token';
import { AppConfig } from './models/app-config';

@Injectable({
    providedIn: 'root',
})
export class AppConfigStore {
    private http = inject(HttpClient);
    private envName = inject(ENV_NAME);
    private _appConfig!: AppConfig;

    public loadConfig(): Observable<AppConfig> {
        const configJson = this.getConfigUrl();
        return this.http.get<AppConfig>(configJson).pipe(
            tap((config: AppConfig) => {
                this._appConfig = config;
            }),
        );
    }

    public getConfigValue(key: keyof AppConfig) {
        if (!this._appConfig) {
            throw new Error(
                'Config is not yet loaded! Wait to access config values until after app init.',
            );
        }

        const value = this._appConfig[key];
        if (!value) {
            throw new Error('Config value not found.');
        }

        return value;
    }

    private getConfigUrl(): string {
        if (!this.envName) {
            return `/config/config.json`;
        }

        return `/config/config.${this.envName}.json`;
    }
}
