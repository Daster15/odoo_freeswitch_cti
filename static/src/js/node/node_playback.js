/** @odoo-module **/

import { NodeAbstract } from './node_abstract';
import { registry } from '@web/core/registry';

export class NodePlayback extends NodeAbstract {
    static template = "odoo_freeswitch_cti.NodePlayback";

    setup() {
        super.setup();
    }

    node_path() {
        return [
            "FAILED",
            "PLAYBACK_END",
            "PLAYBACK_BREAK",
            "ASR_FAILED",
            "TIMEOUT",
            "HANGUP",
            "UNKNOWN",

            "INPUT_0",
            "INPUT_1",
            "INPUT_2",
            "INPUT_3",
            "INPUT_4",
            "INPUT_5",
            "INPUT_6",
            "INPUT_7",
            "INPUT_8",
            "INPUT_9",

            "INPUT_SHARP",
            "INPUT_ASTERISK"
        ];
    }

    node_type() {
        return "playback";
    }

    node_name() {
        return "Playback";
    }

    node_icon() {
        return "play-circle-o";
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

    node_seq() {
        return 5;
    }

    flow_types() {
        return ["incoming_call"];
    }
}

// Register the node
registry.category("odoo_freeswitch_cti_nodes").add("playback", NodePlayback);
