/*********************************************************************
 * Copyright (c) 2019 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import * as che from '@eclipse-che/plugin';
import { injectable, postConstruct } from 'inversify';
import * as startPoint from '../task-plugin-backend';
import { CHE_TASK_TYPE } from './task-protocol';

const TERMINAL_WIDGET_FACTORY_ID = 'terminal';
const REMOTE_TERMINAL_WIDGET_FACTORY_ID = 'remote-terminal';

@injectable()
export class TaskStatusHandler {

    @postConstruct()
    init() {
        che.task.onDidStartTask(async (event: che.TaskInfo) => {
            console.log('Task started ', event);

            const terminalIdentifier = this.getTerminalIdentifier(event);
            che.task.setTaskStatus({ status: che.TaskStatus.InProgress, terminalIdentifier });
        }, undefined, startPoint.getSubscriptions());

        che.task.onDidEndTask(async (event: che.TaskExitedEvent) => {
            console.log('Task is completed ', event);

            const status = this.getTaskStatus(event);
            const terminalIdentifier = this.getTerminalIdentifier(event);

            che.task.setTaskStatus({ status, terminalIdentifier });
        }, undefined, startPoint.getSubscriptions());
    }

    private getTerminalIdentifier(event: che.TaskInfo | che.TaskExitedEvent): che.TerminalWidgetIdentifier {
        const taskConfig = event.config;
        if (taskConfig && taskConfig.type === CHE_TASK_TYPE) {
            return { factoryId: REMOTE_TERMINAL_WIDGET_FACTORY_ID, processId: event.processId };
        } else {
            const terminalWidgetId = `${TERMINAL_WIDGET_FACTORY_ID}-${event.terminalId}`;
            return { factoryId: TERMINAL_WIDGET_FACTORY_ID, widgetId: terminalWidgetId };
        }
    }

    private getTaskStatus(event: che.TaskInfo | che.TaskExitedEvent): che.TaskStatus {
        if (event.signal !== undefined) {
            return che.TaskStatus.Success;
        }

        if (event.code === undefined) {
            return che.TaskStatus.Unknown;
        }

        if (event.code === 0) {
            return che.TaskStatus.Success;
        } else {
            return che.TaskStatus.Error;
        }
    }

    // private async updateTaskWidget(type: string, terminalId: number): Promise<void> {
    //     console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!! ' + terminalId);
    //     if (type === 'che') {
    //         const remoteTerminals = this.widgetManager.getWidgets('remote-terminal');
    //         for (const terminal of remoteTerminals) {
    //             const processId = await (<TerminalWidget>terminal).processId;
    //             console.log('!!!!!!!!!!!! REMOTE ' + terminal.id + ' /// ' + processId);
    //             if (processId === terminalId) {
    //                 console.log('!!! REMOTE processId === terminalId');
    //                 terminal.title.iconClass = 'fa fa-check';
    //             }
    //         }
    //     } else {
    //         const terminals = this.widgetManager.getWidgets(TERMINAL_WIDGET_FACTORY_ID);
    //         for (const terminal of terminals) {
    //             console.log('!!!!!!!!!!!! LOCAL ' + terminal.id);
    //             const terminalWidgetId = `${TERMINAL_WIDGET_FACTORY_ID}-${terminalId}`;
    //             if (terminal.id === terminalWidgetId) {
    //                 console.log('!!! LOCAL Id === terminalId');
    //                 terminal.title.iconClass = 'fa fa-check';
    //             }
    //         }
    //     }
    // }
}
