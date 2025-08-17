/** @odoo-module **/

import { Component, useState, onWillStart } from "@odoo/owl";
import { PanelInput } from "./panel_input";

export class PanelParams extends Component {
    static template = 'odoo_freeswitch_cti.PanelParamsTemplate';
    static components = { PanelInput };
    static props = {
        params: Array,
        node: Object,
    };

    setup() {
        this.state = useState({
            params: this.props.params,
        });

        onWillStart(() => {
            this.initializeParams();
        });

        console.log("PanelParams props", this.props);
    }

    initializeParams() {
        this.state.params.forEach(param => {
            if (param.param_type === "input") {
                param.inputProps = {
                    hideButtons: true,
                    input: {
                        label: param.param_display,
                        name: param.param_name,
                        value: param.param_value
                    }
                };
            }
        });
    }

    onClickSave(ev) {
        ev.preventDefault();
        const node_param = JSON.parse(this.props.node.node_param || "{}");
        this.state.params.forEach(param => {
            if (param.param_type === "input") {
                node_param[param.param_name] = param.param_widget.getWidgetValue();
            }
        });

        const stringifiedNodeParam = JSON.stringify(node_param);
        this.env.bus.trigger("panel_change_operator_param", {
            operator_id: this.props.node.node_id,
            node_param: stringifiedNodeParam
        });
        this.props.node.node_param = stringifiedNodeParam;
    }

    onClickDiscard(ev) {
        ev.preventDefault();
        const node_param = JSON.parse(this.props.node.node_param || "{}");
        this.state.params.forEach(param => {
            if (param.param_type === "input") {
                param.param_widget.setWidgetValue(node_param[param.param_name] || "");
            }
        });
    }
}
