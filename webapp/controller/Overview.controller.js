sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/syncStyleClass",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, syncStyleClass, JSONModel, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("ztest.odata.controller.Overview", {
      onInit: function () {
        var oModel = new JSONModel();
        this.getView().setModel(oModel, "customer");
      },

      onSave: function () {
        // create dialog lazily
        if (!this.pDialog) {
          this.pDialog = this.loadFragment({
            name: "ztest.odata.view.Dialog",
          }).then(
            function (oDialog) {
              // forward compact/cozy style into dialog
              syncStyleClass(
                this.getOwnerComponent().getContentDensityClass(),
                this.getView(),
                oDialog
              );
              return oDialog;
            }.bind(this)
          );
        }
        this.pDialog.then(function (oDialog) {
          oDialog.open();
        });
      },

      onCloseDialog: function () {
        // note: You don't need to chain to the pDialog promise, since this event handler
        // is only called from within the loaded dialog itself.
        this.byId("dialog").close();
      },

      onCustomerChange: function (oEvent) {
        var oSupplierBindingContext = oEvent.getParameter("listItem").getBindingContext();
        // Get the actual data object from the model
        var oData = oSupplierBindingContext.getObject();
        console.log("Selected row data:", oData);
        console.log("Path:" + oSupplierBindingContext.getPath());
        // If you want a specific property, e.g., "Name"
        // console.log("Name:", oData.Name);
        const sSupplierId = oSupplierBindingContext.getProperty("Id");

        // ↓↓↓ THIS is the binding that points to the items aggregation
        const oProductsBinding = this.byId("productsTable").getBinding("items");
        
        if (sSupplierId == null || sSupplierId === "") {
          oProductsBinding.filter([], "Application"); // clear
          return;
        }

        // .../Products?$filter=SupplierId eq <ID>
        oProductsBinding.filter(
          [new Filter("SupplierId", FilterOperator.EQ, sSupplierId)],
          "Application"
        );
      }
    });
  }
);
