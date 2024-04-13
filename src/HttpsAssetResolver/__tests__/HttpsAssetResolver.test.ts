import { AssetType } from '@wowfinder/ts-enums';
import { mockedRaceRawAsset } from '@wowfinder/model';
import { HttpsAssetResolver } from '../HttpsAssetResolver';
import { JsonValue, toJsonValue } from '@wowfinder/ts-utils';

function mockRawAssetByType(type: AssetType, key: string): Promise<JsonValue> {
    switch (type) {
        case AssetType.races:
            return Promise.resolve(toJsonValue(mockedRaceRawAsset));
        case AssetType.adventures:
        case AssetType.classes:
        case AssetType.factions:
        case AssetType.items:
        case AssetType.spells:
        case AssetType.spellLists:
        default:
            return Promise.resolve({ type, key });
    }
}

function mockListByType(type: AssetType): Promise<string[]> {
    return Promise.resolve([`${type}-key-1`, `${type}-key-2`, `${type}-key-3`]);
}

function fetchMock(url: string): ReturnType<typeof global.fetch> {
    const regex = /^https:\/\/example.com\/([^/]+)\/([^/]+)/.exec(
        url.toString(),
    );
    const [, type, key] = regex ?? [null, null, null];
    return Promise.resolve({
        json: () =>
            key === 'list'
                ? mockListByType(type as AssetType)
                : mockRawAssetByType(type as AssetType, key as string),
    } as Response);
}

describe('HttpsAssetResolver', () => {
    let resolver: HttpsAssetResolver;

    beforeEach(() => {
        global.fetch = jest.fn(url => fetchMock(url as string));

        resolver = new HttpsAssetResolver({
            assetUrlBuilder: (type, key) =>
                new URL(`https://example.com/${type}/${key}`),
            assetListUrlBuilder: type =>
                new URL(`https://example.com/${type}/list`),
        });
    });

    it('resolves adventures', async () => {
        const adventure = await resolver.resolve(
            AssetType.adventures,
            'adventure-key',
        );
        expect(adventure.key).toEqual('adventure-key');
    });

    it('resolves classes', async () => {
        const cls = await resolver.resolve(AssetType.classes, 'class-key');
        expect(cls.key).toEqual('class-key');
    });

    it('resolves factions', async () => {
        const faction = await resolver.resolve(
            AssetType.factions,
            'faction-key',
        );
        expect(faction.key).toEqual('faction-key');
    });

    it('resolves items', async () => {
        await expect(
            resolver.resolve(AssetType.items, 'item-key'),
        ).rejects.toThrow('Item raw builder not yet implemented!');
    });

    it('resolves races', async () => {
        const race = await resolver.resolve(AssetType.races, 'race-key');
        expect(race.key).toEqual(mockedRaceRawAsset.key);
    });

    it('resolves spells', async () => {
        await expect(
            resolver.resolve(AssetType.spells, 'spell-key'),
        ).rejects.toThrow('Spell raw builder not yet implemented!');
    });

    it('resolves spell lists', async () => {
        await expect(
            resolver.resolve(AssetType.spellLists, 'spell-list-key'),
        ).rejects.toThrow('SpellList raw builder not yet implemented!');
    });

    it('resolves asset lists', async () => {
        const list = await resolver.list(AssetType.adventures);
        expect(list).toEqual([
            'adventures-key-1',
            'adventures-key-2',
            'adventures-key-3',
        ]);
    });
});
