/** @odoo-module */

import { registry } from "@web/core/registry";
import { ListController } from "@web/views/list/list_controller";
import { listView } from "@web/views/list/list_view";
import { useService } from "@web/core/utils/hooks";

class QueueListController extends ListController {
    setup() {
        super.setup();
        this.bus = useService("bus_service");
        this.bus.addEventListener("notification", ({ detail: notifications }) => {
            for (const { payload, type } of notifications) {
                if (type === "queue_update") {
                    this.reload();
                }
            }
        });
    }
}

export const QueueListView = {
    ...listView,
    Controller: QueueListController,
};

registry.category("views").add("queue_list", QueueListView);
