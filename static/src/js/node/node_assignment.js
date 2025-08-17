/** @odoo-module **/

import { NodeAbstract } from './node_abstract';
import { registry } from '@web/core/registry';

export class NodeAssignment extends NodeAbstract {
    static template = "odoo_freeswitch_cti.NodeAssignment";

    setup() {
        super.setup();
    }

    node_path() {
        return ["SUCCESS"];
    }

    node_type() {
        return "assignment";
    }

    node_name() {
        return "Assign Agent";
    }

    node_icon() {
        return "user-circle";
    }

    node_seq() {
        return 6;
    }

    flow_types() {
        return ["incoming_call"];
    }
}

// Register the node
registry.category("odoo_freeswitch_cti_nodes").add("assignment", NodeAssignment);
