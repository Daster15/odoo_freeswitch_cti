/** @odoo-module **/

import { NodeAbstract } from './node_abstract';
import { registry } from '@web/core/registry';

export class NodeSet extends NodeAbstract {
    static template = "odoo_freeswitch_cti.NodeSet";

    setup() {
        super.setup();
    }

    node_path() {
        return ["SUCCESS"];
    }

    node_type() {
        return "set";
    }

    node_name() {
        return "Set";
    }

    node_icon() {
        return "gear";
    }

    node_seq() {
        return 2;
    }

    node_params() {
        return [
            {
                param_name: "variable",
                param_display: "Variable",
                param_type: "input"
            },
            {
                param_name: "value",
                param_display: "Value",
                param_type: "input"
            }
        ];
    }

    flow_types() {
        return ["incoming_call"];
    }
}

// Register the node
registry.category("odoo_freeswitch_cti_nodes").add("set", NodeSet);
