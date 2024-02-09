# Copyright (c) 2024, LynX and contributors
# For license information, please see license.txt

import frappe
import math
from frappe.model.document import Document


class CSO_SalesOrder(Document):
    def before_save(self):
        self.net_quantity = 0
        self.net_amount = 0
        for row in self.get('items'):
            self.net_quantity += row.qty
            self.net_amount += row.amount

        if self.apply:
            self.total_taxes = self.net_amount * self.tax_rate / 100
        else:
            self.total_taxes = 0

        self.total_amount = self.net_amount + self.total_taxes
        self.rounded_value = math.ceil(self.total_amount / 10) * 10
        self.in_words = frappe.utils.money_in_words(self.rounded_value)
