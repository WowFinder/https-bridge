import { AssetType } from '@wowfinder/ts-enums';

type AssetUrlBuilder = (type: AssetType, key: string) => URL;

type AssetListUrlBuilder = (type: AssetType) => URL;

interface HttpsAssetResolverBuilder {
    assetUrlBuilder: AssetUrlBuilder;
    assetListUrlBuilder: AssetListUrlBuilder;
}

export type { AssetUrlBuilder, AssetListUrlBuilder, HttpsAssetResolverBuilder };
