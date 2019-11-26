/*********************************************************************
 * Copyright (c) 2019 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import * as theia from '@theia/plugin';
import * as che from '@eclipse-che/plugin';

export function start(context: theia.PluginContext) {
    che.telemetry.event('WORKSPACE_START', {});
    const SubmitEditTelemetryEventCommand = {
        id: 'telemetry-plugin-file-edit-event',
        label: 'Submit Edit File Telemetry Event'
    };
    // tslint:disable-next-line:no-any
    context.subscriptions.push(theia.commands.registerCommand(SubmitEditTelemetryEventCommand, (...args: any[]) => {
        theia.window.showInputBox({ prompt: 'Enter file type: ' }, undefined)
            .then((t: string | undefined) => {
                console.log('In the callback of InputBox with value: ', t);
                if (t) {
                    che.telemetry.event('EDITOR_USED', {
                        'programming language': t
                    });
                }
            });
    }));
}

export function stop() {

}
