sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/syncStyleClass",
    "sap/ui/model/json/JSONModel",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, syncStyleClass, JSONModel) {
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
        var oBindingContext = oEvent.getParameter("listItem").getBindingContext();
        // Get the actual data object from the model
        var oData = oBindingContext.getObject();

        // Example: log the whole row data
        console.log("Selected row data:", oData);

        // If you want a specific property, e.g., "Name"
        // console.log("Name:", oData.Name);
        // this.byId("bookingTable").setBindingContext(oBindingContext);
        this.byId("bookingTable").bindElement({path: oBindingContext.getPath() + "/Supplier"});
      },
    });
  }
);
