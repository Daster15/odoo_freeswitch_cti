/** @odoo-module */

import { Component, onMounted, useRef } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

export class DialplanRenderer extends Component {
    static template = "freeswitch_cti.DialplanRenderer";

    setup() {
        super.setup(); // Add this if extending another component

        this.rootRef = useRef("root");
        this.notification = useService("notification");
        this.loaded = false;

        onMounted(() => this.initializeFlow());
    }

    async initializeFlow() {
        try {
            if (this.loaded) return;

            await this.loadDependencies();
            this.initFlowchart();
            await this.loadInitialData();
            this.loaded = true;
        } catch (error) {
            console.error("Flow initialization failed:", error);
            this.notification.add("Failed to initialize flowchart", {
                type: "danger",
                title: "Error",
            });
        }
    }

    async loadDependencies() {
        if (!window.jQuery?.ui?.widget) {
            await this.loadScript('/odoo_freeswitch_cti/static/lib/js/jquery_ui/jquery_ui_14.js');
        }

        if (!window.jQuery?.fn?.flowchart) {
            await this.loadScript('/odoo_freeswitch_cti/static/lib/js/jquery.flowchart/jquery.flowchart.js');
        }
    }

    loadScript(url) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${url}"]`)) {
                return resolve();
            }

            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = () => {
                console.error(`Failed to load script: ${url}`);
                reject(new Error(`Failed to load script: ${url}`));
            };
            document.head.appendChild(script);
        });
    }

    initFlowchart() {
        this.flowchartContainer = document.createElement('div');
        this.flowchartContainer.className = 'o_dialplan_flowchart';
        this.rootRef.el.appendChild(this.flowchartContainer);

        this.$flowchart = $(this.flowchartContainer).flowchart({
            data: { operators: {}, links: {} },
            defaultSelectedLinkColor: "#3e80ed",
            onOperatorSelect: (id) => this.onOperatorSelect(id)
        });
    }

    async loadInitialData() {
        const state = this.props.model.get();

        // Najpierw utwórz wszystkich operatorów
        const operators = {};
        const validNodeIds = new Set();

        (state.nodes || []).forEach(node => {
            const nodeId = String(node.id);
            if (!nodeId) return;

            operators[nodeId] = {
                top: Number(node.y) || 50,
                left: Number(node.x) || 50,
                properties: {
                    title: node.type || 'Untitled',
                    inputs: {},
                    outputs: { output_1: { label: "Next" } },
                    node_param: node.properties?.node_param || '',
                    node_timeout: node.properties?.node_timeout || 0
                }
            };

            this.$flowchart.flowchart('createOperator', nodeId, operators[nodeId]);
            validNodeIds.add(nodeId);
        });

        // Następnie dodaj linki
        (state.links || []).forEach(link => {
            const fromId = String(link.from);
            const toId = String(link.to);

            if (!fromId || !toId || !validNodeIds.has(fromId) || !validNodeIds.has(toId)) {
                return;
            }

            this.$flowchart.flowchart('createLink', {
                fromOperator: fromId,
                fromConnector: link.fromConnector || 'output_1',
                toOperator: toId,
                toConnector: link.toConnector || 'input_1'
            });
        });
    }

    flowchartToState() {
        const data = this.$flowchart.flowchart('getData');
        return {
            nodes: Object.entries(data.operators).map(([id, op]) => ({
                id,
                type: op.properties.title,
                x: op.left,
                y: op.top,
                properties: {
                    node_param: op.properties.node_param || '',
                    node_timeout: op.properties.node_timeout || 0
                }
            })),
            links: Object.values(data.links).map(link => ({
                from: link.fromOperator,
                fromConnector: link.fromConnector,
                to: link.toOperator,
                toConnector: link.toConnector
            }))
        };
    }

    onOperatorSelect(id) {
        const operator = this.$flowchart.flowchart('getOperator', id);
        console.log("Selected operator:", operator);
    }
}