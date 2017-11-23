jQuery.sap.require("com.ril.PRMS.util.Formatter");
sap.ui.core.mvc.Controller.extend("com.ril.PRMS.view.Master", {

	onInit : function() {
		com.ril.PRMS.core = sap.ui.getCore();
		this.oDataModel = this.getOwnerComponent().getModel();
		this.oDataModel.setSizeLimit(1000);
		this.oInitialLoadFinishedDeferred = jQuery.Deferred();
		com.ril.PRMS.Master=this;
		com.ril.PRMS.POPupValiDation="Y";
		var oEventBus = this.getEventBus();
		var jsonModel = new sap.ui.model.json.JSONModel();
		oEventBus.subscribe("Detail", "TabChanged", this.onDetailTabChanged, this);
		var path="/AppActivitySearchSet?&$skip=0&$top=20&$filter=(AttrName eq 'BU_PARTNER|I|EQ| |INIT')";
		this.methodPath(path);
		var oList = this.getView().byId("list");
		oList.setModel(jsonModel);
		oList.attachEvent("updateFinished", function() {
			var datalength= oList.getItems().length;
			var masterPage = this.getView().byId("headerText");
			this.countItem=oList.getItems()[0].mAggregations.attributes[5].mProperties.text;
			this.getView().byId("butnMastrCunt").setText("Load More ["+datalength+"/"+this.countItem+" ]");
			if(datalength>=this.countItem){
				this.getView().byId("butnMastrCunt");
			}
			masterPage.setText("Partners ("+datalength+")");
			if(!sap.ui.Device.system.phone){this.selectFirstItem();}
		}, this);
		this.onApprovalStatus();
		//On phone devices, there is nothing to select from the list. There is no need to attach events.
		if (sap.ui.Device.system.phone) {
			return;
		}

		this.getRouter().attachRoutePatternMatched(this.onRouteMatched, this);

		oEventBus.subscribe("Detail", "Changed", this.onDetailChanged, this);
		oEventBus.subscribe("Detail", "NotFound", this.onNotFound, this);

	},

	onRouteMatched : function(oEvent) {
		var sName = oEvent.getParameter("name");

		if (sName !== "main") {
			return;
		}

		//Load the detail view in desktop
		// this.loadDetailView();

		//Wait for the list to be loaded once
		this.waitForInitialListLoading(function () {

			//On the empty hash select the first item
			if(!sap.ui.Device.system.phone){this.selectFirstItem();}

		});
	},

	onFilterSearch: function(oEvent){
		var extid=sap.ui.getCore().byId("idOrderId").getValue();
		var compname = sap.ui.getCore().byId("idactivityName").getValue();
		var daterange = sap.ui.getCore().byId("idCreationDateRange").getValue();
		if(daterange != ""){
			var datetest=daterange.split('-');
			var date1=com.ril.PRMS.util.Formatter.formatYear(new Date(datetest[0]));
			var date2=com.ril.PRMS.util.Formatter.formatYear(new Date(datetest[1]));
		}else{
			date1="";
			date2="";
		}
		var appstatus = sap.ui.getCore().byId("idApprovalstatus").getSelectedKey();
		var path="/AppActivitySearchSet?$skip=0&$top=1000&$filter=(AttrName eq '/RCRM/F0027|I|EQ| |"+extid+"' or AttrName eq 'DESCRIPTION_UC|I|EQ| |"+compname+"' or AttrName eq 'START_DATE_RANGE|I|BT|"+date2+"|"+date1+"' or AttrName eq 'STATUS|I|EQ| |"+appstatus+"')";
		this.methodPath(path);
		this.fragment.destroyContent();
		this.fragment.close();
	},


	advancedSearch: function(oEvent){
		this.fragment = sap.ui.xmlfragment("com.ril.PRMS.view.filter",this);
		this.fragment.open();
	},

	refreshList: function(){

		var list=this.getView().byId("list");
		for(var i=0 ;i<list.getItems().length;i++)
		{
			list.removeSelections();
			list.getItems()[i].setVisible(true);
			list.getItems()[0].setSelected(true);
		}
	},
	onPressCancel: function(){
		this.fragment.destroyContent();
		this.fragment.close();
	},

	oncancel: function(){
		sap.ui.getCore().byId("idOrderId").setValue("");
		sap.ui.getCore().byId("idactivityName").setValue("");
		sap.ui.getCore().byId("idCreationDateRange").setValue("");
		//sap.ui.getCore().byId("idEmployeeResponsible").setValue("");
		//sap.ui.getCore().byId("idApprovalLevel").setValue("");
		sap.ui.getCore().byId("idApprovalstatus").setValue("");
		sap.ui.getCore().byId("idApprovalstatus").clearSelection();
		//sap.ui.getCore().byId("idCircle").setValue("");
		//sap.ui.getCore().byId("idRoleType").setValue("");
	},

	onapproveAll: function(evt){
		var list=this.getView().byId("list");
		var Title=[];
		var selectedItem=list.getSelectedItems();
		var SelectedItemLength=list.getSelectedItems().length;
		for(var i=0;i<SelectedItemLength;i++){
			var partnerName=selectedItem[i].mProperties.title;
			Title.push(partnerName);
		}
		sap.m.MessageBox.show(Title+" are Approved Partners",{title : SelectedItemLength+" Items are Selected",
			icon : sap.m.MessageBox.Icon.SUCCESS
		});
	},

	methodPath : function(path) {
		var that = this;
		this.oList = this.getView().byId("list");
		com.ril.PRMS.BusyD.open();
		this.oDataModel.read(path, null, [], true, function(oData,oResponse){
			if(oData.results.length==0){
				that.getRouter().myNavToWithoutHash({ 
					currentView : that.getView(),
					targetViewName : "com.ril.PRMS.view.NotFound",
					targetViewType : "XML"
				});
				that.oList.destroyItems();   
				var message = "Data is not available";
				sap.m.MessageToast.show(message);
				com.ril.PRMS.BusyD.close();
				that.byId("butnMastrCunt").setVisible(false);
				return;
			}else{
				that.byId("butnMastrCunt").setVisible(true);
				that.oList.destroyItems();          
				that.oList.getModel().setData(oData.results);
				that.oList.bindItems("/",new sap.m.ObjectListItem({
					press : function(oEvent){
						that.showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
					},
					type: "Active",
					title : "{Description}",
					//---Edited By Teenu on 09-06-2016
					firstStatus : [
					               new sap.m.ObjectStatus({
					            	   text : "{ApprovalStatus}",
					            	   state : "{path: 'ApprovalStatus',formatter: 'com.ril.PRMS.util.Formatter.statusState'}"
					               }).addStyleClass("textNoWrap")],
					               attributes:[
					                           new sap.m.ObjectAttribute({
					                        	   text:"{path: 'CreateDate',formatter: 'com.ril.PRMS.util.Formatter.string_to_Date'}",
					                           }),

					                           new sap.m.ObjectAttribute({
					                        	   title : "External Id",
					                        	   text : "{ExternalId}",
					                        	   visible:false
					                           }),
					                           new sap.m.ObjectAttribute({
					                        	   title : "Activity Id",
					                        	   text : "{ActivityId}",
					                        	   visible:false
					                           }),
					                           new sap.m.ObjectAttribute({
					                        	   title : "Approval Status",
					                        	   text : "{ApprovalStatus}",
					                        	   visible:false
					                           }),

					                           new sap.m.ObjectAttribute({
					                        	   //title : "Scenario Name", ScenarioCode
					                        	   title:"{ScenarioCode}",
					                        	   text : "{ScenarioName}",
					                        	   visible:false
					                           }),
					                           new sap.m.ObjectAttribute({
					                        	   title : "Count",
					                        	   text : "{EvRecordCount}",
					                        	   visible:false
					                           }),
					                           ]

				}));
			}
		},function(error){
			com.ril.PRMS.BusyD.close();
		});
	},

	onmasterLoad: function(evt){
		var listCount=this.oList.getItems().length;
		var countBind=listCount+20;
		var topVal = 20;
		var that=this;
		if(countBind>that.countItem){
			var pathValue=countBind-that.countItem;
			var path="/AppActivitySearchSet?$skip="+listCount+"&$top="+pathValue+"&$filter=(AttrName eq 'BU_PARTNER|I|EQ| |INIT')";
			this.searchDataAdd(path,countBind);
		}else{
			var path="/AppActivitySearchSet?$skip="+listCount+"&$top="+topVal+"&$filter=(AttrName eq 'BU_PARTNER|I|EQ| |INIT')";
			this.searchDataAdd(path,countBind);
		}


	},
	searchDataAdd: function(path,countBind){
		var that=this;
		this.oDataModel.read(path, null, [], true, function(oData,oResponse){
			var results=oData.results;
			for(var i=0;i<results.length;i++){
				var Description=oData.results[i].Description;
				var approvalStatus=oData.results[i].ApprovalStatus;
				var extnlId=oData.results[i].ExternalId;
				var actvyId=oData.results[i].ActivityId;
				var aprvlStus=oData.results[i].ApprovalStatus;
				var scnrioName=oData.results[i].ScenarioName;
				var oDatacount=oData.results[i].EvRecordCount;
				var CreateDate=oData.results[i].CreateDate;
				var ScenarioCode = oData.results[i].ScenarioCode;
				that.oList.addItem(new sap.m.ObjectListItem({
					type: "Active",
					title : Description,
					firstStatus : [
					               new sap.m.ObjectStatus({
					            	   text : approvalStatus,
					            	   state : com.ril.PRMS.util.Formatter.statusState(approvalStatus)
					               }).addStyleClass("textNoWrap")],
					               attributes:[
					                           new sap.m.ObjectAttribute({
					                        	   text:com.ril.PRMS.util.Formatter.string_to_Date(CreateDate),
					                           }),
					                           new sap.m.ObjectAttribute({
					                        	   title : "External Id",
					                        	   text : extnlId,
					                        	   visible:false
					                           }),
					                           new sap.m.ObjectAttribute({
					                        	   title : "Activity Id",
					                        	   text : actvyId,
					                        	   visible:false
					                           }),
					                           new sap.m.ObjectAttribute({
					                        	   title : "Approval Status",
					                        	   text : aprvlStus,
					                        	   visible:false
					                           }),
					                           new sap.m.ObjectAttribute({
					                        	 //  title : "Scenario Name",
					                        	   title:ScenarioCode,
					                        	   text : scnrioName,
					                        	   visible:false
					                           }),
					                           new sap.m.ObjectAttribute({
					                        	   title : "Count",
					                        	   text : oDatacount,
					                        	   visible:false
					                           }),
					                           ]
				}));
			}
			var masterPage = that.getView().byId("headerText");
			var button=that.getView().byId("butnMastrCunt");
			button.setText("Load More Data ["+countBind+"/"+that.countItem+"]");
			var listCount=that.oList.getItems().length;
			masterPage.setText("Partners ("+listCount+")");
			if(that.countItem<=20||countBind==that.countItem||countBind >that.countItem){
				button.setVisible(false);
			}
		},function(error){
			com.ril.PRMS.BusyD.close();
		});
	},
	onSearch: function(oEvent){
		var list=this.getView().byId("list");
		var sValue = oEvent.oSource.mProperties.value.toUpperCase();
		var getItems = list.getItems();
		for (var i = 0; i < getItems.length; i++) {
			var cell1=getItems[i].mProperties.title.toUpperCase();
			if (cell1.indexOf(sValue) > -1 ) {
				getItems[i].setVisible(true);
			} else {
				getItems[i].setVisible(false);
			}
		}
		this.getView().byId("headerText").setText("Partners("+list.getVisibleItems().length+")");
	},
	onDetailChanged : function (sChanel, sEvent, oData) {
		var sEntityPath = oData.sEntityPath;
		//Wait for the list to be loaded once
		this.waitForInitialListLoading(function () {
			var oList = this.getView().byId("list");

			var oSelectedItem = oList.getSelectedItem();
			// The correct item is already selected
			if(oSelectedItem && oSelectedItem.getBindingContext().getPath() === sEntityPath) {
				return;
			}
			var aItems = oList.getItems();
			for (var i = 0; i < aItems.length; i++) {
				if (aItems[i].getBindingContext().getPath() === sEntityPath) {
					oList.setSelectedItem(aItems[i], true);
					break;
				}
			}
		});
	},

	onDetailTabChanged : function (sChanel, sEvent, oData) {
		this.sTab = oData.sTabKey;
	},

	loadDetailView : function(){
		this.getRouter().myNavToWithoutHash({ 
			currentView : this.getView(),
			targetViewName : "com.ril.PRMS.view.Detail",
			targetViewType : "XML"
		});
	},

	waitForInitialListLoading : function (fnToExecute) {
		jQuery.when(this.oInitialLoadFinishedDeferred).then(jQuery.proxy(fnToExecute, this));
	},

	onNotFound : function () {
		this.getView().byId("list").removeSelections();
	},

	selectFirstItem : function() {
		var oList = this.getView().byId("list");
		var aItems = oList.getItems();
		if (aItems.length) {
			oList.setSelectedItem(aItems[0], true);
			//Load the detail view in desktop
			this.loadDetailView();
			oList.fireSelect({"listItem" : aItems[0]});
		}
		else {
			this.getRouter().myNavToWithoutHash({ 
				currentView : this.getView(),
				targetViewName : "com.ril.PRMS.view.NotFound",
				targetViewType : "XML"
			});
		}

	},
	onSelect : function(oEvent) {
//		Get the list item either from the listItem parameter or from the event's
//		source itself (will depend on the device-dependent mode)
		com.ril.PRMS.LISt_iD=this.byId("list");
		com.ril.PRMS.list_IteM=oEvent.getParameter("listItem");
		com.ril.PRMS.list_SRC=oEvent.getSource();
		if(com.ril.PRMS.POPupValiDation==="X")
		{
			sap.m.MessageBox.show("Your data will be lost.Do you want to proceed?", {
				icon: sap.m.MessageBox.Icon.INFORMATION,
				title: "Confirmation",
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
				onClose: function(oAction) { 
					if(oAction==="YES")
					{
						com.ril.PRMS.BusyD.open();
						com.ril.PRMS.POPupValiDation="Y";
						if(com.ril.PRMS.Master.byId("list").getSelectedItems().length>1){
							com.ril.PRMS.Master.masterListItem="actionButtonDisable";
							com.ril.PRMS.Master.getView().byId("butnAction").setVisible(true);
						}else{
							com.ril.PRMS.Master.masterListItem="actionButtonenable";
							com.ril.PRMS.Master.getView().byId("butnAction").setVisible(false);
						}
						com.ril.PRMS.Master.showDetail(com.ril.PRMS.list_IteM ||  com.ril.PRMS.list_SRC);
					}
					if(oAction==="NO")
					{
						com.ril.PRMS.LISt_iD.setSelectedItem(com.ril.PRMS.LISt_iD.getItems()[com.ril.PRMS.InDeX]);
					}

				},
			}
			); 

		}

		if(com.ril.PRMS.POPupValiDation==="Y")
		{
			com.ril.PRMS.BusyD.open();
			if(com.ril.PRMS.Master.byId("list").getSelectedItems().length>1){
				this.masterListItem="actionButtonDisable";
				this.getView().byId("butnAction").setVisible(true);
				//this.getView().byId("idApproveSelected").setVisible(true);
			}else{
				this.masterListItem="actionButtonenable";
				this.getView().byId("butnAction").setVisible(false);
				//this.getView().byId("idApproveSelected").setVisible(false);
			}
			this.showDetail(com.ril.PRMS.list_IteM ||  com.ril.PRMS.list_SRC);
		}
	},

	showDetail : function(oItem) {
		var bReplace = jQuery.device.is.phone ? false : true;
		var extnlId=oItem.mAggregations.attributes[1].mProperties.text;
		this.scenarioCode = oItem.mAggregations.attributes[4].mProperties.title;
		var path = extnlId;
		if(this.getRouter()._oRouter._prevRoutes[0].params[0] == path){
			this.getRouter().navTo("Detail", {
				from: "Master",
				entity: "01",
			}, bReplace);
		}
		this.getRouter().navTo("Detail", {
			from: "Master",
			entity: path,
		}, bReplace);
	},

	getEventBus : function () {
		return sap.ui.getCore().getEventBus();
	},

	getRouter : function () {
		return sap.ui.core.UIComponent.getRouterFor(this);
	},

	onActivity: function(evt){
		var oButton = evt.getSource();
		// create action sheet only once
		if (!this._actionSheet) {
			this._actionSheet = sap.ui.xmlfragment("com.ril.PRMS.view.activity", this);
			this.getView().addDependent(this._actionSheet);
		}
		this._actionSheet.openBy(oButton);
	},
	onApprovalStatus : function(){
		var that=this;
		this.jsonModel = new sap.ui.model.json.JSONModel();
		var path="/PartnerCenF4Set(IsParamName='APPROVAL_STATUS')?$expand=HEADITEMNAV/HEADERITEMNAV";
		this.oDataModel.read(path, null, [], true, function(oData,oResponse){
			that.jsonModel.setData(oData.HEADITEMNAV.results[0].HEADERITEMNAV.results);
		},function(error){
			com.ril.PRMS.BusyD.close();
		}); 
	}, 

	advancedSearch: function(oEvent){
		this.fragment = sap.ui.xmlfragment("com.ril.PRMS.view.filter",this);
		this.fragment.open();
		var appStatusCmb = sap.ui.getCore().byId("idApprovalstatus");
		appStatusCmb.setModel(this.jsonModel);

	},
	onRefresh:function(){
		var path="/AppActivitySearchSet?&$skip=0&$top=20&$filter=(AttrName eq 'BU_PARTNER|I|EQ| |INIT')";
		this.methodPath(path);
	},

	// added by linga on 11.16.2016. live change event for both external ID and company name.
	onChangeExtid:function(e){
		var source = e.oSource;
		var myRegEx  = /[^a-z\d]/i; 
		if(myRegEx.test(source.getValue())){
			source.setValue(source.getValue().replace(/[^a-zA-Z0-9]/g,''));
			sap.m.MessageToast.show("Value should be AlphaNumeric");
			return;
		}
	},
//	-----------------------------Filter---------------------//         

	onExit : function(oEvent){
		var oEventBus = this.getEventBus();
		oEventBus.unsubscribe("Detail", "TabChanged", this.onDetailTabChanged, this);
		oEventBus.unsubscribe("Detail", "Changed", this.onDetailChanged, this);
		oEventBus.unsubscribe("Detail", "NotFound", this.onNotFound, this);
	}
});
