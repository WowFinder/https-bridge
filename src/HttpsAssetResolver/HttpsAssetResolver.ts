import { AsyncCachingAssetResolver } from '@wowfinder/model';
import { HttpsAssetResolverBuilder } from './helpers';
import { HttpsBackendAssetResolver } from './HttpsBackendAssetResolver';

class HttpsAssetResolver extends AsyncCachingAssetResolver {
    constructor({
        assetUrlBuilder,
        assetListUrlBuilder,
    }: HttpsAssetResolverBuilder) {
        super(
            new HttpsBackendAssetResolver({
                assetUrlBuilder,
                assetListUrlBuilder,
            }),
        );
    }
}

export { HttpsAssetResolver };
