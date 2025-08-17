/** @odoo-module **/

import { Component, useState } from "@odoo/owl";

export class PanelInput extends Component {
    static template = 'odoo_freeswitch_cti.PanelInputTemplate';
    static props = {
        input: Object,
        hideButtons: { type: Boolean, optional: true },
    };

    setup() {
        this.state = useState({
            value: this.props.input.value || '',
        });
        console.log("PanelInput props", this.props);
    }

    // for params load and save
    getWidgetValue() {
        return this.state.value;
    }

    setWidgetValue(v) {
        this.state.value = v;
    }

    //--------------------------------------------------------------------------
    // Handlers
    //--------------------------------------------------------------------------

    /**
     * On click ok.
     *
     * @private
     * @param {MouseEvent} ev
     */
    _onClickOk(ev) {
        ev.preventDefault();
        if (this.props.input.save && this.state.value !== this.props.input.value) {
            this.props.input.save(this.state.value, this.props.input, this);
            this.props.input.value = this.state.value;
        }
    }

    _onClickCancel(ev) {
        ev.preventDefault();
        this.state.value = this.props.input.value;
    }
}

PanelInput.props = {
    input: { type: Object },
    hideButtons: { type: Boolean, optional: true },
};
