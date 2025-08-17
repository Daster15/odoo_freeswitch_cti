/** @odoo-module **/

import { NodeAbstract } from './node_abstract';
import { registry } from '@web/core/registry';

export class NodeBridge extends NodeAbstract {
    static template = "odoo_freeswitch_cti.NodeBridge";

    setup() {
        super.setup();
    }

    node_path() {
        return ["SUCCESS"];
    }

    node_type() {
        return "bridge";
    }

    node_name() {
        return "Bridge";
    }

    node_icon() {
        return "exchange";
    }

    node_seq() {
        return 5;
    }

    node_params() {
        return [
            {
                param_name: "data",
                param_display: "Data",
                param_type: "input"
            }
        ];
    }

    flow_types() {
        return ["incoming_call"];
    }
}

// Register the node
registry.category("odoo_freeswitch_cti_nodes").add("bridge", NodeBridge);
