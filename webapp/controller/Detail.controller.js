sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/core/routing/History"],
  function (Controller, History) {
    "use strict";

    return Controller.extend("ztest.odata.controller.Detail", {
      onInit: function () {
        // Get the productId from the Overview page: first get the router
        var oRouter = this.getOwnerComponent().getRouter();
        // Register the function to respond when the route was matched
        oRouter.getRoute("DetailView").attachPatternMatched(this._onObjectMatched, this);

      },
      _onObjectMatched: function(oEvent) {
        this.getView().bindElement("/Products" + oEvent.getParameter("arguments").productId);
      },



      onNavBack: function () {
        var oHistory = History.getInstance();
        var sPreviousHash = oHistory.getPreviousHash();

        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          var oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("RouteApp", {}, true);
        }
      },
    });
  }
);
