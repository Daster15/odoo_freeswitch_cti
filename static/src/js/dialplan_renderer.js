/** @odoo-module */

import { Component } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

import NodeRegistry from "../../src/js/node/node_registry";
import PanelWidget from "../../src/js/widget/panel_widget";

export class DialplanRenderer extends Component {
    setup() {
        this.rpc = useService("rpc");
        this.action = useService("action");
        this.dialog = useService("dialog");
    }

    initializeFlow() {
        this._initializeFlow();
        this._renderToolbar();
        this._renderPanel();
        this._renderFlowChart();
        this._renderZoom();
        this.stateToFlowchart();
        this.isInDom = true;
    }

    flowchartToState() {
        const data = this.$flowchart.flowchart("getData");
        const nodes = [];
        const events = [];

        Object.entries(data.operators || {}).forEach(([id, op]) => {
            nodes.push({
                node_id: id,
                node_type: op.type,
                name: op.properties.title,
                node_timeout: op.properties.node?.node_timeout,
                node_param: op.properties.node?.node_param,
                display_left: op.left,
                display_top: op.top,
            });
        });

        Object.values(data.links || {}).forEach(link => {
            events.push({
                node_id: [link.fromOperator],
                name: link.fromConnector,
                next_node: [link.toOperator],
            });
        });

        return { nodes, events };
    }

    stateToFlowchart(state = { nodes: [], events: [] }) {
        const operators = {};
        const links = {};

        (state.nodes || []).forEach((node) => {
            const klass = NodeRegistry.get(node.node_type);
            if (!klass) return;
            const op = klass.fromJson(node);
            op.left = node.display_left || 0;
            op.top = node.display_top || 0;
            operators[node.node_id] = op;
        });

        (state.events || []).forEach((ev) => {
            const from = ev.node_id?.[0];
            const to = ev.next_node?.[0];
            if (!from || !to || !operators[from] || !operators[to]) return;

            const linkId = `${from}.${ev.name}.${to}`;
            links[linkId] = {
                fromOperator: from,
                fromConnector: ev.name,
                toOperator: to,
                toConnector: to + ".inputs",
                color: "lightblue",
            };
        });

        this.$flowchart.flowchart("setData", { operators, links });
        this._rerenderZoom();
        this._renderNoItemPanel();
    }

    _initializeFlow() {
        const flow = document.createElement("div");
        flow.classList.add("o_dialplan_flow");
        this.el.appendChild(flow);

        const toolbar = document.createElement("div");
        toolbar.classList.add("o_flow_toolbar");
        this.el.appendChild(toolbar);

        const chart = document.createElement("div");
        chart.classList.add("o_flow_chart");
        flow.appendChild(chart);

        this.$el = $(this.el);
        this.$flowchart = $(chart);
        this.$toolbar = $(toolbar);
    }

    _renderToolbar() {
        const nodeTypes = ["start", "end", "assignment", "join", "operator"];
        for (const type of nodeTypes) {
            const node = NodeRegistry.get(type);
            if (!node) continue;
            const $item = $(`
                <div class="o_flow_toolbar_item">
                    <div class="o_flow_toolbar_title">
                        <div class="o_flow_toolbar_title_item">${node.title()}</div>
                    </div>
                </div>
            `);
            $item.data("node-type", type);
            this.$toolbar.append($item);
        }

        this.$toolbar.find(".o_flow_toolbar_item").on("click", (e) => {
            const type = $(e.currentTarget).data("node-type");
            this._newOperator(type);
        });
    }

    _renderPanel() {
        // Placeholder - implement PanelWidget rendering
    }

    _renderFlowChart() {
        this.$flowchart.flowchart({
            data: { operators: {}, links: {} },
            defaultSelectedLinkColor: "lightblue",
            onOperatorSelect: (operatorId) => {
                this._rerenderPanel(operatorId);
                return true;
            },
        });
    }

    _renderZoom() {
        // optional
    }

    _rerenderZoom() {}
    _renderNoItemPanel() {}

    _newOperator(type) {
        const klass = NodeRegistry.get(type);
        if (!klass) return;
        const uuid = createUUID();
        const op = klass.createOperator(uuid);
        this.$flowchart.flowchart("createOperator", uuid, op);
        this._rerenderZoom();
    }

    _rerenderPanel(operatorId) {
        const node = this.$flowchart.flowchart("getOperatorData", operatorId);
        const panel = new PanelWidget(this, { node });
        panel.appendTo(this.el);  // simplified
    }
}

DialplanRenderer.template = "freeswitch_cti.DialplanRendererRoot";