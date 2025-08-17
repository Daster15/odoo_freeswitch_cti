/** @odoo-module */

import { Layout } from "@web/search/layout";
import { useService } from "@web/core/utils/hooks";
import { Component, onWillStart, onWillUpdateProps, useState } from "@odoo/owl";

export class DialplanController extends Component {
    setup() {
        this.orm = useService("orm");
        this.action = useService("action");
        this.dialog = useService("dialog");
        this.rpc = useService("rpc");

        const { Model, resModel, fields, archInfo, domain, context } = this.props;
        this.model = useState(new Model(this.rpc, resModel, fields, archInfo, domain, context));

        // Owl 2: expose component via set-ref
        this.setRenderer = (comp) => {
            this.renderer = comp;
            setTimeout(() => {
                comp.initializeFlow();  // zamiast on_attach_callback
            });
        };

        onWillStart(async () => {
            await this.model.load({ res_id: this.props.resId });
        });

        onWillUpdateProps(async (nextProps) => {
            if (nextProps && nextProps.resId && nextProps.resId !== this.props.resId) {
                await this.model.reload({ currentId: nextProps.resId });
            }
        });
    }

    onSave() {
        const data = this.renderer?.flowchartToState?.();
        if (data) this.model.save(data);
    }

    onCancel() {
        const state = this.model.get();
        this.renderer?.stateToFlowchart?.(state);
    }
}

DialplanController.template = "freeswitch_cti.DialplanView";
DialplanController.components = { Layout };
