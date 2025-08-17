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
        this.res_id = null;
        this.nodes = [];
        this.events = [];
        this.dialplan = null;
    }

    async load(params = {}) {
        if (params.res_id) {
            this.res_id = params.res_id;
        } else if (this.context?.active_id) {
            this.res_id = this.context.active_id;
        } else if (params.currentId) {
            this.res_id = params.currentId;
        }

        if (!this.res_id) return;
        await this._fetchInfo();
    }

    async reload(params = {}) {
        if (params.currentId) {
            this.res_id = params.currentId;
        }
        await this._fetchInfo();
    }

    get() {
        return JSON.parse(JSON.stringify({
            res_id: this.res_id,
            dialplan: this.dialplan,
            nodes: this.nodes,
            events: this.events,
        }));
    }

    async save(data) {
        await this._updateInfo(data);
    }

    async _fetchInfo() {
        const res = await this.keepLast.add(this.rpc({
            route: "/freeswitch_cti/dialplan/get_info",
            params: { id: this.res_id },
        }));
        this.nodes = res.nodes || [];
        this.dialplan = res.dialplan || null;
        this.events = res.events || [];
    }

    async _updateInfo(data) {
        const res = await this.keepLast.add(this.rpc({
            route: "/freeswitch_cti/dialplan/update_info",
            params: {
                id: this.res_id,
                nodes: data.nodes,
                events: data.events,
            },
        }));
        this.nodes = res.nodes || [];
        this.events = res.events || [];
    }
}