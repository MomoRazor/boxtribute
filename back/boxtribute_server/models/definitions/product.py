from peewee import SQL, CharField, DateTimeField, IntegerField

from ...db import db
from ..fields import UIntForeignKeyField, ZeroDateTimeField
from .base import Base
from .product_category import ProductCategory
from .product_gender import ProductGender
from .size_range import SizeRange
from .standard_product import StandardProduct
from .user import User


class Product(db.Model):
    base = UIntForeignKeyField(
        column_name="camp_id",
        field="id",
        model=Base,
        on_delete="RESTRICT",
        on_update="CASCADE",
        object_id_name="base_id",
    )
    category = UIntForeignKeyField(
        column_name="category_id",
        field="id",
        model=ProductCategory,
        on_delete="RESTRICT",
    )
    comment = CharField(column_name="comments", null=True)
    created_on = DateTimeField(column_name="created", null=True)
    created_by = UIntForeignKeyField(
        model=User,
        column_name="created_by",
        field="id",
        null=True,
        on_delete="SET NULL",
        on_update="CASCADE",
    )
    deleted_on = ZeroDateTimeField(
        null=True,
        default=None,
        column_name="deleted",
    )
    gender = UIntForeignKeyField(
        column_name="gender_id",
        field="id",
        model=ProductGender,
        on_update="CASCADE",
        object_id_name="gender_id",
    )
    last_modified_on = DateTimeField(column_name="modified", null=True)
    last_modified_by = UIntForeignKeyField(
        model=User,
        column_name="modified_by",
        field="id",
        null=True,
        on_delete="SET NULL",
        on_update="CASCADE",
    )
    name = CharField()
    size_range = UIntForeignKeyField(
        column_name="sizegroup_id",
        field="id",
        model=SizeRange,
        on_delete="RESTRICT",
        on_update="CASCADE",
        object_id_name="size_range_id",
    )
    in_shop = IntegerField(
        column_name="stockincontainer", constraints=[SQL("DEFAULT 0")]
    )
    price = IntegerField(column_name="value", constraints=[SQL("DEFAULT 0")])
    standard_product = UIntForeignKeyField(
        model=StandardProduct,
        column_name="standard_product_id",
        field="id",
        null=True,
        on_delete="SET NULL",
        on_update="CASCADE",
        object_id_name="standard_product_id",
    )

    class Meta:
        table_name = "products"
