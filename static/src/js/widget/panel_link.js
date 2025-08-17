/** @odoo-module **/

import { Component, onMounted, useRef } from "@odoo/owl";

export class PanelLink extends Component {
    static template = 'odoo_freeswitch_cti.PanelLinkTemplate';
    static props = {
        node: Object,
    };

    setup() {
        this.node = this.props.node;
        this.selectRefs = {};
        this.previous_val = null;

        console.log("PanelLink props", this.props);

        onMounted(() => this.initializeSelects());
    }

    initializeSelects() {
        const nodes = this.getNodes();

        this.node.node_path.forEach(path => {
            const selectId = `o_flow_panel_node_select_${path}`;
            const select = this.selectRefs[selectId].el;

            this.populateSelect(select, nodes);
            this.setInitialValue(select, path);
            this.addEventListeners(select, path);
        });
    }

    getNodes() {
        return Object.entries(this.node.operators)
            .filter(([operatorId, operator]) =>
                operator.type !== "start" && operatorId !== this.node.node_id)
            .map(([operatorId, operator]) => ({
                id: operatorId,
                text: operator.properties.title
            }));
    }

    populateSelect(select, nodes) {
        select.innerHTML = '<option></option>';
        nodes.forEach(node => {
            const option = document.createElement('option');
            option.value = node.id;
            option.textContent = node.text;
            select.appendChild(option);
        });
    }

    setInitialValue(select, path) {
        this.node.links.forEach(_link => {
            if (_link.fromOperator === this.node.node_id && _link.fromConnector === path) {
                select.value = _link.toOperator;
            }
        });
    }

    addEventListeners(select, path) {
        select.addEventListener("mousedown", (ev) => {
            console.log("MOUSE DOWN ..............", select.value);
            this.previous_val = select.value;
        });

        select.addEventListener("change", (ev) => {
            console.log("on changed", ev);
            const _operator_id = select.value;
            console.log("on changed opid", _operator_id, this.previous_val);
            if (this.previous_val === _operator_id) {
                return;
            }
            if (this.previous_val) {
                this.env.bus.trigger("panel_remove_link", {
                    from_operator_id: this.node.node_id,
                    from_connector: path,
                    to_operator_id: this.previous_val // this is link id
                });
            }

            if (_operator_id) {
                this.env.bus.trigger("panel_create_link", {
                    from_operator_id: this.node.node_id,
                    from_connector: path,
                    to_operator_id: _operator_id
                });
            }
        });
    }

    onClickOk(ev) {
        ev.preventDefault();
    }

    onClickCancel(ev) {
        ev.preventDefault();
    }
}
