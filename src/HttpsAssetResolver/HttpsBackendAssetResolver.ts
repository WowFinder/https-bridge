import {
    AsyncAssetResolver,
    Adventure,
    Faction,
    Item,
    Spell,
    SpellList,
} from '@wowfinder/model';
import { ResolvableAssetType } from '@wowfinder/model/Assets/base';
import { Class, Race } from '@wowfinder/model/Creature';
import { AssetType } from '@wowfinder/ts-enums';
import {
    AssetUrlBuilder,
    AssetListUrlBuilder,
    HttpsAssetResolverBuilder,
} from './helpers';

class HttpsBackendAssetResolver extends AsyncAssetResolver {
    #assetUrlBuilder: AssetUrlBuilder;
    #assetListUrlBuilder: AssetListUrlBuilder;

    constructor({
        assetUrlBuilder,
        assetListUrlBuilder,
    }: HttpsAssetResolverBuilder) {
        super();
        this.#assetUrlBuilder = assetUrlBuilder;
        this.#assetListUrlBuilder = assetListUrlBuilder;
    }

    resolveAdventure(key: string): Promise<Adventure> {
        return fetch(
            this.#assetUrlBuilder(AssetType.adventures, key).toString(),
        )
            .then(response => response.json())
            .then(json => new Adventure(json));
    }

    resolveClass(key: string): Promise<Class> {
        return fetch(this.#assetUrlBuilder(AssetType.classes, key).toString())
            .then(response => response.json())
            .then(json => new Class(json));
    }

    resolveFaction(key: string): Promise<Faction> {
        return fetch(this.#assetUrlBuilder(AssetType.factions, key).toString())
            .then(response => response.json())
            .then(json => new Faction(json));
    }

    resolveItem(key: string): Promise<Item> {
        return (
            fetch(this.#assetUrlBuilder(AssetType.items, key).toString())
                // .then(response => response.json())
                .then(() => {
                    throw new Error('Item raw builder not yet implemented!');
                })
        );
    }

    resolveRace(key: string): Promise<Race> {
        return fetch(this.#assetUrlBuilder(AssetType.races, key).toString())
            .then(response => response.json())
            .then(json => new Race(json));
    }

    resolveSpell(key: string): Promise<Spell> {
        return (
            fetch(this.#assetUrlBuilder(AssetType.spells, key).toString())
                // .then(response => response.json())
                .then(() => {
                    throw new Error('Spell raw builder not yet implemented!');
                })
        );
    }

    resolveSpellList(key: string): Promise<SpellList> {
        return (
            fetch(this.#assetUrlBuilder(AssetType.spellLists, key).toString())
                // .then(response => response.json())
                .then(() => {
                    throw new Error(
                        'SpellList raw builder not yet implemented!',
                    );
                })
        );
    }

    list(type: ResolvableAssetType): Promise<string[]> {
        return fetch(this.#assetListUrlBuilder(type).toString())
            .then(response => response.json())
            .then(json => json as string[]);
    }
}

export { HttpsBackendAssetResolver };
