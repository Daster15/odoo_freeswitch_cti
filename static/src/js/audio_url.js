/** @odoo-module */

import { registry } from "@web/core/registry";
import { standardFieldProps } from "@web/views/fields/standard_field_props";
import { Component, xml } from "@odoo/owl";

export class AudioUrlField extends Component {
    setup() {
        this.websitePath = this.props.options?.website_path || false;
        this.mime = this.props.options?.mime || "audio/wav";
    }

    get href() {
        const value = this.props.value || "";
        return this.websitePath ? `${this.websitePath}${value}` : value;
    }
}

AudioUrlField.template = xml`
<t t-if="props.readonly">
  <div class="o_audio_field_url o_form_uri o_text_overflow">
    <audio controls="controls">
      <source t-att-src="href" t-att-type="mime"/>
    </audio>
  </div>
</t>
<t t-else="">
  <input t-att-value="props.value or ''" class="o_input"/>
</t>`;

AudioUrlField.props = {
    ...standardFieldProps,
};

AudioUrlField.supportedTypes = ["char"];

registry.category("fields").add("audio", AudioUrlField);
