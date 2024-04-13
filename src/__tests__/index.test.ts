import * as index from '../';

describe('index.ts', () => {
    it('should export all utils', () => {
        expect(index).toBeDefined();
        expect(index).toHaveProperty('HttpsAssetResolver');
        expect(index).toHaveProperty('HttpsBackendAssetResolver');
    });
});
describe('.setup.ts', () => {
    it('should run the module', async () => {
        const setup = await require('../.setup');
        expect(setup).toBeDefined();
        expect(setup.cleanup).not.toThrow();
    });
});
