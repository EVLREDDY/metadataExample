jQuery.sap.declare("com.ril.PRMS.Component");
jQuery.sap.require("com.ril.PRMS.MyRouter");
jQuery.sap.require("com.ril.PRMS.util.Formatter");

sap.ui.core.UIComponent.extend("com.ril.PRMS.Component", {
	metadata : {
		name : "PRMS",
		version : "1.0",
		includes : ["css/style.css"],
		dependencies : {
			libs : ["sap.m", "sap.ui.layout"],
			components : []
		},

		rootView : "com.ril.PRMS.view.App",

		config : {
			resourceBundle : "i18n/messageBundle.properties",
			serviceConfig : {
				name: "",
				serviceUrl: com.ril.PRMS.util.Formatter.getServiceUrl(com.ril.PRMS.util.Formatter.PRM_SERVICE)

			}
		},

		routing : {
			config : {
				routerClass : com.ril.PRMS.MyRouter,
				viewType : "XML",
				viewPath : "com.ril.PRMS.view",
				targetAggregation : "detailPages",
				clearTarget : false
			},
			routes : [
				{
					pattern : "",
					name : "main",
					view : "Master",
					targetAggregation : "masterPages",
					targetControl : "idAppControl",
					subroutes : [
						{
							//pattern : "{entity}/{Idno}/{Status}/{date}/{transact}/{selectedItems}/{Descrpton}",
							pattern : "{entity}",
							name : "Detail",
							view : "Detail"
						}
					]
				},
				{
					name : "catchallMaster",
					view : "Master",
					targetAggregation : "masterPages",
					targetControl : "idAppControl",
					subroutes : [
						{
							pattern : ":all*:",
							name : "catchallDetail",
							view : "NotFound",
							transition : "show"
						}
					]
				}
			]
		}
	},

	init : function() {
		com.ril.PRMS.BusyD=new sap.m.BusyDialog({
			
		});
		com.ril.PRMS.BusyD.open();
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

		var mConfig = this.getMetadata().getConfig();

		// Always use absolute paths relative to our own component
		// (relative paths will fail if running in the Fiori Launchpad)
		var oRootPath = jQuery.sap.getModulePath("com.ril.PRMS");
		// Set i18n model
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : [oRootPath, mConfig.resourceBundle].join("/")
		});
		this.setModel(i18nModel, "i18n");

		var sServiceUrl = mConfig.serviceConfig.serviceUrl;

		//This code is only needed for testing the application when there is no local proxy available
		var bIsMocked = jQuery.sap.getUriParameters().get("responderOn") === "true";
		// Start the mock server for the domain model
		if (bIsMocked) {
			this._startMockServer(sServiceUrl);
		}

		// Create and set domain model to the component
		
		var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, {json: true,loadMetadataAsync: true});
		oModel.setDefaultCountMode("None");
		
		//
		oModel.attachMetadataFailed(function(data){
          //  this.getEventBus().publish("Component", "MetadataFailed");
			var backendMessage = data.mParameters.statusText;
			sap.m.MessageToast.show(backendMessage);
			com.ril.PRMS.BusyD.close();
			
		},this);
		this.setModel(oModel);

		// Set device model
		var oDeviceModel = new sap.ui.model.json.JSONModel({
			isTouch : sap.ui.Device.support.touch,
			isNoTouch : !sap.ui.Device.support.touch,
			isPhone : sap.ui.Device.system.phone,
			isNoPhone : !sap.ui.Device.system.phone,
			listMode : sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
			listItemType : sap.ui.Device.system.phone ? "Active" : "Inactive"
		});
		oDeviceModel.setDefaultBindingMode("OneWay");
		this.setModel(oDeviceModel, "device");

		this.getRouter().initialize();
	},

	_startMockServer : function (sServiceUrl) {
		jQuery.sap.require("sap.ui.core.util.MockServer");
		var oMockServer = new sap.ui.core.util.MockServer({
			rootUri: sServiceUrl
		});

		var iDelay = +(jQuery.sap.getUriParameters().get("responderDelay") || 0);
		sap.ui.core.util.MockServer.config({
			autoRespondAfter : iDelay
		});

		oMockServer.simulate("model/metadata.xml", "model/");
		oMockServer.start();


		sap.m.MessageToast.show("Running in demo mode with mock data.", {
			duration: 4000
		});
	},

	getEventBus : function () {
		return sap.ui.getCore().getEventBus();
	}
});