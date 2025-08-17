# -*- coding: utf-8 -*-

import odoo.http as http
import logging

_logger = logging.getLogger(__name__)


class DialplanView(http.Controller):

    @http.route('/freeswitch_cti/dialplan/get_info', type='json', auth='user')
    def get_info(self, id):
        try:
            if not id:
                return {"error": "Missing ID", "nodes": [], "events": []}

            nodes = http.request.env['freeswitch_cti.dialplan_node'].search_read(
                [('extension_id', '=', int(id))],
                ['id', 'name', 'node_type', 'node_param', 'node_timeout', 'display_left', 'display_top']
            )

            events = http.request.env['freeswitch_cti.dialplan_node_event'].search_read(
                [('extension_id', '=', int(id))],
                ['node_id', 'next_node', 'name']
            )

            return {
                "nodes": nodes or [],
                "events": events or [],
                "dialplan": None
            }
        except Exception as e:
            _logger.error("Failed to get dialplan info: %s", str(e))
            return {
                "error": str(e),
                "nodes": [],
                "events": [],
                "dialplan": None
            }

    @http.route('/freeswitch_cti/dialplan/update_info', type='json', auth='user')
    def update_info(self, id, nodes, events):
        try:
            if not id:
                return {"error": "Missing ID", "nodes": [], "events": []}

            node_obj = http.request.env['freeswitch_cti.dialplan_node']
            event_obj = http.request.env['freeswitch_cti.dialplan_node_event']
            extension_id = int(id)

            http.request.env.cr.execute("SAVEPOINT update_dialplan")
            try:
                # Usuń stare węzły i zdarzenia
                node_obj.search([('extension_id', '=', extension_id)]).unlink()
                event_obj.search([('extension_id', '=', extension_id)]).unlink()

                # Utwórz nowe węzły
                node_ids = {}
                for node in nodes:
                    if not node.get('id'):
                        continue

                    node_data = {
                        'extension_id': extension_id,
                        'name': node.get('name', ''),
                        'node_type': node.get('type', ''),
                        'node_param': node.get('node_param', ''),
                        'node_timeout': node.get('node_timeout', 0),
                        'display_left': node.get('x', 0),
                        'display_top': node.get('y', 0)
                    }
                    new_node = node_obj.create(node_data)
                    node_ids[str(node['id'])] = new_node.id

                # Utwórz nowe zdarzenia
                for event in events:
                    if not event.get('node_id') or not event.get('next_node'):
                        continue

                    event_data = {
                        'extension_id': extension_id,
                        'node_id': node_ids.get(str(event['node_id'])),
                        'next_node': node_ids.get(str(event['next_node'])),
                        'name': event.get('name', 'output_1')
                    }

                    if event_data['node_id'] and event_data['next_node']:
                        event_obj.create(event_data)

                http.request.env.cr.execute("RELEASE SAVEPOINT update_dialplan")
                return self.get_info(id)

            except Exception as e:
                http.request.env.cr.execute("ROLLBACK TO SAVEPOINT update_dialplan")
                _logger.error("Failed to update dialplan: %s", str(e))
                raise e

        except Exception as e:
            _logger.error("Failed to update dialplan: %s", str(e))
            return {
                "error": str(e),
                "nodes": [],
                "events": [],
                "dialplan": None
            }