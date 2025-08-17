/** @odoo-module **/

import { NodeAbstract } from './node_abstract';
import { registry } from '@web/core/registry';

export class NodeHangup extends NodeAbstract {
    static template = "odoo_freeswitch_cti.NodeHangup";

    setup() {
        super.setup();
    }

    node_path() {
        return ["SUCCESS"];
    }

    node_type() {
        return "hangup";
    }

    node_name() {
        return "Hangup Telephone";
    }

    node_icon() {
        return "tty";
    }

    node_seq() {
        return 99;
    }

    flow_types() {
        return ["incoming_call"];
    }
}

// Register the node
registry.category("odoo_freeswitch_cti_nodes").add("hangup", NodeHangup);
