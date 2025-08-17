/** @odoo-module **/

import { NodeAbstract } from './node_abstract';
import { registry } from '@web/core/registry';

export class NodeStart extends NodeAbstract {
    static template = "odoo_freeswitch_cti.NodeStart";

    setup() {
        super.setup();
    }

    node_path() {
        return ["SUCCESS"];
    }

    node_type() {
        return "start";
    }

    node_name() {
        return "Start Dialplan";
    }

    node_icon() {
        return "circle-o";
    }

    node_seq() {
        return 0;
    }
}

// Register the node
registry.category("odoo_freeswitch_cti_nodes").add("start", NodeStart);
