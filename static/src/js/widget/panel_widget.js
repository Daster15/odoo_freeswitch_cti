/** @odoo-module **/

import { Component, onMounted } from "@odoo/owl";
import { registry } from "@web/core/registry";

export class PanelWidget extends Component {
    static template = 'odoo_freeswitch_cti.PanelWidgetTemplate';
    static props = {
        node: Object,
    };

    setup() {
        this.node = this.props.node;
        console.log("init panel widget", this.props);

        onMounted(() => this.renderWidget());
    }

    renderWidget() {
        if (!this.node) {
            return;
        }
        console.log("renderWidget ....", this.node);
        const nodeRegistry = registry.category("odoo_freeswitch_cti_nodes");
        const NodeClass = nodeRegistry.get(this.node.node_type);
        if (NodeClass && NodeClass.prototype.nodePanel) {
            NodeClass.prototype.nodePanel(this, this.node);
        } else {
            console.error(`Node class for type ${this.node.node_type} not found or doesn't have nodePanel method`);
        }
    }
}
