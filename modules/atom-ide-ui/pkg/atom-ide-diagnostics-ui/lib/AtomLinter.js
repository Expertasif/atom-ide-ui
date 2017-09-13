/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 * @format
 */

import featureConfig from 'nuclide-commons-atom/feature-config';
import {observableFromSubscribeFunction} from 'nuclide-commons/event';
import {Observable} from 'rxjs';

const LINTER_PACKAGE = 'linter';

export function observePackageIsEnabled(): Observable<boolean> {
  return Observable.merge(
    Observable.of(atom.packages.isPackageActive(LINTER_PACKAGE)),
    observableFromSubscribeFunction(
      atom.packages.onDidActivatePackage.bind(atom.packages),
    )
      .filter(pkg => pkg.name === LINTER_PACKAGE)
      .mapTo(true),
    observableFromSubscribeFunction(
      atom.packages.onDidDeactivatePackage.bind(atom.packages),
    )
      .filter(pkg => pkg.name === LINTER_PACKAGE)
      .mapTo(false),
  );
}

export function disable(): void {
  atom.packages.disablePackage(LINTER_PACKAGE);
}

const USE_DIAGNOSTICS_KEY = 'use.atom-ide-diagnostics-ui';

export function disableDiagnostics(): void {
  featureConfig.set(USE_DIAGNOSTICS_KEY, false);
  const packageName = featureConfig.getPackageName();
  atom.notifications.addInfo('Re-enabling Diagnostics', {
    description:
      'To re-enable diagnostics, please enable `atom-ide-diagnostics-ui` under the "Use" section in ' +
      `\`${packageName}\` settings.` +
      (packageName === 'nuclide'
        ? '\n\nNote that Flow and Hack errors will not appear until you do so.'
        : ''),
    dismissable: true,
  });
}
