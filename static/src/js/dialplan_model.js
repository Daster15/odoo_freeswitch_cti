/** @odoo-module */

import { KeepLast } from "@web/core/utils/concurrency";

export class DialplanModel {
    constructor(rpc, resModel, fields, archInfo, domain, context) {
        this.rpc = rpc;
        this.resModel = resModel;
        this.fields = fields;
        this.archInfo = archInfo || {};
        this.domain = domain || [];
        this.context = context || {};
        this.keepLast = new KeepLast();
        this.resId = null;
        this.data = {
            nodes: [],
            links: []
        };
    }

    async load(params = {}) {
        try {
            this.resId = params.res_id || this.context.active_id;
            if (!this.resId) {
                this._setEmptyState();
                return;
            }

            const result = await this.keepLast.add(
                this.rpc("/freeswitch_cti/dialplan/get_info", {
                    id: this.resId
                }).catch(() => {
                    return {nodes: [], events: [], dialplan: null};
                })
            );

            this.data = this.normalizeData(result);
        } catch (error) {
            console.error("Failed to load dialplan data:", error);
            this._setEmptyState();
        }
    }

    async save(data) {
        try {
            const result = await this.keepLast.add(
                this.rpc("/freeswitch_cti/dialplan/update_info", {
                    id: this.resId,
                    nodes: data.nodes,
                    events: this.convertLinksToEvents(data.links)
                })
            );

            this.data = this.normalizeData(result);
            return true;
        } catch (error) {
            console.error("Failed to save dialplan data:", error);
            throw error;
        }
    }

    get() {
        return JSON.parse(JSON.stringify(this.data));
    }

    normalizeData(result) {
        return {
            nodes: (result.nodes || []).map(node => ({
                id: String(node.id),
                type: node.node_type || 'Untitled',
                x: Number(node.display_left || 50),
                y: Number(node.display_top || 50),
                properties: {
                    title: node.name || node.node_type || 'Untitled',
                    node_param: node.node_param || '',
                    node_timeout: node.node_timeout || 0
                }
            })),
            links: this.convertEventsToLinks(result.events || [])
        };
    }

    convertEventsToLinks(events) {
        return events.map(event => ({
            from: String(event.node_id),
            to: String(event.next_node),
            fromConnector: event.name || 'output_1',
            toConnector: 'input_1'
        })).filter(link => link.from && link.to);
    }

    convertLinksToEvents(links) {
        return links.map(link => ({
            node_id: String(link.from),
            next_node: String(link.to),
            name: link.fromConnector || 'output_1'
        })).filter(event => event.node_id && event.next_node);
    }

    _setEmptyState() {
        this.data = {
            nodes: [],
            links: []
        };
    }
}