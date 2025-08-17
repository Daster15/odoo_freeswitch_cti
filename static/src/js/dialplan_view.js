/** @odoo-module */

import { registry } from "@web/core/registry";
import { DialplanController } from "./dialplan_controller";
import { DialplanModel } from "./dialplan_model";
import { DialplanRenderer } from "./dialplan_renderer";

export const DialplanView = {
    type: "dialplan",
    display_name: "Dialplan",
    icon: "fa-diagram-project",
    multiRecord: false,
    Controller: DialplanController,
    Model: DialplanModel,
    Renderer: DialplanRenderer,
    props: (genericProps, view) => ({
        ...genericProps,
        Model: view.Model,
        Renderer: view.Renderer,
        resModel: genericProps.resModel,
        fields: genericProps.fields,
        archInfo: genericProps.archInfo,
    })
};

registry.category("views").add("dialplan", DialplanView);