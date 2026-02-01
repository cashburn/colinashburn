import { Injectable } from '@angular/core';
import { of } from 'rxjs';

import { AppConfigStore } from '../app-config-store';
import { AppConfig } from '../models';
import { mockAppConfig } from './app-config.mock';

@Injectable()
class MockAppConfigStore extends AppConfigStore {
    override loadConfig() {
        return of(mockAppConfig);
    }

    override getConfigValue(key: keyof AppConfig): string {
        return mockAppConfig[key];
    }
}

export const provideMockAppConfigStore = {
    provide: AppConfigStore,
    useClass: MockAppConfigStore,
};
