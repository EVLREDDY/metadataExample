jQuery.sap.declare("metadata.Component");
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ui.core.routing.History");
jQuery.sap.require("metadata.util.Formatter");
jQuery.sap.require("sap.m.routing.RouteMatchedHandler");

sap.ui.core.UIComponent.extend("metadata.Component", {
	metadata : {
		"name" : "Metadata Info",
		"version" : "1.1.0-SNAPSHOT",
		"library" : "metadata",
		"includes" : [ "util/Formatter.js","css/style.css"],
		"dependencies" : {
			"libs" : [ "sap.m" ],
			"components" : []
		},
		"config" : {
		      serviceConfig : {
		        name : "",
		        serviceUrl : metadata.util.Formatter.getServiceUrl(metadata.util.Formatter.CRM_SERVICE,true)
		      }
		    },

		routing : {
			config : {
				"viewType" : "XML",
				"viewPath" : "metadata.view",
				"targetControl" : "fioriContent",
				"targetAggregation" : "pages",
				"clearTarget" : false
			},
			routes : [
			          {
			        	  pattern : "",
			        	  name : "S1",
			        	  view : "S1"
			          },
			          {
			        	  name : "cafDisplay",
			        	  view : "cafDisplay",
			        	  pattern : "cafDisplay"
			          },
			          {
			        	  name : "TodayCaf",
			        	  view : "TodayCaf",
			        	  pattern : "TodayCaf"
			          },
			          ]
		}
	},
	createContent : function() {
		var oViewData = {
				component : this
		};

		return sap.ui.view({
			viewName : "metadata.view.Main",
			type : sap.ui.core.mvc.ViewType.XML,
			viewData : oViewData
		});
	},

	init : function() {
		metadata.appData = {};
		metadata.comp = this;
		metadata.busyDialog = new sap.m.BusyDialog();
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
		var sRootPath = jQuery.sap.getModulePath("metadata");
		var oServiceConfig = this.getMetadata().getConfig().serviceConfig;
		var sServiceUrl = oServiceConfig.serviceUrl;
		var mConfig = this.getMetadata().getConfig();
		this._routeMatchedHandler = new sap.m.routing.RouteMatchedHandler(this.getRouter(), this._bRouterCloseDialogs);
		this._initODataModel(sServiceUrl);
		this.getRouter().initialize();
	},

	exit : function() {
		this._routeMatchedHandler.destroy();
	},
	setRouterSetCloseDialogs : function(bCloseDialogs) {
		this._bRouterCloseDialogs = bCloseDialogs;
		if (this._routeMatchedHandler) {
			this._routeMatchedHandler.setCloseDialogs(bCloseDialogs);
		}
	},

	_initODataModel : function(sServiceUrl) {
		 var oModel = new sap.ui.model.odata.ODataModel("https://cors-anywhere.herokuapp.com/http://services.odata.org/V2/(S(frik5l2zde0sxh4jiifyhqo4))/OData/OData.svc/",{
			    json: true,
			    loadMetadataAsync: false,
			  });
		 this.setModel(oModel);
		 
	}
});