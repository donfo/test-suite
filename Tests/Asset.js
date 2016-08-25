'use strict';

import { NativeModules } from 'react-native';

import { Asset } from 'exponent';

export const name = 'Asset';

export function test(t) {
  t.describe('Asset', () => {
    [
      {
        module: require('../Assets/black-128x256.png'),
        name: 'black-128x256', type: 'png',
        hash: '4e3911b395b3cc00e737be94c7ed49bb',
        width: 128, height: 256,
      },
      {
        module: require('../Assets/comic.ttf'),
        name: 'comic', type: 'ttf',
        hash: '69d77ab5cba970d7934a5f5bcd8fdd11',
      },
    ].forEach(({ module, name, type, ...more }) =>
      t.describe(`${name}.${type}`, () => {
        t.it(
          `has correct name, type, ${Object.keys(more).join(', ')}`,
          async () => {
            const asset = Asset.fromModule(module);
            t.expect(asset.name).toBe(name);
            t.expect(asset.type).toBe(type);
            Object.keys(more).forEach(member =>
              t.expect(asset[member]).toBe(more[member]));
          },
        );

        t.it(
          "when downloaded, has a 'file://' localUri",
          async () => {
            const asset = Asset.fromModule(module);
            await asset.downloadAsync();
            t.expect(asset.localUri).toMatch(
              new RegExp(`^file:\/\/.*\.${type}`));
          },
        );

        t.it(
          'when downloaded, exists in cache with matching hash and has ' +
          'localUri pointing to the cached file',
          async () => {
            const asset = Asset.fromModule(module);
            await asset.downloadAsync();

            const cachePath = `ExponentAsset-${asset.hash}.${asset.type}`;
            const {
              exists,
              md5,
              uri: cacheUri,
            } = await NativeModules.ExponentFileSystem.getInfoAsync(
              cachePath, { cache: true, md5: true });

            t.expect(exists).toBeTruthy();
            t.expect(md5).toBe(asset.hash);
            t.expect(cacheUri).toBe(asset.localUri);
          },
        );
      }));
  });
}
