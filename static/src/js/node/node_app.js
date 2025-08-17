/** @odoo-module **/

import { NodeAbstract } from './node_abstract';
import { registry } from '@web/core/registry';

export class NodeApp extends NodeAbstract {
    static template = "odoo_freeswitch_cti.NodeApp";

    setup() {
        super.setup();
    }

    node_path() {
        return ["SUCCESS"];
    }

    node_type() {
        return "app";
    }

    node_name() {
        return "Application";
    }

    node_icon() {
        return "th";
    }

    node_seq() {
        return 2;
    }

    node_params() {
        return [
            {
                param_name: "app",
                param_display: "Application",
                param_type: "input"
            },
            {
                param_name: "data",
                param_display: "Application Data",
                param_type: "input"
            }
        ];
    }

    flow_types() {
        return ["incoming_call"];
    }
}

// Register the node
registry.category("odoo_freeswitch_cti_nodes").add("app", NodeApp);
