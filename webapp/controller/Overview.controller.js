sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/syncStyleClass",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
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

      onClear: function () {
        const oProductsTable = this.byId("productsTable");
        // in the view, the Products ColumnListItems is under <dependents>. Otherwise it would
        // dissapear with the following unbindItems()
        oProductsTable.unbindItems();
        const oSuppliersTable = this.byId("suppliersTable");
        oSuppliersTable.removeSelections(true);
      },

      onCustomerChange: function (oEvent) {
        // Get the binding context from T1=Suppliers
        var oSupplierBindingContext = oEvent
          .getParameter("listItem")
          .getBindingContext();

        if (!oSupplierBindingContext) return;
        // Get the actual data object from the model
        var oData = oSupplierBindingContext.getObject();
        console.log("Selected row data:", oData);
        console.log("Path:" + oSupplierBindingContext.getPath());
        // If you want a specific property, e.g., "Name"
        // console.log("Name:", oData.Name);
        const sSupplierId = oSupplierBindingContext.getProperty("Id");

        // Get the Products table
        const oProductsTable = this.byId("productsTable");

        // For the first time, the table is not bound, it is empty.
        // When you click on a supplier then the data should be displayed in Products
        // Bind the Products table <items="/Products">
        var oProductsBindingItems = oProductsTable.getBinding("items");
        if (!oProductsBindingItems) {
          const oTemplate = this.byId("productsTemplate").clone();
          oProductsTable.bindItems({
            path: "/Products",
            template: oTemplate,
            templateShareable: false,
          });
          oProductsBindingItems = oProductsTable.getBinding("items");
        }

        oProductsBindingItems.filter(
          [new Filter("SupplierId", FilterOperator.EQ, sSupplierId)],
          "Application"
        );
      },

      onNavToDetails: function (oEvent) {
        var oRouter = this.getOwnerComponent().getRouter();
        // have to pass also productId
        var oSource = oEvent.getSource();
        console.log("NavToDetails Source:" + oSource);
        // the model does not have a name
        var oBindingProducts = oSource.getBindingContext();
        console.log("NavToDetails Path:", oBindingProducts.getPath());     // e.g. "/Products/3"
        console.log("NavToDetails Data:", oBindingProducts.getObject());   // object of that product
        
        // Get the productId
        var oProductId = oBindingProducts.getPath().substring("/Products".length);
        oRouter.navTo("DetailView", {productId: oProductId});

      },
    });
  }
);
