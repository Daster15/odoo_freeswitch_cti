/** @odoo-module */

import { useService } from "@web/core/utils/hooks";
import { Component, onWillStart, onWillUpdateProps, useState } from "@odoo/owl";

export class DialplanController extends Component {
    static template = "freeswitch_cti.DialplanView";

    setup() {

        super.setup(); // Add this if extending another component

        this.orm = useService("orm");
        this.action = useService("action");
        this.notification = useService("notification");
        this.rpc = useService("rpc");

        const { Model, resModel, fields, archInfo, domain, context } = this.props;
        this.model = useState(new Model(this.rpc, resModel, fields, archInfo, domain, context));

        onWillStart(async () => {
            try {
                await this.model.load({ res_id: this.props.resId });
            } catch (error) {
                this.notification.add("Failed to load dialplan", {
                    type: "danger",
                    title: "Error",
                });
            }
        });

        onWillUpdateProps(async (nextProps) => {
            if (nextProps?.resId !== this.props.resId) {
                try {
                    await this.model.reload({ currentId: nextProps.resId });
                } catch (error) {
                    this.notification.add("Failed to reload dialplan", {
                        type: "danger",
                        title: "Error",
                    });
                }
            }
        });
    }

    async onSave() {
        try {
            if (this.renderer) {
                const data = this.renderer.flowchartToState();
                const success = await this.model.save(data);
                if (success) {
                    this.notification.add("Dialplan saved successfully", {
                        type: "success",
                        title: "Success",
                    });
                }
            }
        } catch (error) {
            this.notification.add("Failed to save dialplan", {
                type: "danger",
                title: "Error",
            });
        }
    }

    onCancel() {
        if (this.renderer) {
            const state = this.model.get();
            this.renderer.stateToFlowchart(state);
            this.notification.add("Changes discarded", {
                type: "warning",
                title: "Warning",
            });
        }
    }
}