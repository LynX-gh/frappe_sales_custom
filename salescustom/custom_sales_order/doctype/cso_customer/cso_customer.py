# Copyright (c) 2024, LynX and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class CSO_Customer(Document):
    def before_save(self):
        if self.middle_name:
            self.full_name = f'{self.first_name} {self.middle_name} {self.last_name}'
        else:
            self.full_name = f'{self.first_name} {self.last_name}'
