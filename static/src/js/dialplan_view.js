/** @odoo-module */

import { registry } from "@web/core/registry";

import { DialplanController } from "./dialplan_controller";
import { DialplanModel } from "./dialplan_model";
import { DialplanRenderer } from "./dialplan_renderer";

export const DialplanView = {
    type: "dialplan",
    display_name: "Dialplan",
    icon: "fa-code-fork",
    multiRecord: false,
    searchMenuTypes: [],
    Controller: DialplanController,
    Model: DialplanModel,
    Renderer: DialplanRenderer,
    props(genericProps, view) {
        return {
            ...genericProps,
            Model: view.Model,
            Renderer: view.Renderer,
        };
    },
};

registry.category("views").add("dialplan", DialplanView);
