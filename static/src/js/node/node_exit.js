/** @odoo-module **/

import { NodeAbstract } from './node_abstract';
import { registry } from '@web/core/registry';

export class NodeExit extends NodeAbstract {
    static template = "odoo_freeswitch_cti.NodeExit";

    setup() {
        super.setup();
    }

    node_type() {
        return "exit";
    }

    node_name() {
        return "Exit Dialplan";
    }

    node_icon() {
        return "stop-circle-o";
    }

    node_seq() {
        return 1;
    }
}

// Register the node
registry.category("odoo_freeswitch_cti_nodes").add("exit", NodeExit);
