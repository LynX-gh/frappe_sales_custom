// Copyright (c) 2024, LynX and contributors
// For license information, please see license.txt

frappe.ui.form.on("CSO_Sales Order", {
  customer: function (frm) {
    frappe.db.get_value("CSO_Customer", frm.doc.customer, "full_name").then((r) => {
      console.log(r);
      frm.set_value("customer_name", r.message.full_name);
    });
  },

  date: function (frm) {
    frm.set_value("delivery_date", frappe.datetime.add_days(frm.doc.date, 7));
  },

  delivery_date: function (frm) {
    if (frm.doc.delivery_date <= frm.doc.date) {
      frappe.msgprint(__("Delivery date cannot be before order date"));
      frm.set_value("delivery_date", frappe.datetime.add_days(frm.doc.date, 7));
    }

    frm.doc.items.forEach((row, idx) => {
      if (!row.delivery_date || row.delivery_date < frm.doc.delivery_date)
        row.delivery_date = frm.doc.delivery_date;
    });
    frm.refresh_field("items");
  },

  refresh(frm) {
    console.log("refresh");
  },
});

frappe.ui.form.on("Sales Order Item", {
  item_code: function (frm, cdt, cdn) {
    let row = frappe.get_doc(cdt, cdn);
    row.delivery_date = frm.doc.delivery_date;
    row.qty = 1;
    row.conversion_factor = 1;
    calc_individial(frm, cdt, cdn);
  },

  qty: function (frm, cdt, cdn) {
    calc_individial(frm, cdt, cdn);
  },

  rate: function (frm, cdt, cdn) {
    calc_individial(frm, cdt, cdn);
  },
});

const calc_individial = (frm, cdt, cdn) => {
  let row = frappe.get_doc(cdt, cdn);
  row.amount = row.rate * row.qty;
  frm.refresh_field("items");
};
