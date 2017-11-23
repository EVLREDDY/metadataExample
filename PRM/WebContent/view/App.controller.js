sap.ui.core.mvc.Controller.extend("com.ril.PRMS.view.App", {
	
	  onInit : function()
	    {
	        if (sap.ui.Device.support.touch === false) 
	        {
	            this.getView().addStyleClass("sapUiSizeCompact");
	        }
	    }
});