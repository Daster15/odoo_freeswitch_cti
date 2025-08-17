/** @odoo-module */

import { registry } from "@web/core/registry";
import { ListController } from "@web/views/list/list_controller";
import { listView } from "@web/views/list/list_view";
import { useService } from "@web/core/utils/hooks";

class AgentListController extends ListController {
    setup() {
        super.setup();
        this.bus = useService("bus_service");
        this.bus.addEventListener("notification", ({ detail: notifications }) => {
            for (const { payload, type } of notifications) {
                if (type === "agent_update") {
                    this.reload();
                }
            }
        });
    }
}

export const AgentListView = {
    ...listView,
    Controller: AgentListController,
};

registry.category("views").add("agent_list", AgentListView);
