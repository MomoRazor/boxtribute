from ariadne import MutationType
from flask import g

from ....authz import authorize
from ....models.definitions.shipment import Shipment
from .crud import (
    cancel_shipment,
    create_shipment,
    mark_shipment_as_lost,
    move_not_delivered_boxes_in_stock,
    send_shipment,
    start_receiving_shipment,
    update_shipment_when_preparing,
    update_shipment_when_receiving,
)

mutation = MutationType()


@mutation.field("createShipment")
def resolve_create_shipment(*_, creation_input):
    authorize(permission="shipment:create", base_id=creation_input["source_base_id"])
    return create_shipment(**creation_input, user=g.user)


@mutation.field("updateShipmentWhenPreparing")
def resolve_update_shipment_when_preparing(*_, update_input):
    shipment = Shipment.get_by_id(update_input.pop("id"))
    authorize(permission="shipment:edit", base_id=shipment.source_base_id)
    authorize(permission="shipment_detail:write")
    return update_shipment_when_preparing(
        **update_input, shipment=shipment, user=g.user
    )


@mutation.field("updateShipmentWhenReceiving")
def resolve_update_shipment_when_receiving(*_, update_input):
    shipment = Shipment.get_by_id(update_input.pop("id"))
    authorize(permission="shipment:edit", base_id=shipment.target_base_id)
    authorize(permission="shipment_detail:write")
    return update_shipment_when_receiving(
        **update_input, shipment=shipment, user=g.user
    )


@mutation.field("cancelShipment")
def resolve_cancel_shipment(*_, id):
    shipment = Shipment.get_by_id(id)
    authorize(
        permission="shipment:edit",
        base_ids=[shipment.source_base_id, shipment.target_base_id],
    )
    authorize(permission="shipment_detail:write")
    return cancel_shipment(shipment=shipment, user=g.user)


@mutation.field("sendShipment")
def resolve_send_shipment(*_, id):
    shipment = Shipment.get_by_id(id)
    authorize(permission="shipment:edit", base_id=shipment.source_base_id)
    return send_shipment(shipment=shipment, user=g.user)


@mutation.field("startReceivingShipment")
def resolve_start_receiving_shipment(*_, id):
    shipment = Shipment.get_by_id(id)
    authorize(permission="shipment:edit", base_id=shipment.target_base_id)
    return start_receiving_shipment(shipment=shipment, user=g.user)


@mutation.field("markShipmentAsLost")
def resolve_mark_shipment_as_lost(*_, id):
    shipment = Shipment.get_by_id(id)
    authorize(
        permission="shipment:edit",
        base_ids=[shipment.source_base_id, shipment.target_base_id],
    )
    authorize(permission="shipment_detail:write")
    return mark_shipment_as_lost(shipment=shipment, user=g.user)


@mutation.field("moveNotDeliveredBoxesInStock")
def resolve_move_not_delivered_boxes_in_stock(*_, box_ids):
    # Authorization is complex and hence takes place in the inner function
    return move_not_delivered_boxes_in_stock(box_ids=box_ids, user=g.user)
