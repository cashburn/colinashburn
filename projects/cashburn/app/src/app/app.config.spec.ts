import { appConfig } from './app.config';

describe('App Config', () => {
    it('should be defined', () => {
        expect(appConfig).toBeDefined();
    });

    it('should have providers defined', () => {
        expect(Array.isArray(appConfig.providers)).toBe(true);
    });
});
