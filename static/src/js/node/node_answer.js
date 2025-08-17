/** @odoo-module **/

import { NodeAbstract } from './node_abstract';
import { registry } from '@web/core/registry';

export class NodeAnswer extends NodeAbstract {
    static template = "odoo_freeswitch_cti.NodeAnswer";

    setup() {
        super.setup();
    }

    node_path() {
        return ["SUCCESS"];
    }

    node_type() {
        return "answer";
    }

    node_name() {
        return "Answer";
    }

    node_icon() {
        return "phone";
    }

    node_seq() {
        return 5;
    }

    flow_types() {
        return ["incoming_call"];
    }
}

// Register the node
registry.category("odoo_freeswitch_cti_nodes").add("answer", NodeAnswer);
