/*********************************************************************
 * Copyright (c) 2019 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/
import { TasksExtImpl } from '@theia/plugin-ext/lib/plugin/tasks/tasks';
import * as theia from '@theia/plugin';
import { StatusBarAlignment } from '@theia/plugin-ext/lib/plugin/types-impl';

 export class ExecuteTaskContainerAware {
     static makeExecuteTaskContainerAware(tasksExt: TasksExtImpl) {
        const executeTaskContainerAware = new ExecuteTaskContainerAware();
        executeTaskContainerAware.overrideExecuteTask(tasksExt);
     }

     overrideExecuteTask(tasksExt: TasksExtImpl) {
         const originalExecuteTask = tasksExt.executeTask.bind(tasksExt);
         const executeTask = async (task: theia.Task) => {
            const notificationItem = theia.window.createStatusBarItem(StatusBarAlignment.Right);
            notificationItem.text = 'Preparing task for execution';
            notificationItem.show();
            const result = await originalExecuteTask(task);
            notificationItem.hide();

            return result;
         }
         tasksExt.executeTask = executeTask;
     }
 }