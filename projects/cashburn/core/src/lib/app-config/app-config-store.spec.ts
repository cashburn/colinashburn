import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { AppConfigStore } from './app-config-store';
import { AppConfig } from './models/app-config';

describe('AppConfigStore', () => {
    let service: AppConfigStore;
    let httpTesting: HttpTestingController;
    let testScheduler: TestScheduler;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideZonelessChangeDetection(),
                provideHttpClient(),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(AppConfigStore);
        httpTesting = TestBed.inject(HttpTestingController);
        testScheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
    });

    afterEach(() => {
        httpTesting.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should throw error before app is loaded', () => {
        expect(() => service.getConfigValue('apiUrl')).toThrowError();
    });

    it('should return config value when key is present after loadConfig', async () => {
        const mockConfig = { apiUrl: 'mock://mock-api' };

        const config$ = service.loadConfig();

        // Testing using firstValueFrom() because this is how it is loaded during app init
        const configPromise = firstValueFrom(config$);
        const req = httpTesting.expectOne(
            '/config/config.json',
            'Request to load the configuration',
        );
        expect(req.request.method).toBe('GET');
        req.flush(mockConfig);
        expect(await configPromise).toEqual(mockConfig);
        expect(service.getConfigValue('apiUrl')).toEqual(mockConfig.apiUrl);
    });

    it('should throw error when key is not present after loadConfig', async () => {
        const mockConfig = { apiUrl: 'mock://mock-api' };

        const config$ = service.loadConfig();

        // Testing using firstValueFrom() because this is how it is loaded during app init
        const configPromise = firstValueFrom(config$);
        const req = httpTesting.expectOne(
            '/config/config.json',
            'Request to load the configuration',
        );
        expect(req.request.method).toBe('GET');
        req.flush(mockConfig);
        expect(await configPromise).toEqual(mockConfig);

        expect(() => service.getConfigValue('apiUrl2' as keyof AppConfig)).toThrowError(
            'Config value not found.',
        );
    });
});
