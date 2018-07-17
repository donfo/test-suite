'use strict';

import React from 'react';
import { BarCodeScanner, Permissions } from 'expo';
import * as TestUtils from '../TestUtils';

import { mountAndWaitFor as originalMountAndWaitFor } from './helpers';

export const name = 'BarCodeScanner';
const style = { width: 200, height: 200 };

export async function test(t, { setPortalChild, cleanupPortal }) {
  const shouldSkipTestsRequiringPermissions = await TestUtils.shouldSkipTestsRequiringPermissionsAsync();
  const describeWithPermissions = shouldSkipTestsRequiringPermissions ? t.xdescribe : t.describe;

  describeWithPermissions('BarCodeScanner', () => {
    const mountAndWaitFor = (child, propName = 'ref') =>
      new Promise(resolve => {
        const response = originalMountAndWaitFor(child, propName, setPortalChild);
        setTimeout(() => resolve(response), 1500);
      });

    t.beforeAll(async () => {
      await TestUtils.acceptPermissionsAndRunCommandAsync(() => {
        return Permissions.askAsync(Permissions.CAMERA);
      });
    });

    t.beforeEach(async () => {
      const { status } = await Permissions.getAsync(Permissions.CAMERA);
      t.expect(status).toEqual('granted');
    });

    t.afterEach(async () => {
      await cleanupPortal();
    });

    t.describe('when created', () => {
      t.it('displays the view', async () => {
        await mountAndWaitFor(<BarCodeScanner style={style} />);
      });
    });
  });
}
