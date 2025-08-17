/** @odoo-module **/

import { PanelInput } from "../widget/panel_input";
import { PanelLink } from "../widget/panel_link";
import { PanelParams } from "../widget/panel_params";

export class NodeAbstract {
    node_path() {
        return [];
    }

    node_panel(widget, node) {
        this.node_panel_head(widget, node);
        this.node_panel_name(widget, node);
        this.node_panel_parameters(widget, node);
        this.node_panel_path(widget, node);
    }

    node_panel_head(widget, node) {
    }

    node_panel_name(widget, node) {
        const panel_input_widget = new PanelInput(widget, {
            input: {
                label: "Node Name",
                name: "node_name",
                value: node.operator.properties.title,
                save: (value, input) => {
                    widget.trigger('panel_change_operator_title', {
                        operator_id: node.node_id,
                        title: value
                    });
                }
            }
        });
        panel_input_widget.mount(widget.el);
    }

    node_panel_path(widget, node) {
        const panel_link_widget = new PanelLink(widget, {
            node: node
        });
        panel_link_widget.mount(widget.el);
    }

    node_panel_parameters(widget, node) {
        const params = this.node_params(node);
        if (!params) {
            return;
        }

        // load node parameter
        if (node.node_param !== undefined) {
            const node_params = JSON.parse(node.node_param || "{}");
            params.forEach(param => {
                if (node_params[param.param_name] !== undefined) {
                    param.param_value = node_params[param.param_name];
                }
            });
        }

        const panel_params_widget = new PanelParams(widget, {params: params, node: node});
        panel_params_widget.mount(widget.el);
    }

    node_params() {
        return null;
    }

    node_type() {
        return null;
    }

    node_name() {
        return null;
    }

    node_icon() {
        return null;
    }

    node_seq() {
        return 9999;
    }

    flow_types() {
        return null;
    }
}
