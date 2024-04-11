import { HttpsAssetResolver } from '../HttpsAssetResolver';

describe('HttpsAssetResolver', () => {
    let resolver: HttpsAssetResolver;

    beforeEach(() => {
        global.fetch = jest.fn(url => {
            const regex = /^https:\/\/example.com\/([^/]+)\/([^/]+)/.exec(
                url.toString(),
            );
            const [, type, key] = regex ?? [null, null, null];
            return Promise.resolve({
                json: () => Promise.resolve({ type, key }),
            } as Response);
        });

        resolver = new HttpsAssetResolver({
            assetUrlBuilder: (type, key) =>
                new URL(`https://example.com/${type}/${key}`),
            assetListUrlBuilder: type =>
                new URL(`https://example.com/${type}/list`),
        });
    });

    it('resolves adventures', async () => {
        const adventure = await resolver.resolveAdventure('adventure-key');
        expect(adventure.key).toEqual('adventure-key');
    });

    it('resolves classes', async () => {
        const cls = await resolver.resolveClass('class-key');
        expect(cls.key).toEqual('class-key');
    });

    it('resolves factions', async () => {
        const faction = await resolver.resolveFaction('faction-key');
        expect(faction.key).toEqual('faction-key');
    });

    it('resolves items', async () => {
        await expect(resolver.resolveItem('item-key')).rejects.toThrow(
            'Item raw builder not yet implemented!',
        );
    });
});
