from ..enums import TaggableObjectType
from ..models.definitions.beneficiary import Beneficiary
from ..models.definitions.box import Box
from ..models.definitions.product import Product
from ..models.definitions.tags_relation import TagsRelation


def derive_beneficiary_filter(filter_input):
    """Derive filter condition for select-query from given filter parameters. If no
    parameters given, return True (i.e. no filtering applied).
    """
    if not filter_input:
        return True

    condition = True
    created_from = filter_input.get("created_from")
    if created_from is not None:
        condition &= Beneficiary.created_on >= created_from

    created_until = filter_input.get("created_until")
    if created_until is not None:
        condition &= Beneficiary.created_on <= created_until

    active = filter_input.get("active")
    if active is not None:
        # By default, the 'deleted' DateTimeField is '0000-00-00 00:00:00' which
        # evaluates to both NULL and NOT NULL. Hence in order to find actual dates
        # (indicating inactive beneficiaries) use >0 instead of IS NOT NULL
        condition &= (
            Beneficiary.deleted.is_null() if active else Beneficiary.deleted > 0
        )

    is_volunteer = filter_input.get("is_volunteer")
    if is_volunteer is not None:
        condition &= (
            Beneficiary.is_volunteer if is_volunteer else ~Beneficiary.is_volunteer
        )

    registered = filter_input.get("registered")
    if registered is not None:
        condition &= (
            ~Beneficiary.not_registered if registered else Beneficiary.not_registered
        )

    pattern = filter_input.get("pattern")
    if pattern is not None:
        condition &= (
            (Beneficiary.last_name.contains(pattern))
            | (Beneficiary.first_name.contains(pattern))
            | (Beneficiary.comment.contains(pattern))
            | (Beneficiary.group_identifier == pattern)
        )
    return condition


def derive_box_filter(filter_input, selection=None):
    """Derive filter condition for select-query from given filter parameters, along with
    corresponding model selection. If no parameters given, return True (i.e. no
    filtering applied) and `Box.select()`.
    """
    selection = selection or Box.select()
    if not filter_input:
        return True, selection

    join_with_product_required = False
    condition = True
    states = filter_input.get("states")
    if states:
        condition &= Box.state << states

    last_modified_from = filter_input.get("last_modified_from")
    if last_modified_from is not None:
        condition &= Box.last_modified_on >= last_modified_from

    last_modified_until = filter_input.get("last_modified_until")
    if last_modified_until is not None:
        condition &= Box.last_modified_on <= last_modified_until

    product_gender = filter_input.get("product_gender")
    if product_gender is not None:
        condition &= Box.product.gender == product_gender
        join_with_product_required = True

    product_category_id = filter_input.get("product_category_id")
    if product_category_id is not None:
        condition &= Box.product.category == product_category_id
        join_with_product_required = True

    product_id = filter_input.get("product_id")
    if product_id is not None:
        condition &= Box.product == product_id

    size_id = filter_input.get("size_id")
    if size_id is not None:
        condition &= Box.size == size_id

    tag_ids = filter_input.get("tag_ids")
    if tag_ids is not None:
        selection = selection.join(
            TagsRelation,
            src=Box,
            on=(
                (TagsRelation.object_type == TaggableObjectType.Box)
                & (TagsRelation.object_id == Box.id)
                & (TagsRelation.tag << tag_ids)
            ),
        ).distinct()

    if join_with_product_required:
        selection = selection.join(Product, src=Box)

    return condition, selection
