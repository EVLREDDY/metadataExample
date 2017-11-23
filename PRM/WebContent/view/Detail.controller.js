jQuery.sap.require("com.ril.PRMS.util.mandit");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("com.ril.PRMS.util.Formatter");
jQuery.sap.require("com.ril.PRMS.util.MessageStrip");
jQuery.sap.require("com.ril.PRMS.util.MessageStripRenderer");
jQuery.sap.require("com.ril.PRMS.util.MessageStripUtilities");
sap.ui.core.mvc.Controller.extend("com.ril.PRMS.view.Detail", {

	onInit : function() {
		com.ril.PRMS.BusyD.open();
		this.oDataModel = this.getOwnerComponent().getModel();
		this.oDataModel.setSizeLimit("100");
		this.oDataModel.setDefaultCountMode("None");
		this.oInitialLoadFinishedDeferred = jQuery.Deferred();
		if(sap.ui.Device.system.phone) {
			//Do not wait for the master when in mobile phone resolution
			this.oInitialLoadFinishedDeferred.resolve();
		} else {
			var oEventBus = this.getEventBus(); 
			oEventBus.subscribe("Component", "MetadataFailed", this.onMetadataFailed, this);
			oEventBus.subscribe("Master", "InitialLoadFinished", this.onMasterLoaded, this);
		}
		this.getRouter().attachRouteMatched(this.onRouteMatched, this);
		this.buttonFlag = 1;
		
	},
	
	//code for message Strip
	onMsgPress :function(){
		if(this.mst){
			this.mst.destroy();
		}
			this.mst=com.ril.PRMS.util.Formatter.mesgtrip();
			   this.getView().byId("detailPage").addContent(this.mst);	
		},
	
	onMetadataFailed : function(){
		this.getView().setBusy(false);
		this.oInitialLoadFinishedDeferred.resolve();
		this.showEmptyView();     
	},
	onRouteMatched : function(oEvent) {
		var oParameters = oEvent.getParameters();
		if (oParameters.name == "Detail")
		{ 
			if(oEvent.getParameter("arguments").entity == "01"){
				return
			}
			
		
			if(!com.ril.PRMS.list_SRC){
				
				com.ril.PRMS.Master.loadDetailView();
				return;
			}
			
			this.arrRet = [],this.addChars = [],this.arrDelChars =[],this.arrParentNv=[],this.LOB_SUBCATEGORY=[];
			this.LOBtableChange=false,this.salesTableChange=false,this.devicesTableChange=false,this.identifierTaxTableChange=false;
			this.editIndForTables = false,this.FOSKey="",this.serviceKey="",this.lobidkey="",this.lobdesc="";
			this.onAddressTabSelect,this.onAttributeTabSelect,this.onIdentifierTabSelect,this.onRefDetailsTabSelect,this.onAgentTabSelect,this.onUploadTabSelect,this.onHQTabSelect = false;
			this.getView().byId("profileTab").setIconColor("Default");
			this.getView().byId("addressTab").setIconColor("Default");
			this.getView().byId("identTab").setIconColor("Default");
			this.getView().byId("attributesTab").setIconColor("Default");
			this.getView().byId("refDealer").setIconColor("Default");
			this.getView().byId("agentDet").setIconColor("Default");
			this.getView().byId("iconTabFilterDoc").setIconColor("Default");
			
			this.byId("txtAreaComment").setValue("");
		
			if(this.fragment==undefined){
				this.fragment = sap.ui.xmlfragment("com.ril.PRMS.view.history",this);
			}
			
			this.historyTable = com.ril.PRMS.core.byId("historyTable");
			var jModel = new sap.ui.model.json.JSONModel([]);
			this.historyTable.setModel(jModel);
			
			
			this.table=this.getView().byId("UploadTable1");
			this.table.setModel(new sap.ui.model.json.JSONModel([]),"jsonDoc");
			
			this.table1=this.getView().byId("UploadTable2");
			this.table1.setModel(new sap.ui.model.json.JSONModel([]));
			this.transact = "";
			var attributes = com.ril.PRMS.list_SRC.getSelectedItem().mAggregations.attributes;
			this.emptyValue();
			var id=attributes[2].getText();
			this.extrnlId=attributes[1].getText();
			var date= attributes[0].getText();
			var status=attributes[3].getText();
			var descrption=com.ril.PRMS.list_SRC.getSelectedItem().getTitle();
			this.scenarioName=attributes[4].getText();
			this.getView().byId("att_id").setText(date);
			this.byId("scenario").setText(this.scenarioName);
			if(this.scenarioName=="Create New Head Quarter with Agent(s)"||
					this.scenarioName=="Create New Head Quarter without Agent(s)"||
					this.scenarioName=="Modify only Org data of HQ"||
					this.scenarioName=="Modify Org and Location data of HQ"||
					this.scenarioName=="Treminate HQ"){
				this.getView().byId("profileTab").setVisible(true);
				this.getView().byId("addressTab").setVisible(true);
				this.getView().byId("identTab").setVisible(true);
				this.getView().byId("attributesTab").setVisible(true);
				this.getView().byId("tabLocation").setVisible(false);
				this.getView().byId("frmProfileTab1").setVisible(true);
				this.getView().byId("frmProfileTab2").setVisible(false);
				this.getView().byId("lblWebsite").setVisible(true);
				this.getView().byId("inptCompWebsite").setVisible(true);
			}else if(this.scenarioName=="Create New Agent"){
				this.getView().byId("profileTab").setVisible(false);
				this.getView().byId("addressTab").setVisible(false);
				this.getView().byId("identTab").setVisible(false);
				this.getView().byId("attributesTab").setVisible(false);
				this.getView().byId("tabLocation").setVisible(true);
				this.getView().byId("frmProfileTab2").setVisible(true);
				this.getView().byId("frmProfileTab1").setVisible(false);
				this.getView().byId("lblWebsite").setVisible(false);
				this.getView().byId("inptCompWebsite").setVisible(false);
			}else{
				this.getView().byId("profileTab").setVisible(true);
				this.getView().byId("addressTab").setVisible(true);
				this.getView().byId("identTab").setVisible(true);
				this.getView().byId("attributesTab").setVisible(true);
				this.getView().byId("tabLocation").setVisible(true);
				this.getView().byId("frmProfileTab2").setVisible(true);
				this.getView().byId("frmProfileTab1").setVisible(false);
				this.getView().byId("lblWebsite").setVisible(false);
				this.getView().byId("inptCompWebsite").setVisible(false);
			}
			this.bindView(descrption,id,date,status);
			this.getView().byId("idIconTabBar").setSelectedKey("profile");
			this.objSaveData={};
			this.visibleItems();
			this.getView().byId("idEditButon").setVisible(true);
			this.getView().byId("idEditSave").setVisible(false);
			this.getView().byId("idEditCancel").setVisible(false);
			this.byId("btnApprove").setVisible(true);
			this.byId("btnReject").setVisible(true);
			this.onundoEdit("false");
			var path="/FileUpAndDelSet(DocType='',DocName='',HqId='"+this.extrnlId+"')";
			com.ril.PRMS.Master.oDataModel.remove(path,null,false,function(oRequest,oResponse){
				com.ril.PRMS.docTable.getModel().refresh();
				sap.m.MessageToast.show(JSON.parse(oResponse.headers["sap-message"]).message);
			},function(oError) {
				sap.m.MessageToast.show(oError);
				com.ril.PRMS.BusyD.close();
			});
			
			if(this.scenarioName.indexOf("Modify")>=0){
				if(this.mst){
					this.mst.destroy();
				}
				this.mst=com.ril.PRMS.util.Formatter.mesgtrip();
				   this.getView().byId("detailPage").addContent(this.mst);
			}
			
		}
		
		

		   
		   
	},

	visibleItems: function(){
		var hqTab=this.getView().byId("tabLocation").getVisible();
		if(hqTab==true){
			//-------------------Attributes------------------//
			this.getView().byId("labelFootfall").setVisible(true);
			this.getView().byId("cmbfotfall").setVisible(true);
			this.getView().byId("cmbshpfrntSpce").setVisible(false);
			this.getView().byId("labelShopfrntSpce").setVisible(true);
			this.byId("titleIT").setText("IT");
			this.getView().byId("labelPcLap").setVisible(true);
			this.getView().byId("cmbPcsLap").setVisible(true);
			this.getView().byId("labelPrntScnner").setVisible(true);
			this.getView().byId("cmbPrntrScnrs").setVisible(true);
			this.getView().byId("manPwrOthrInfraForm").setVisible(true);
			this.getView().byId("labelPyutMedia").setVisible(true);
			this.getView().byId("cmbPayoutMedia").setVisible(true);
			this.getView().byId("titleSecurtyDetls").setText("Security Details");
			this.getView().byId("labelScutyType").setVisible(true);
			this.getView().byId("cmbSurtyType").setVisible(true);
			this.getView().byId("labelScutyInstrumntDetls").setVisible(true);
			this.getView().byId("inptScurtyInstrmntDtls").setVisible(true);
			this.getView().byId("labelScutyStrtDate").setVisible(true);
			this.getView().byId("DtpckScurtyStrtDte").setVisible(true);
			this.getView().byId("labelScutyEndDate").setVisible(true);
			this.getView().byId("DtpckScurtyEndDte").setVisible(true);
			this.getView().byId("turnOverPrftFrom").setVisible(true);
			this.getView().byId("inptSecrtyAmnt").setVisible(false);
			this.getView().byId("labelContractStartDate").setVisible(false);
			this.getView().byId("datePickrStartContract").setVisible(false);
			this.getView().byId("labelContractEndDate").setVisible(false);
			this.getView().byId("datePickrEndContract").setVisible(false);
			this.getView().byId("cmbOccpnyTyp").setVisible(false);
			this.getView().byId("cmbOffcSpce").setVisible(false);
			this.getView().byId("cmbfotfall").setVisible(true);
			this.getView().byId("labelShopfrntSpce").setVisible(true);
			this.getView().byId("cmbshpfrntSpce").setVisible(true);
			this.byId("titleBankDetails").setText("");
			this.getView().byId("labelScutyAmtRs").setVisible(false);
			this.getView().byId("inptSecrtyAmnt").setVisible(false);
			this.getView().byId("labelAccountHldrName").setVisible(false);
			this.getView().byId("inptAccountHldrName").setVisible(false);
			this.getView().byId("labelAccountNo").setVisible(false);
			this.getView().byId("inputAccountNo").setVisible(false);
			this.getView().byId("labelBankName").setVisible(false);
			this.getView().byId("inptBankName").setVisible(false);
			this.getView().byId("labelBranchName").setVisible(false);
			this.getView().byId("inptBranchName").setVisible(false);
			this.getView().byId("labelIfcCode").setVisible(false);
			this.getView().byId("inptIfcCode").setVisible(false);
			this.getView().byId("AttrHQSimpleForm").setVisible(false);
			this.getView().byId("AttributeSimpleform").setVisible(true);
		}else{
			//-------------------Attributes------------------//
			this.getView().byId("labelFootfall").setVisible(true);
			this.getView().byId("cmbfotfall").setVisible(true);
			this.getView().byId("labelShopfrntSpce").setVisible(true);
			this.getView().byId("cmbshpfrntSpce").setVisible(true);
			this.getView().byId("labelShopfrntSpce").setVisible(true);
			this.byId("titleIT").setText("IT");
			this.getView().byId("labelPcLap").setVisible(true);
			this.getView().byId("cmbPcsLap").setVisible(true);
			this.getView().byId("labelPrntScnner").setVisible(true);
			this.getView().byId("cmbPrntrScnrs").setVisible(true);
			this.getView().byId("manPwrOthrInfraForm").setVisible(true);
			this.getView().byId("labelPyutMedia").setVisible(true);
			this.getView().byId("cmbPayoutMedia").setVisible(true);
			this.getView().byId("titleSecurtyDetls").setText("Security Details");
			this.getView().byId("labelScutyType").setVisible(true);
			this.getView().byId("cmbSurtyType").setVisible(true);
			this.getView().byId("labelScutyInstrumntDetls").setVisible(true);
			this.getView().byId("inptScurtyInstrmntDtls").setVisible(true);
			this.getView().byId("labelScutyStrtDate").setVisible(true);
			this.getView().byId("DtpckScurtyStrtDte").setVisible(true);
			this.getView().byId("labelScutyEndDate").setVisible(true);
			this.getView().byId("DtpckScurtyEndDte").setVisible(true);
			this.getView().byId("labelContractStartDate").setVisible(true);
			this.getView().byId("datePickrStartContract").setVisible(true);
			this.getView().byId("labelContractEndDate").setVisible(true);
			this.getView().byId("datePickrEndContract").setVisible(true);
			this.getView().byId("cmbOccpnyTyp").setVisible(true);
			this.getView().byId("cmbOffcSpce").setVisible(true);
			this.getView().byId("cmbfotfall").setVisible(true);
			this.getView().byId("labelShopfrntSpce").setVisible(true);
			this.getView().byId("cmbshpfrntSpce").setVisible(true);
			this.byId("titleBankDetails").setText("");
			this.getView().byId("labelScutyAmtRs").setVisible(true);
			this.getView().byId("inptSecrtyAmnt").setVisible(true);
			this.getView().byId("labelAccountHldrName").setVisible(false);
			this.getView().byId("inptAccountHldrName").setVisible(false);
			this.getView().byId("labelAccountNo").setVisible(false);
			this.getView().byId("inputAccountNo").setVisible(false);
			this.getView().byId("labelBankName").setVisible(false);
			this.getView().byId("inptBankName").setVisible(false);
			this.getView().byId("labelBranchName").setVisible(false);
			this.getView().byId("inptBranchName").setVisible(false);
			this.getView().byId("labelIfcCode").setVisible(false);
			this.getView().byId("inptIfcCode").setVisible(false);
			this.getView().byId("AttrHQSimpleForm").setVisible(true);
			this.getView().byId("AttributeSimpleform").setVisible(false);
		}
		this.getView().byId("inptSecrtyAmnt").setVisible(true);
		this.getView().byId("inptAccountHldrName").setVisible(true);
		this.getView().byId("inputAccountNo").setVisible(true);
		this.getView().byId("inptBankName").setVisible(true);
		this.getView().byId("inptBranchName").setVisible(true);
		this.getView().byId("inptIfcCode").setVisible(true);
	},
	bindf4: function(){
		
		setTimeout(function(){
			com.ril.PRMS.BusyD.close();
		},10000);
		
		var r4gPath="/LookUpValueSet?$filter=LovType eq 'R4GST' and PagingSize eq 100 and OffsetValue eq 1";
		this.oDataModel.read(r4gPath, null, [], true, function(oData,oResponse){
			var jsonR4gstate=new sap.ui.model.json.JSONModel(oData);
			that.getView().setModel(jsonR4gstate,"jsonr4Gstate");
		},function(oData, oResponse){
			var msg = oData.response.statusText;
			sap.m.MessageBox.alert(msg, {
				icon  : sap.m.MessageBox.Icon.ERROR,                        
				title : "Error",
				actions: [sap.m.MessageBox.Action.OK]
			});
			com.ril.PRMS.BusyD.close();
		});

		var path="/PartnerCenF4Set(IsParamName='')?$expand=HEADITEMNAV/HEADERITEMNAV";
		var that=this;
		that.docArr_D=[]; that.docArr=[]; that.docArr1=[];that.taxArrs = [];that.proofArrs=[];that.zprodGrp=[];that.zBussGrp=[];that.prfDataResults=[];
		this.oDataModel.read(path, null, [], true, function(oData,oResponse){
			var hqDET = that.getView().byId("tabLocation").getVisible();
			for(var i=0;i<oData.HEADITEMNAV.results.length;i++){
				var paramValue=oData.HEADITEMNAV.results[i].IsParamName;
				switch(paramValue){
				case "PROOF_DETAILS_D":
					var header=oData.HEADITEMNAV.results[i].HigerLevelAttr;
					if(header !="POA" && header !="POI"){
						var obj ={
								pfIdeVal : header,
								pfIdChild :oData.HEADITEMNAV.results[i].HEADERITEMNAV.results
						};
						that.taxArrs.push(obj); 
					}
					break;
				case "PROOF_DETAILS_A":
					var header=oData.HEADITEMNAV.results[i].HigerLevelAttr;
					if(header =="POI" || header == "POA" ){
						var obj ={
								pfIdeVal : header,
								pfIdChild :oData.HEADITEMNAV.results[i].HEADERITEMNAV.results
						};
						that.proofArrs.push(obj); 
					}
					break;
				case "ZBUSGRP":
					var firstHeader=oData.HEADITEMNAV.results[i];

					if(hqDET){
						var headerItemNav=oData.HEADITEMNAV.results[i].HEADERITEMNAV;
						var headerItemResults=headerItemNav.results;
						for(var prd=0;prd<headerItemResults.length;prd++){
							var obj ={
									AttrCode :headerItemResults[prd].AttrCode,
									AttrValue :headerItemResults[prd].AttrValue
							};
							that.zBussGrp.push(obj);
						}

						var hqBusJson=new sap.ui.model.json.JSONModel(that.zBussGrp);
						that.getView().setModel(hqBusJson,"hqBusgroup");
					}else{
						//that.multiCombos("mltcombxAssgndBussGroup",firstHeader); 
						that.bindAssBusGroup("TabidAssbgroup",firstHeader);
					}
					break;
				case "ZPRODGRP":
					var firstHeader=oData.HEADITEMNAV.results[i];
					if(hqDET){
						var headerItemNav=oData.HEADITEMNAV.results[i].HEADERITEMNAV;
						var headerItemResults=headerItemNav.results;
						for(var prd=0;prd<headerItemResults.length;prd++){
							var obj ={
									AttrCode :headerItemResults[prd].AttrCode,
									AttrValue :headerItemResults[prd].AttrValue
							};
							that.zprodGrp.push(obj);
						}
						var hqPrdJson=new sap.ui.model.json.JSONModel(that.zprodGrp);
						that.getView().setModel(hqPrdJson,"hqProductgroup");
					}else{
					//	that.multiCombos("multicbxPrdctGroup",firstHeader);
						that.bindGroups("tabidProgroup",firstHeader);
					}
					break;
				case "LOB_CATEGORY":
					//var headerItemNav=paramItem.HEADERITEMNAV;
					that.onComboBind("cmbLnsBusnssId",oData.HEADITEMNAV.results[i]);
					break;
				case "LOB_SUBCATEGORY":
					//var headerItemNav=paramItem.HEADERITEMNAV;
					that.LOB_SUBCATEGORY.push(oData.HEADITEMNAV.results[i]);
					break;
				case "DEALER_CHARS":
					var paramItem=oData.HEADITEMNAV.results[i];
					var HigerLevelAttr=paramItem.HigerLevelAttr;
					switch(HigerLevelAttr){
					case "ZCPCHAR-ZOCTYPE":
//						var headerItemNav=paramItem.HEADERITEMNAV;
						that.onComboBind("cmbOccpnyTyp",paramItem);
						break;
					case "ZCPCHAR-ZSPACE":
//						var headerItemNav=paramItem.HEADERITEMNAV;
						that.onComboBind("cmbOffcSpce",paramItem);
						break;
					case "ZCPCHAR-ZCOMMISSIONMED":
//						var headerItemNav=paramItem.HEADERITEMNAV;
						that.onComboBind("cmbJioMnyCmson",paramItem);
						break;
					case "ZCPCHAR-ZSETTLEFRQ":
//						var headerItemNav=paramItem.HEADERITEMNAV;
						that.onComboBind("cmbJioMnystlmntFreq",paramItem);
						break;
					case "ZCPCHAR-ZTIPENABLED":
//						var headerItemNav=paramItem.HEADERITEMNAV;
						that.onComboBind("cmbEnbleTIP",paramItem);
						break;
					case "ZCPCHAR-ZBUSCHANNEL":
//						var headerItemNav=paramItem.HEADERITEMNAV;
						that.onComboBind("cmbBusnsChnl",paramItem);
						break;
					case "ZCPCHAR-ZDLYTRANSCOUNT":
//						var headerItemNav=paramItem.HEADERITEMNAV;
						that.onComboBind("cmbDlyTrncCnt",paramItem);
						break;
					case "ZCPCHAR-ZDLYREVENUE":
//						var headerItemNav=paramItem.HEADERITEMNAV;
						that.onComboBind("cmbDlyRvnuINR",paramItem);
						break;
					case "ZCPCHAR-ZPAYTYPE":
//						var headerItemNav=paramItem.HEADERITEMNAV;
						that.onComboBind("cmbPymntAccptTyp",paramItem);
						break;
					case "ZCPCHAR-ZRETPOL":
//						var headerItemNav=paramItem.HEADERITEMNAV;
						that.onComboBind("cmbRtrnPolcy",paramItem);
						break;
					case "ZCPCHAR-ZSETTLEDET":
//						var headerItemNav=paramItem.HEADERITEMNAV;
						that.onComboBind("cmbStleDtls",paramItem);
						break;
					case "ZCPCHAR-ZYRSOFBUSINESS":
//						var headerItemNav=paramItem.HEADERITEMNAV;
						that.onComboBind("cmbYrsBusns",paramItem);
						break;
					case "ZOUTS":
//						var headerItemNav=paramItem.HEADERITEMNAV;
						that.outltSbtype = paramItem;
						break;
					}
					break;
				case "APPROVER_JOB_FUNCTION":
					var firstHeader=oData.HEADITEMNAV.results[i];
					var headerItemResults=firstHeader.HEADERITEMNAV.results;
					for(var r=0;r<headerItemResults.length;r++){
						var attrCode=headerItemResults[r].AttrCode;
						if(that.empJobfu==attrCode){
							var attrValue=headerItemResults[r].AttrValue;
							that.getView().byId("inptJobfun").setText(attrValue);
						}
					}
					break;
				case "COUNTRY":
					var firstHeader=oData.HEADITEMNAV.results[i];
					that.onComboBind("cmbCountry",firstHeader);
					that.onComboBind("cmbRefCountry",firstHeader);
					that.onComboBind("cmbAgentPreCountry",firstHeader);
					that.onComboBind("cmbAgentPerCount",firstHeader);
					that.onComboBind("cmdAgentRefCountry",firstHeader);
					break;
				case "LOCATIONTYPE":
					var firstHeader=oData.HEADITEMNAV.results[i];
					if(hqDET){
						that.onComboBind("cmbLocationTypePftb2",firstHeader);
					}else{
						that.onComboBind("cmbLocationType",firstHeader);
					}
					break;

				case "LOCATIONSUBTYPE":
					var firstHeader=oData.HEADITEMNAV.results[i];
					if(hqDET){
						that.onComboBind("cmbLocationSubTypePftb2",firstHeader);
					}else{
						that.onComboBind("cmbLocationSubType",firstHeader);
					}
					break;
				case "OWNERSHIPTYPE":
					var firstHeader=oData.HEADITEMNAV.results[i];
					if(hqDET){
						that.onComboBind("cmbOwnrTypPftb2",firstHeader);
					}else{
						that.onComboBind("cmbOwnrTyp",firstHeader);
					}
					break;
				case "REGION":
					var firstHeader=oData.HEADITEMNAV.results[i];
					that.onComboBind("cmbState",firstHeader);
					that.onComboBind("cmbRefState",firstHeader);
					that.onComboBind("cmbAgentPreState",firstHeader);
					that.onComboBind("cmbAgentPerState",firstHeader);
					that.onComboBind("cmbAgentRefState",firstHeader);
					break;
				case "ADD_CHARS_AGENT":
					var paramItem=oData.HEADITEMNAV.results[i];
					var HigerLevelAttr=paramItem.HigerLevelAttr;
					switch(HigerLevelAttr){
					case "ZAQLF":
						that.onComboBind("cmbQualification",paramItem);
						break;
					case "ZAIND":
						that.onComboBind("cmbIndustry",paramItem);
						break;
					case "ZASLN":
						that.onComboBind("cmbSecLanguage",paramItem);
						break;
					}
					break;
				case "ZZCOMM_PREF":
					var firstHeader=oData.HEADITEMNAV.results[i];
					that.onComboBind("cmbCom_pref",firstHeader);
					break;
				case "ZZGENDER":
					var firstHeader=oData.HEADITEMNAV.results[i];
					that.onComboBind("cmbGender",firstHeader);
					break;
				case "ZZJOB_FUNCTION":
					var firstHeader=oData.HEADITEMNAV.results[i];
					that.onComboBind("cmbJobFnctn",firstHeader);
					break;
				case "ZZPREFERRED_LANG":
					var firstHeader=oData.HEADITEMNAV.results[i];
					that.onComboBind("cmbPref_lang",firstHeader);
					break;
				case "ZZTITLE":
					var firstHeader=oData.HEADITEMNAV.results[i];
					that.onComboBind("cmbSaluton",firstHeader);
					break;
				case "CPTYPE":
					var firstHeader=oData.HEADITEMNAV.results[i];
					if(hqDET == true){
						that.onComboBind("cmbRelationTypePftb2",firstHeader);
						that.onComboBind("relTypLoc",firstHeader);
					}else{
						that.onComboBind("cmbRelationType",firstHeader);
					}
					break;
				case "ADD_CHARS_LOC":
					var paramItem=oData.HEADITEMNAV.results[i];
					var HigerLevelAttr=paramItem.HigerLevelAttr;
					switch(HigerLevelAttr){
					case "ZLINS":
						that.onComboBind("cmbLoctonInsurd",paramItem);
						that.onComboBind("cmbLoctonInsurdnew",paramItem);
						break;
					case "ZFTFL":
						that.onComboBind("cmbfotfall",paramItem);
						break;
					case "ZNOUT":
						that.onComboBind("cmbnoofOutlet",paramItem);
						break;
					case "ZSHFS":
						that.onComboBind("cmbshpfrntSpce",paramItem);
						break;
					case "ZCPCL":
						that.onComboBind("cmbPcsLap",paramItem);
						break;
					case "ZPRSC":
						that.onComboBind("cmbPrntrScnrs",paramItem);
						break;
					case "ZCBES":
						that.onComboBind("cmbCntBnkEndStf",paramItem);
						break;
					case "ZTMPS":
						that.onComboBind("cmbTotlMnpwrStrngt",paramItem);
						break;
					case "ZCFOS":
						that.onComboBind("cmbCntofFsStf",paramItem);
						break;
					case "ZCSUP":
						that.onComboBind("cmbSprvsonSlesStf",paramItem);
						break;
					case "ZCFES":
						that.onComboBind("cmbCntofFrntEdStf",paramItem);
						break;
//						-------------------------------------//Binding manpower adding fields-------------------------------------------------
					case "ZDSSR":
						that.onComboBind("AgentCombodss",paramItem);
						break;
					case "ZLOWN":
						that.onComboBind("AgentlocCombo",paramItem);
						that.onComboBind("AgentlocComboOwnership",paramItem);
						break;
					case "ZOLFL":
						that.onComboBind("cmbOnlneFulmnt",paramItem);
						break;
					case "ZOLFQ":
						that.onComboBind("cmbDlvryQual",paramItem);
						break;
					case "ZDELM":
//						var prm_zdelm_global = paramItem;
						//prm_zdelm_global = paramItem.HEADERITEMNAV.results;
						var firstHeader=oData.HEADITEMNAV.results[i];
						//that.multiCombos("multicmbMdeDlvry",firstHeader);
						that.bindModeOfDelv("tabidModeofDelv",firstHeader);
						
						break;
					case "ZOCON":
//						var prm_zocon_global = paramItem;
						//prm_zocon_global = paramItem.HEADERITEMNAV.results;
						var firstHeader=oData.HEADITEMNAV.results[i];
						//that.multiCombos("multicmbConnevtOffice",firstHeader);
						
						that.bindConOffice("TabidConOffice",firstHeader);
						break;
					case "ZPAYM":
						that.onComboBind("cmbPayoutMedia",paramItem);
						break;
					case "ZSTYP":
						that.onComboBind("cmbSurtyType",paramItem);
						break;
					case "ZBTYP":
						that.busTypes = paramItem;
						break;
					case "ZOUTS":
						that.outltSbtype = paramItem;
						break;
					case "ZSRVA":
						that.onComboBind("cmbSrvcAra",paramItem);
						break;
					case "ZARFS":
						that.onComboBind("cmbAreaServc",paramItem);
						break;
					case "ZSBOY":
						that.onComboBind("cmbShpServ",paramItem);
						break;
					case "ZSRVQ":
						that.onComboBind("cmbQualfcton",paramItem);
						break;
						//------Connectivity Table-----------------
					case "ZMSLVC":
						that.mnthSale = paramItem;
						break;
					case "ZASLPC":
						that.onComboBind("inptAvrgSelngPrce",paramItem);
						break;
					case "ZBRNDSC":
						that.brndService = paramItem;
						break;
					case "ZPRODTC":
						that.prodType = paramItem;
						break;
						//-----------Device table-----------------------
					case "ZMSLVD":
						that.mnthSaleDev = paramItem;
						break;
					case "ZBRNDSD":
						that.brndServiceDev = paramItem;
						break;
					case "ZPRODTD":
						that.prodTypeDev = paramItem;
						break;
					}
					break;
					// -----------------------cases  for category and ATTACH_DOC_A in  agents details tab--------------------
				case "ATTACH_DOC_CATEGORY_A":
					var headerValue=oData.HEADITEMNAV.results[i].HigerLevelAttr;
					var firstHeader=oData.HEADITEMNAV.results[i];
					for(var low=0;low<firstHeader.HEADERITEMNAV.results.length;low++){
						var obj={
								parent:headerValue,
								child:oData.HEADITEMNAV.results[i].HEADERITEMNAV.results[low].AttrValue,
								code:oData.HEADITEMNAV.results[i].HEADERITEMNAV.results[low].AttrCode
						};
						that.docArr.push(obj);
					}
					break;
				case "ATTACH_DOC_A":
					var headerValue=oData.HEADITEMNAV.results[i].HigerLevelAttr;
					var firstHeader=oData.HEADITEMNAV.results[i];
					for(var low=0;low<firstHeader.HEADERITEMNAV.results.length;low++){
						var obj={
								parent:headerValue,
								childKey:oData.HEADITEMNAV.results[i].HEADERITEMNAV.results[low].AttrCode,
								childValue:oData.HEADITEMNAV.results[i].HEADERITEMNAV.results[low].AttrValue
						};
						that.docArr1.push(obj);
					}
					break;
					// -----------------------cases  for category and ATTACH_DOC_D in  Documents tab--------------------
				case "ATTACH_DOC_CATEGORY_D":
					var headerValue=oData.HEADITEMNAV.results[i].HigerLevelAttr;
					var firstHeader=oData.HEADITEMNAV.results[i];
					for(var low=0;low<firstHeader.HEADERITEMNAV.results.length;low++){
						var obj={
								parent:headerValue,
								child:oData.HEADITEMNAV.results[i].HEADERITEMNAV.results[low].AttrValue,
								code:oData.HEADITEMNAV.results[i].HEADERITEMNAV.results[low].AttrCode
						};
						that.docArr_D.push(obj);
					}
					break;
				case "ATTACH_DOC_D":
					var headerValue=oData.HEADITEMNAV.results[i].HigerLevelAttr;
					var firstHeader=oData.HEADITEMNAV.results[i];
					for(var low=0;low<firstHeader.HEADERITEMNAV.results.length;low++){
						var obj={
								parent:headerValue,
								childKey:oData.HEADITEMNAV.results[i].HEADERITEMNAV.results[low].AttrCode,
								childValue:oData.HEADITEMNAV.results[i].HEADERITEMNAV.results[low].AttrValue
						};
						that.docArr1.push(obj);
					}
					break;
				case "CPSUBTYPE":
					var cpSubTypeHeader=oData.HEADITEMNAV.results[i];
					var cpSubType=cpSubTypeHeader.HigerLevelAttr;
					var cpSubTypeHeaderItemNav=oData.HEADITEMNAV.results[i].HEADERITEMNAV;
					var cpSubTypeHeaderItemNavrsult=cpSubTypeHeaderItemNav.results;
					if(cpSubType=="03"){
						that.cpsubtype3=[];
						that.CpSubArrayData(cpSubType,cpSubTypeHeaderItemNavrsult);
					}else if(cpSubType=="04"){
						that.cpsubtype4=[];
						that.CpSubArrayData(cpSubType,cpSubTypeHeaderItemNavrsult);
					}else if(cpSubType=="05"){
						that.cpsubtype5=[];
						that.CpSubArrayData(cpSubType,cpSubTypeHeaderItemNavrsult);
					}else if(cpSubType=="06"){
						that.cpsubtype6=[];
						that.CpSubArrayData(cpSubType,cpSubTypeHeaderItemNavrsult);
					}else if(cpSubType=="07"){
						that.cpsubtype7=[];
						that.CpSubArrayData(cpSubType,cpSubTypeHeaderItemNavrsult);
					}else if(cpSubType=="08"){
						that.cpsubtype8=[];
						that.CpSubArrayData(cpSubType,cpSubTypeHeaderItemNavrsult);
					}else if(cpSubType=="09"){
						that.cpsubtype9=[];
						that.CpSubArrayData(cpSubType,cpSubTypeHeaderItemNavrsult);
					}else if(cpSubType=="10"){
						that.cpsubtype10=[];
						that.CpSubArrayData(cpSubType,cpSubTypeHeaderItemNavrsult);
					}else if(cpSubType=="11"){
						that.cpsubtype11=[];
						that.CpSubArrayData(cpSubType,cpSubTypeHeaderItemNavrsult);
					}else if(cpSubType=="12"){
						that.cpsubtype12=[];
						that.CpSubArrayData(cpSubType,cpSubTypeHeaderItemNavrsult);
					}if(cpSubType=="DI"){
						that.cpsubtypeD1=[];
						that.CpSubArrayData(cpSubType,cpSubTypeHeaderItemNavrsult);
					}
					break;
				case "SEGMENT_VALUE":
					var segmentValue=oData.HEADITEMNAV.results[i].HigerLevelAttr;
					var firstHeader = oData.HEADITEMNAV.results[i];
					if(segmentValue=="ZDSG"){
						if(hqDET == true){
							that.onComboBind("cmbSegmentTypePftb2",firstHeader);
						}else{
							that.onComboBind("cmbSegmentValue",firstHeader);
						}
					}else if(segmentValue=="ZDBT"){
						if(hqDET == true){
							that.onComboBind("cmbSegmentValuePftb2",firstHeader);
						}else{
							that.onComboBind("cmbSegmenttype",firstHeader);
						}
					}
					break;
				}
			}
			that.onDocComboBind("combo1",that.docArr_D);
			that.onDocComboBind1("AgentCategoryCombo",that.docArr);
			that.onBindTab();
		},function(oData, oResponse){
			var msg = oData.response.statusText;
			sap.m.MessageBox.alert(msg, {
				icon  : sap.m.MessageBox.Icon.ERROR,                        
				title : "Error",
				actions: [sap.m.MessageBox.Action.OK]
			});
			com.ril.PRMS.BusyD.close();
		});
	},
	onDocComboBind1:function(id,arr){
		this.getView().byId(id).destroyItems();
		this.getView().byId(id).setSelectedKey("");
		var headerItemSubLenth=arr.length;
		for(var j=0;j<headerItemSubLenth;j++){
			var keys=arr[j].parent;
			var texts=arr[j].parent;
//			var codes=arr[j].code;
			var eVals = this.byId(id).getKeys().length;
			if(eVals == 0){
				this.getView().byId(id).addItem(new sap.ui.core.Item({key:keys, text:texts }));
			}else{
				for(var cm=0;cm<eVals;cm++){
					if(keys != this.byId(id).getKeys()[eVals-1]&&keys != this.byId(id).getKeys()[cm]&&keys != this.byId(id).getKeys()[eVals]){
						this.getView().byId(id).addItem(new sap.ui.core.Item({key:keys, text:texts }));
					}
				}
			}
		}
	},

	onDocComboBind:function(id,arr){
		this.getView().byId(id).destroyItems();
		this.getView().byId(id).setSelectedKey("");
		var headerItemSubLenth=arr.length;
		for(var j=0;j<headerItemSubLenth;j++){
			var keys=arr[j].parent;
			var texts=arr[j].parent;
			var eVals = this.byId(id).getKeys().length;
			if(eVals == 0){
				this.getView().byId(id).addItem(new sap.ui.core.Item({key:keys, text:texts }));
			}else{
				for(var cm=0;cm<eVals;cm++){
					if(keys != this.byId(id).getKeys()[eVals-1]&&keys != this.byId(id).getKeys()[cm]&&keys != this.byId(id).getKeys()[eVals]){
						this.getView().byId(id).addItem(new sap.ui.core.Item({key:keys, text:texts }));
					}
				}
			}
		}
	},
	onComboBind: function(id,firstHeader){
		this.getView().byId(id).destroyItems();
		firstHeader.HEADERITEMNAV.results.unshift({AttrCode:"",AttrValue:""});
		var headerItemSubLenth=firstHeader.HEADERITEMNAV.results.length;
		for(var j=0;j<headerItemSubLenth;j++){
			var keys=firstHeader.HEADERITEMNAV.results[j].AttrCode;
			var texts=firstHeader.HEADERITEMNAV.results[j].AttrValue;
			this.getView().byId(id).addItem(new sap.ui.core.Item({key:keys, text:texts }));
		}
	},
	segmentValueArrayData: function(segmentType,segmentTypeHeaderIemNavresult){
		for(var i=0;i<segmentTypeHeaderIemNavresult.length;i++){
			var AttrCode=segmentTypeHeaderIemNavresult[i].AttrCode;
			var AttrValue=segmentTypeHeaderIemNavresult[i].AttrValue;
			var concatValue=AttrCode.concat("-"+AttrValue);
			switch(segmentType){
			case "ZDSG":
				this.segmentValueZDSG.push(concatValue);
				break;
			case "ZDBT":
				this.segmentValueZDBT.push(concatValue);
				break;
			}
		}
	},
	CpSubArrayData: function(cpSubType,cpSubTypeHeaderItemNavrsult){
		for(var i=0;i<cpSubTypeHeaderItemNavrsult.length;i++){
			var AttrCode=cpSubTypeHeaderItemNavrsult[i].AttrCode;
			var AttrValue=cpSubTypeHeaderItemNavrsult[i].AttrValue;
			var concatValue=AttrCode.concat("-"+AttrValue);
			switch(cpSubType){
			case "03":
				this.cpsubtype3.push(concatValue);
				break;
			case "04":
				this.cpsubtype4.push(concatValue);
				break;
			case "05":
				this.cpsubtype5.push(concatValue);
				break;
			case "06":
				this.cpsubtype6.push(concatValue);
				break;
			case "07":
				this.cpsubtype7.push(concatValue);
				break;
			case "08":
				this.cpsubtype8.push(concatValue);
				break;
			case "09":
				this.cpsubtype9.push(concatValue);
				break;
			case "10":
				this.cpsubtype10.push(concatValue);
				break;
			case "11":
				this.cpsubtype11.push(concatValue);
				break;
			case "12":
				this.cpsubtype12.push(concatValue);
				break;
			case "13":
				this.cpsubtype13.push(concatValue);
				break;
			case "D1":
				this.cpsubtypeD1.push(concatValue);
				break;
			}
		}
	},
	//...................Selection Change ComboBox............................//

	onChangeHQRelationType: function(){
		var realtionSubType=this.getView().byId("relSubTypLoc");
		var selectedKey =this.getView().byId("relTypLoc").getSelectedKey();
		realtionSubType.destroyItems();
		realtionSubType.setValue("");
		this.onBindRelSubType(selectedKey,realtionSubType);
	},

	onBindRelSubType : function(selectedKey,realtionSubType){
		switch(selectedKey){
		case "03":
			var keythreeArrayLenth=this.cpsubtype3.length;
			for(var i=0;i<keythreeArrayLenth;i++){
				var concatValue=this.cpsubtype3[i];
				var concatsplitValue=concatValue.split("-");
				var keys=concatsplitValue[0];
				var texts=concatsplitValue[1];
				realtionSubType.addItem(new sap.ui.core.Item({key:keys, text:texts }));
			}
			break;
		case "04":
			var keythreeArrayLenth=this.cpsubtype4.length;
			for(var i=0;i<keythreeArrayLenth;i++){
				var concatValue=this.cpsubtype4[i];
				var concatsplitValue=concatValue.split("-");
				var keys=concatsplitValue[0];
				var texts=concatsplitValue[1];
				realtionSubType.addItem(new sap.ui.core.Item({key:keys, text:texts }));
			}
			break;
		case "05":
			var keythreeArrayLenth=this.cpsubtype5.length;
			for(var i=0;i<keythreeArrayLenth;i++){
				var concatValue=this.cpsubtype5[i];
				var concatsplitValue=concatValue.split("-");
				var keys=concatsplitValue[0];
				var texts=concatsplitValue[1];
				realtionSubType.addItem(new sap.ui.core.Item({key:keys, text:texts }));
			}
			break;
		case "06":
			var keythreeArrayLenth=this.cpsubtype6.length;
			for(var i=0;i<keythreeArrayLenth;i++){
				var concatValue=this.cpsubtype6[i];
				var concatsplitValue=concatValue.split("-");
				var keys=concatsplitValue[0];
				var texts=concatsplitValue[1];
				realtionSubType.addItem(new sap.ui.core.Item({key:keys, text:texts }));
			}
			break;
		case "07":
			var keythreeArrayLenth=this.cpsubtype7.length;
			for(var i=0;i<keythreeArrayLenth;i++){
				var concatValue=this.cpsubtype7[i];
				var concatsplitValue=concatValue.split("-");
				var keys=concatsplitValue[0];
				var texts=concatsplitValue[1];
				realtionSubType.addItem(new sap.ui.core.Item({key:keys, text:texts }));
			}
			break;
		case "08":
			var keythreeArrayLenth=this.cpsubtype8.length;
			for(var i=0;i<keythreeArrayLenth;i++){
				var concatValue=this.cpsubtype8[i];
				var concatsplitValue=concatValue.split("-");
				var keys=concatsplitValue[0];
				var texts=concatsplitValue[1];
				realtionSubType.addItem(new sap.ui.core.Item({key:keys, text:texts }));
			}
			break;
		case "09":
			var keythreeArrayLenth=this.cpsubtype9.length;
			for(var i=0;i<keythreeArrayLenth;i++){
				var concatValue=this.cpsubtype9[i];
				var concatsplitValue=concatValue.split("-");
				var keys=concatsplitValue[0];
				var texts=concatsplitValue[1];
				realtionSubType.addItem(new sap.ui.core.Item({key:keys, text:texts }));
			}
			break;
		case "10":
			var keythreeArrayLenth=this.cpsubtype10.length;
			for(var i=0;i<keythreeArrayLenth;i++){
				var concatValue=this.cpsubtype10[i];
				var concatsplitValue=concatValue.split("-");
				var keys=concatsplitValue[0];
				var texts=concatsplitValue[1];
				realtionSubType.addItem(new sap.ui.core.Item({key:keys, text:texts }));
			}
			break;
		case "11":
			var keythreeArrayLenth=this.cpsubtype11.length;
			for(var i=0;i<keythreeArrayLenth;i++){
				var concatValue=this.cpsubtype11[i];
				var concatsplitValue=concatValue.split("-");
				var keys=concatsplitValue[0];
				var texts=concatsplitValue[1];
				realtionSubType.addItem(new sap.ui.core.Item({key:keys, text:texts }));
			}
			break;
		case "12":
			var keythreeArrayLenth=this.cpsubtype12.length;
			for(var i=0;i<keythreeArrayLenth;i++){
				var concatValue=this.cpsubtype12[i];
				var concatsplitValue=concatValue.split("-");
				var keys=concatsplitValue[0];
				var texts=concatsplitValue[1];
				realtionSubType.addItem(new sap.ui.core.Item({key:keys, text:texts }));
			}
			break;
		case "13":
			var keythreeArrayLenth=this.cpsubtype13.length;
			for(var i=0;i<keythreeArrayLenth;i++){
				var concatValue=this.cpsubtype13[i];
				var concatsplitValue=concatValue.split("-");
				var keys=concatsplitValue[0];
				var texts=concatsplitValue[1];
				realtionSubType.addItem(new sap.ui.core.Item({key:keys, text:texts }));
			}
			break;
		case "D1":
			var keythreeArrayLenth=this.cpsubtypeD1.length;
			for(var i=0;i<keythreeArrayLenth;i++){
				var concatValue=this.cpsubtypeD1[i];
				var concatsplitValue=concatValue.split("-");
				var keys=concatsplitValue[0];
				var texts=concatsplitValue[1];
				realtionSubType.addItem(new sap.ui.core.Item({key:keys, text:texts }));
			}
			break;
		}
	},
	
	bindGroups:function(id,path){
		
		var resultPath=path.HEADERITEMNAV;
		var jsonModel = new sap.ui.model.json.JSONModel(resultPath);
		this.byId(id).setModel(jsonModel,"jsonData");
		
	},
	bindAssBusGroup:function(id,path){
		
		var assresultPath=path.HEADERITEMNAV;
		var jsonModelass = new sap.ui.model.json.JSONModel(assresultPath);
		this.byId(id).setModel(jsonModelass,"jsonAssbgroup");
	},
	bindModeOfDelv:function(id,path){
		
		var resultPath=path.HEADERITEMNAV;
		var jsonModel = new sap.ui.model.json.JSONModel(resultPath);
		this.byId(id).setModel(jsonModel,"jsonDataModeOfdelv");
	},
	bindConOffice:function(id,path){
		
		var resultPath=path.HEADERITEMNAV;
		var jsonModel = new sap.ui.model.json.JSONModel(resultPath);
		this.byId(id).setModel(jsonModel,"jsonDataConOff");
	},
	multiCombos: function(id,path){
		this.getView().byId(id).removeAllSelectedItems();
		this.getView().byId(id).removeAggregation();
		this.getView().byId(id).destroyItems();
		var resultPath=path.HEADERITEMNAV.results;
		for(var m=0;m<resultPath.length;m++){
			var keys=resultPath[m].AttrCode;
			var texts=resultPath[m].AttrValue;
			this.getView().byId(id).addItem(new sap.ui.core.Item({key:keys, text:texts }));
		}
	},
	onTabSelect: function(oEvent){
		var sKey = oEvent.getParameter("key");
		if(sKey =="agentDtls"){
			var cbAgents = this.getView().byId("cbAgents");

			this.arrAgentVal =[];
			for(var i=0;i<cbAgents.getItems().length;i++){
				var objkey =cbAgents.getItems()[i].mProperties.key; 
				this.objArr = "arr"+objkey;
				this.objArr=[];
			} 
			this.onloadAgentUploadData(sKey);
		}
		
		// Added by LINGA REDDY on Jan 6, 2017 7:02:54 PM

		if(sKey =="profile"){
			this.onProfileTabSelect = true;
		}
		if(sKey == "cnctDtls"){
			this.onAddressTabSelect = true;
		}
		if(sKey =="attributes"){
			this.onAttributeTabSelect = true;
			this.byId("idIconTabBarAttribute").setSelectedKey("KeyInfrastructure");
		}
		if(sKey =="proofDtls"){
			this.onIdentifierTabSelect = true;
		}
		if(sKey =="refDtls"){
			this.onRefDetailsTabSelect = true;
		}
		if(sKey =="agentDtls"){
			this.onAgentTabSelect = true;
		}
		if(sKey =="upload"){
			this.onUploadTabSelect = true;
		}
		if(sKey =="Comments"){
			this.oncommentTabSelect = true;
		}
		
		if(sKey == "location"){
			this.onHQTabSelect = true;
		}
		
	},
	//--------------------Profile Tab------------------------------//
	onR4gStateChange:function(evt){
		var r4gStateKey=this.getView().byId("cmbR4GState").getSelectedKey();
		var r4gmodel=this.getView().byId("cmbR4GState").getModel('jsonr4Gstate');
		if(r4gmodel == undefined){
			return;
		}
		var r4gData=r4gmodel.getData().results;
		var LovDescArr=[];
		if(r4gStateKey && r4gData.length !=0){
			for(var i=0; i<r4gData.length; i++){
				if(r4gStateKey===r4gData[i].LovCode){
					LovDescArr.push({
						LovCode:r4gData[i].LovCode,
						LovDesc:r4gData[i].LovDesc
					});
					break;
				}
			}
		}else{
			LovDescArr.push({
				LovCode:"",
				LovDesc:""
			});

		}
		var that=this;
		if(evt !=undefined){
			that.objSaveData["R4gstateId"]=r4gStateKey;
			that.objSaveData["R4gstateId_X"]="X";
		}
		that.getView().byId("cmbDelvryCntr").setValue("");
		that.getView().byId("cmbCircle").setValue("");
		that.getView().byId("cmbR4GArea").setValue("");
		//---------Delivery Center
		var dlvryCntrpath="/LookUpHierValueSet?$filter=LovType eq 'JIODISTRIBUTIONCENTRE' and PagingSize eq 100 and OffsetValue eq 1 and ParentLovTyp eq 'R4GST' and LovCode eq '"+r4gStateKey+"'";
		that.oDataModel.read(dlvryCntrpath,null,[],false,function(oData,oResponse){
			var jsonDlvryCenter=new sap.ui.model.json.JSONModel(oData);
			that.getView().setModel(jsonDlvryCenter,"jsonDlvryCenter");
			that.getView().byId("cmbDelvryCntr").setSelectedKey("");
		},function(oData, oResponse){
			var msg = oData.response.statusText;
			sap.m.MessageBox.alert(msg, {
				icon  : sap.m.MessageBox.Icon.ERROR,                        
				title : "Error",
				actions: [sap.m.MessageBox.Action.OK]
			});
			com.ril.PRMS.BusyD.close();
		});
		var circlePath="LookUpValueSet?$filter=LovType eq 'CIRCLE'  and PagingSize eq 100 and OffsetValue eq 1 and LovCode eq '"+LovDescArr[0].LovDesc+"'";
		that.oDataModel.read(circlePath,null,[],false,function(oData,oResponse){
			var jsonCircle=new sap.ui.model.json.JSONModel(oData);
			that.getView().setModel(jsonCircle,"jsonCircle");
			that.getView().byId("cmbCircle").setSelectedKey("");
		},function(oData, oResponse){
			var msg = oData.response.statusText;
			sap.m.MessageBox.alert(msg, {
				icon  : sap.m.MessageBox.Icon.ERROR,                        
				title : "Error",
				actions: [sap.m.MessageBox.Action.OK]
			});
			com.ril.PRMS.BusyD.close();
		});
		//---------Area--------------//
		var pathArea="/LookUpHierValueSet?$filter=LovType eq 'AREA' and PagingSize eq 100 and OffsetValue eq 1 and ParentLovTyp eq 'R4GSTATE' and LovCode eq '"+r4gStateKey+"'";
		that.oDataModel.read(pathArea,null,[],false,function(oData,oResponse){
			var jsonArea=new sap.ui.model.json.JSONModel(oData);
			that.getView().setModel(jsonArea,"jsonArea");
			that.getView().byId("cmbR4GArea").setSelectedKey("");
		},function(oData, oResponse){
			var msg = oData.response.statusText;
			sap.m.MessageBox.alert(msg, {
				icon  : sap.m.MessageBox.Icon.ERROR,                        
				title : "Error",
				actions: [sap.m.MessageBox.Action.OK]
			});
			com.ril.PRMS.BusyD.close();
		});
		this.getView().byId("cmbJiocenter").setSelectedKey("");
	},
	onR4GAreaChange: function(evt){
		var stateKey=this.getView().byId("cmbR4GArea").getSelectedKey();
		var that=this;
		if(evt != undefined){
			this.objSaveData["R4gareaId"]=stateKey;
			this.objSaveData["R4gareaId_X"]="X";
		}
		that.getView().byId("cmbJiocenter").setValue("");
		var pathArea="/LookUpHierValueSet?$filter=LovType eq 'JIOCENTER' and PagingSize eq 100 and OffsetValue eq 1 and ParentLovTyp eq 'AREA' and LovCode eq '"+stateKey+"'";
		that.oDataModel.read(pathArea,null,[],true,function(oData,oResponse){
			var jsonJiocenter=new sap.ui.model.json.JSONModel(oData);
			that.getView().setModel(jsonJiocenter,"jsonJioCenter");
		},function(oData, oResponse){
			var msg = oData.response.statusText;
			sap.m.MessageBox.alert(msg, {
				icon  : sap.m.MessageBox.Icon.ERROR,                        
				title : "Error",
				actions: [sap.m.MessageBox.Action.OK]
			});
			com.ril.PRMS.BusyD.close();
		});
	},
	onChangeParentPartnerSrvc: function(evt){
		var parentPrtSrvcValue=evt.oSource.getValue();
		this.saveArrayData("Parent Partner Services",parentPrtSrvcValue);
	},
	onPressCancel: function(e){
	var that=this;
	var event = e;
	this.editIndForTables = false;
	if(com.ril.PRMS.POPupValiDation==="X")
	{
		sap.m.MessageBox.show("All changes to your data will be lost.Do you want to proceed?", {
			icon: sap.m.MessageBox.Icon.INFORMATION,
			title: "Confirmation",
			actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose: function(oAction) { 
				if(oAction==="YES")
				{
					that.fullScreen(event);
					com.ril.PRMS.POPupValiDation="Y";
					com.ril.PRMS.BusyD.open();
					that.onBindTab();
					that.onloadAgentUploadData();
					that.onundoEdit("false");
					that.getView().byId("idEditButon").setVisible(true);
					that.getView().byId("idEditSave").setVisible(false);
					that.getView().byId("idEditCancel").setVisible(false);
					if(that.apprvlLevel== that.depoLevel){
						that.getView().byId("depstChckTlbar").setVisible(true);
						/*that.getView().byId("depstChckTlbar").setVisible(true);
						// added by linga 
						if(that.scenarioName=="Treminate HQ"){
							that.byId("idDevHandover").setVisible(true); 
							that.byId("idSettlement").setVisible(true);
						}else{
							that.byId("idDevHandover").setVisible(false); 
							that.byId("idSettlement").setVisible(false);
						}
						//------------ */
						if(com.ril.PRMS.Master.scenarioCode == "S011" || com.ril.PRMS.Master.scenarioCode == "S012" || com.ril.PRMS.Master.scenarioCode == "S013"){
							that.byId("idDevHandover").setVisible(true); 
							that.byId("idSettlement").setVisible(true);
							that.getView().byId("switchDepst").setVisible(false);
							that.getView().byId("depositCheckLabel").setVisible(false);
						//	that.byId("idDevHandover").setSelected(oData.HandoverOfDeviceDone=="X"?true:false); 
						//	that.byId("idSettlement").setVisible(oData.FinalSettlementDone=="X"?true:false);
							
						}else{
							that.getView().byId("switchDepst").setVisible(true);
							that.getView().byId("depositCheckLabel").setVisible(true);
							that.byId("idDevHandover").setVisible(false); 
							that.byId("idSettlement").setVisible(false);
						}
						
						}else{
						that.getView().byId("depstChckTlbar").setVisible(false);
						that.byId("idDevHandover").setVisible(false); 
						that.byId("idSettlement").setVisible(false);
						that.getView().byId("switchDepst").setVisible(false);
						that.getView().byId("depositCheckLabel").setVisible(false);
					}
					if(that.apprvlLevel== "99"){
						that.getView().byId("idAccept").setVisible(true);
						that.byId("btnApprove").setVisible(false);
						that.byId("btnReject").setVisible(false);
						that.getView().byId("idHold").setVisible(false);
						that.byId("idEditButon").setVisible(false);
					}else{
						that.byId("btnApprove").setVisible(true);
						that.byId("btnReject").setVisible(true);
						//that.byId("btnSendBack").setVisible(true);
						that.getView().byId("idHold").setVisible(true);
						that.getView().byId("idAccept").setVisible(false);
						that.byId("idEditButon").setVisible(true);
					}
					var taxTable=that.getView().byId("taxTable");
					var taxItem=taxTable.getItems();
					for(var i=0;i<taxItem.length;i++){
						taxTable.getItems()[i].mAggregations.cells[2].setEnabled(false);
						taxTable.getItems()[i].mAggregations.cells[3].setEnabled(false);
						taxTable.getItems()[i].mAggregations.cells[4].setEnabled(false);
						taxTable.getItems()[i].mAggregations.cells[5].setEnabled(false);
						taxTable.getItems()[i].mAggregations.cells[6].setEnabled(false);
					}
					var prfTable=that.getView().byId("proofTable");
					var prfITems=prfTable.getItems();
					for(var j=0;j<prfITems.length;j++){
						prfTable.getItems()[j].mAggregations.cells[2].setEnabled(false);
						prfTable.getItems()[j].mAggregations.cells[3].setEnabled(false);
						prfTable.getItems()[j].mAggregations.cells[4].setEnabled(false);
						prfTable.getItems()[j].mAggregations.cells[5].setEnabled(false);
						prfTable.getItems()[j].mAggregations.cells[6].setEnabled(false);
					}
					var busTypeTable = that.byId("busTypeTab");
					busTypeTable.setMode("None");
					that.byId("busTypeBtAdd").setVisible(false);
					for(var k=0;k<busTypeTable.getItems().length;k++){
						busTypeTable.getItems()[k].mAggregations.cells[0].setEnabled(false);
						busTypeTable.getItems()[k].mAggregations.cells[1].setEnabled(false);
						busTypeTable.getItems()[k].mAggregations.cells[2].setEnabled(false);
						busTypeTable.getItems()[k].mAggregations.cells[3].setEnabled(false);
						busTypeTable.getItems()[k].mAggregations.cells[4].setEnabled(false);
						busTypeTable.getItems()[k].mAggregations.cells[5].setEnabled(false);
						busTypeTable.getItems()[k].mAggregations.cells[6].setEnabled(false);
						busTypeTable.getItems()[k].mAggregations.cells[7].setEnabled(false);
						busTypeTable.getItems()[k].mAggregations.cells[8].setEnabled(false);
						busTypeTable.getItems()[k].mAggregations.cells[9].setEnabled(false);
					}
					var agntTable=that.byId("agent_Details_proofTable");
//					var agntTableLngth=agntTable.getItems().length;
					for(var ap=0;ap<agntTable.getItems().length;ap++){
						agntTable.getItems()[ap].mAggregations.cells[2].setEnabled(false);
						agntTable.getItems()[ap].mAggregations.cells[3].setEnabled(false);
						agntTable.getItems()[ap].mAggregations.cells[4].setEnabled(false);
						agntTable.getItems()[ap].mAggregations.cells[5].setEnabled(false);
						agntTable.getItems()[ap].mAggregations.cells[6].setEnabled(false);
					}
					var salesTable = that.byId("salesTab");
					salesTable.setMode("None");
					that.byId("btSalestab").setVisible(false);
					for(var l=0;l<salesTable.getItems().length;l++){
						salesTable.getItems()[l].mAggregations.cells[0].setEnabled(false);
						salesTable.getItems()[l].mAggregations.cells[1].setEnabled(false);
						salesTable.getItems()[l].mAggregations.cells[2].setEnabled(false);
					}
//					***********************Sales Detilais-Connectivity**************
					var salesTableConnectivity = that.byId("deviceTab");
					salesTableConnectivity.setMode("None");
					that.byId("btSalestabConnectivity").setVisible(false);
					for(var l=0;l<salesTableConnectivity.getItems().length;l++){
						salesTableConnectivity.getItems()[l].mAggregations.cells[0].setEnabled(false);
						salesTableConnectivity.getItems()[l].mAggregations.cells[1].setEnabled(false);
						salesTableConnectivity.getItems()[l].mAggregations.cells[2].setEnabled(false);
					}
					that.getView().byId("profileTab").setIconColor("Default");
					that.getView().byId("addressTab").setIconColor("Default");
					that.getView().byId("identTab").setIconColor("Default");
					that.getView().byId("attributesTab").setIconColor("Default");
					that.getView().byId("refDealer").setIconColor("Default");
					that.getView().byId("agentDet").setIconColor("Default");
					that.getView().byId("iconTabFilterDoc").setIconColor("Default");
					if(com.ril.PRMS.Master.byId("list").getSelectedItems().length>1){
						this.bindf4();
						this.oDataModel.refresh();
					}else{
						return
					}
					
				}
				if(oAction==="NO")
				{
					com.ril.PRMS.POPupValiDation="X";
				}
			},
		}
		); 
	}},
	ApprovalHistoryFrag:function(oEvent){
		var that = this;
		var path = "ApprovalActivityDisplaySet(ActivityId='"+this.id+"')?$expand=ADISPTOLISTNAV";
		if(that.approvalHistoryFragmentData == undefined){
			this.oDataModel.read(path, null, [], true, function(oData,oResponse){
				that.approvalHistoryFragmentData = oData.ADISPTOLISTNAV;
				that.approvalHistoryFragmentBind(oData);
				that.fragment.open();
			},function(oData, oResponse){
				var msg = oData.response.statusText;
				sap.m.MessageBox.alert(msg, {
					icon  : sap.m.MessageBox.Icon.ERROR,                        
					title : "Error",
					actions: [sap.m.MessageBox.Action.OK]
				});
				com.ril.PRMS.BusyD.close();
			});	
		}else{
			that.fragment.open();
		}
		
	},
	approvalHistoryFragmentBind:function(oData){
		var that = this;
		var compName=oData.Description;
		that.depoLevel = oData.DepositLevel;
		com.ril.PRMS.core.byId("histroyFrgmntActTle").setText("Approval History for Activity-"+compName);
		that.historyTable.getModel().setData(oData.ADISPTOLISTNAV);
		that.historyTable.bindItems("/results",new sap.m.ColumnListItem({
			cells : [
			         new sap.m.Text({
			        	 text:"{ApprovarName}"
			         }),
			         new sap.m.Text({
			        	 text:"{Approvar}"
			         }),
			         new sap.m.Text({
			        	 text:"{ApprovalLevel}"
			         }),
			         new sap.m.Text({
			        	 text:"{CompletionDate}"
			         }),
			         new sap.m.Text({
			        	 text:"{IvActivityId}"
			         }),
			         new sap.m.Text({
			        	 text:"{JobFunction}"
			         }),
			         new sap.m.Text({
			        	 text:""
			         }),
			         ]
		}));
		
	},
	
	onOK:function(oEvent){
		//this.fragment.destroyContent();
		this.fragment.close();
	},
	onhstryCancel: function(){
	//	this.fragment.destroyContent();
		this.fragment.close();
	},
	onAction: function(oEvent){
		var oButton = oEvent.getSource();
		// create action sheet only once
		if (!this._actionSheet) {
			this._actionSheet = sap.ui.xmlfragment("com.ril.PRMS.view.ActionSheet", this);
			this.getView().addDependent(this._actionSheet);
		}
		this._actionSheet.openBy(oButton);
	},
	showEmptyView : function () {
		this.getRouter().myNavToWithoutHash({ 
			currentView : this.getView(),
			targetViewName : "com.ril.PRMS.view.NotFound",
			targetViewType : "XML"
		});
	},
	fireDetailChanged : function (sEntityPath) {
		this.getEventBus().publish("Detail", "Changed", { sEntityPath : sEntityPath });
	},
	fireDetailNotFound : function () {
		this.getEventBus().publish("Detail", "NotFound");
	},
	onNavBack : function() {
		this.getRouter().myNavBack("main");
	},
	onDetailSelect : function(oEvent) {
		sap.ui.core.UIComponent.getRouterFor(this).navTo("detail",{
			entity : oEvent.getSource().getBindingContext().getPath().slice(1),
			tab: oEvent.getParameter("selectedKey")
		}, true);
	},
	getEventBus : function () {
		return com.ril.PRMS.core.getEventBus();
	},
	getRouter : function () {
		return sap.ui.core.UIComponent.getRouterFor(this);
	},
	//Binding
	bindView : function (descrption,id,date,status) {
		this.id = id;
//		var oView = this.getView();
		var ObjectHeader=this.getView().byId("detailHeader");
		ObjectHeader.setTitle(descrption);
		ObjectHeader.setNumberUnit("Activity Id");
		var objStatus=this.getView().byId("status_id");
		objStatus.setText(status);
		objStatus.setState(com.ril.PRMS.util.Formatter.ApprovalStatus(status));
		var objAttribute=this.getView().byId("att_id");
		objAttribute.setText(date);
		var path = "ApprovalActivityDisplaySet(ActivityId='"+id+"')?$expand=ADISPTOLISTNAV";
		var that=this;
		this.oDataModel.read(path, null, [], true, function(oData,oResponse){
			that.approvalHistoryFragmentData = oData.ADISPTOLISTNAV;
			that.approvalHistoryFragmentBind(oData);
			var desc = oData.ApprovalLine;
//			var createDate=oData.CreateDate
			that.empJobfu=oData.EmpJobfun;
			var empRspnsble=oData.EmpName;
			that.apprvlLevel=oData.ZapprovalLevel;
			that.createOwner=oData.CreateOwner;
//			var transact=oData.TransactionNo;
			that.transact=oData.TransactionNo;
			var objAttribute=that.getView().byId("transactNo");
			objAttribute.setText(that.transact);
			var dpstCheck=oData.DepositCheck;
			var depostiLevel=oData.DepositLevel;
			var depostChkToBar=that.byId("depstChckTlbar");
			var swtchDpstChck=that.byId("switchDepst");
			if(that.apprvlLevel==depostiLevel){
				depostChkToBar.setVisible(true);
				
				// added by linga 
				if(com.ril.PRMS.Master.scenarioCode == "S011" || com.ril.PRMS.Master.scenarioCode == "S012" || com.ril.PRMS.Master.scenarioCode == "S013"){
					that.byId("idDevHandover").setVisible(true); 
					that.byId("idSettlement").setVisible(true);
					swtchDpstChck.setVisible(false);
					that.getView().byId("depositCheckLabel").setVisible(false);
					that.byId("idDevHandover").setSelected(oData.HandoverOfDeviceDone=="X"?true:false); 
					that.byId("idDevHandover").isChecked = (oData.HandoverOfDeviceDone=="X"?true:false); 
					that.byId("idSettlement").setSelected(oData.FinalSettlementDone=="X"?true:false);
					that.byId("idSettlement").isChecked = (oData.FinalSettlementDone=="X"?true:false);
					
				}else{
					
					if(dpstCheck!=""){
						swtchDpstChck.setCustomTextOn("YES");
					}else{
						swtchDpstChck.setCustomTextOff("NO");
					}
					swtchDpstChck.setVisible(true);
					that.getView().byId("depositCheckLabel").setVisible(true);
						that.byId("idDevHandover").setVisible(false); 
						that.byId("idSettlement").setVisible(false);
				}
				//------------
			}else{
				depostChkToBar.setVisible(false);
				that.byId("idDevHandover").setVisible(false); 
				that.byId("idSettlement").setVisible(false);
				that.getView().byId("switchDepst").setVisible(false);
				that.getView().byId("depositCheckLabel").setVisible(false);
			}
			if(that.apprvlLevel== "99"){
				that.getView().byId("idAccept").setVisible(true);
				that.byId("btnApprove").setVisible(false);
				that.byId("btnReject").setVisible(false);
				that.getView().byId("idHold").setVisible(false);
				that.byId("idEditButon").setVisible(false);
			}else{
				that.byId("btnApprove").setVisible(true);
				that.byId("btnReject").setVisible(true);
				that.getView().byId("idHold").setVisible(true);
				that.getView().byId("idAccept").setVisible(false);
				that.byId("idEditButon").setVisible(true);
			}
			that.getView().byId("objattrapprvlLevl").setText(that.apprvlLevel);
			that.getView().byId("inptRespons").setText(empRspnsble);
			var fedItem = that.getView().byId("fedList");
			var fedListModel = fedItem.getModel("fedListModel");
			delete fedListModel;
			if(desc !=""){
				fedItem.setVisible(true);
				that.getView().byId("scrlContComment").setVisible(true);
				var fedArr = [];
				var b=desc.split("____________________");
				for(var i=b.length;i>0;i--)
				{ 
					var obj = {
							comment :b[i-1].substring(0,14).trim(),
							Desc : b[i-1].substring(45).trim(),
							time : b[i-1].substring(14,45).trim()
					};
					fedArr.push(obj);
				}
				var ofedModel = new sap.ui.model.json.JSONModel(fedArr);
				fedItem.setModel(ofedModel,"fedListModel");
			}else{
				fedItem.setVisible(false);
				that.getView().byId("scrlContComment").setVisible(false);
				that.byId("fedList").destroyItems();
			}
		},function(oData, oResponse){
			var msg = oData.response.statusText;
			sap.m.MessageBox.alert(msg, {
				icon  : sap.m.MessageBox.Icon.ERROR,                        
				title : "Error",
				actions: [sap.m.MessageBox.Action.OK]
			});
			com.ril.PRMS.BusyD.close();
		});
		that.bindf4();
	},
	onJIOCenterChange : function(oEvent){
		var jioCenterId = this.getView().byId("cmbJiocenter").getSelectedKey();
		if(oEvent){
			this.objSaveData["JioCenterId"]=jioCenterId;
			this.objSaveData["JioCenterId_X"]="X";
		}
		this.onCAFPickup(jioCenterId);
	},
	onCAFPickup : function(jioCenterId){
		if(jioCenterId !=""){
			var oCafId = this.getView().byId("inptCafPckup");
			var cafMod =oCafId.getModel("aliasCAFModel");
			delete cafMod;
			var subpath = "ZCAFPARENT~"+jioCenterId+"";
			var oCAFModel = new sap.ui.model.json.JSONModel();
			oCAFModel.setSizeLimit(2200);
			var path= "/PartnerCenF4Set(IsParamName='"+subpath+"')?$expand=HEADITEMNAV/HEADERITEMNAV";
			this.oDataModel.read(path, null, [], true, function(oData,oResponse){
				oData.HEADITEMNAV.results[0].HEADERITEMNAV.results.unshift({AttrCode:"",AttrValue:""});
				oCAFModel.setData(oData.HEADITEMNAV.results[0].HEADERITEMNAV);
				oCafId.setModel(oCAFModel,"aliasCAFModel");
			});
		}
	},
	onFOSBind : function(servceValue){
		var that = this;
		if(servceValue !="" && servceValue != undefined){
			var subpath = "ZFOSPARENT~"+servceValue+"";
			var oFOSModel = new sap.ui.model.json.JSONModel();
			oFOSModel.setSizeLimit(3000);
			var oFosId = this.getView().byId("inptfosAgnt");
			var path= "/PartnerCenF4Set(IsParamName='"+subpath+"')?$expand=HEADITEMNAV/HEADERITEMNAV";
			this.oDataModel.read(path, null, [], true, function(oData,oResponse){
				oFOSModel.setData(oData.HEADITEMNAV.results[0].HEADERITEMNAV);
				oFosId.setModel(oFOSModel,"aliasFOSModel");

				// Added by LINGA REDDY on Jan 6, 2017 6:39:17 PM
				if(that.FOSKey != "" && that.FOSKey != undefined){
					that.byId("inptfosAgnt").setSelectedKey(that.FOSKey);
				}else{
					that.byId("inptfosAgnt").setSelectedKey("");
				}
				//-------------------------------------------------------
				
			});
			
			/*if(this.FOSKey != "" && this.FOSKey != undefined){
				oView.byId("inptfosAgnt").setSelectedKey(this.FOSKey);
			}*/
		}
	},
	onBindTab:function(oEvent){
		this.Agentflag = 0;
		var that=this;
		//Dealer Chars Data
		that.productKeys=[];
		that.productKeysWithTasks = [];
		that.busGroupKeysWithTasks = [];
		that.businessKeys=[];
		that.conectvityArray =[];
		that.deliveryKeys =[];
		that.deliveryKeysWithTasks=[];
		that.conectvitykeysWithTasks =[];
		var oView = this.getView();
		that.arrBtTyp = [];that.arrDstCmp = [];that.arrinptYrs = [];that.arrinptPrmt =[];
		that.arrinptRoi = [];that.arrCerdtRcvdcmp = [];that.arrBAnnulTrnvr = [];that.arrGrwthPrvsYer = [];
		that.arrcmbOutlt = [];that.arrOutltCnt = [];that.arrPrdTyp =[];that.arrBrndSrvcd=[];that.arrMntlySlesVol=[];that.agentNameModel=[];that.refAgeArr =[];
		that.arrPrdDevTyp =[];that.arrBrndSrvcdDev =[];that.arrMntlySlesDevVol =[];
		var path = "/ProspectDisplaySet(IvTransNo='"+that.transact+"')?&$expand=PDTOAGENTDTLSNAV,PDTODEALERCHARSSNAV,PDTOPARENTIDSNAV,PDTOPROOFDTLSNAV,PDTOADDCHARSNAV,PDTOAGENTDTLSNAV/PDAGENTTOPROOFNAV,PDTOAGENTDTLSNAV/PDAGENTTOADDCHARNAV,PDTODEALERSEGNAV,PDTOBASICBUSGRPNAV,PDTOBASICPRDGRPNAV,PDTOLOCREFNAV,PDTOAGENTDTLSNAV/PDAGENTTOADDRESSNAV,PDTOAGENTDTLSNAV/PDAGENTTOREFERNAV";
		this.oDataModel.read(path, null, [], true, function(oData,oResponse){
			if(oData.ContractStartdate!=""&&oData.ContractStartdate!=undefined){
				oView.byId("datePickrStartContract").setDateValue(oData.ContractStartdate);
				oView.byId("datePickrStartContract")["isData"] = true;
				if(oData.ContractStartdate_X==="X"){oView.byId("datePickrStartContract").setValueState("Warning");}else{oView.byId("datePickrStartContract").setValueState("None");}
			}
			if(oData.ContractEnddate!=""&&oData.ContractEnddate!=undefined){
				oView.byId("datePickrEndContract").setDateValue(oData.ContractEnddate);
				oView.byId("datePickrEndContract")["isData"] = true;
				if(oData.ContractEnddate_X==="X"){oView.byId("datePickrEndContract").setValueState("Warning");}else{oView.byId("datePickrEndContract").setValueState("None");}
			}
			var HqDet = oView.byId("tabLocation").getVisible(); 
			if(HqDet == true){
				//----Hq Tab----------------------
				if(oData.BasicOwnershiptype!=""&&oData.BasicOwnershiptype!=undefined){
					oView.byId("cmbOwnrTypPftb2").setSelectedKey(oData.BasicOwnershiptype);
					oView.byId("cmbOwnrTypPftb2")["isData"] = true;
				}  
				if(oData.LocLocationname2!=""&&oData.LocLocationname2!=undefined){
					oView.byId("compNameLoc").setValue(oData.LocLocationname2);
					oView.byId("compNameLoc")["isData"] = true;
				}
				if(oData.LocLocationname1!=""&&oData.LocLocationname1!=undefined){
					oView.byId("aliasNameLoc").setValue(oData.LocLocationname1);
					oView.byId("aliasNameLoc")["isData"] = true;
				}
				oView.byId("relTypLoc").setSelectedKey(oData.BasicCptype);
				that.onChangeHQRelationType();
				oView.byId("relSubTypLoc").setSelectedKey(oData.BasicCpsubtype);
				oView.byId("dtePickrDateofIncrptionPftb2").setDateValue(oData.BasicDateInc);
				if(oData.Locationname2!=""&&oData.Locationname2!=undefined){
					oView.byId("inptCompNamePftb2").setValue(oData.Locationname2);
					oView.byId("inptCompNamePftb2")["isData"] = true;
					if(oData.Locationname2_X==="X"){oView.byId("inptCompNamePftb2").setValueState("Warning");}else{oView.byId("inptCompNamePftb2").setValueState("None");}
				}
				if(oData.Locationname1!=""&&oData.Locationname1!=undefined){
					oView.byId("inptAliasNamePftb2").setValue(oData.Locationname1);
					oView.byId("inptAliasNamePftb2")["isData"] = true;
					if(oData.Locationname1_X==="X"){oView.byId("inptAliasNamePftb2").setValueState("Warning");}else{oView.byId("inptAliasNamePftb2").setValueState("None");}
				}
				if(oData.Cptype!=""&&oData.Cptype!=undefined){
					oView.byId("cmbRelationTypePftb2").setSelectedKey(oData.Cptype);
					oView.byId("cmbRelationTypePftb2")["isData"] = true;
				}
				that.onChangeRelationType();
				if(oData.Cpsubtype!=""&&oData.Cpsubtype!=undefined){
					oView.byId("cmbRelationSubTypePftb2").setSelectedKey(oData.Cpsubtype);
					oView.byId("cmbRelationSubTypePftb2")["isData"] = true;
				}

				if(oData.Locationtype!=""&&oData.Locationtype!=undefined){
					oView.byId("cmbLocationTypePftb2").setSelectedKey(oData.Locationtype);
					oView.byId("cmbLocationTypePftb2")["isData"] = true;
				}

				if(oData.Locationsubtype!=""&&oData.Locationsubtype!=undefined){
					oView.byId("cmbLocationSubTypePftb2").setSelectedKey(oData.Locationsubtype);
					oView.byId("cmbLocationSubTypePftb2")["isData"] = true;
				}
				if(oData.RelationType01 == "BP"){
					oView.byId("chkBillToPartyPftb2").setSelected(true);
					oView.byId("chkBillToPartyPftb2")["isData"] = true;
				}else{
					oView.byId("chkBillToPartyPftb2").setSelected(false);
				}
				if(oData.RelationType02 == "SH"){
					oView.byId("chkShipToPartyPftb2").setSelected(true);
					oView.byId("chkShipToPartyPftb2")["isData"] = true;
				}else{
					oView.byId("chkShipToPartyPftb2").setSelected(false);
				}
			}else{
				if(oData.Ownershiptype!=""&&oData.Ownershiptype!=undefined){
					oView.byId("cmbOwnrTyp").setSelectedKey(oData.Ownershiptype);
					oView.byId("cmbOwnrTyp")["isData"] = true;
					if(oData.Ownershiptype_X==="X"){oView.byId("cmbOwnrTyp").setValueState("Warning");}else{oView.byId("cmbOwnrTyp").setValueState("None");}
				}
				if(oData.Locationname2!=""&&oData.Locationname2!=undefined){
					oView.byId("inptCompName").setValue(oData.Locationname2);
					oView.byId("inptCompName")["isData"] = true;
					if(oData.Locationname2_X==="X"){oView.byId("inptCompName").setValueState("Warning");}else{oView.byId("inptCompName").setValueState("None");}
				}
				/* changed by linga on Oct 22, 2016 at 2:17:52 PM */
				
				if(oData.Locationname1 == ""){
					oView.byId("inptAliasName").setValue(oData.Locationname2 );
					oView.byId("inptAliasName")["isData"] = true;
					if(oData.Locationname2_X==="X"){oView.byId("inptAliasName").setValueState("Warning");}else{oView.byId("inptAliasName").setValueState("None");}
				}else{
					oView.byId("inptAliasName").setValue(oData.Locationname1 );
					oView.byId("inptAliasName")["isData"] = true;
					if(oData.Locationname1_X==="X"){oView.byId("inptAliasName").setValueState("Warning");}else{oView.byId("inptAliasName").setValueState("None");}
				}
				
				if(oData.Cptype!=""&&oData.Cptype!=undefined){
					oView.byId("cmbRelationType").setSelectedKey(oData.Cptype);
					oView.byId("cmbRelationType")["isData"] = true;
					if(oData.Cptype_X==="X"){oView.byId("cmbRelationType").setValueState("Warning");}else{oView.byId("cmbRelationType").setValueState("None");}
				}
				that.onChangeRelationType();
				if(oData.Cpsubtype!=""&&oData.Cpsubtype!=undefined){
					oView.byId("cmbRelationSubType").setSelectedKey(oData.Cpsubtype);
					oView.byId("cmbRelationSubType")["isData"] = true;
					if(oData.Cpsubtype_X==="X"){oView.byId("cmbRelationSubType").setValueState("Warning");}else{oView.byId("cmbRelationSubType").setValueState("None");}
				}
				if(oData.Locationtype!=""&&oData.Locationtype!=undefined){
					oView.byId("cmbLocationType").setSelectedKey(oData.Locationtype);
					oView.byId("cmbLocationType")["isData"] = true;
					if(oData.Locationtype_X==="X"){oView.byId("cmbLocationType").setValueState("Warning");}else{oView.byId("cmbLocationType").setValueState("None");}
				}
				if(oData.Locationsubtype!=""&&oData.Locationsubtype!=undefined){
					oView.byId("cmbLocationSubType").setSelectedKey(oData.Locationsubtype);
					oView.byId("cmbLocationSubType")["isData"] = true;
					if(oData.Locationsubtype_X==="X"){oView.byId("cmbLocationSubType").setValueState("Warning");}else{oView.byId("cmbLocationSubType").setValueState("None");}
				}
				if(oData.DateInc!=""&&oData.DateInc!=undefined){
					oView.byId("dtePickrDateofIncrption").setDateValue(oData.DateInc);
					oView.byId("dtePickrDateofIncrption")["isData"] = true;
					if(oData.DateInc_X==="X"){oView.byId("dtePickrDateofIncrption").setValueState("Warning");}else{oView.byId("dtePickrDateofIncrption").setValueState("None");}
				}
				if(oData.Segment!=""&&oData.Segment!=undefined){
					oView.byId("cmbSegment").setSelectedKey(oData.Segment);
					oView.byId("cmbSegment")["isData"] = true;
					if(oData.Segment_X==="X"){oView.byId("cmbSegment").setValueState("Warning");}else{oView.byId("cmbSegment").setValueState("None");}
				}
				if(oData.Website!=""&&oData.Website!=undefined){
					oView.byId("inptCompWebsite").setValue(oData.Website);
					oView.byId("inptCompWebsite")["isData"] = true;
					if(oData.Website_X==="X"){oView.byId("inptCompWebsite").setValueState("Warning");}else{oView.byId("inptCompWebsite").setValueState("None");}
				}

			}
			//Parent Type
			var postalCode=oData.PostlCod1;
			if(postalCode!=""&&postalCode!=undefined){
				oView.byId("inptPostalCde")["isData"] = true;
			}
			oView.byId("inptPostalCde").setValue(postalCode);
			if(oData.PostlCod1_X==="X"){oView.byId("inptPostalCde").setValueState("Warning");}else{oView.byId("inptPostalCde").setValueState("None");}
			if(postalCode == ""){
				oView.byId("cmbCity").setValue("");
				oView.byId("cmbCity").setEnabled(false);
				oView.byId("inptAreaLoc").setValue("");
				oView.byId("cmbDistrct").setValue("");
			}else{
				that.onChangePin();
				that._onAddState();
			}
			var ParentData=oData.PDTOPARENTIDSNAV;
			var parentResults=ParentData.results;
			for(var p=0;p<parentResults.length;p++){
				var parentType=parentResults[p].ZzparentType;
				var parentId=parentResults[p].ZzparentId;
				if(parentType=="CA"){
					oView.byId("inptCafPckup").setSelectedKey(parentId);
					oView.byId("inptCafPckup")["isData"] = true;
					oView.byId("inptCafPckup").setValueState(com.ril.PRMS.util.Formatter.setColor(parentResults[p].ZzparentId_X,parentResults[p].ZzTask));
				}else if(parentType=="BB"){
					oView.byId("inptParentPrtnrDvc").setValue(parentId);
					oView.byId("inptParentPrtnrDvc")["isData"] = true;
					oView.byId("inptParentPrtnrDvc").setValueState(com.ril.PRMS.util.Formatter.setColor(parentResults[p].ZzparentId_X,parentResults[p].ZzTask));
				}else if(parentType=="01"){
					this.serviceKey = parentId;
					oView.byId("inptParentPrtnrSrvc").setValue(parentId);
					oView.byId("inptParentPrtnrDvc")["isData"] = true;
					oView.byId("inptParentPrtnrSrvc").setValueState(com.ril.PRMS.util.Formatter.setColor(parentResults[p].ZzparentId_X,parentResults[p].ZzTask));
					that.onFOSBind(parentId);
				}else if(parentType=="FS"){
					if(this.serviceKey != "" && this.serviceKey != undefined){
						oView.byId("inptfosAgnt").setSelectedKey(parentId);
					}else{
						this.FOSKey = parentId;
					}
					
					oView.byId("inptfosAgnt")["isData"] = true;
					oView.byId("inptfosAgnt").setValueState(com.ril.PRMS.util.Formatter.setColor(parentResults[p].ZzparentId_X,parentResults[p].ZzTask));
				}
			}
			//Company contact details
			var mobAddressTab=oData.MobileNo;
			var indexOfMobAddress=mobAddressTab.indexOf("+91");
			var indexOfMobAddress2=mobAddressTab.indexOf("091");
			var indexOfMobAddress3=mobAddressTab.indexOf("0");

			if(indexOfMobAddress==-1 && indexOfMobAddress2==0){
				oView.byId("inpComptMobleNo")["isData"] = true;
				oView.byId("inpComptMobleNo").setValue(mobAddressTab.substring(3,mobAddressTab.length));
			}
			else if (indexOfMobAddress==0 && indexOfMobAddress2==-1 )  {
				oView.byId("inpComptMobleNo")["isData"] = true;
				oView.byId("inpComptMobleNo").setValue(mobAddressTab.substring(3,mobAddressTab.length));
			}  
			else if (indexOfMobAddress3==0){
				oView.byId("inpComptMobleNo")["isData"] = true;
				oView.byId("inpComptMobleNo").setValue(mobAddressTab.substring(1,mobAddressTab.length));
			}
			else{
				oView.byId("inpComptMobleNo").setValue(mobAddressTab);
				oView.byId("inpComptMobleNo")["isData"] = true;
			}
			oView.byId("inpComptMobleNo").setValueState(com.ril.PRMS.util.Formatter.setHeaderColor(oData.MobileNo_X));

			//added by linga on 141016
			var stdCode;
            if(oData.AlternateTelno.indexOf("+91")=="0"){
                  stdCode=oData.AlternateTelno.substring(3,oData.AlternateTelno.length);
                  }
            else{
                  stdCode=oData.AlternateTelno;
            }
            oView.byId("inpSTDCode").setValue(stdCode.split("-")[0]);
            oView.byId("inpFaxedLneNo").setValue(stdCode.split("-")[1]);
            oView.byId("inpSTDCode").setValueState(com.ril.PRMS.util.Formatter.setHeaderColor(oData.AlternateTelno_X));
            oView.byId("inpFaxedLneNo").setValueState(com.ril.PRMS.util.Formatter.setHeaderColor(oData.AlternateTelno_X));

			
			/*oView.byId("inpSTDCode").setValue((oData.AlternateTelno).split("-")[0]);
			oView.byId("inpFaxedLneNo").setValue((oData.AlternateTelno).split("-")[1]);
			oView.byId("inpSTDCode").setValueState(com.ril.PRMS.util.Formatter.setHeaderColor(oData.AlternateTelno_X));
			oView.byId("inpFaxedLneNo").setValueState(com.ril.PRMS.util.Formatter.setHeaderColor(oData.AlternateTelno_X));*/
			//----------------------
			oView.byId("inptCompEmail").setValue(oData.Email);
			oView.byId("inptCompEmail").setValueState(com.ril.PRMS.util.Formatter.setHeaderColor(oData.Email_X));

			//Sales Hierarchy
			if(oData.R4gstateId!=""&&oData.R4gstateId!=undefined){
				oView.byId("cmbR4GState").setSelectedKey(oData.R4gstateId);
				oView.byId("cmbR4GState")["isData"] = true;
				if(oData.R4gstateId_X==="X"){oView.byId("cmbR4GState").setValueState("Warning");}else{oView.byId("cmbR4GState").setValueState("None");}
			}
			that.onR4gStateChange();
			if(oData.DeliveringSiteDc!=""&&oData.DeliveringSiteDc!=undefined){
				oView.byId("cmbDelvryCntr").setSelectedKey(oData.DeliveringSiteDc);
				oView.byId("cmbDelvryCntr")["isData"] = true;
				if(oData.DeliveringSiteDc_X==="X"){oView.byId("cmbDelvryCntr").setValueState("Warning");}else{oView.byId("cmbDelvryCntr").setValueState("None");} 
			}
			if(oData.CircleId!=""&&oData.CircleId!=undefined){
				oView.byId("cmbCircle").setSelectedKey(oData.CircleId);
				oView.byId("cmbCircle")["isData"] = true;
				if(oData.CircleId_X==="X"){oView.byId("cmbCircle").setValueState("Warning");}else{oView.byId("cmbCircle").setValueState("None");}
			}
			if(oData.R4gareaId!=""&&oData.R4gareaId!=undefined){
				oView.byId("cmbR4GArea").setSelectedKey(oData.R4gareaId);
				oView.byId("cmbR4GArea")["isData"] = true;
				if(oData.R4gareaId_X==="X"){oView.byId("cmbR4GArea").setValueState("Warning");}else{oView.byId("cmbR4GArea").setValueState("None");}
			}
			that.onR4GAreaChange();
			if(oData.JioCenterId!=""&&oData.JioCenterId!=undefined){
				oView.byId("cmbJiocenter").setSelectedKey(oData.JioCenterId);
				oView.byId("cmbJiocenter")["isData"] = true;
				if(oData.JioCenterId_X==="X"){oView.byId("cmbJiocenter").setValueState("Warning");}else{oView.byId("cmbJiocenter").setValueState("None");}
				that.onJIOCenterChange();
			}
			that.onCAFPickup(oData.JioCenterId); 
			//Address
			if(oData.COName!=""&&oData.COName!=undefined){
				oView.byId("inptcoName").setValue(oData.COName);
				oView.byId("inptcoName")["isData"] = true;
				if(oData.COName_X==="X"){oView.byId("inptcoName").setValueState("Warning");}else{oView.byId("inptcoName").setValueState("None");}
			}

			oView.byId("inptHouseno").setValue(oData.HouseNo);
			if(oData.HouseNo_X==="X"){oView.byId("inptHouseno").setValueState("Warning");}else{oView.byId("inptHouseno").setValueState("None");}
			oView.byId("inptBuldngno").setValue(oData.StrSuppl1);
			oView.byId("inptSocnname").setValue(oData.SocietyName);
			oView.byId("inptStreet").setValue(oData.Street);
			if(oData.Street_X==="X"){oView.byId("inptStreet").setValueState("Warning");}else{oView.byId("inptStreet").setValueState("None");}

			oView.byId("inptSubLclty").setValue(oData.StrSuppl3);
			if(oData.StrSuppl3_X==="X"){oView.byId("inptSubLclty").setValueState("Warning");}else{oView.byId("inptSubLclty").setValueState("None");}
			oView.byId("inptlandmark").setValue(oData.StrSuppl2);
			if(oData.StrSuppl2_X==="X"){oView.byId("inptlandmark").setValueState("Warning");}else{oView.byId("inptlandmark").setValueState("None");}
			oView.byId("cmbCity").setValue(oData.City);
			if(oData.City_X==="X"){oView.byId("cmbCity").setValueState("Warning");}else{oView.byId("cmbCity").setValueState("None");}
			that.onCityChange();
			oView.byId("inptAreaLoc").setValue(oData.Location);
			if(oData.Location_X==="X"){oView.byId("inptAreaLoc").setValueState("Warning");}else{oView.byId("inptAreaLoc").setValueState("None");}
			oView.byId("inptAddrCityId").setValue(oData.CityId);
			if(oData.CityId_X==="X"){oView.byId("inptAddrCityId").setValueState("Warning");}else{oView.byId("inptAddrCityId").setValueState("None");}
			oView.byId("cmbDistrct").setValue(oData.District);
			if(oData.District_X==="X"){oView.byId("cmbDistrct").setValueState("Warning");}else{oView.byId("cmbDistrct").setValueState("None");}
			oView.byId("cmbState").setSelectedKey(oData.Region);
			if(oData.Region_X==="X"){oView.byId("cmbState").setValueState("Warning");}else{oView.byId("cmbState").setValueState("None");}
			oView.byId("cmbCountry").setSelectedKey(oData.Country);
			if(oData.Country_X==="X"){oView.byId("cmbCountry").setValueState("Warning");}else{oView.byId("cmbCountry").setValueState("None");}

			//Geography
			oView.byId("inptLatitude").setValue(oData.Latitude);
			oView.byId("inptLongitude").setValue(oData.Longitude);
			var oWeekModel=new sap.ui.model.json.JSONModel(com.ril.PRMS.util.Formatter.getWeekList());
			that.getView().setModel(oWeekModel,"weekModel");
			oView.byId("cmbStrtWkngDay").setSelectedKey(oData.StartDay);
			if(oData.StartDay_X==="X"){oView.byId("cmbStrtWkngDay").setValueState("Warning");}else{oView.byId("cmbStrtWkngDay").setValueState("None");}
			var starttime=oData.StartTime.ms;
			oView.byId("dpStratTime").setValue(com.ril.PRMS.util.Formatter.millsectoSec(starttime));
			if(oData.StartTime_X==="X"){oView.byId("dpStratTime").setValueState("Warning");}else{oView.byId("dpStratTime").setValueState("None");}
			oView.byId("cmbEndWkngDay").setSelectedKey(oData.EndDay);
			if(oData.EndDay_X==="X"){oView.byId("cmbEndWkngDay").setValueState("Warning");}else{oView.byId("cmbEndWkngDay").setValueState("None");}
			var endTime=oData.EndTime.ms;
			oView.byId("dpEndTime").setValue(com.ril.PRMS.util.Formatter.millsectoSec(endTime));
			if(oData.EndTime_X==="X"){oView.byId("dpEndTime").setValueState("Warning");}else{oView.byId("dpEndTime").setValueState("None");}

			var oLocRefModel = new sap.ui.model.json.JSONModel(oData.PDTOLOCREFNAV.results[0]);
			oView.setModel(oLocRefModel,"LocModel");
			if(oData.PDTOLOCREFNAV.results.length!=0){
				if(oData.PDTOLOCREFNAV.results[0].Zzpin == "" ){
					oView.byId("cmbLocCity").setValue("");
					oView.byId("cmbLocCity").setEnabled(false);
					oView.byId("inpLocRefAL").setValue("");
					oView.byId("cmbDistrict").setValue("");
				}
				that._onRefDealerState();
			}

			// Infrastructure
			//Security Deposit

			//Dealer Segment
			var dlrSgmnt=oData.PDTODEALERSEGNAV;
			dlrSgmnt=dlrSgmnt.results;
			for(var ds=0;ds<dlrSgmnt.length;ds++){
				var sgmntName=dlrSgmnt[ds].ZzsegmentName;
				var sgmntValue=dlrSgmnt[ds].ZzsegmentValue;
				var ZTask = dlrSgmnt[ds].ZzTASK;
				switch(sgmntName){
				case "ZDBT":
					if(HqDet == true){
						that.getView().byId("cmbSegmentValuePftb2").setSelectedKey(sgmntValue); 
						that.getView().byId("cmbSegmentValuePftb2")["isData"] = true;
						//added by linga on 011016 .
							switch(ZTask){
							case "I" :oView.byId("cmbSegmentValuePftb2").setValueState("Success");break;
							case "D" :oView.byId("cmbSegmentValuePftb2").setValueState("Error");break;
							case "U" :if(dlrSgmnt[ds].ZzsegmentName_X =="X"){oView.byId("cmbSegmentValuePftb2").setValueState("Warning");}break;
							default: oView.byId("cmbSegmentValuePftb2").setValueState("None");break;
						}
					}else{
						that.getView().byId("cmbSegmenttype").setSelectedKey(sgmntValue);   
						that.getView().byId("cmbSegmenttype")["isData"]=true;
							switch(ZTask){
							case "I" :oView.byId("cmbSegmenttype").setValueState("Success");break;
							case "D" :oView.byId("cmbSegmenttype").setValueState("Error");break;
							case "U" :if(dlrSgmnt[ds].ZzsegmentName_X =="X"){oView.byId("cmbSegmenttype").setValueState("Warning");}break;
							default: oView.byId("cmbSegmenttype").setValueState("None");break;
						}
					}
					break;
				case "ZDSG":
					if(HqDet == true){
						that.getView().byId("cmbSegmentTypePftb2").setSelectedKey(sgmntValue); 
						that.getView().byId("cmbSegmentTypePftb2")["isData"]=true;
							switch(ZTask){
							case "I" :oView.byId("cmbSegmentTypePftb2").setValueState("Success");break;
							case "D" :oView.byId("cmbSegmentTypePftb2").setValueState("Error");break;
							case "U" :if(dlrSgmnt[ds].ZzsegmentName_X =="X"){oView.byId("cmbSegmentTypePftb2").setValueState("Warning");}break;
							default: oView.byId("cmbSegmentTypePftb2").setValueState("None");break;
						}
					}else{
						that.getView().byId("cmbSegmentValue").setSelectedKey(sgmntValue); 
						that.getView().byId("cmbSegmentValue")["isData"]=true;
							switch(ZTask){
							case "I" :oView.byId("cmbSegmentValue").setValueState("Success");break;
							case "D" :oView.byId("cmbSegmentValue").setValueState("Error");break;
							case "U" :if(dlrSgmnt[ds].ZzsegmentName_X =="X"){oView.byId("cmbSegmentValue").setValueState("Warning");}break;
							default: oView.byId("cmbSegmentValue").setValueState("None");break;
						}
					}
					break;
				}
			}
			if(oData.ContSecurityDeposit!=""&&oData.ContSecurityDeposit!=undefined){
				oView.byId("inptSecrtyAmnt").setValue(oData.ContSecurityDeposit);
				oView.byId("inptSecrtyAmnt")["isData"]=true;
				oView.byId("inptSecrtyAmnt").setValueState(com.ril.PRMS.util.Formatter.setHeaderColor(oData.ContSecurityDeposit_X)); 
			}
			var dealerCharData=oData.PDTODEALERCHARSSNAV;
			var dealerDataResults=dealerCharData.results;
			for(var d=0;d<dealerDataResults.length;d++){
				var zName=dealerDataResults[d].Zzname;
				var zValue=dealerDataResults[d].Zzvalue;
				var ZTask=dealerDataResults[d].ZzTask;
				switch(zName){
				//added by linga on 081016 -----------------
				//copy
				case "ZCPCHAR-ZLOBUSDESC":  
					this.lobidkey = zValue;
					oView.byId("cmbLnsBusnssId").setSelectedKey(zValue);
					oView.byId("cmbLnsBusnssId")["isData"]=true;
						switch(ZTask){
						case "I" :oView.byId("cmbLnsBusnssId").setValueState("Success");break;
						case "D" :oView.byId("cmbLnsBusnssId").setValueState("Error");break;
						case "U" :
							if(dealerDataResults[d].Zzvalue_X =="X"){
							oView.byId("cmbLnsBusnssId").setValueState("Warning");
							}
							break;
							default: oView.byId("cmbLnsBusnssId").setValueState("None");break;
						
						}
					if(this.lobdesc!=undefined){
						for(var z=0;z<that.LOB_SUBCATEGORY.length;z++){
							if(that.LOB_SUBCATEGORY[z].HigerLevelAttr == this.lobidkey){
								that.onComboBind("cmbLnsBusnssDesc",that.LOB_SUBCATEGORY[z]);
								oView.byId("cmbLnsBusnssDesc")["isData"]=true;
								oView.byId("cmbLnsBusnssDesc").setSelectedKey(this.lobdesc);
							}
						}
					}
					break;
				case "ZCPCHAR-ZLOBUSID":
					var key = this.lobidkey;
					if(key == undefined){
						this.lobdesc = zValue;
						oView.byId("cmbLnsBusnssDesc")["isData"]=true;
					}else{
						//var key =  oView.byId("cmbLnsBusnssId").getSelectedKey();
						for(var z=0;z<that.LOB_SUBCATEGORY.length;z++){
							if(that.LOB_SUBCATEGORY[z].HigerLevelAttr == key){
								that.onComboBind("cmbLnsBusnssDesc",that.LOB_SUBCATEGORY[z]);
								oView.byId("cmbLnsBusnssDesc")["isData"]=true;
								oView.byId("cmbLnsBusnssDesc").setSelectedKey(zValue);
							}
						}
					}
					switch(ZTask){
					case "I" :oView.byId("cmbLnsBusnssDesc").setValueState("Success");break;
					case "D" :oView.byId("cmbLnsBusnssDesc").setValueState("Error");break;
					case "U" :
						if(dealerDataResults[d].Zzvalue_X =="X"){
						oView.byId("cmbLnsBusnssDesc").setValueState("Warning");
						}
						break;
						default: oView.byId("cmbLnsBusnssDesc").setValueState("None");break;
					}
					
					break;

				case "ZCPCHAR-ZOCTYPE":
					oView.byId("cmbOccpnyTyp").setSelectedKey(zValue);
					oView.byId("cmbOccpnyTyp")["isData"]=true;
						switch(ZTask){
						case "I" :oView.byId("cmbOccpnyTyp").setValueState("Success");break;
						case "D" :oView.byId("cmbOccpnyTyp").setValueState("Error");break;
						case "U" :if(dealerDataResults[d].Zzvalue_X =="X"){
							oView.byId("cmbOccpnyTyp").setValueState("Warning");
							}
						break;
						default: oView.byId("cmbOccpnyTyp").setValueState("None");break;
						}
					break;
				case "ZCPCHAR-ZSPACE":
					oView.byId("cmbOffcSpce").setSelectedKey(zValue);
					oView.byId("cmbOffcSpce")["isData"]=true;
						switch(ZTask){
						case "I" :oView.byId("cmbOffcSpce").setValueState("Success");break;
						case "D" :oView.byId("cmbOffcSpce").setValueState("Error");break;
						case "U" :
							if(dealerDataResults[d].Zzvalue_X =="X"){
								oView.byId("cmbOffcSpce").setValueState("Warning");break;
							}
								break;
						default: oView.byId("cmbOffcSpce").setValueState("None");break;
						}
					break;
				case "PRODGROUP":
					var zValue=dealerDataResults[d].Zzvalue;
					that.productKeysWithTasks.push(dealerDataResults[d]);
					that.productKeys.push(zValue);
					break;
				case "BUSGROUP":
					var zValue=dealerDataResults[d].Zzvalue;
					that.busGroupKeysWithTasks.push(dealerDataResults[d]);
				//	var zTask = dealerDataResults[d].ZzTask;
				//	var fValue = zValue+"-"+zTask;
					that.businessKeys.push(zValue);
					break;
				case "ZCPSALES-ZYEAR1":
					var zValue=dealerDataResults[d].Zzvalue;
					oView.byId("inpSYear").setValue(zValue);
					oView.byId("inpSYear")["isData"]=true;
				
						switch(ZTask){
						case "I" :oView.byId("inpSYear").setValueState("Success");break;
						case "D" :oView.byId("inpSYear").setValueState("Error");break;
						case "U" :
							if(dealerDataResults[d].Zzvalue_X =="X"){oView.byId("inpSYear").setValueState("Warning");}break;
						default: oView.byId("inpSYear").setValueState("None");break;
						
					}
					break;
				case "ZCPSALES-ZYEAR1TURNOVER":
					var zValue=dealerDataResults[d].Zzvalue;
					oView.byId("inptAnnulTrnovr").setValue(zValue);
					oView.byId("inptAnnulTrnovr")["isData"]=true;
					
						switch(ZTask){
						case "I" :oView.byId("inptAnnulTrnovr").setValueState("Success");break;
						case "D" :oView.byId("inptAnnulTrnovr").setValueState("Error");break;
						case "U" :
							if(dealerDataResults[d].Zzvalue_X =="X"){
							oView.byId("inptAnnulTrnovr").setValueState("Warning");}
							break;
						default: oView.byId("inptAnnulTrnovr").setValueState("None");break;
						}
					break;
				case "ZCPSALES-ZYEAR1PROFIT":
					var zValue=dealerDataResults[d].Zzvalue;
					oView.byId("inputAnulPrft").setValue(zValue);
					oView.byId("inputAnulPrft")["isData"]=true;
					
						switch(ZTask){
						case "I" :oView.byId("inputAnulPrft").setValueState("Success");break;
						case "D" :oView.byId("inputAnulPrft").setValueState("Error");break;
						case "U" : if(dealerDataResults[d].Zzvalue_X =="X"){
							oView.byId("inputAnulPrft").setValueState("Warning");}
						break;
						default: oView.byId("inputAnulPrft").setValueState("None");break;
						}
					break;
				case "ZCPSALES-ZYEAR2PROFIT":
					var zValue=dealerDataResults[d].Zzvalue;
					oView.byId("inputAnulPrft2").setValue(zValue);
					oView.byId("inputAnulPrft2")["isData"]=true;
					
						switch(ZTask){
						case "I" :oView.byId("inputAnulPrft2").setValueState("Success");break;
						case "D" :oView.byId("inputAnulPrft2").setValueState("Error");break;
						case "U" :if(dealerDataResults[d].Zzvalue_X =="X"){oView.byId("inputAnulPrft2").setValueState("Warning");}
						break;
						default: oView.byId("inputAnulPrft2").setValueState("None");break;
						}
					break;
				case "ZCPSALES-ZYEAR2TURNOVER":
					var zValue=dealerDataResults[d].Zzvalue;
					oView.byId("inptAnnulTrnovr2").setValue(zValue);
					oView.byId("inptAnnulTrnovr2")["isData"]=true;
					
						switch(ZTask){
						case "I" :oView.byId("inptAnnulTrnovr2").setValueState("Success");break;
						case "D" :oView.byId("inptAnnulTrnovr2").setValueState("Error");break;
						case "U" :if(dealerDataResults[d].Zzvalue_X =="X"){oView.byId("inptAnnulTrnovr2").setValueState("Warning");}break;
						default: oView.byId("inptAnnulTrnovr2").setValueState("None");break;
						}
					break;
				case "ZCPSALES-ZYEAR2":
					var zValue=dealerDataResults[d].Zzvalue;
					oView.byId("inptYear2").setValue(zValue);
					oView.byId("inptYear2")["isData"]=true;
						switch(ZTask){
						case "I" :oView.byId("inptYear2").setValueState("Success");break;
						case "D" :oView.byId("inptYear2").setValueState("Error");break;
						case "U" :
							if(dealerDataResults[d].Zzvalue_X =="X"){
							oView.byId("inptYear2").setValueState("Warning");}
							break;
						default: oView.byId("inptYear2").setValueState("None");break;
						
					}
					break;
				case "ZCPCHAR-ZCOMMISSIONMED":
					var zValue=dealerDataResults[d].Zzvalue;
					oView.byId("cmbJioMnyCmson").setSelectedKey(zValue);
					oView.byId("cmbJioMnyCmson")["isData"]=true;
						switch(ZTask){
						case "I" :oView.byId("cmbJioMnyCmson").setValueState("Success");break;
						case "D" :oView.byId("cmbJioMnyCmson").setValueState("Error");break;
						case "U" :
							if(dealerDataResults[d].Zzvalue_X =="X"){
							oView.byId("cmbJioMnyCmson").setValueState("Warning");}
							break;
						default: oView.byId("cmbJioMnyCmson").setValueState("None");break;
						}
					break;
				case "ZCPCHAR-ZSETTLEFRQ":
					var zValue=dealerDataResults[d].Zzvalue;
					oView.byId("cmbJioMnystlmntFreq").setSelectedKey(zValue);
					oView.byId("cmbJioMnystlmntFreq")["isData"]=true;
						switch(ZTask){
						case "I" :oView.byId("cmbJioMnystlmntFreq").setValueState("Success");break;
						case "D" :oView.byId("cmbJioMnystlmntFreq").setValueState("Error");break;
						case "U" :
							if(dealerDataResults[d].Zzvalue_X =="X"){
							oView.byId("cmbJioMnystlmntFreq").setValueState("Warning");}
							break;
						default: oView.byId("cmbJioMnystlmntFreq").setValueState("None");break;
						}
					
					break;
				case "ZCPCHAR-ZTIPENABLED":
					var zValue=dealerDataResults[d].Zzvalue;
					oView.byId("cmbEnbleTIP").setSelectedKey(zValue);
					oView.byId("cmbEnbleTIP")["isData"]=true;
						switch(ZTask){
						case "I" :oView.byId("cmbEnbleTIP").setValueState("Success");break;
						case "D" :oView.byId("cmbEnbleTIP").setValueState("Error");break;
						case "U" :
							if(dealerDataResults[d].Zzvalue_X =="X"){
							oView.byId("cmbEnbleTIP").setValueState("Warning");}break;
						default: oView.byId("cmbEnbleTIP").setValueState("None");break;
						}
					break;
				case "ZCPCHAR-ZBUSCHANNEL":
					var zValue=dealerDataResults[d].Zzvalue;
					oView.byId("cmbBusnsChnl").setSelectedKey(zValue);
					oView.byId("cmbBusnsChnl")["isData"]=true;
						switch(ZTask){
						case "I" :oView.byId("cmbBusnsChnl").setValueState("Success");break;
						case "D" :oView.byId("cmbBusnsChnl").setValueState("Error");break;
						case "U" :
							if(dealerDataResults[d].Zzvalue_X =="X"){
							oView.byId("cmbBusnsChnl").setValueState("Warning");}
							break;
						default: oView.byId("cmbBusnsChnl").setValueState("None");break;
						}
					break;
				case "ZCPCHAR-ZJMMOBILE":
					//oView.byId("inptJioMnyCmsonMbleNmbr").setValue(zValue);
					var zValue=dealerDataResults[d].Zzvalue;
					var ZTask=dealerDataResults[d].ZzTask;
					var mobcheck=zValue;
					var indexOfMob=mobcheck.indexOf("+91");
					var indexOfMob2=mobcheck.indexOf("091");
					var indexOfMob3=mobcheck.indexOf("0");
					
					switch(ZTask){
					case "I" :oView.byId("inptJioMnyCmsonMbleNmbr").setValueState("Success");break;
					case "D" :oView.byId("inptJioMnyCmsonMbleNmbr").setValueState("Error");break;
					case "U" :
						if(dealerDataResults[d].Zzvalue_X =="X"){
							oView.byId("inptJioMnyCmsonMbleNmbr").setValueState("Warning");
							}
						break;
					default:oView.byId("inptJioMnyCmsonMbleNmbr").setValueState("None");break;
					}
					
					if(indexOfMob==-1 && indexOfMob2==0){
						oView.byId("inptJioMnyCmsonMbleNmbr").setValue(mobcheck.substring(3,mobcheck.length));
						oView.byId("inptJioMnyCmsonMbleNmbr")["isData"]=true;
					}

					else if(indexOfMob==0 && indexOfMob2==-1){
						oView.byId("inptJioMnyCmsonMbleNmbr").setValue(mobcheck.substring(3,mobcheck.length));
						oView.byId("inptJioMnyCmsonMbleNmbr")["isData"]=true;
					}
					else if(indexOfMob3==0){
						oView.byId("inptJioMnyCmsonMbleNmbr").setValue(mobcheck.substring(1,mobcheck.length));
						oView.byId("inptJioMnyCmsonMbleNmbr")["isData"]=true;
					}

					else{
						oView.byId("inptJioMnyCmsonMbleNmbr").setValue(mobcheck);
						oView.byId("inptJioMnyCmsonMbleNmbr")["isData"]=true;
					}
					break;
				case "ZCPCHAR-ZDLYTRANSCOUNT":
					var zValue=dealerDataResults[d].Zzvalue;
					oView.byId("cmbDlyTrncCnt").setSelectedKey(zValue);
					oView.byId("cmbDlyTrncCnt")["isData"]=true;
						switch(ZTask){
						case "I" :oView.byId("cmbDlyTrncCnt").setValueState("Success");break;
						case "D" :oView.byId("cmbDlyTrncCnt").setValueState("Error");break;
						case "U" :	if(dealerDataResults[d].Zzvalue_X =="X"){oView.byId("cmbDlyTrncCnt").setValueState("Warning");}
						break;
						default: oView.byId("cmbDlyTrncCnt").setValueState("None");break;
						}
					break;
				case "ZCPCHAR-ZDLYREVENUE":
					var zValue=dealerDataResults[d].Zzvalue;
					oView.byId("cmbDlyRvnuINR").setSelectedKey(zValue);
					oView.byId("cmbDlyRvnuINR")["isData"]=true;
						switch(ZTask){
						case "I" :oView.byId("cmbDlyRvnuINR").setValueState("Success");break;
						case "D" :oView.byId("cmbDlyRvnuINR").setValueState("Error");break;
						case "U" :if(dealerDataResults[d].Zzvalue_X =="X"){oView.byId("cmbDlyRvnuINR").setValueState("Warning");}
						break;
						default: oView.byId("cmbDlyRvnuINR").setValueState("None");break;
						}
					break;

				case "ZCPCHAR-ZPAYTYPE":
					var zValue=dealerDataResults[d].Zzvalue;
					oView.byId("cmbPymntAccptTyp").setSelectedKey(zValue);
					oView.byId("cmbPymntAccptTyp")["isData"]=true;
					
						switch(ZTask){
						case "I" :oView.byId("cmbPymntAccptTyp").setValueState("Success");break;
						case "D" :oView.byId("cmbPymntAccptTyp").setValueState("Error");break;
						case "U" :if(dealerDataResults[d].Zzvalue_X =="X"){oView.byId("cmbPymntAccptTyp").setValueState("Warning");}break;
						default: oView.byId("cmbPymntAccptTyp").setValueState("None");break;
						}
					break;
				case "ZCPCHAR-ZRETPOL":
					var zValue=dealerDataResults[d].Zzvalue;
					oView.byId("cmbRtrnPolcy").setSelectedKey(zValue);
					oView.byId("cmbRtrnPolcy")["isData"]=true;
						switch(ZTask){
						case "I" :oView.byId("cmbRtrnPolcy").setValueState("Success");break;
						case "D" :oView.byId("cmbRtrnPolcy").setValueState("Error");break;
						case "U" :if(dealerDataResults[d].Zzvalue_X =="X"){oView.byId("cmbRtrnPolcy").setValueState("Warning");}break;
						default: oView.byId("cmbRtrnPolcy").setValueState("None");break;
						}
					break;
				case "ZCPCHAR-ZSETTLEDET":
					var zValue=dealerDataResults[d].Zzvalue;
					oView.byId("cmbStleDtls").setSelectedKey(zValue);
					oView.byId("cmbStleDtls")["isData"]=true;
						switch(ZTask){
						case "I" :oView.byId("cmbStleDtls").setValueState("Success");break;
						case "D" :oView.byId("cmbStleDtls").setValueState("Error");break;
						case "U" :if(dealerDataResults[d].Zzvalue_X =="X"){oView.byId("cmbStleDtls").setValueState("Warning");}break;
						default: oView.byId("cmbStleDtls").setValueState("None");break;
						}
					break;
				case "ZCPCHAR-ZYRSOFBUSINESS":
					var zValue=dealerDataResults[d].Zzvalue;
					oView.byId("cmbYrsBusns").setSelectedKey(zValue);
					oView.byId("cmbYrsBusns")["isData"]=true;
						switch(ZTask){
						case "I" :oView.byId("cmbYrsBusns").setValueState("Success");break;
						case "D" :oView.byId("cmbYrsBusns").setValueState("Error");break;
						case "U" :if(dealerDataResults[d].Zzvalue_X =="X"){oView.byId("cmbYrsBusns").setValueState("Warning");}break;
						default: oView.byId("cmbYrsBusns").setValueState("None");break;
						}
					break;
				}
			}
			if(HqDet == true){
				var oProdGrpMod = new sap.ui.model.json.JSONModel(oData.PDTOBASICPRDGRPNAV.results);
				oView.setModel(oProdGrpMod,"oPgrpMod");
				var oAssGrpMod = new sap.ui.model.json.JSONModel(oData.PDTOBASICBUSGRPNAV.results);
				oView.setModel(oAssGrpMod,"oAgrpMod");
			}else{
				//added by linga on 10.11.16
				
				that.TableSelectedItems("tabidProgroup",that.productKeysWithTasks,"jsonData","Zzvalue");
				that.TableSelectedItems("TabidAssbgroup",that.busGroupKeysWithTasks,"jsonAssbgroup","Zzvalue");}

			//Addtional chars
			var addtnlCharData=oData.PDTOADDCHARSNAV;
			var addtnlDataResults=addtnlCharData.results;
			for(var a=0;a<addtnlDataResults.length;a++){
				var subCharName=addtnlDataResults[a].ZzSubCharName;
				var ZTask=addtnlDataResults[a].ZzTask;

				switch(subCharName){
				case "ZSINST":
					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					oView.byId("inptScurtyInstrmntDtls").setValue(subCharValue);
					oView.byId("inptScurtyInstrmntDtls")["isData"]=true;
						switch(ZTask){
						case "I" :oView.byId("inptScurtyInstrmntDtls").setValueState("Success");break;
						case "D" :oView.byId("inptScurtyInstrmntDtls").setValueState("Error");break;
						case "U" :if(addtnlDataResults[a].ZsubcharValue_X=="X"){oView.byId("inptScurtyInstrmntDtls").setValueState("Warning");}break;
						default: oView.byId("inptScurtyInstrmntDtls").setValueState("None");break;
						}
					break;
				case "ZLINS":
					if(HqDet == true){
						var subCharValue=addtnlDataResults[a].ZzSubCharValue; 
						oView.byId("cmbLoctonInsurdnew").setSelectedKey(subCharValue);
						oView.byId("cmbLoctonInsurdnew")["isData"]=true;
							switch(ZTask){
							case "I" :oView.byId("cmbLoctonInsurdnew").setValueState("Success");break;
							case "D" :oView.byId("cmbLoctonInsurdnew").setValueState("Error");break;
							case "U" :if(addtnlDataResults[a].ZsubcharValue_X=="X"){oView.byId("cmbLoctonInsurdnew").setValueState("Warning");}break;
							default: oView.byId("cmbLoctonInsurdnew").setValueState("None");break;
							}
					}
					else{
						var subCharValue=addtnlDataResults[a].ZzSubCharValue;
						oView.byId("cmbLoctonInsurd").setSelectedKey(subCharValue);
						oView.byId("cmbLoctonInsurd")["isData"]=true;
							switch(ZTask){
							case "I" :oView.byId("cmbLoctonInsurd").setValueState("Success");break;
							case "D" :oView.byId("cmbLoctonInsurd").setValueState("Error");break;
							case "U" :if(addtnlDataResults[a].ZsubcharValue_X=="X"){oView.byId("cmbLoctonInsurd").setValueState("Warning");}break;
							default: oView.byId("cmbLoctonInsurd").setValueState("None");break;
							}
						}

					break;
				case "ZFTFL":
					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					oView.byId("cmbfotfall").setSelectedKey(subCharValue);
					oView.byId("cmbfotfall")["isData"]=true;
						switch(ZTask){
						case "I" :oView.byId("cmbfotfall").setValueState("Success");break;
						case "D" :oView.byId("cmbfotfall").setValueState("Error");break;
						case "U" :if(addtnlDataResults[a].ZsubcharValue_X=="X"){oView.byId("cmbfotfall").setValueState("Warning");}break;
						default: oView.byId("cmbfotfall").setValueState("None");break;
						}
					break;
				case "ZSHFS":
					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					oView.byId("cmbshpfrntSpce").setSelectedKey(subCharValue);
					oView.byId("cmbshpfrntSpce")["isData"]=true;
						switch(ZTask){
						case "I" :oView.byId("cmbshpfrntSpce").setValueState("Success");break;
						case "D" :oView.byId("cmbshpfrntSpce").setValueState("Error");break;
						case "U" :if(addtnlDataResults[a].ZsubcharValue_X=="X"){oView.byId("cmbshpfrntSpce").setValueState("Warning");}break;
						default: oView.byId("cmbshpfrntSpce").setValueState("None");break;
						}
					break;
				case "ZCPCL":
					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					oView.byId("cmbPcsLap").setSelectedKey(subCharValue);
					oView.byId("cmbPcsLap")["isData"]=true;
						switch(ZTask){
						case "I" :oView.byId("cmbPcsLap").setValueState("Success");break;
						case "D" :oView.byId("cmbPcsLap").setValueState("Error");break;
						case "U" :if(addtnlDataResults[a].ZsubcharValue_X=="X"){oView.byId("cmbPcsLap").setValueState("Warning");}break;
						default: oView.byId("cmbPcsLap").setValueState("None");break;
						}
					break;
				case "ZPRSC":
					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					oView.byId("cmbPrntrScnrs").setSelectedKey(subCharValue);
					oView.byId("cmbPrntrScnrs")["isData"]=true;
						switch(ZTask){
						case "I" :oView.byId("cmbPrntrScnrs").setValueState("Success");break;
						case "D" :oView.byId("cmbPrntrScnrs").setValueState("Error");break;
						case "U" :if(addtnlDataResults[a].ZsubcharValue_X=="X"){oView.byId("cmbPrntrScnrs").setValueState("Warning");}break;
						default: oView.byId("cmbPrntrScnrs").setValueState("None");break;
						}
					break;
				case "ZCFTE":
					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					oView.byId("inptFullTmeEmploys").setValue(subCharValue);
					oView.byId("inptFullTmeEmploys")["isData"]=true;
						switch(ZTask){
						case "I" :oView.byId("inptFullTmeEmploys").setValueState("Success");break;
						case "D" :oView.byId("inptFullTmeEmploys").setValueState("Error");break;
						case "U" :if(addtnlDataResults[a].ZsubcharValue_X=="X"){oView.byId("inptFullTmeEmploys").setValueState("Warning");}break;
						default: oView.byId("inptFullTmeEmploys").setValueState("None");break;
						}
					break;

				case "ZDSSN":
					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					oView.byId("AgentDssNme").setValue(subCharValue);
					oView.byId("AgentDssNme")["isData"]=true;
						switch(ZTask){
						case "I" :oView.byId("AgentDssNme").setValueState("Success");break;
						case "D" :oView.byId("AgentDssNme").setValueState("Error");break;
						case "U" :if(addtnlDataResults[a].ZsubcharValue_X=="X"){oView.byId("AgentDssNme").setValueState("Warning");}break;
						default: oView.byId("AgentDssNme").setValueState("None");break;
						}
					break;

				case "ZNVEH":
					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					oView.byId("inpNoofVehicles").setValue(subCharValue);
					oView.byId("inpNoofVehicles")["isData"]=true;
						switch(ZTask){
						case "I" :oView.byId("inpNoofVehicles").setValueState("Success");break;
						case "D" :oView.byId("inpNoofVehicles").setValueState("Error");break;
						case "U" :if(addtnlDataResults[a].ZsubcharValue_X=="X"){oView.byId("inpNoofVehicles").setValueState("Warning");}break;
						default: oView.byId("inpNoofVehicles").setValueState("None");break;
						}
					break;

				case "ZCBES":
					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					oView.byId("cmbCntBnkEndStf").setSelectedKey(subCharValue);
					oView.byId("cmbCntBnkEndStf")["isData"]=true;
						switch(ZTask){
						case "I" :oView.byId("cmbCntBnkEndStf").setValueState("Success");break;
						case "D" :oView.byId("cmbCntBnkEndStf").setValueState("Error");break;
						case "U" :if(addtnlDataResults[a].ZsubcharValue_X=="X"){oView.byId("cmbCntBnkEndStf").setValueState("Warning");}break;
						default: oView.byId("cmbCntBnkEndStf").setValueState("None");break;
						}
					break;
				case "ZTMPS":
					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					oView.byId("cmbTotlMnpwrStrngt").setSelectedKey(subCharValue);
					oView.byId("cmbTotlMnpwrStrngt")["isData"]=true;
						switch(ZTask){
						case "I" :oView.byId("cmbTotlMnpwrStrngt").setValueState("Success");break;
						case "D" :oView.byId("cmbTotlMnpwrStrngt").setValueState("Error");break;
						case "U" :if(addtnlDataResults[a].ZsubcharValue_X=="X"){oView.byId("cmbTotlMnpwrStrngt").setValueState("Warning");}break;
						default: oView.byId("cmbTotlMnpwrStrngt").setValueState("None");break;
						}
					break;
				case "ZCFOS":
					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					oView.byId("cmbCntofFsStf").setSelectedKey(subCharValue);
					oView.byId("cmbCntofFsStf")["isData"]=true;
						switch(ZTask){
						case "I" :oView.byId("cmbCntofFsStf").setValueState("Success");break;
						case "D" :oView.byId("cmbCntofFsStf").setValueState("Error");break;
						case "U" :if(addtnlDataResults[a].ZsubcharValue_X=="X"){oView.byId("cmbCntofFsStf").setValueState("Warning");}break;
						default: oView.byId("cmbCntofFsStf").setValueState("None");break;
						}
					break;
				case "ZCSUP":
					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					oView.byId("cmbSprvsonSlesStf").setSelectedKey(subCharValue);
					oView.byId("cmbSprvsonSlesStf")["isData"]=true;
						switch(ZTask){
						case "I" :oView.byId("cmbSprvsonSlesStf").setValueState("Success");break;
						case "D" :oView.byId("cmbSprvsonSlesStf").setValueState("Error");break;
						case "U" :if(addtnlDataResults[a].ZsubcharValue_X=="X"){oView.byId("cmbSprvsonSlesStf").setValueState("Warning");}break;
						default: oView.byId("cmbSprvsonSlesStf").setValueState("None");break;
						}
					break;
				case "ZCFES":
					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					oView.byId("cmbCntofFrntEdStf").setSelectedKey(subCharValue);
					oView.byId("cmbCntofFrntEdStf")["isData"]=true;
						switch(ZTask){
						case "I" :oView.byId("cmbCntofFrntEdStf").setValueState("Success");break;
						case "D" :oView.byId("cmbCntofFrntEdStf").setValueState("Error");break;
						case "U" :if(addtnlDataResults[a].ZsubcharValue_X=="X"){oView.byId("cmbCntofFrntEdStf").setValueState("Warning");}break;
						default: oView.byId("cmbCntofFrntEdStf").setValueState("None");break;
						}
					break;

				case "ZDSSR":
					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					oView.byId("AgentCombodss").setSelectedKey(subCharValue);
					oView.byId("AgentCombodss")["isData"]=true;
						switch(ZTask){
						case "I" :oView.byId("AgentCombodss").setValueState("Success");break;
						case "D" :oView.byId("AgentCombodss").setValueState("Error");break;
						case "U" :if(addtnlDataResults[a].ZsubcharValue_X=="X"){oView.byId("AgentCombodss").setValueState("Warning");}break;
						default: oView.byId("AgentCombodss").setValueState("None");break;
					}
					break;

				case "ZLOWN":
					if(HqDet == true){
						var subCharValue=addtnlDataResults[a].ZzSubCharValue;
						oView.byId("AgentlocComboOwnership").setSelectedKey(subCharValue);
						oView.byId("AgentlocComboOwnership")["isData"]=true;
							switch(ZTask){
							case "I" :oView.byId("AgentlocComboOwnership").setValueState("Success");break;
							case "D" :oView.byId("AgentlocComboOwnership").setValueState("Error");break;
							case "U" :if(addtnlDataResults[a].ZsubcharValue_X=="X"){oView.byId("AgentlocComboOwnership").setValueState("Warning");}break;
							default: oView.byId("AgentlocComboOwnership").setValueState("None");break;
						}
					} 
					else{
						var subCharValue=addtnlDataResults[a].ZzSubCharValue;
						oView.byId("AgentlocCombo").setSelectedKey(subCharValue);
						oView.byId("AgentlocCombo")["isData"]=true;
							switch(ZTask){
							case "I" :oView.byId("AgentlocCombo").setValueState("Success");break;
							case "D" :oView.byId("AgentlocCombo").setValueState("Error");break;
							case "U" :if(addtnlDataResults[a].ZsubcharValue_X=="X"){oView.byId("AgentlocCombo").setValueState("Warning");}break;
							default: oView.byId("AgentlocCombo").setValueState("None");break;
						}}
					break;


				case "ZDELM":

					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					that.deliveryKeys.push(subCharValue);
					that.deliveryKeysWithTasks.push(addtnlDataResults[a]);

					break;
				case "ZOCON":
					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					that.conectvityArray.push(subCharValue);
					that.conectvitykeysWithTasks.push(addtnlDataResults[a]);
					break;
				case "ZPAYM":
					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					oView.byId("cmbPayoutMedia").setSelectedKey(subCharValue);
					oView.byId("cmbPayoutMedia")["isData"]=true;
						switch(ZTask){
						case "I" :oView.byId("cmbPayoutMedia").setValueState("Success");break;
						case "D" :oView.byId("cmbPayoutMedia").setValueState("Error");break;
						case "U" :if(addtnlDataResults[a].ZsubcharValue_X=="X"){oView.byId("cmbPayoutMedia").setValueState("Warning");}break;
						default: oView.byId("cmbPayoutMedia").setValueState("None");break;
					}
					break;
				case "ZSTYP":
					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					oView.byId("cmbSurtyType").setSelectedKey(subCharValue);
					oView.byId("cmbSurtyType")["isData"]=true;
					
					switch(ZTask){
					case "I" :oView.byId("cmbSurtyType").setValueState("Success");break;
					case "D" :oView.byId("cmbSurtyType").setValueState("Error");break;
					case "U" :if(addtnlDataResults[a].ZsubcharValue_X=="X"){oView.byId("cmbSurtyType").setValueState("Warning");}break;
					default: oView.byId("cmbSurtyType").setValueState("None");break;
				}
					break;
				case "ZBTYP":
//					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					//  that.arrBtTyp.push({value : subCharValue, task : ZTask});
					//changed by linga on 031016.
					that.arrBtTyp.push({value :addtnlDataResults[a], task : ZTask});
					//oView.byId("cmbBusnessType").setSelectedKey(subCharValue);
					break;
				case "ZDISTC":
//					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					//that.arrDstCmp.push(subCharValue);
					that.arrDstCmp.push(addtnlDataResults[a]);
					//oView.byId("inputDstrbtnCmpny").setValue(subCharValue);
					break;
				case "ZYOPS":
//					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					that.arrinptYrs.push(addtnlDataResults[a]);
					//oView.byId("inptYrsOprtn").setValue(subCharValue);
					break;
				case "ZPRMF":
//					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					//oView.byId("inptPrmtFndng").setValue(subCharValue);
					that.arrinptPrmt.push(addtnlDataResults[a]);
					break;
				case "ZRINV":
//					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					//oView.byId("inptRoi").setValue(subCharValue);
					that.arrinptRoi.push(addtnlDataResults[a]);
					break;
				case "ZCRFC":
//					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					//oView.byId("inptCerdtRcvdcmp").setValue(subCharValue);
					that.arrCerdtRcvdcmp.push(addtnlDataResults[a]);
					break;
				case "ZLOTRO":
//					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					//  oView.byId("inptAnnulTrnvr").setValue(subCharValue);
					that.arrBAnnulTrnvr.push(addtnlDataResults[a]);
					break;
				case "ZPGRW":
//					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					//oView.byId("inptGrwthPrvsYer").setValue(subCharValue);
					that.arrGrwthPrvsYer.push(addtnlDataResults[a]);
					break;
				case "ZOUTS":
//					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					//oView.byId("cmbOutltSbtype").setSelectedKey(subCharValue);
					that.arrcmbOutlt.push(addtnlDataResults[a]);
					break;
				case "ZOUTC":
//					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					//oView.byId("inptOutltCnt").setValue(subCharValue);
					that.arrOutltCnt.push(addtnlDataResults[a]);
					break;
				case "ZMSLVC":
//					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					// that.arrMntlySlesVol.push(subCharValue);
					that.arrMntlySlesVol.push(addtnlDataResults[a]);
					break;
				case "ZASLP":
					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					oView.byId("inptAvrgSelngPrce").setValue(subCharValue);
					oView.byId("inptAvrgSelngPrce")["isData"]=true;
					break;
				case "ZBRNDSC":
//					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					that.arrBrndSrvcd.push(addtnlDataResults[a]);
					// that.arrBrndSrvcd.push(subCharValue);
					break;
				case "ZPRODTC":
//					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					//oView.byId("inptPrdTyp").setValue(subCharValue);
					//that.arrPrdTyp.push(subCharValue);
					that.arrPrdTyp.push(addtnlDataResults[a]);
					break;
				case "ZMSLVD":
//					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					//that.arrMntlySlesDevVol.push(subCharValue);
					that.arrMntlySlesDevVol.push(addtnlDataResults[a]);
					break;
				case "ZBRNDSD":
//					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					//that.arrBrndSrvcdDev.push(subCharValue);
					that.arrBrndSrvcdDev.push(addtnlDataResults[a]);
					break;
				case "ZPRODTD":
//					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					//oView.byId("inptPrdTyp").setValue(subCharValue);
					//that.arrPrdDevTyp.push(subCharValue);
					that.arrPrdDevTyp.push(addtnlDataResults[a]);
					break;

				case "ZOLFL":
					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					oView.byId("cmbOnlneFulmnt").setSelectedKey(subCharValue);
					oView.byId("cmbOnlneFulmnt")["isData"]=true;
						switch(ZTask){
						case "I" :oView.byId("cmbOnlneFulmnt").setValueState("Success");break;
						case "D" :oView.byId("cmbOnlneFulmnt").setValueState("Error");break;
						case "U" :if(addtnlDataResults[a].ZsubcharValue_X=="X"){oView.byId("cmbOnlneFulmnt").setValueState("Warning");}break;
						default: oView.byId("cmbOnlneFulmnt").setValueState("None");break;
						}

					break;
				case "ZDBNM":
					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					oView.byId("inptDlverByNme").setValue(subCharValue);
					oView.byId("inptDlverByNme")["isData"]=true;
						switch(ZTask){
						case "I" :oView.byId("inptDlverByNme").setValueState("Success");break;
						case "D" :oView.byId("inptDlverByNme").setValueState("Error");break;
						case "U" :if(addtnlDataResults[a].ZsubcharValue_X=="X"){oView.byId("inptDlverByNme").setValueState("Warning");}break;
						default: oView.byId("inptDlverByNme").setValueState("None");break;
					}
					break;
				case "ZOLFQ":
					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					oView.byId("cmbDlvryQual").setSelectedKey(subCharValue);
					oView.byId("cmbDlvryQual")["isData"]=true;
						switch(ZTask){
						case "I" :oView.byId("cmbDlvryQual").setValueState("Success");break;
						case "D" :oView.byId("cmbDlvryQual").setValueState("Error");break;
						case "U" :if(addtnlDataResults[a].ZsubcharValue_X=="X"){oView.byId("cmbDlvryQual").setValueState("Warning");}break;
						default: oView.byId("cmbDlvryQual").setValueState("None");break;
						
					}
					break;
				case "ZSRVA":
					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					oView.byId("cmbSrvcAra").setSelectedKey(subCharValue);
					oView.byId("cmbSrvcAra")["isData"]=true;
						switch(ZTask){
						case "I" :oView.byId("cmbSrvcAra").setValueState("Success");break;
						case "D" :oView.byId("cmbSrvcAra").setValueState("Error");break;
						case "U" :if(addtnlDataResults[a].ZsubcharValue_X=="X"){oView.byId("cmbSrvcAra").setValueState("Warning");}break;
						default: oView.byId("cmbSrvcAra").setValueState("None");break;
						}
					break;
				case "ZARFS":
					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					oView.byId("cmbAreaServc").setSelectedKey(subCharValue);
					oView.byId("cmbAreaServc")["isData"]=true;
						switch(ZTask){
						case "I" :oView.byId("cmbAreaServc").setValueState("Success");break;
						case "D" :oView.byId("cmbAreaServc").setValueState("Error");break;
						case "U" :if(addtnlDataResults[a].ZsubcharValue_X=="X"){oView.byId("cmbAreaServc").setValueState("Warning");}break;
						default: oView.byId("cmbAreaServc").setValueState("None");break;
						}
					break;
				case "ZSBOY":
					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					oView.byId("cmbShpServ").setSelectedKey(subCharValue);
					oView.byId("cmbShpServ")["isData"]=true;
						switch(ZTask){
						case "I" :oView.byId("cmbShpServ").setValueState("Success");break;
						case "D" :oView.byId("cmbShpServ").setValueState("Error");break;
						case "U" :if(addtnlDataResults[a].ZsubcharValue_X=="X"){oView.byId("cmbShpServ").setValueState("Warning");}break;
						default: oView.byId("cmbShpServ").setValueState("None");break;
						}
					break;
				case "ZBNAM":
					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					oView.byId("inptServcName").setValue(subCharValue);
					oView.byId("inptServcName")["isData"]=true;
						switch(ZTask){
						case "I" :oView.byId("inptServcName").setValueState("Success");break;
						case "D" :oView.byId("inptServcName").setValueState("Error");break;
						case "U" :if(addtnlDataResults[a].ZsubcharValue_X=="X"){oView.byId("inptServcName").setValueState("Warning");}break;
						default: oView.byId("inptServcName").setValueState("None");break;
						}
					break;
				case "ZSRVQ":
					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					oView.byId("cmbQualfcton").setSelectedKey(subCharValue);
					oView.byId("cmbQualfcton")["isData"]=true;
						switch(ZTask){
						case "I" :oView.byId("cmbQualfcton").setValueState("Success");break;
						case "D" :oView.byId("cmbQualfcton").setValueState("Error");break;
						case "U" :if(addtnlDataResults[a].ZsubcharValue_X=="X"){oView.byId("cmbQualfcton").setValueState("Warning");}break;
						default: oView.byId("cmbQualfcton").setValueState("None");break;
						}
					break;
				case "ZSEND":
					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					var secuEnd = com.ril.PRMS.util.Formatter.datePRMnPC(subCharValue);
					oView.byId("DtpckScurtyEndDte").setDateValue(secuEnd);
					oView.byId("DtpckScurtyEndDte")["isData"]=true;
					oView.byId("DtpckScurtyEndDte").setValueState(com.ril.PRMS.util.Formatter.setHeaderColor(addtnlDataResults[a].ZsubcharValue_X));
					break;
				case "ZSEST":
					var subCharValue=addtnlDataResults[a].ZzSubCharValue;
					var secuEst = com.ril.PRMS.util.Formatter.datePRMnPC(subCharValue);
					oView.byId("DtpckScurtyStrtDte").setDateValue(secuEst);
					oView.byId("DtpckScurtyStrtDte")["isData"]=true;
					oView.byId("DtpckScurtyStrtDte").setValueState(com.ril.PRMS.util.Formatter.setHeaderColor(addtnlDataResults[a].ZsubcharValue_X));
					break;
				}
			}
			
			//added by linga on 10.11.16
			
			that.TableSelectedItems("tabidModeofDelv",that.deliveryKeysWithTasks,"jsonDataModeOfdelv","ZzSubCharValue");
			that.TableSelectedItems("TabidConOffice",that.conectvitykeysWithTasks,"jsonDataConOff","ZzSubCharValue");

			//Bank Details
			oView.byId("inptAccountHldrName").setValue(oData.Accountholdername);
			if(oData.Accountholdername_X==="X"){oView.byId("inptAccountHldrName").setValueState("Warning");}else{oView.byId("inptAccountHldrName").setValueState("None");}
			oView.byId("inputAccountNo").setValue(oData.Accountnumber);
			if(oData.Accountnumber_X==="X"){oView.byId("inputAccountNo").setValueState("Warning");}else{oView.byId("inputAccountNo").setValueState("None");}
			oView.byId("inptBankName").setValue(oData.Bankname);
			if(oData.Bankname_X==="X"){oView.byId("inptBankName").setValueState("Warning");}else{oView.byId("inptBankName").setValueState("None");}
			oView.byId("inptBranchName").setValue(oData.Branchname);
			if(oData.Branchname_X==="X"){oView.byId("inptBranchName").setValueState("Warning");}else{oView.byId("inptBranchName").setValueState("None");}
			oView.byId("inptIfcCode").setValue(oData.Ifsccode);
			if(oData.Ifsccode_X==="X"){oView.byId("inptIfcCode").setValueState("Warning");}else{oView.byId("inptIfcCode").setValueState("None");}
			// Channel Finance 
			oView.byId("cmbChannelFinanced").setSelectedKey(oData.ChannelFinanced);
			if(oData.ChannelFinanced_X==="X"){oView.byId("cmbChannelFinanced").setValueState("Warning");}else{oView.byId("cmbChannelFinanced").setValueState("None");}
			oView.byId("inputCreditLimt").setValue(oData.CreditLimit);
			if(oData.CreditLimit_X==="X"){oView.byId("inputCreditLimt").setValueState("Warning");}else{oView.byId("inputCreditLimt").setValueState("None");}
			oView.byId("inpBankName").setValue(oData.BankName);
			if(oData.BankName_X==="X"){oView.byId("inpBankName").setValueState("Warning");}else{oView.byId("inpBankName").setValueState("None");}
			oView.byId("DtpSantionDate").setDateValue(oData.SanctionDate);
			if(oData.SanctionDate_X==="X"){oView.byId("DtpSantionDate").setValueState("Warning");}else{oView.byId("DtpSantionDate").setValueState("None");}
			oView.byId("DtpExpiryDate").setDateValue(oData.ExpiryDate);
			if(oData.ExpiryDate_X==="X"){oView.byId("DtpExpiryDate").setValueState("Warning");}else{oView.byId("DtpExpiryDate").setValueState("None");}
			oView.byId("inpCrdPerid").setValue(oData.CreditPeriod);
			if(oData.CreditPeriod_X==="X"){oView.byId("inpCrdPerid").setValueState("Warning");}else{oView.byId("inpCrdPerid").setValueState("None");}
			//Agents
			var agentData=oData.PDTOAGENTDTLSNAV;
			that.agentDataDet = oData.PDTOAGENTDTLSNAV;

			var cbAgent = oView.byId("cbAgents");
			cbAgent.destroyItems();
			if(agentData.results.length>0){
				//---Editted By Teenu on 11-06-2016 for Agent New View----------
				var arrAgent = [];
			//	that.refAgeArr =[];
				for(var i=0;i<agentData.results.length;i++){
					var refAgeArr =[];
					//---Agent Details-----------------
					var agentResultsData=agentData.results[i];
					var Saluton = agentResultsData.Zztitle;
					var fName = agentResultsData.Zzfname;
					var lName = agentResultsData.Zzlname;
					var mName = agentResultsData.Zzmname;
					var sex = agentResultsData.Zzgender;
					var dob = agentResultsData.Zzbirthdate;
					var jbFun = agentResultsData.ZzjobFunction;

					//-----ADDITIONAL CHARACTER NAVIGATION------------
					var Agentaddchar=agentResultsData.PDAGENTTOADDCHARNAV;
					for(var ac=0;ac<Agentaddchar.results.length;ac++){
						var Zname=Agentaddchar.results[ac].Zzname;
						var Zvalue=Agentaddchar.results[ac].Zzvalue;
						switch(Zname){
						case "ZASLN":
							/* that.byId("cmbSecLanguage").setSelectedKey(Zvalue);   
		                    break;*/
							var secLang = Zvalue;
							break;
						case "ZAYOE":
							/* that.byId("inpYoExp").setValue(Zvalue);                           
		                    break;*/
							var inpYOE = Zvalue;
							break;
						case "ZAIND":
							/*  that.byId("cmbInduZvaluestry").setSelectedKey(Zvalue);                          
		                    break; */
							var Industry  =Zvalue;
							break;
						case "ZAQLF":
							/* that.byId("cmbQualification").setSelectedKey(Zvalue);                     
		                    break;    */    
							var Qlf = Zvalue;
							break;
						case "ZADOJ":
							/*    that.byId("dpDOJ").setValue(Zvalue);   //need to work on this ASAP                  
		                    break;  
		            	var Doj = Zvalue;*/
							var Doj = com.ril.PRMS.util.Formatter.datePRMnPC(Zvalue);
							break;
						}
						// break;
					} 

					//----Contact information----------
					var mob = agentResultsData.ZzmobileNo;
					var email = agentResultsData.Zzemail;
					/*var prefLang = agentResultsData.ZzpreferredLang;
		           var comPrf = agentResultsData.ZzcommPref;*/
					var altMob = agentResultsData.ZzworkTelNo;
					//-----Owner user identification-------
					var priAgent = agentResultsData.Zzprimarycontact;
					var prmId = agentResultsData.ZzagentId;
					var agentId = agentResultsData.ZzextAgentid;
					var jobDesc = agentResultsData.ZzjobDesc;
					//-------------Address Tab---------------
					var oagentPreMod = new sap.ui.model.json.JSONModel();
					var oagentPerMod = new sap.ui.model.json.JSONModel();
					that.oResultData = agentResultsData;
					var agentPresentAdd = that.getView().getModel("agentPresentAdd");
					delete agentPresentAdd;
					var agentPermentAdd = that.getView().getModel("agentPermentAdd");
					delete agentPermentAdd;
					var PresentAdd = "";
					var PermantAdd = ""; 
					for(var k=0;k<agentResultsData.PDAGENTTOADDRESSNAV.results.length;k++){
						if(agentResultsData.PDAGENTTOADDRESSNAV.results[k].ZzaddrType == "XXDEFAULT"){
							//agentPresArr.push(agentResultsData.PDAGENTTOADDRESSNAV.results[k]);
							agentResultsData.PDAGENTTOADDRESSNAV.results[k].isBackend = true;
							oagentPreMod.setData(agentResultsData.PDAGENTTOADDRESSNAV.results[k]);
							that.getView().setModel(oagentPreMod,"agentPresentAdd");
							PresentAdd  = agentResultsData.PDAGENTTOADDRESSNAV.results[k];
							that._onAgentPreState();
						}else{
							//agentPerAddArr.push(agentResultsData.PDAGENTTOADDRESSNAV.results[k]);
							agentResultsData.PDAGENTTOADDRESSNAV.results[k].isBackend = true;
							oagentPerMod.setData(agentResultsData.PDAGENTTOADDRESSNAV.results[k]);
							that.getView().setModel(oagentPerMod,"agentPermentAdd");
							PermantAdd =  agentResultsData.PDAGENTTOADDRESSNAV.results[k];
							that._onAgentPerState();
						}
					}
					var AgentProofTable=agentResultsData.PDAGENTTOPROOFNAV;
					var agentProofArr = [];
					if(AgentProofTable.results.length>0){
						for(var j=0;j<AgentProofTable.results.length;j++){
							var agentProofData=AgentProofTable.results[j];
							var agentProfIdentifier = agentProofData.ZzproofIdent;
							var profType = agentProofData.ZzidType;
							var docNo = agentProofData.ZzidNumber;
							var doissue = agentProofData.ZzdateOfIssue;
							var doexpiry = agentProofData.ZzdateOfExpiry;
							var plceofIsuue = agentProofData.ZzplaceOfIssue;
							var issueAuth = agentProofData.ZzissueAuth;
							var Profobj={
									ZTask : agentProofData.ZzTask,
									ZzproofIdent : agentProfIdentifier,
									ZzproofIdent_X:agentProofData.ZzproofIdent_X,
									ZzidType : profType,
									ZzidType_X:agentProofData.ZzidType_X,
									ZzidNumber : docNo,
									ZzidNumber_X : agentProofData.ZzidNumber_X,
									ZzdateOfIssue : doissue,
									ZzdateOfIssue_X :agentProofData.ZzdateOfIssue_X,
									ZzdateOfExpiry : doexpiry,
									ZzdateOfExpiry_X :agentProofData.ZzdateOfExpiry_X,
									ZzplaceOfIssue : plceofIsuue,
									ZzplaceOfIssue_X :agentProofData.ZzplaceOfIssue_X,
									ZzissueAuth : issueAuth,
									ZzissueAuth_X : agentProofData.ZzissueAuth_X,
									isBackend : true,
									modelIndex :j
							};
							agentProofArr.push(Profobj);
						}

					}
					var refAgentData = agentResultsData.PDAGENTTOREFERNAV;
					var oRefAgentMod = new sap.ui.model.json.JSONModel();
					for(var l=0;l<refAgentData.results.length;l++){
						var refObj = {
								extrnID : agentId,
								ID : refAgentData.results[l].Zzsequence,
								/* Fname :refAgentData.results[l].Zzfname,
		                 Mname :refAgentData.results[l].ZzmiddileName,
		                 Lname :refAgentData.results[l].ZzlastName,*/
		                 value : refAgentData.results[l].Zzfname+" "+refAgentData.results[l].ZzmiddileName+" "+refAgentData.results[l].ZzlastName,
		                 objRefArr :refAgentData.results[l]
						};
						refAgeArr.push(refObj);
					}

					var obj ={
							extrnID : agentId,value :fName+" "+mName+" "+lName,fname :fName,fname_X:"",lname : lName,lname_X:"",mname : mName,mname_X:"",
							sex : sex,sex_X:"",Saluton : Saluton,Saluton_X:"",dob : dob,dob_X:"",jbFun : jbFun,jbFun_X:"",mob : mob,mob_X:"",
							email : email,email_X:"",altMob :altMob,altMob_X:"",priAgent : priAgent,priAgent_X:"",prmId :prmId,prmId_X:"",
							jobDesc :jobDesc,jobDesc_X:"",objArr :agentProofArr,secLang :secLang,secLang_X:"",inpYOE :inpYOE,inpYOE_X:"",
							Qlf :Qlf,Qlf_X:"",Doj :Doj,Doj_X:"",Industry: Industry,Industry_X:"",
							PresentAdd :PresentAdd,PermantAdd :PermantAdd,objRefArr : refAgeArr,
							Doj_isData: (Doj!="" && Doj!=null && Doj!=undefined )?true:false,
									Qlf_isData:(Qlf!="" && Qlf!=null && Qlf!=undefined )?true:false,
											Industry_isData:(Industry!="" && Industry!=null && Industry!=undefined )?true:false,
													inpYOE_isData:(inpYOE!="" && inpYOE!=null && inpYOE!=undefined )?true:false,
															secLang_isData:(secLang!="" && secLang!=null && secLang!=undefined )?true:false

																	//----Agent Table
					};
					arrAgent.push(obj)
				}
				//--------------------Agent Select--------------------------------
				that.agentNameModel = new sap.ui.model.json.JSONModel(arrAgent);
				var template = new sap.ui.core.Item({key:"{extrnID}", text:"{value}" });
				cbAgent.setModel(that.agentNameModel);
				cbAgent.bindItems('/',template);
				//that.AgentKey_temp = that.agentNameModel.oData[0].extrnID;
		//		cbAgent.setSelectedKey(that.agentNameModel.oData[0].extrnID);
				that.AgentKey_temp = cbAgent.getModel().getData()[0].extrnID;

				//--------------------Ref Agent Select--------------------------------------
				/* changed by linga on Oct 18, 2016 at 1:34:17 PM */
				
				//that.locRefArr = [];
				var locRefDetArr =[];
				/*for(var m=0;m<that.refAgeArr.length;m++){
					if(that.agentNameModel.oData[0].extrnID == that.refAgeArr[m].extrnID){
						that.locRefArr.push(that.refAgeArr[m]);
					}
				}*/
				//	that.locRefArr.push(that.agentNameModel.oData[0].objRefArr);
				//-------------Ref Agent Select
				var agentref = that.getView().getModel("refAgeMod");
				delete agentref;
				var refAgentModel = new sap.ui.model.json.JSONModel(that.agentNameModel.oData[0].objRefArr);
				var oRefAgentMod = new sap.ui.model.json.JSONModel();
				var selRefAgent = oView.byId("selRefAgent");
				var template = new sap.ui.core.Item({key:"{ID}", text:"{value}" });
				selRefAgent.setModel(refAgentModel);
				selRefAgent.bindItems('/',template);
				if(that.agentNameModel.oData[0].objRefArr.length>0){
					oView.byId("selRefAgent").setSelectedKey(refAgentModel.oData.ID);
					locRefDetArr.push(refAgentModel.oData[0].objRefArr);
					oRefAgentMod.setData(locRefDetArr[0]);
				}
				
				that.getView().setModel(oRefAgentMod,"refAgeMod");
				that._onRefAgentState();
				//----Agent Profile---------------------
				oView.byId("cmbSaluton").setSelectedKey(that.agentNameModel.oData[0].Saluton);
				oView.byId("fname").setValue(that.agentNameModel.oData[0].fname);
				oView.byId("mName").setValue(that.agentNameModel.oData[0].mname);
				oView.byId("lName").setValue(that.agentNameModel.oData[0].lname);
				oView.byId("cmbGender").setSelectedKey(that.agentNameModel.oData[0].sex);
				oView.byId("datePickrbirthday").setDateValue(that.agentNameModel.oData[0].dob);
				oView.byId("cmbJobFnctn").setSelectedKey(that.agentNameModel.oData[0].jbFun);
				var dateOfJoining = that.agentNameModel.oData[0].Doj=="Invalid Date"?null:that.agentNameModel.oData[0].Doj;
				oView.byId("dpDOJ").setDateValue(dateOfJoining);//that.agentNameModel.oData[0].Doj
				oView.byId("cmbQualification").setSelectedKey(that.agentNameModel.oData[0].Qlf);
				oView.byId("cmbIndustry").setSelectedKey(that.agentNameModel.oData[0].Industry);
				oView.byId("inpYoExp").setValue(that.agentNameModel.oData[0].inpYOE);
				oView.byId("cmbSecLanguage").setSelectedKey(that.agentNameModel.oData[0].secLang);

				//----Contact Information---------------------
				var mobcheck=that.agentNameModel.oData[0].mob;
				var indexOfMob=mobcheck.indexOf("+91");
				var indexOfMob2=mobcheck.indexOf("091");
				var indexOfMob3=mobcheck.indexOf("0");
				if(indexOfMob==-1 && indexOfMob2==0){
					oView.byId("inptmobileNo").setValue(mobcheck.substring(3,mobcheck.length));
				}
				else if(indexOfMob==0 && indexOfMob2==-1){
					oView.byId("inptmobileNo").setValue(mobcheck.substring(3,mobcheck.length));
				}

				else if(indexOfMob3==0){
					oView.byId("inptmobileNo").setValue(mobcheck.substring(1,mobcheck.length));
				}
				else{
					oView.byId("inptmobileNo").setValue(mobcheck);
				}
				// oView.byId("inptmobileNo").setValue(that.agentNameModel.oData[0].mob);
				var altMobCheck=that.agentNameModel.oData[0].altMob;
				var indexOfAltMob=altMobCheck.indexOf("+91");
				var indexOfAltMob2=altMobCheck.indexOf("091");
				var indexOfAltMob3=altMobCheck.indexOf("0");
				if(indexOfAltMob==-1 && indexOfAltMob2==0){
					oView.byId("cmbAlterMbno").setValue(altMobCheck.substring(3,altMobCheck.length));
				}
				else if(indexOfAltMob==0 && indexOfAltMob2==-1){
					oView.byId("cmbAlterMbno").setValue(altMobCheck.substring(3,altMobCheck.length));
				}

				else if(indexOfAltMob3==0){
					oView.byId("cmbAlterMbno").setValue(altMobCheck.substring(1,altMobCheck.length));
				}
				else{
					oView.byId("cmbAlterMbno").setValue(altMobCheck);
				}


				oView.byId("inptEmail").setValue(that.agentNameModel.oData[0].email);
				oView.byId("cmbPref_lang").setSelectedKey(that.agentNameModel.oData[0].prefLang);
				oView.byId("cmbCom_pref").setSelectedKey(that.agentNameModel.oData[0].comPrf);
				//----Owner user identification-----------------
				if(priAgent == "Y"){
					oView.byId("ckBxPriAgent").setSelected(true);
				}else{
					oView.byId("ckBxPriAgent").setSelected(true);
				}
				oView.byId("inptPRMID").setValue(that.agentNameModel.oData[0].prmId);
				oView.byId("inptExtrnlID").setValue(that.agentNameModel.oData[0].extrnID);
				oView.byId("inptjobDescr").setValue(that.agentNameModel.oData[0].jobDesc);

				//------Agent Table-------------------------
				var agentPrftab = that.getView().getModel("agentPrftab");
				delete agentPrftab;
				var prfAgentArr = [];
				var agentprrofTable = oView.byId("agent_Details_proofTable");
				if(that.agentNameModel.oData[0].objArr.length>0){
					var agentprfIdentMods = new sap.ui.model.json.JSONModel(that.proofArrs);
					agentprfIdentMods.setDefaultBindingMode("OneWay");
					that.getView().setModel(agentprfIdentMods,"agntprfcmdMod");
					for(var l=0;l<that.agentNameModel.oData[0].objArr.length;l++){
						if(that.agentNameModel.oData[0].objArr[l].ZzproofIdent == "POI" || that.agentNameModel.oData[0].objArr[l].ZzproofIdent == "POA"){
							prfAgentArr.push(that.agentNameModel.oData[0].objArr[l]);
						}
					}
					var oJsonAgentPrftabMod = new sap.ui.model.json.JSONModel(prfAgentArr);
					oJsonAgentPrftabMod.setDefaultBindingMode("OneWay");
					agentprrofTable.setModel(oJsonAgentPrftabMod,"agentPrftab");
					var oTable = that.byId("agent_Details_proofTable");
					for(var q=0;q<oTable.getItems().length;q++){
						var oprfCombokey = oTable.mAggregations.items[q].mAggregations.cells[0].mProperties.selectedKey;
						for(var s=0;s<that.proofArrs.length;s++){
							if(oprfCombokey == that.proofArrs[s].pfIdeVal){
								var oprfComboProType = oTable.mAggregations.items[q].mAggregations.cells[1];
								var prfTypeMods = new sap.ui.model.json.JSONModel(that.proofArrs[s]);
								prfTypeMods.setDefaultBindingMode("OneWay");
								oprfComboProType.setModel(prfTypeMods,"prfcmbprfsMod");
								break;
							}
						}
						if(prfTypeMods != undefined){
							if(prfTypeMods.oData.pfIdChild !=undefined){
								for(var r =0;r<prfTypeMods.oData.pfIdChild.length;r++){
									prfAgentArr
									if(prfAgentArr[q].ZzidType == prfTypeMods.oData.pfIdChild[r].AttrCode){
										oTable.mAggregations.items[q].mAggregations.cells[1].setSelectedKey(prfTypeMods.oData.pfIdChild[r].AttrCode);
										break;
									}
									/*if(that.agentNameModel.oData[0].objArr[q].ZzidType == prfTypeMods.oData.pfIdChild[r].AttrCode){
										oTable.mAggregations.items[q].mAggregations.cells[1].setSelectedKey(prfTypeMods.oData.pfIdChild[r].AttrCode);
										break;
									}*/
								}
							}
						}
					}
				}
			}
			//proofTable
			var taxTable = oView.byId("taxTable");
			var proofDTLData=oData.PDTOPROOFDTLSNAV;
			that.prfDataResults=proofDTLData.results;
			var taxArray=[];
			var proofArray=[];
			var prfIdentMod = new sap.ui.model.json.JSONModel(that.taxArrs);
			prfIdentMod.setDefaultBindingMode("OneWay");
			that.getView().setModel(prfIdentMod,"prfcmb1Mod");
			var prfIdentMods = new sap.ui.model.json.JSONModel(that.proofArrs);
			prfIdentMods.setDefaultBindingMode("OneWay");
			that.getView().setModel(prfIdentMods,"prfcmdprfMod");
			for(var p=0;p<that.prfDataResults.length;p++){
				var ZprrofIdnt=that.prfDataResults[p].ZzproofIdent;
//				var zTask=that.prfDataResults[p].ZzTask;


				if(ZprrofIdnt=="TAX"){
//					var taxTable = oView.byId("taxTable");
					var prfResultItem=that.prfDataResults[p];
					taxArray.push(prfResultItem);
				}else if(ZprrofIdnt=="RC"){
//					var taxTable = oView.byId("taxTable");
					var prfResultItem=that.prfDataResults[p];
					taxArray.push(prfResultItem);
				}else if(ZprrofIdnt=="TRM"){
//					var taxTable = oView.byId("taxTable");
					var prfResultItem=that.prfDataResults[p];
					taxArray.push(prfResultItem);
				}else if(ZprrofIdnt=="POA"|| ZprrofIdnt=="POI"){

					var prrofTable = oView.byId("proofTable");
					var prfResultItem=that.prfDataResults[p];
					proofArray.push(prfResultItem);
				}
			}
			if(taxArray!=undefined&&taxArray.length>0){
				var taxJSon=new sap.ui.model.json.JSONModel(taxArray);
				taxJSon.setDefaultBindingMode("OneWay");
				taxTable.setModel(taxJSon);
				var oTable = that.byId("taxTable");
				for(q=0;q<oTable.getItems().length;q++){
					var oComboKey1 = oTable.mAggregations.items[q].mAggregations.cells[0].mProperties.selectedKey;
					for(var s=0;s<that.taxArrs.length;s++){
						if(oComboKey1 == that.taxArrs[s].pfIdeVal){
							var oComboProType = oTable.mAggregations.items[q].mAggregations.cells[1];
							var prfTypeMod = new sap.ui.model.json.JSONModel(that.taxArrs[s]);
							prfTypeMod.setDefaultBindingMode("OneWay");
							oComboProType.setModel(prfTypeMod,"prfcmb2Mod");
							break;
						}
					}
					if(prfTypeMod != undefined){
						for(var r =0;r<prfTypeMod.oData.pfIdChild.length;r++){
							if(taxJSon.oData[q].ZzidType == prfTypeMod.oData.pfIdChild[r].AttrCode){
								oTable.mAggregations.items[q].mAggregations.cells[1].setSelectedKey(prfTypeMod.oData.pfIdChild[r].AttrCode);
								break;
							}
						}
					}

				}

			}
			if(proofArray!=undefined && proofArray.length>0){
				var prrofTable = oView.byId("proofTable");
				var ProofJSon=new sap.ui.model.json.JSONModel(proofArray);
				ProofJSon.setDefaultBindingMode("OneWay");
				prrofTable.setModel(ProofJSon);
				var oTable = that.byId("proofTable");
				for(q=0;q<oTable.getItems().length;q++){
					var oprfCombokey = oTable.mAggregations.items[q].mAggregations.cells[0].mProperties.selectedKey;
					for(var s=0;s<that.proofArrs.length;s++){
						if(oprfCombokey == that.proofArrs[s].pfIdeVal){
							var oprfComboProType = oTable.mAggregations.items[q].mAggregations.cells[1];
							var prfTypeMods = new sap.ui.model.json.JSONModel(that.proofArrs[s]);
							prfTypeMods.setDefaultBindingMode("OneWay");
							oprfComboProType.setModel(prfTypeMods,"prfcmbprfsMod");
							break;
						}
					}
					if(prfTypeMods != undefined){
						for(var r =0;r<prfTypeMods.oData.pfIdChild.length;r++){
							if(ProofJSon.oData[q].ZzidType == prfTypeMods.oData.pfIdChild[r].AttrCode){
								oTable.mAggregations.items[q].mAggregations.cells[1].setSelectedKey(prfTypeMods.oData.pfIdChild[r].AttrCode);
								break;
							}
						}
					}
				}

			}

			that.busTypeBinds();
			that.onSaleTypeBinds();
			that.onDeviceTypeBinds();
			that._agentDataSetting(that.agentDataDet);
			//===============Documents Tab  Setting======================
			that._onsetDocumentList();
			com.ril.PRMS.BusyD.close();
		},function(oData, oResponse){
			var msg = oData.response.statusText;
			sap.m.MessageBox.alert(msg, {
				icon  : sap.m.MessageBox.Icon.ERROR,                        
				title : "Error",
				actions: [sap.m.MessageBox.Action.OK]
			});
			com.ril.PRMS.BusyD.close();
		});//end of oData scope...
		//}


	},

	//======Common method for Document======================
	_onsetDocumentList : function(){
		var that = this;
		var TableIdDoc=that.getView().byId("UploadTable1");
		var docmntId = that.extrnlId;
		var path="/BusinessFileInfoSet/?$filter=IvUuid eq '"+docmntId+"'";
		that.oDataModel.read(path, null,[], true, function(oData, oResponse) {
		//	var jsonR4gstate=new sap.ui.model.json.JSONModel();
		//	jsonR4gstate.setData(oData);
		//	TableIdDoc.setModel(jsonR4gstate,"jsonDoc");
			TableIdDoc.getModel("jsonDoc").setData(oData);
			for(var d=0;d<oData.results.length;d++){
				var deltaSearch = oData.results[d].IvUuid;
				var delta= deltaSearch.search("DELTA");
				if(delta >0){
					TableIdDoc.getItems()[d].addStyleClass("UOranColor");
				}
			}
		},function(oData, oResponse){
			var msg = oData.response.statusText;
			sap.m.MessageBox.alert(msg, {
				icon  : sap.m.MessageBox.Icon.ERROR,                        
				title : "Error",
				actions: [sap.m.MessageBox.Action.OK]
			});
		});
	},
	//=========Editted By Teenu 21-08-2016==========================================
	onSelectionChangeAgntPrfIden:function(oEvnt){
		var agentprfTypeMod = oEvnt.getSource().getParent().mAggregations.cells[1].getModel();
		delete agentprfTypeMod;
		var selectedItem = oEvnt.mParameters.selectedItem.mProperties;
		var sItemLength = oEvnt.getSource().getItems().length;
		this.oJsonPtypeMod = [];
		var oComboPTypeId = oEvnt.getSource().getParent().mAggregations.cells[1];
		for(var i = 0; i<sItemLength; i++){
			if(oEvnt.getSource().getItems()[i].mProperties == selectedItem){
				var oJsonPtypeMods = new sap.ui.model.json.JSONModel(this.proofArrs[i].pfIdChild);
				oComboPTypeId.setModel(oJsonPtypeMods,"prfcmbprfsMod");
				break;
			}
		}
	},
	//===================Pin Code Common Code=========================================
	_globalinfoSys:function(postalCode,id){
		var path="/LookUpHierValueSet?$filter=LovType eq 'CITY' and PagingSize eq 100 and OffsetValue eq 1 and ParentLovTyp eq 'PINCODE' and LovCode eq '"+postalCode+"'";
		var that=this;
		that.oDataModel.read(path,null,[],true,function(oData,oResponse){
		
		// Added by LINGA REDDY on Jan 6, 2017 6:51:12 PM second phase changes
				// lovCode is less than 4 charecters to bind the cites to the combobox.
			var cityData = [];
			for(var i=0;i<oData.results.length;i++){
				if(oData.results[i].LovCode.length<=4){
					cityData.push(oData.results[i]);
				}
			}
			
		// ------------------------------------------------------------------
			var jsonCityModel =new sap.ui.model.json.JSONModel(cityData);
			that.getView().byId(id).setModel(jsonCityModel,"jsonCity1");
		},function(oData, oResponse){
			var msg = oData.response.statusText;
			sap.m.MessageBox.alert(msg, {
				icon  : sap.m.MessageBox.Icon.ERROR,                        
				title : "Error",
				actions: [sap.m.MessageBox.Action.OK]
			});
		});
	},
//	========================================================================================================================
	_onAddState : function(){
		var postalCode=this.getView().byId("inptPostalCde").getValue();
		var state =this.getView().byId("cmbState");
		this._onChangePinState(postalCode,state);
	},
	_onRefDealerState : function(){
		var postalCode=this.getView().byId("inpAgentRefPin").getValue();
		var state =this.getView().byId("cmbAgentRefState");
		this._onChangePinState(postalCode,state);
	},	
	_onAgentPreState : function(){
		var postalCode=this.getView().byId("inpAgentPrePin").getValue();
		var state =this.getView().byId("cmbAgentPreState");
		this._onChangePinState(postalCode,state);
	},	
	_onAgentPerState : function(){
		var postalCode=this.getView().byId("inpAgentPerPin").getValue();
		var state =this.getView().byId("cmbAgentPerState");
		this._onChangePinState(postalCode,state);
	},
	_onRefAgentState : function(){
		var postalCode=this.getView().byId("inpAgentRefPin").getValue();
		var state =this.getView().byId("cmbAgentRefState");
		this._onChangePinState(postalCode,state);
	},
//	------Based on Pin Setting State---------------------------------
	_onChangePinState : function(postalCode,state,id){
		var path="/LooUpRelatedValueSet/?$filter=LovType eq 'PINCODE' and LovCode eq '"+postalCode+"'";
		var that=this;
		that.oDataModel.read(path,null,[],true,function(oData,oResponse){
			if(oData.results.length>0){
				for(var i=0;i<oData.results.length;i++){
					if(oData.results[i].LovType == "STATE"){
						state.removeAllItems();
						state.setSelectedKey(oData.results[i].LovCode);
						state.addItem(new sap.ui.core.Item({key:oData.results[i].LovCode, text:oData.results[i].RelatedLovName }));
						if(that.byId("idIconTabBar").getSelectedKey() === "agentDtls"){
							if(id!=="cmbAgentRefCity"){
								var address = (id == "cmbAgentPerCity")?"PermantAdd":"PresentAdd";
								that.changeAgentData(["Zzstate",oData.results[i].LovCode,address]);	
							}else if(id=="cmbAgentRefCity"){
								that.changeAgentData(["Zzstate",oData.results[i].LovCode,"","refAgent"]);
							}
						}
					}

				}
			}else{
				state.removeAllItems();
				state.setValue("");
			}
		},function(oData, oResponse){
			var msg = oData.response.statusText;
			sap.m.MessageBox.alert(msg, {
				icon  : sap.m.MessageBox.Icon.ERROR,                        
				title : "Error",
				actions: [sap.m.MessageBox.Action.OK]
			});
		});
	},
//	-------Address tab----------------------
	onChangePin : function(evt){
		var postalCode=this.getView().byId("inptPostalCde").getValue();
		var str = postalCode.replace(/[^0-9]/g, '');
		this.getView().byId("inptPostalCde").setValue(str);
		if(postalCode == "" || postalCode.length <6){
			this.getView().byId("cmbCity").setValue("");
			this.getView().byId("cmbCity").clearSelection();
			this.getView().byId("cmbCity").setEnabled(false);
			this.getView().byId("inptAreaLoc").setValue("");
			this.getView().byId("inptAreaLoc").clearSelection();
			this.getView().byId("inptAreaLoc").destroyItems();
			this.getView().byId("cmbDistrct").setValue("");
			this.getView().byId("cmbDistrct").clearSelection();
			this.getView().byId("cmbDistrct").destroyItems();
			this.byId("cmbState").setValue("");
			this.byId("cmbState").destroyItems();
			return "";
		}else if(postalCode.length == 6){
			this._globalinfoSys(postalCode,"cmbCity");
			this._onChangePinState(postalCode,this.byId("cmbState"));
			if(evt !=undefined){
				this.getView().byId("cmbCity").setEnabled(true);
			}

		}

	},
	onCityChange : function(evt){
		var cityKey=this.byId("cmbCity").getSelectedKey();
		var city=this.byId("cmbCity").getValue();
		if(evt !=undefined){
			this.objSaveData["City"]=city;
			this.objSaveData["City_X"]="X";
			this.objSaveData["CityId"]=cityKey;
			this.objSaveData["CityId_X"]="X";
		}
		this.getView().byId("inptAreaLoc").setValue("");
		this.getView().byId("cmbDistrct").setValue("");
		this._cityChange(cityKey);
		if(this.byId("idIconTabBar").getSelectedKey() === "cnctDtls" &&  com.ril.PRMS.POPupValiDation!=undefined && com.ril.PRMS.POPupValiDation == "X"){
			this.setLongitude_Latitude();
		}
		this.clearCityDependent();
		this.onChangeState(evt);
	},
	//---------Ref--Dealer-------------
	onChangeLocPin : function(evt){
		var postalCode=this.getView().byId("inpLocRefPin").getValue();
		var str = postalCode.replace(/[^0-9]/g, '');
		this.getView().byId("inpLocRefPin").setValue(str);
		if(postalCode == "" || postalCode.length <6){
			this.getView().byId("cmbLocCity").setValue("");
			this.getView().byId("cmbLocCity").clearSelection();
			this.getView().byId("cmbLocCity").destroyItems();
			this.getView().byId("cmbLocCity").setEnabled(false);
			this.getView().byId("inpLocRefAL").setValue("");
			this.getView().byId("inpLocRefAL").clearSelection();
			this.getView().byId("inpLocRefAL").destroyItems();
			this.getView().byId("cmbDistrict").setValue("");
			this.getView().byId("cmbDistrict").clearSelection();
			this.getView().byId("cmbDistrict").destroyItems();
			this.byId("cmbRefState").setValue("");
			this.byId("cmbRefState").destroyItems();
		}else if(postalCode.length == 6){
			this.getView().byId("cmbLocCity").setEnabled(true);
			this._globalinfoSys(postalCode,"cmbLocCity");
			this._onChangePinState(postalCode,this.byId("cmbRefState"));
			if(evt !=undefined){
				this.getView().byId("cmbLocCity").setEnabled(true);
			}
		}
	},
	onLocCityChange : function(){
		this.getView().byId("inpLocRefAL").setValue("");
		this.getView().byId("inpLocRefAL").clearSelection();
		this.getView().byId("cmbDistrict").setValue("");
		this.getView().byId("cmbDistrict").clearSelection();
		var cityKey=this.byId("cmbLocCity").getSelectedKey();
		this._cityChange(cityKey);
	},
	//---------Agent--PresentAdd-------------
	onChangePinPresentAdd : function(e){
		var postalCode=this.getView().byId("inpAgentPrePin").getValue();
		var str = postalCode.replace(/[^0-9]/g, '');
		this.getView().byId("inpAgentPrePin").setValue(str);
		if(postalCode == "" || postalCode.length <6){
			this.getView().byId("cmbAgentPreCity").setValue("");
			this.getView().byId("cmbAgentPreCity").clearSelection();
			this.getView().byId("cmbAgentPreCity").destroyItems();
			this.getView().byId("cmbAgentPreCity").setEnabled(false);
			this.getView().byId("inpAgentPreArea").setValue("");
			this.getView().byId("inpAgentPreArea").clearSelection();
			this.getView().byId("inpAgentPreArea").destroyItems();
			this.getView().byId("inpAgentPreDist").setValue("");
			this.getView().byId("inpAgentPreDist").clearSelection();
			this.getView().byId("inpAgentPreDist").destroyItems();
			/* changed by linga on Oct 19, 2016 at 3:31:41 PM */
			var array = [["Zzlocation","","PresentAdd"],
			             ["Zzcity","","PresentAdd"],
			             ["Zzdistrict","","PresentAdd"]];
			for(var i=0;i<array.length;i++){
				this.changeAgentData(array[i]);
			}
		}else if(postalCode.length == 6){
			this.getView().byId("cmbAgentPreCity").setEnabled(true); 
			this._globalinfoSys(postalCode,"cmbAgentPreCity");
			this._onChangePinState(postalCode,this.byId("cmbAgentPreState"),"cmbAgentPreCity");
			if(this.byId("idIconTabBar").getSelectedKey() === "agentDtls"){
				this.changeAgentData(this.getProperty(e));
			}
		}
	},
	onAgentPreCityChange : function(e){
		this.getView().byId("inpAgentPreArea").setValue("");
		this.getView().byId("inpAgentPreArea").clearSelection();
		this.getView().byId("inpAgentPreDist").setValue("");
		this.getView().byId("inpAgentPreDist").clearSelection();
		var cityKey=this.byId("cmbAgentPreCity").getSelectedKey();
		this._cityChange(cityKey);
		if(this.byId("idIconTabBar").getSelectedKey() === "agentDtls"){
			this.changeAgentData(this.getProperty(e));
		}
	},
	//---------Agent--PerAdd-------------
	onChangePinAgentPer : function(e){
		var postalCode=this.getView().byId("inpAgentPerPin").getValue();
		var str = postalCode.replace(/[^0-9]/g, '');
		this.getView().byId("inpAgentPerPin").setValue(str);
		if(postalCode == "" || postalCode.length <6){
			this.getView().byId("cmbAgentPerCity").setValue("");
			this.getView().byId("cmbAgentPerCity").clearSelection();
			this.getView().byId("cmbAgentPerCity").destroyItems();
			this.getView().byId("cmbAgentPerCity").setEnabled(false);
			this.getView().byId("inpAgentPerArea").setValue("");
			this.getView().byId("inpAgentPerArea").clearSelection();
			this.getView().byId("inpAgentPerArea").destroyItems();
			this.getView().byId("inpAgentPerDist").setValue("");
			this.getView().byId("inpAgentPerDist").clearSelection();
			this.getView().byId("inpAgentPerDist").destroyItems();
			/* changed by linga on Oct 19, 2016 at 3:34:01 PM */
			var array = [["Zzlocation","","PermantAdd"],
			             ["Zzcity","","PermantAdd"],
			             ["Zzdistrict","","PermantAdd"]];
			for(var i=0;i<array.length;i++){
				this.changeAgentData(array[i]);
			}
		}else if(postalCode.length == 6){
			this.getView().byId("cmbAgentPerCity").setEnabled(true);
			if(this.byId("idIconTabBar").getSelectedKey() === "agentDtls"){
				this.changeAgentData(this.getProperty(e));
			}
			this._globalinfoSys(postalCode,"cmbAgentPerCity");
			this._onChangePinState(postalCode,this.byId("cmbAgentPerState"),"cmbAgentPerCity");
		}
	},
	onAgentPerCityChange : function(){
		this.getView().byId("inpAgentPerArea").setValue("");
		this.getView().byId("inpAgentPerArea").clearSelection();
		this.getView().byId("inpAgentPerDist").setValue("");
		this.getView().byId("inpAgentPerDist").clearSelection();
		var cityKey=this.byId("cmbAgentPerCity").getSelectedKey();
		this._cityChange(cityKey);
	},
	//---------Agent--RefAdd-------------
	onChangeRefPin : function(e){
		var postalCode=this.getView().byId("inpAgentRefPin").getValue();
		var str = postalCode.replace(/[^0-9]/g, '');
		this.getView().byId("inpAgentRefPin").setValue(str);
		
		var array = [["Zzlocation","","","","refAgent"],
		             ["Zzcity","","","","refAgent"],
		             ["Zzdistrict","","","","refAgent"]];
		for(var i=0;i<array.length;i++){
			this.changeAgentData(array[i]);
		}
		if(postalCode == "" || postalCode.length <6){
			this.getView().byId("cmbAgentRefCity").setValue("");
			this.getView().byId("cmbAgentRefCity").clearSelection();
			this.getView().byId("cmbAgentRefCity").destroyItems();
			this.getView().byId("cmbAgentRefCity").setEnabled(false);
			this.getView().byId("inpAgentRefArea").setValue("");
			this.getView().byId("inpAgentRefArea").clearSelection();
			this.getView().byId("inpAgentRefArea").destroyItems();
			this.getView().byId("inpAgentRefDist").setValue("");
			this.getView().byId("inpAgentRefDist").clearSelection();
			this.getView().byId("inpAgentRefDist").destroyItems();
			/* changed by linga on Oct 19, 2016 at 3:30:07 PM */
			/*var array = [["Zzlocation","","","","refAgent"],
			             ["Zzcity","","","","refAgent"],
			             ["Zzdistrict","","","","refAgent"]];
			for(var i=0;i<array.length;i++){
				this.changeAgentData(array[i]);
			}*/
			
		}else if(postalCode.length == 6){
			
			this.getView().byId("cmbAgentRefCity").setEnabled(true);
			if(this.byId("idIconTabBar").getSelectedKey() === "agentDtls"){
				this.changeAgentData(this.getProperty(e));
			}
			this._globalinfoSys(postalCode,"cmbAgentRefCity");
			this._onChangePinState(postalCode,this.byId("cmbAgentPerState"),"cmbAgentRefCity");
		}
	},
	onAgentRefCityChange : function(){
		this.getView().byId("inpAgentRefArea").setValue("");
		this.getView().byId("inpAgentRefArea").clearSelection();
		this.getView().byId("inpAgentRefDist").setValue("");
		this.getView().byId("inpAgentRefDist").clearSelection();
		var cityKey=this.byId("cmbAgentRefCity").getSelectedKey();
		this._cityChange(cityKey);
	},
	_cityChange: function(cityKey){
		var that=this;
		var path="/LookUpHierValueSet?$filter=LovType eq 'DISTRICT' and PagingSize eq 100 and OffsetValue eq 1 and ParentLovTyp eq 'CITY' and LovCode eq '"+cityKey+"'";
		that.oDataModel.read(path,null,[],true,function(oData,oResponse){
			var jsonDistrct=new sap.ui.model.json.JSONModel(oData);
			that.getView().setModel(jsonDistrct,"jsonDstrct");
		},function(oData, oResponse){
			var msg = oData.response.statusText;
			sap.m.MessageBox.alert(msg, {
				icon  : sap.m.MessageBox.Icon.ERROR,                        
				title : "Error",
				actions: [sap.m.MessageBox.Action.OK]
			});
		});
		var path="/LookUpHierValueSet?$filter=LovType eq 'LOCALITY' and PagingSize eq 100 and OffsetValue eq 1 and ParentLovTyp eq 'CITY' and LovCode eq '"+cityKey+"'";
		that.oDataModel.read(path,null,[],true,function(oData,oResponse){
			var jsonLocality=new sap.ui.model.json.JSONModel(oData);
			jsonLocality.setSizeLimit(10000);
			that.getView().setModel(jsonLocality,"jsonLocality");
		},function(oData, oResponse){
			var msg = oData.response.statusText;
			sap.m.MessageBox.alert(msg, {
				icon  : sap.m.MessageBox.Icon.ERROR,                        
				title : "Error",
				actions: [sap.m.MessageBox.Action.OK]
			});
		});
	},
	/* added  by linga on Oct 25, 2016 at 1:51:15 PM */
	fullScreen:function(e){
		var button = this.byId("fullscreenButton");
		var page = button.getParent().getParent().getParent().getParent().getParent();
		//if(!button.getPressed()){
		if(e.oSource.sId.indexOf("idEditButon")>0){
		page.setMode(sap.m.SplitAppMode.HideMode);
		button.setIcon("sap-icon://exit-full-screen");
		button.setPressed(true);
		this.getView().byId("inptJioMnyCmsonMbleNmbr").setWidth("93%"); 
		this.getView().byId("inptmobileNo").setWidth("335px");
		this.getView().byId("cmbAlterMbno").setWidth("335px");
		this.getView().byId("inpComptMobleNo").setWidth("290px"); 
		//this.getView().byId("inpStaticCode2").setWidth("200px"); 
		this.getView().byId("inpFaxedLneNo").setWidth("245px");
		}else{
		page.setMode(sap.m.SplitAppMode.ShowHideMode);
		button.setIcon("sap-icon://full-screen");
		button.setPressed(false);
		this.getView().byId("inptJioMnyCmsonMbleNmbr").setWidth("118px");
		this.getView().byId("inptmobileNo").setWidth("240px");
		this.getView().byId("cmbAlterMbno").setWidth("240px");
		this.getView().byId("inpComptMobleNo").setWidth("118px");
		this.getView().byId("inpComptMobleNo").setWidth("195px");
		this.getView().byId("inpFaxedLneNo").setWidth("150px");
		}
		},

	
	//Edit Information
	onEditPress:function(oEvt){
		//this.addChars = [];
		this.fullScreen(oEvt);
		this.editIndForTables= true;
		com.ril.PRMS.POPupValiDation="X";
		com.ril.PRMS.InDeX=com.ril.PRMS.LISt_iD.indexOfItem(com.ril.PRMS.list_IteM);
		var  oView = this.getView(); 
		this.saveCancel="show";
		oView.byId("idEditButon").setVisible(false);
		oView.byId("idHold").setVisible(false);
		oView.byId("idAccept").setVisible(false);
		this.byId("btnApprove").setVisible(false);
		this.byId("btnReject").setVisible(false);
		oView.byId("idEditSave").setVisible(true);
		oView.byId("idEditCancel").setVisible(true);
		this.buttonFlag = 1;
		this.editSaveValues();
		var taxTable=this.getView().byId("taxTable");
		var taxItem=taxTable.getItems();
		for(var i=0;i<taxItem.length;i++){
			taxTable.getItems()[i].mAggregations.cells[2].setEnabled(true);
			taxTable.getItems()[i].mAggregations.cells[3].setEnabled(true);
			taxTable.getItems()[i].mAggregations.cells[4].setEnabled(true);
			taxTable.getItems()[i].mAggregations.cells[5].setEnabled(true);
			taxTable.getItems()[i].mAggregations.cells[6].setEnabled(true);
		}
		var prfTable=this.getView().byId("proofTable");
		var prfITems=prfTable.getItems();
		for(var j=0;j<prfITems.length;j++){
			prfTable.getItems()[j].mAggregations.cells[2].setEnabled(true);
			prfTable.getItems()[j].mAggregations.cells[3].setEnabled(true);
			prfTable.getItems()[j].mAggregations.cells[4].setEnabled(true);
			prfTable.getItems()[j].mAggregations.cells[5].setEnabled(true);
			prfTable.getItems()[j].mAggregations.cells[6].setEnabled(true);

		}
		var busTypeTable = this.byId("busTypeTab");
		busTypeTable.setMode("Delete");
		this.byId("busTypeBtAdd").setVisible(true);
		for(var k=0;k<busTypeTable.getItems().length;k++){
			busTypeTable.getItems()[k].mAggregations.cells[0].setEnabled(true);
			busTypeTable.getItems()[k].mAggregations.cells[1].setEnabled(true);
			busTypeTable.getItems()[k].mAggregations.cells[2].setEnabled(true);
			busTypeTable.getItems()[k].mAggregations.cells[3].setEnabled(true);
			busTypeTable.getItems()[k].mAggregations.cells[4].setEnabled(true);
			busTypeTable.getItems()[k].mAggregations.cells[5].setEnabled(true);
			busTypeTable.getItems()[k].mAggregations.cells[6].setEnabled(true);
			busTypeTable.getItems()[k].mAggregations.cells[7].setEnabled(true);
			busTypeTable.getItems()[k].mAggregations.cells[8].setEnabled(true);
			busTypeTable.getItems()[k].mAggregations.cells[9].setEnabled(true);
		}
		var agntTablePrf = this.byId("agent_Details_proofTable");
		var agntTbleITem=agntTablePrf.getItems().length;
		for(var ap=0;ap<agntTbleITem;ap++){
			agntTablePrf.getItems()[ap].mAggregations.cells[2].setEnabled(true);
			agntTablePrf.getItems()[ap].mAggregations.cells[3].setEnabled(true);
			agntTablePrf.getItems()[ap].mAggregations.cells[4].setEnabled(true);
			agntTablePrf.getItems()[ap].mAggregations.cells[5].setEnabled(true);
			agntTablePrf.getItems()[ap].mAggregations.cells[6].setEnabled(true);
		}
		var salesTable = this.byId("salesTab");
		salesTable.setMode("Delete");
		this.byId("btSalestab").setVisible(true);
		for(var l=0;l<salesTable.getItems().length;l++){
			salesTable.getItems()[l].mAggregations.cells[0].setEnabled(true);
			salesTable.getItems()[l].mAggregations.cells[1].setEnabled(true);
			salesTable.getItems()[l].mAggregations.cells[2].setEnabled(true);
		}
		//*****************sales details-Connectivity*****************
		var salesTableConnectivity = this.byId("deviceTab");
		salesTableConnectivity.setMode("Delete");
		this.byId("btSalestabConnectivity").setVisible(true);
		for(var l=0;l<salesTableConnectivity.getItems().length;l++){
			salesTableConnectivity.getItems()[l].mAggregations.cells[0].setEnabled(true);
			salesTableConnectivity.getItems()[l].mAggregations.cells[1].setEnabled(true);
			salesTableConnectivity.getItems()[l].mAggregations.cells[2].setEnabled(true);
		}
		var doctablelength= this.byId("UploadTable1").getItems().length;
		if(doctablelength > 0){
		}
		else{
			this.byId("UploadTable1").setMode("None");
		}
		this.onundoEdit("true");
		var doctablelength= this.byId("UploadTable1").getItems().length;
		if(doctablelength > 0){
		}
		else{
			this.byId("UploadTable1").setMode("None");
		}
		this.byId("comboName").setEnabled(false);
		this.byId("DocumentFileUpload").setEnabled(false);
		this.byId("iddocumentuploadbtn").setEnabled(false);
		this.byId("AgentUploadButton").setEnabled(false);
		//For agent upload tab visibility--------------------------
		this.byId("AgentcomboName").setEnabled(false);
		this.byId("AgentFileUpload").setEnabled(false);
		this.byId("AgentUploadButton").setEnabled(false);
		var doctablelength= this.byId("UploadTable2").getItems().length;
		if(doctablelength > 0){
		}
		else{
			this.byId("UploadTable2").setMode("None");
		}
		this.onloadAgentUploadData();
	},
	onundoEdit: function(value){
		if(value=="false"){
			 value=false;
		}else if(value=="true"){
			value=true;
		}
		var  oView = this.getView(); 
		//----Profile--------------------------
		var HqDet = oView.byId("tabLocation").getVisible();
		if(HqDet == true){
			//oView.byId("inptCompNamePftb2").setEnabled(value);
			oView.byId("inptAliasNamePftb2").setEnabled(value);
			//oView.byId("cmbRelationTypePftb2").setEnabled(value);
			//oView.byId("cmbRelationSubTypePftb2").setEnabled(value);
			//oView.byId("cmbLocationTypePftb2").setEnabled(value);
			//oView.byId("cmbLocationSubTypePftb2").setEditable(value);
			oView.byId("cmbSegmentPftb2").setEditable(value);
			oView.byId("AttrHQSimpleForm").setEditable(value);
			oView.byId("HQDetailsform").setVisible(false);
			oView.byId("cmbSegmentTypePftb2").setEditable(value);
			oView.byId("cmbSegmentValuePftb2").setEditable(value);
			oView.byId("cmbOccpnyTyp").setVisible(false);
			oView.byId("cmbOffcSpce").setVisible(false);
			oView.byId("cmbfotfall").setVisible(true);
			oView.byId("labelShopfrntSpce").setVisible(true);
			oView.byId("titleBankDetails").setText("");
			oView.byId("labelScutyAmtRs").setVisible(false);
			oView.byId("inptSecrtyAmnt").setVisible(false);
			oView.byId("labelAccountHldrName").setVisible(false);
			oView.byId("inptAccountHldrName").setVisible(false);
			oView.byId("labelAccountNo").setVisible(false);
			oView.byId("inputAccountNo").setVisible(false);
			oView.byId("labelBankName").setVisible(false);
			oView.byId("inptBankName").setVisible(false);
			oView.byId("labelBranchName").setVisible(false);
			oView.byId("inptBranchName").setVisible(false);
			oView.byId("labelIfcCode").setVisible(false);
			oView.byId("inptIfcCode").setVisible(false);
			oView.byId("AttrHQSimpleForm").setVisible(false);
			oView.byId("AttributeSimpleform").setVisible(true);
			oView.byId("inptCafPckup").setEnabled(value);
			//oView.byId("inptfosAgnt").setEnabled(value);
		}else{
			oView.byId("cmbOwnrTyp").setEnabled(value);
			//oView.byId("inptCompName").setEnabled(value);
			oView.byId("inptAliasName").setEnabled(value);
			//oView.byId("cmbRelationType").setEnabled(value);
			//oView.byId("cmbRelationSubType").setEnabled(value);
		//	oView.byId("cmbLocationType").setEnabled(value);
		//	oView.byId("cmbLocationSubType").setEnabled(value);
			oView.byId("cmbSegment").setEnabled(value);
			oView.byId("dtePickrDateofIncrption").setEnabled(value);
			oView.byId("cmbSegmenttype").setEnabled(value);
			oView.byId("cmbSegmentValue").setEnabled(value);
			oView.byId("HQDetailsform").setVisible(true);
			oView.byId("cmbOccpnyTyp").setVisible(true);
			oView.byId("cmbOffcSpce").setVisible(true);
			oView.byId("titleBankDetails").setText("Bank Details");
			oView.byId("labelScutyAmtRs").setVisible(true);
			oView.byId("inptSecrtyAmnt").setVisible(true);
			oView.byId("labelAccountHldrName").setVisible(true);
			oView.byId("inptAccountHldrName").setVisible(true);
			oView.byId("labelAccountNo").setVisible(true);
			oView.byId("inputAccountNo").setVisible(true);
			oView.byId("labelBankName").setVisible(true);
			oView.byId("inptBankName").setVisible(true);
			oView.byId("labelBranchName").setVisible(true);
			oView.byId("inptBranchName").setVisible(true);
			oView.byId("labelIfcCode").setVisible(true);
			oView.byId("inptIfcCode").setVisible(true);
			//-------------Profile--------------------------------/
			/*oView.byId("inptParentPrtnrDvc").setEnabled(value);
			oView.byId("inptParentPrtnrSrvc").setEnabled(value);*/
			oView.byId("inptCafPckup").setEnabled(value);
		//	oView.byId("inptfosAgnt").setEnabled(value);

		}
		oView.byId("inpComptMobleNo").setEnabled(value);
		oView.byId("inpFaxedLneNo").setEnabled(value);
		oView.byId("inpSTDCode").setEnabled(value);
		oView.byId("inptCompEmail").setEnabled(value);
		oView.byId("inptCompWebsite").setEnabled(value);
		/*oView.byId("cmbR4GState").setEnabled(value);
		oView.byId("cmbDelvryCntr").setEnabled(value);
		oView.byId("cmbCircle").setEnabled(value);
		oView.byId("cmbR4GArea").setEnabled(value);
		oView.byId("cmbJiocenter").setEnabled(value);*/
		oView.byId("inptCafPckup").setEnabled(value);
		//oView.byId("inptfosAgnt").setEnabled(value);
		//-------------Adress--------------------------------/
		oView.byId("inptcoName").setEditable(value);
		oView.byId("inptHouseno").setEnabled(value);
		oView.byId("inptBuldngno").setEditable(value);
		oView.byId("inptSocnname").setEditable(value);
		oView.byId("inptStreet").setEnabled(value);
		oView.byId("inptAreaLoc").setEnabled(value);
		oView.byId("inptlandmark").setEnabled(value);
		oView.byId("inptSubLclty").setEnabled(value);
		oView.byId("inptPostalCde").setEnabled(value);
		oView.byId("cmbCity").setEnabled(value);
		oView.byId("inptAddrCityId").setEnabled(value);
		oView.byId("cmbDistrct").setEnabled(value);
		oView.byId("cmbState").setEnabled(value);
		//oView.byId("cmbCountry").setEnabled(value);
		oView.byId("cmbStrtWkngDay").setEnabled(value);
		oView.byId("dpStratTime").setEnabled(value);
		oView.byId("cmbEndWkngDay").setEnabled(value);
		oView.byId("dpEndTime").setEnabled(value);
		oView.byId("cmbChannelFinanced").setEnabled(value);
		oView.byId("inputCreditLimt").setEnabled(value);
		oView.byId("DtpSantionDate").setEnabled(value);
		oView.byId("DtpExpiryDate").setEnabled(value);
		oView.byId("inpBankName").setEnabled(value);
		oView.byId("inpCrdPerid").setEnabled(value);
		//------Identifiers-------------------------
		oView.byId("btnTaxTabAdd").setVisible(value);
		oView.byId("btnProofTab").setVisible(value);
		var visAdd = oView.byId("btnTaxTabAdd").getVisible();
		if(visAdd == true){
			oView.byId("taxTable").setMode("Delete");
			oView.byId("proofTable").setMode("Delete");
			oView.byId("agent_Details_proofTable").setMode("Delete");
		}else{
			oView.byId("taxTable").setMode("None");
			oView.byId("proofTable").setMode("None");
			oView.byId("agent_Details_proofTable").setMode("None");
		}
		
		//done by mahesh
		
		oView.byId("busTypeBtAdd").setEnabled(value);
		oView.byId("btnTaxTabAdd").setEnabled(value);
		oView.byId("btnProofTab").setEnabled(value);
		
		//---------------------Attributes---------------------------
		oView.byId("cmbOccpnyTyp").setEnabled(value);
		oView.byId("cmbOffcSpce").setEnabled(value);
		oView.byId("cmbLoctonInsurd").setEnabled(value);
		oView.byId("cmbLoctonInsurdnew").setEnabled(value);
		oView.byId("cmbfotfall").setEnabled(value);
		oView.byId("cmbshpfrntSpce").setEnabled(value);
		oView.byId("cmbPcsLap").setEnabled(value);
		oView.byId("cmbPrntrScnrs").setEnabled(value);
		oView.byId("inptFullTmeEmploys").setEnabled(value);
		oView.byId("AgentDssNme").setEnabled(value);
		oView.byId("inpNoofVehicles").setEnabled(value);
		oView.byId("cmbCntBnkEndStf").setEnabled(value);
		oView.byId("cmbTotlMnpwrStrngt").setEnabled(value);
		oView.byId("cmbCntofFsStf").setEnabled(value);
		oView.byId("cmbSprvsonSlesStf").setEnabled(value);
		oView.byId("cmbCntofFrntEdStf").setEnabled(value);
		oView.byId("AgentCombodss").setEnabled(value);
		oView.byId("AgentlocCombo").setEnabled(value);
		oView.byId("AgentlocComboOwnership").setEnabled(value);
		oView.byId("inptAccountHldrName").setEnabled(value);
		oView.byId("inputAccountNo").setEnabled(value);
		oView.byId("inptBankName").setEnabled(value);
		oView.byId("inptBranchName").setEnabled(value);
		oView.byId("inptIfcCode").setEnabled(value);
		oView.byId("cmbSurtyType").setEnabled(value);
		oView.byId("inptScurtyInstrmntDtls").setEnabled(value);
		oView.byId("DtpckScurtyStrtDte").setEnabled(value);
		oView.byId("DtpckScurtyEndDte").setEnabled(value);
		oView.byId("cmbPayoutMedia").setEnabled(value);
		oView.byId("inptSecrtyAmnt").setEnabled(value);
		oView.byId("inpSYear").setEnabled(value);
		oView.byId("inptAnnulTrnovr").setEnabled(value);
		oView.byId("inputAnulPrft").setEnabled(value);
		oView.byId("inptYear2").setEnabled(value);
		oView.byId("inptIfcCode").setEnabled(value);
		oView.byId("inptAnnulTrnovr2").setEnabled(value);
		oView.byId("inputAnulPrft2").setEnabled(value);
		oView.byId("datePickrStartContract").setEnabled(value);
		oView.byId("datePickrEndContract").setEnabled(value);
		oView.byId("cmbfotfall").setVisible(true);
		oView.byId("cmbSrvcAra").setEnabled(value);
		oView.byId("cmbAreaServc").setEnabled(value);
		oView.byId("cmbShpServ").setEnabled(value);
		oView.byId("inptServcName").setEnabled(value);
		oView.byId("cmbQualfcton").setEnabled(value);
		//--Jio Money
		oView.byId("cmbJioMnyCmson").setEnabled(value);
		oView.byId("cmbJioMnystlmntFreq").setEnabled(value);
		oView.byId("cmbEnbleTIP").setEnabled(value);
		oView.byId("cmbBusnsChnl").setEnabled(value);
		oView.byId("inptJioMnyCmsonMbleNmbr").setEnabled(value);
		oView.byId("cmbDlyTrncCnt").setEnabled(value);
		oView.byId("cmbDlyRvnuINR").setEnabled(value);
		oView.byId("cmbPymntAccptTyp").setEnabled(value);
		oView.byId("cmbRtrnPolcy").setEnabled(value);
		oView.byId("cmbStleDtls").setEnabled(value);
		oView.byId("cmbLnsBusnssId").setEnabled(value);
		oView.byId("cmbLnsBusnssDesc").setEnabled(value);
		oView.byId("cmbYrsBusns").setEnabled(value);
		//--Online fulfillment
		oView.byId("cmbOnlneFulmnt").setEnabled(value);
		oView.byId("inptDlverByNme").setEnabled(value);
		oView.byId("cmbDlvryQual").setEnabled(value);
		//----- Local Refference-------------------------------
		oView.byId("inpLocRefID").setEnabled(value);
		oView.byId("inpLocRefFname").setEnabled(value);
		oView.byId("inpLocRefMname").setEnabled(value);
		oView.byId("inpLocRefLname").setEnabled(value);
		oView.byId("inpLocRefOrg").setEnabled(value);
		oView.byId("inpLocRefDesg").setEnabled(value);
		oView.byId("inpLocRefAdd1").setEnabled(value);
		oView.byId("inpLocRefAL").setEnabled(value);
		oView.byId("inpLocRefSubLoc").setEnabled(value);
		oView.byId("inpLocRefAdd2").setEnabled(value);
		oView.byId("inpLocRefAdd3").setEnabled(value);
		oView.byId("inpLocRefPin").setEnabled(value);
		oView.byId("cmbLocCity").setEnabled(value);
		oView.byId("cmbDistrict").setEnabled(value);
		oView.byId("cmbRefState").setEnabled(value);
		//oView.byId("cmbRefCountry").setEnabled(value);
		oView.byId("inpLocRefMob").setEnabled(value);
		oView.byId("inpLocRefEmail").setEnabled(value);

		//-----Agent Details-------------------
		
		
		var agentIndicator = value ? (this.agentNameModel && this.agentNameModel.oData && this.agentNameModel.oData.length>0 ? value :!value):value;
		
		oView.byId("cmbSaluton").setEnabled(agentIndicator);
		oView.byId("fname").setEnabled(agentIndicator);
		oView.byId("mName").setEnabled(agentIndicator);
		oView.byId("lName").setEnabled(agentIndicator);
		oView.byId("cmbGender").setEnabled(agentIndicator);
		oView.byId("datePickrbirthday").setEnabled(agentIndicator);
		oView.byId("cmbJobFnctn").setEnabled(agentIndicator);
		oView.byId("dpDOJ").setEnabled(agentIndicator);
		oView.byId("cmbQualification").setEnabled(agentIndicator);
		oView.byId("cmbIndustry").setEnabled(agentIndicator);
		oView.byId("inpYoExp").setEnabled(agentIndicator);
		oView.byId("cmbSecLanguage").setEnabled(agentIndicator);
		oView.byId("inptmobileNo").setEnabled(agentIndicator);
		oView.byId("cmbAlterMbno").setEnabled(agentIndicator);
		oView.byId("inptEmail").setEnabled(agentIndicator);
		oView.byId("cmbPref_lang").setEnabled(agentIndicator);
		oView.byId("cmbCom_pref").setEnabled(agentIndicator);
		oView.byId("ckBxPriAgent").setEnabled(agentIndicator);
		oView.byId("inptPRMID").setEnabled(agentIndicator);
		oView.byId("inptExtrnlID").setEnabled(agentIndicator);
		oView.byId("inptjobDescr").setEnabled(agentIndicator);
		oView.byId("agentBtAdd").setVisible(agentIndicator);
		oView.byId("AgentCategoryCombo").setVisible(agentIndicator);
		oView.byId("AgentcomboName").setVisible(agentIndicator);
		oView.byId("AgentFileUpload").setVisible(agentIndicator);
		oView.byId("PanelAgentDocUpload").setVisible(agentIndicator);
		//----Agent Address------------------------
		oView.byId("inpAgentPreAdd1").setEnabled(agentIndicator);
		oView.byId("inpAgentPreArea").setEnabled(agentIndicator);
		oView.byId("inpAgentPreSub").setEnabled(agentIndicator);
		oView.byId("inpAgentPreAdd2").setEnabled(agentIndicator);
		oView.byId("inpAgentPreAdd3").setEnabled(agentIndicator);
		oView.byId("inpAgentPrePin").setEnabled(agentIndicator);
		oView.byId("cmbAgentPreCity").setEnabled(agentIndicator);
		oView.byId("inpAgentPreDist").setEnabled(agentIndicator);
		oView.byId("cmbAgentPreState").setEnabled(agentIndicator);
		//oView.byId("cmbAgentPreCountry").setEnabled(agentIndicator);
		oView.byId("inpAgentPerAdd1").setEnabled(agentIndicator);
		oView.byId("inpAgentPerArea").setEnabled(agentIndicator);
		oView.byId("inpAgentPerSub").setEnabled(agentIndicator);
		oView.byId("inpAgentPerAdd2").setEnabled(agentIndicator);
		oView.byId("inpAgentPerAdd3").setEnabled(agentIndicator);
		oView.byId("inpAgentPerPin").setEnabled(agentIndicator);
		oView.byId("cmbAgentPerCity").setEnabled(agentIndicator);
		oView.byId("inpAgentPerDist").setEnabled(agentIndicator);
		oView.byId("cmbAgentPerState").setEnabled(agentIndicator);
		//	oView.byId("cmbAgentPerCount").setEnabled(agentIndicator);
		//------------------Ref.Agent-----------------------------
		oView.byId("inpAgentRefFname").setEnabled(agentIndicator);
		oView.byId("inpAgentRefMname").setEnabled(agentIndicator);
		oView.byId("inpAgentRefLname").setEnabled(agentIndicator);
		oView.byId("inpAgentRefCompName").setEnabled(agentIndicator);
		oView.byId("inpAgentRefDesg").setEnabled(agentIndicator);
		oView.byId("inpAgentRefAdd1").setEnabled(agentIndicator);
		oView.byId("inpAgentRefArea").setEnabled(agentIndicator);
		oView.byId("inpAgentRefSubLoc").setEnabled(agentIndicator);
		oView.byId("inpAgentRefAdd2").setEnabled(agentIndicator);
		oView.byId("inpAgentRefAdd3").setEnabled(agentIndicator);
		oView.byId("inpAgentRefPin").setEnabled(agentIndicator);
		oView.byId("cmbAgentRefCity").setEnabled(agentIndicator);
		oView.byId("inpAgentRefDist").setEnabled(agentIndicator);
		oView.byId("cmbAgentRefState").setEnabled(agentIndicator);
		//oView.byId("cmdAgentRefCountry").setEnabled(agentIndicator);
		oView.byId("inpAgentRefContact").setEnabled(agentIndicator);
		oView.byId("inpAgentRefEmail").setEnabled(agentIndicator);
		
		
		
		
		//----Documents tab visisbility------------------------
		oView.byId("combo1").setVisible(value);
		oView.byId("comboName").setVisible(value);
		oView.byId("DocumentFileUpload").setVisible(value);
		oView.byId("iddocumentuploadbtn").setVisible(value);
		oView.byId("AgentUploadButton").setVisible(value);
	},
	emptyValue: function(){
		var oView=this.getView();
		//----Agent Address------------------------
		oView.byId("cbAgents").setSelectedKey("");
		oView.byId("cbAgents").setValue("");
		oView.byId("inpAgentPreAdd1").setValue("");
		oView.byId("inpAgentPreArea").setValue("");
		oView.byId("inpAgentPreSub").setValue("");
		oView.byId("inpAgentPreAdd2").setValue("");
		oView.byId("inpAgentPreAdd3").setValue("");
		oView.byId("inpAgentPrePin").setValue("");
		oView.byId("inpAgentPreDist").setValue("");
		oView.byId("cmbAgentPreState").setSelectedKey("");
		oView.byId("cmbAgentPreState").setValue("");
		oView.byId("cmbAgentPreCountry").setSelectedKey("");
		oView.byId("cmbAgentPreCountry").setValue("");
		oView.byId("inpAgentPerAdd1").setValue("");
		oView.byId("inpAgentPerArea").setValue("");
		oView.byId("inpAgentPerSub").setValue("");
		oView.byId("inpAgentPerAdd2").setValue("");
		oView.byId("inpAgentPerAdd3").setValue("");
		oView.byId("inpAgentPerPin").setValue("");
		oView.byId("inpAgentPerDist").setValue("");
		oView.byId("cmbAgentPerState").setSelectedKey("");
		oView.byId("cmbAgentPerState").setValue("");
		//oView.byId("cmbAgentPerCount").setSelectedKey("");
		oView.byId("cmbAgentPerCount").setValue("");
		//------------------Ref.Agent-----------------------------
		oView.byId("inpAgentRefFname").setValue("");
		oView.byId("inpAgentRefMname").setValue("");
		oView.byId("inpAgentRefLname").setValue("");
		oView.byId("inpAgentRefCompName").setValue("");
		oView.byId("inpAgentRefDesg").setValue("");
		oView.byId("inpAgentRefAdd1").setValue("");
		oView.byId("inpAgentRefArea").setValue("");
		oView.byId("inpAgentRefSubLoc").setValue("");
		oView.byId("inpAgentRefAdd2").setValue("");
		oView.byId("inpAgentRefAdd3").setValue("");
		oView.byId("inpAgentRefPin").setValue("");
		oView.byId("inpAgentRefDist").setValue("");
		oView.byId("cmbAgentRefState").setSelectedKey("");
		oView.byId("cmbAgentRefState").setValue("");
		//oView.byId("cmdAgentRefCountry").setSelectedKey("");
		oView.byId("cmdAgentRefCountry").setValue("");
		oView.byId("cmdAgentRefCountry").setSelectedKey("");
		oView.byId("inpAgentRefContact").setValue("");
		oView.byId("inpAgentRefEmail").setValue("");
//		/ProfileTab--------------------------//////////////////////////////////////////////////
		oView.byId("cmbOwnrTyp").setSelectedKey("");
		//oView.byId("inptCompName").setValue("");
		oView.byId("inptAliasName").setValue("");
		oView.byId("cmbRelationType").setSelectedKey("");
		oView.byId("cmbRelationSubType").setSelectedKey("");
		//oView.byId("cmbLocationType").setSelectedKey("");
	//	oView.byId("cmbLocationSubType").setSelectedKey("");
		oView.byId("dtePickrDateofIncrption").setValue("");
		oView.byId("cmbSegment").setSelectedKey("");
		oView.byId("cmbSegmentValuePftb2").setSelectedKey("");
		oView.byId("cmbSegmentTypePftb2").setSelectedKey("");
		oView.byId("cmbSegmentValue").setSelectedKey("");
		oView.byId("cmbSegmenttype").setSelectedKey("");
		oView.byId("multicbxPrdctGroup").setSelectedKeys("");
		oView.byId("mltcombxAssgndBussGroup").setSelectedKeys("");
		oView.byId("cmbR4GState").setSelectedKey("");
		oView.byId("cmbDelvryCntr").setSelectedKey("");
		oView.byId("cmbCircle").setSelectedKey("");
		oView.byId("cmbJiocenter").setSelectedKey("");
		oView.byId("cmbR4GArea").setSelectedKey("");
		oView.byId("inptParentPrtnrDvc").setValue("");
		oView.byId("inptParentPrtnrSrvc").setValue("");
		oView.byId("inptCafPckup").setSelectedKey("");
		oView.byId("inptfosAgnt").setSelectedKey("");
		//Addresstab----------------------------------------------//////////////////////////////////////////////////
		oView.byId("inptHouseno").setValue("");
		oView.byId("inptBuldngno").setValue("");
		oView.byId("inptSocnname").setValue("");
		oView.byId("inptStreet").setValue("");
		oView.byId("inptAreaLoc").setValue("");
		oView.byId("inptlandmark").setValue("");
		oView.byId("inptSubLclty").setValue("");
		oView.byId("inptPostalCde").setValue("");
		oView.byId("inptAddrCityId").setValue("");
		oView.byId("cmbDistrct").setValue("");
		oView.byId("cmbState").setSelectedKey("");
		oView.byId("cmbCountry").setSelectedKey("");
		oView.byId("inpComptMobleNo").setValue("");
		oView.byId("inpFaxedLneNo").setValue("");
		oView.byId("inpSTDCode").setValue("");
		oView.byId("inptCompEmail").setValue("");
		oView.byId("inptCompWebsite").setValue("");
		//Ref Dealer Tab--------------------------------------////////////////////////////////////////////////////////////////////
		oView.byId("inpLocRefID").setValue("");
		oView.byId("inpLocRefFname").setValue("");
		oView.byId("inpLocRefMname").setValue("");
		oView.byId("inpLocRefLname").setValue("");
		oView.byId("inpLocRefOrg").setValue("");
		oView.byId("inpLocRefDesg").setValue("");
		oView.byId("inpLocRefAdd1").setValue("");
		oView.byId("inpLocRefAL").setValue("");
		oView.byId("inpLocRefSubLoc").setValue("");
		oView.byId("inpLocRefAdd2").setValue("");
		oView.byId("inpLocRefAdd3").setValue("");
		oView.byId("inpLocRefPin").setValue("");
		oView.byId("cmbDistrict").setSelectedKey("");
		oView.byId("cmbRefState").setSelectedKey("");
		oView.byId("cmbRefCountry").setSelectedKey("");
		oView.byId("inpLocRefMob").setValue("");
		oView.byId("inpLocRefEmail").setValue("");
		//Agent Details---------------------------------//////////////////////////////////////////////////////////////////////////////
		oView.byId("cmbSaluton").setSelectedKey("");
		oView.byId("fname").setValue("");
		oView.byId("mName").setValue("");
		oView.byId("lName").setValue("");
		oView.byId("cmbGender").setSelectedKey("");
		oView.byId("datePickrbirthday").setValue("");
		oView.byId("cmbJobFnctn").setSelectedKey("");
		oView.byId("dpDOJ").setValue("");
		oView.byId("cmbQualification").setSelectedKey("");
		oView.byId("cmbIndustry").setSelectedKey("");
		oView.byId("inpYoExp").setValue("");
		oView.byId("cmbSecLanguage").setSelectedKey("");
		oView.byId("inptmobileNo").setValue("");
		oView.byId("cmbAlterMbno").setValue("");
		oView.byId("inptEmail").setValue("");
		oView.byId("ckBxPriAgent").setSelected(false);
		oView.byId("inptPRMID").setValue("");
		oView.byId("inptExtrnlID").setValue("");
		oView.byId("inptjobDescr").setValue("");
		///////////////////////Agent Details  /////////////////Present Address/////////////////////////////////////////////
		oView.byId("inpAgentPreAdd1").setValue("");
		oView.byId("inpAgentPreArea").setValue("");
		oView.byId("inpAgentPreSub").setValue("");
		oView.byId("inpAgentPreAdd2").setValue("");
		oView.byId("inpAgentPreAdd3").setValue("");
		oView.byId("inpAgentPrePin").setValue("");
		oView.byId("inpAgentPreDist").setValue("");
		oView.byId("cmbAgentPreState").setSelectedKey("");
		oView.byId("cmbAgentPreCountry").setSelectedKey("");
///////////////////////Agent Details  /////////////////Permanenet Address/////////////////////////////////////////////
		oView.byId("inpAgentPerAdd1").setValue("");
		oView.byId("inpAgentPerArea").setValue("");
		oView.byId("inpAgentPerSub").setValue("");
		oView.byId("inpAgentPerAdd2").setValue("");
		oView.byId("inpAgentPerAdd3").setValue("");
		oView.byId("inpAgentPerPin").setValue("");
		oView.byId("inpAgentPerDist").setValue("");
		oView.byId("cmbAgentPerState").setSelectedKey("");
		oView.byId("cmbAgentPerCount").setSelectedKey("");
		//------------------Proof table---------------
		oView.byId("agent_Details_proofTable").removeAllItems();
		//--------------------Agent Document------------------
		oView.byId("UploadTable2").removeAllItems();
		//Agent details//// Basicinfo--------------------------------------------------------------------
		oView.byId("inpAgentRefFname").setValue("");
		oView.byId("inpAgentRefMname").setValue("");
		oView.byId("inpAgentRefLname").setValue("");
		oView.byId("inpAgentRefCompName").setValue("");
		oView.byId("inpAgentRefDesg").setValue("");
		//Agent details//// Address--------------------------------------------------------------------
		oView.byId("inpAgentRefAdd1").setValue("");
		oView.byId("inpAgentRefArea").setValue("");
		oView.byId("inpAgentRefSubLoc").setValue("");
		oView.byId("inpAgentRefAdd2").setValue("");
		oView.byId("inpAgentRefAdd3").setValue("");
		oView.byId("inpAgentRefPin").setValue("");
		oView.byId("inpAgentRefDist").setValue("");
		oView.byId("cmbAgentRefState").setSelectedKey("");
		oView.byId("cmdAgentRefCountry").setSelectedKey("");
		oView.byId("inpAgentRefContact").setValue("");
		oView.byId("inpAgentRefEmail").setValue("");
		//attributes Tab-----------------------------------------------///
		oView.byId("cmbOccpnyTyp").setSelectedKey("");
		oView.byId("cmbOffcSpce").setSelectedKey("");
		oView.byId("cmbLoctonInsurd").setSelectedKey("");
		oView.byId("cmbLoctonInsurdnew").setSelectedKey("");
		oView.byId("cmbfotfall").setSelectedKey("");
		oView.byId("cmbshpfrntSpce").setSelectedKey("");
		oView.byId("cmbPcsLap").setSelectedKey("");
		oView.byId("cmbAgentRefState").setSelectedKey("");
		oView.byId("cmbPrntrScnrs").setSelectedKey("");
		oView.byId("inptFullTmeEmploys").setValue("");
		oView.byId("AgentDssNme").setValue("");
		oView.byId("cmbCntBnkEndStf").setSelectedKey("");
		oView.byId("cmbTotlMnpwrStrngt").setSelectedKey("");
		oView.byId("cmbCntofFsStf").setSelectedKey("");
		oView.byId("cmbCntofFrntEdStf").setSelectedKey("");
		oView.byId("AgentCombodss").setSelectedKey("");
		oView.byId("AgentlocCombo").setSelectedKey("");
		oView.byId("AgentlocComboOwnership").setSelectedKey("");
		oView.byId("multicmbMdeDlvry").setSelectedKeys("");
		oView.byId("multicmbConnevtOffice").setSelectedKeys("");
		oView.byId("cmbPayoutMedia").setSelectedKey("");
		oView.byId("cmbSurtyType").setSelectedKey("");
		oView.byId("inptScurtyInstrmntDtls").setValue("");
		oView.byId("inptSecrtyAmnt").setValue("");
		oView.byId("DtpckScurtyStrtDte").setValue("");
		oView.byId("DtpckScurtyEndDte").setValue("");
		oView.byId("cmbSprvsonSlesStf").setSelectedKey("");
		//Attributes----//Bank Details////////////////////////
		oView.byId("inptAccountHldrName").setValue("");
		oView.byId("inputAccountNo").setValue("");
		oView.byId("inptBankName").setValue("");
		oView.byId("inptBranchName").setValue("");
		oView.byId("inptIfcCode").setValue("");
		oView.byId("cmbOnlneFulmnt").setSelectedKey("");
		oView.byId("inptDlverByNme").setValue("");
		oView.byId("cmbDlvryQual").setSelectedKey("");
		/////Turnover and Profit///////Attributes////////////////////////
		oView.byId("inpSYear").setValue("");
		oView.byId("inptAnnulTrnovr").setValue("");
		oView.byId("inputAnulPrft").setValue("");
		oView.byId("inptYear2").setValue("");
		oView.byId("inptAnnulTrnovr2").setValue("");
		oView.byId("inputAnulPrft2").setValue("");
		oView.byId("cmbSrvcAra").setSelectedKey("");
		oView.byId("cmbAreaServc").setSelectedKey("");
		oView.byId("cmbShpServ").setSelectedKey("");
		oView.byId("inptServcName").setValue("");
		oView.byId("cmbQualfcton").setSelectedKey("");
		oView.byId("datePickrStartContract").setValue("");
		oView.byId("datePickrEndContract").setValue("");
		//---------------List of Bussiness---------------------------
		oView.byId("busTypeTab").removeAllItems();
		//--------------Sales Details--------------------------------
		oView.byId("salesTab").removeAllItems();
		oView.byId("deviceTab").removeAllItems();
		//Attributes//////////////JioMoneyDealer======================
		oView.byId("cmbJioMnyCmson").setSelectedKey("");
		oView.byId("cmbJioMnystlmntFreq").setSelectedKey("");
		oView.byId("cmbEnbleTIP").setSelectedKey("");
		oView.byId("cmbBusnsChnl").setSelectedKey("");
		oView.byId("inptJioMnyCmsonMbleNmbr").setValue("");
		oView.byId("cmbDlyTrncCnt").setSelectedKey("");
		oView.byId("cmbDlyRvnuINR").setSelectedKey("");
		oView.byId("cmbPymntAccptTyp").setSelectedKey("");
		oView.byId("cmbRtrnPolcy").setSelectedKey("");
		oView.byId("cmbStleDtls").setSelectedKey("");
		oView.byId("cmbLnsBusnssId").setSelectedKey("");
		oView.byId("cmbLnsBusnssDesc").setSelectedKey("");
		oView.byId("cmbYrsBusns").setSelectedKey("");

		//Identifiers tab--------------------------------------------------
		oView.byId("agent_Details_proofTable").removeAllItems(); 
		oView.byId("proofTable").removeAllItems();
		//-----------------Documents-----------------------------
		oView.byId("UploadTable1").removeAllItems();
	},
	EditFalse: function(value){
		var  oView = this.getView(); 
		oView.byId("idEditButon").setVisible(value);
		oView.byId("idEditSave").setVisible(value);
		oView.byId("idEditCancel").setVisible(value);
		oView.byId("slctCmpnyNme").setEnabled(value);
		oView.byId("inptAliasName").setEditable(value);
		oView.byId("dtePickrDateofIncrption").setEditable(value);
		//Dealer Classification
		//oView.byId("cmbRelationType").setEnabled(value);
		//oView.byId("cmbRelationSubType").setEnabled(value);
	//	oView.byId("cmbLocationType").setEnabled(value);
	//	oView.byId("cmbLocationSubType").setEnabled(value);
		//Company contact details
		oView.byId("inpComptMobleNo").setEditable(value);
		oView.byId("inpFaxedLneNo").setEditable(value);
		oView.byId("inptCompEmail").setEditable(value);
		oView.byId("inptCompWebsite").setEditable(value);
		//Sales Hierarchy
		oView.byId("cmbR4GState").setEnabled(value);
		oView.byId("cmbJiocenter").setEnabled(value);
		oView.byId("cmbR4GArea").setEnabled(value);
		oView.byId("cmbDelvryCntr").setEnabled(value);
	},
	//Action Performance - CTA
	//---Approve Action----

	// Added by LINGA REDDY on Jan 6, 2017 11:45:50 AM

	isAllTabsChecked:function(){
		//var profileTab = this.byId("profileTab").getVisible();
		var addressTab = this.byId("addressTab").getVisible();
		var identifiersTab = this.byId("identTab").getVisible();
		var attributesTab = this.byId("attributesTab").getVisible();
		var refDealerTab = this.byId("refDealer").getVisible();
		var agentTab = this.byId("agentDet").getVisible();
		var docTab = this.byId("iconTabFilterDoc").getVisible();
		var HqTab = this.byId("tabLocation").getVisible();
		
		var text = "";
		if(!this.onAddressTabSelect && addressTab){
			text +="Address Tab, ";
		}
		if(!this.onAttributeTabSelect && attributesTab){
			text +="Attribute Tab, "; 
		} 
		if(!this.onIdentifierTabSelect && identifiersTab){
			text +="Identifiers Tab, "; 
		} 
		if(!this.onRefDetailsTabSelect && refDealerTab){
			text +="Reference Dealers Tab, "; 
		} 
		if(!this.onAgentTabSelect && agentTab){
			text +="Agents Tab, "; 
		} 
		if(!this.onUploadTabSelect && docTab){
			text +="Documents Tab, "; 
		} 
		if(!this.onHQTabSelect && HqTab){
			text +="Documents Tab, "; 
		} 
		
		if(text != ""){
			//sap.m.MessageToast.show("Please check the details of "+text.substring(0,text.lastIndexOf(",")));
			sap.m.MessageToast.show("Please Verify the data of all the tabs.");
			return false;
		}else{
			return true;
		}
		
	},
	
	
	onApprove:function(){
	
	// Added by LINGA REDDY on Jan 6, 2017 7:01:10 PM (suggested by ritesh sir)
	
		if(!this.isAllTabsChecked()){
			return;
		};
	//-------------------------------------------------	
		var comments = this.getView().byId("txtAreaComment").getValue();
		var empResponsible= "";//this.getView().byId("objattrEmpRes").getText();
		var approval = "E0002";
		var dpLevel = this.getView().byId("switchDepst");
		//var dpLeveltlBr = this.getView().byId("depstChckTlbar");
		if(com.ril.PRMS.Master.scenarioCode == "S011" || com.ril.PRMS.Master.scenarioCode == "S012" || com.ril.PRMS.Master.scenarioCode == "S013"){
			this._onCommonAction(comments,empResponsible,approval);
		}else{
		if(dpLevel.getVisible()){
				if(dpLevel.getState()){
					this._onCommonAction(comments,empResponsible,approval);
				}else{
					sap.m.MessageToast.show("Please Select Deposit Level");
				}
			}else{
				this._onCommonAction(comments,empResponsible,approval);
			}
		}
		
	},
	//---Reject Action-----
	onReject:function(){
		
		if(!this.isAllTabsChecked()){
			return;
		};
		
		var comments = this.getView().byId("txtAreaComment").getValue();
		var empResponsible= "";//this.getView().byId("objattrEmpRes").getText();
		var approval = "E0003";
		this._onCommonAction(comments,empResponsible,approval);
	},
	onSendBack:function(){
		var comments = this.getView().byId("txtAreaComment").getValue();
		var empResponsible= "";//this.getView().byId("objattrEmpRes").getText();
		var approval = "E0004";
		this._onCommonAction(comments,empResponsible,approval);
	},
	//---Hold Action-----
	onHold: function(){
		var comments = this.getView().byId("txtAreaComment").getValue();
		var empResponsible= ""; //this.getView().byId("objattrEmpRes").getText();
		var approval = "E0005";
		this._onCommonAction(comments,empResponsible,approval);
	},
	//---Accept Action-----
	onAccept: function(){
		var comments = this.getView().byId("txtAreaComment").getValue();
		var empResponsible= "";//this.getView().byId("objattrEmpRes").getText();
		var approval = "E0006";
		this._onCommonAction(comments,empResponsible,approval);
	},
	//-----Common function for Action
	_onCommonAction: function(comments,empResponsible,approval,message){
		var that = this;
		if(comments == "" || comments == null || comments == undefined){
			sap.m.MessageToast.show("Please fill your Comments");
			this.byId("idIconTabBar").setSelectedKey("Comments");
			return;
		}
		sap.m.MessageBox.show("Are you sure?", {
			icon: sap.m.MessageBox.Icon.INFORMATION,
			title: "Confirmation",
			actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose: function(oAction) { 
				if(oAction==="YES"){
					var activityId= that.id;
					var depositCheck=that.getView().byId("switchDepst");
					var checkState="";
					if(depositCheck.getState()){
						checkState="X";
					}else if(depositCheck.getState()){
						checkState="";
					}
					
					var HandoverOfDeviceDone= "";
					var FinalSettlementDone="";
					var FinalSettlementDone_X ="";
					var HandoverOfDeviceDone_X= "";
					
					var devHObackendCheck = that.getView().byId("idDevHandover").isChecked;
					var devHOfrontendCheck = that.getView().byId("idDevHandover").getSelected();
					var settlementBC = that.getView().byId("idSettlement").isChecked;
					var settlementFC = that.getView().byId("idSettlement").getSelected();
					
					if(that.apprvlLevel == that.depoLevel && com.ril.PRMS.Master.scenarioCode == "S011" || com.ril.PRMS.Master.scenarioCode == "S012" || com.ril.PRMS.Master.scenarioCode == "S013"){
						HandoverOfDeviceDone= that.getView().byId("idDevHandover").getSelected()?"X":"";
						FinalSettlementDone=that.getView().byId("idSettlement").getSelected()?"X":"";
						FinalSettlementDone_X =settlementBC?(settlementFC?"":"X"):(settlementFC?"X":"");
						HandoverOfDeviceDone_X= devHObackendCheck?(devHOfrontendCheck?"":"X"):(devHOfrontendCheck?"X":"");
					}
					
					var data={};
					var arr = [];
					var items={
							"Task":"",
							"ApprovalLevel":"",
							"Approvar":"",
							"ApprovalJobfun":"",
							"ApprovalLevel_X":"",
							"Approvar_X":"",
							"ApprovalJobfun_X":"",

					};
					arr.push(items);
					data.ActivityId = activityId;
					data.Description = "";
					data.ZapprovalLevel = "";
					data.EmpResponsible = empResponsible;
					data.EmpJobfun="";
					data.CreateDate="0000-00-00T00:00:00";
					data.ProspectExtId="";
					data.CurrentOwner="0680000052";
					data.ProspectBpId="";
					data.TransactionNo="";
					data.ApprovalLine=comments;
					data.ApprovalActivityText=comments;
					data.ApprovalStat = approval;
					data.ApprovalLine_X="X";
					data.ApprovalActivityText_X="X";
					data.ActivityId_X = "";
					data.CreateDate_X = "";
					data.ApprovalStat_X = "X";
					data.CurrentOwner_x="";
					data.EmpResponsible_X="";
					data.DepositCheck=checkState;
					data.DepositCheck_X=checkState;
					data.ACTUPDATETOLISTNAV=arr;
					data.DepositLevel="",
					data.HandoverOfDeviceDone= HandoverOfDeviceDone;
					data.HandoverOfDeviceDone_X= HandoverOfDeviceDone_X;
					data.FinalSettlementDone=FinalSettlementDone;
					data.FinalSettlementDone_X=FinalSettlementDone_X;
					
					that.status_payload(data);

				}}});
	} ,
	status_payload:function(data){
		var that = this;
		var path = "/ApprovalActivityUpdateSet";
		com.ril.PRMS.BusyD.open();
		this.oDataModel.create(path,data,{async: true , success:function(oData,oResponse){
			var message = oResponse.data.EvMsg;
			com.ril.PRMS.BusyD.close();
			sap.m.MessageBox.alert(message,{
				onClose:function(oAction){
					that.close();
				}});
		}, error:function(oData){
			var msg = oData.response.statusText;
			sap.m.MessageBox.alert(msg, {
				icon  : sap.m.MessageBox.Icon.ERROR,                        
				title : "Error",
				actions: [sap.m.MessageBox.Action.OK]
			});
			com.ril.PRMS.BusyD.close();
		}});
	},
	close:function(){
		var path="/AppActivitySearchSet?&$skip=0&$top=20&$filter=(AttrName eq 'BU_PARTNER|I|EQ| |INIT')";
		com.ril.PRMS.Master.methodPath(path);
		this.byId("txtAreaComment").setValue("");
	},
	/*maxmin : function(e) {
		if (e.getSource().getPressed()) {
			var oSplit = e.getSource().getParent().getParent().getParent().getParent().getParent();
			oSplit.setMode(sap.m.SplitAppMode.HideMode);
			this.getView().byId("fullscreenButton").setIcon("sap-icon://exit-full-screen");
		} else {
			var oSplit = e.getSource().getParent().getParent().getParent().getParent().getParent();
			oSplit.setMode(sap.m.SplitAppMode.ShowHideMode);
			this.getView().byId("fullscreenButton").setIcon("sap-icon://full-screen");
		};
	},*/
	
	maxmin : function(e) {
		if (e.getSource().getPressed()) {
			var oSplit = e.getSource().getParent().getParent().getParent().getParent().getParent();
			oSplit.setMode(sap.m.SplitAppMode.HideMode);
			this.getView().byId("fullscreenButton").setIcon("sap-icon://exit-full-screen");
			this.getView().byId("inptJioMnyCmsonMbleNmbr").setWidth("91%"); 
			this.getView().byId("inptmobileNo").setWidth("335px");
			this.getView().byId("cmbAlterMbno").setWidth("335px");
			this.getView().byId("inpComptMobleNo").setWidth("290px");
			this.getView().byId("inpFaxedLneNo").setWidth("245px");
		} else {
			var oSplit = e.getSource().getParent().getParent().getParent().getParent().getParent();
			oSplit.setMode(sap.m.SplitAppMode.ShowHideMode);
			this.getView().byId("fullscreenButton").setIcon("sap-icon://full-screen");
			this.getView().byId("inptJioMnyCmsonMbleNmbr").setWidth("118px");
			this.getView().byId("inptmobileNo").setWidth("240px");
			this.getView().byId("cmbAlterMbno").setWidth("240px");
			this.getView().byId("inpComptMobleNo").setWidth("118px");
			this.getView().byId("inpComptMobleNo").setWidth("195px");
			this.getView().byId("inpFaxedLneNo").setWidth("150px");
		};
	},
	
	
	onChangePrfTaxtab : function(oEvent){
		var that=this;
		var selectedKey= oEvent.mParameters.selectedItem.mProperties.key;
		var prfMod = oEvent.getSource().getParent().mAggregations.cells[1].getModel("prfcmb2Mod");
		prfMod.destroy();
		for(var s=0;s<that.taxArrs.length;s++){
			if(selectedKey == that.taxArrs[s].pfIdeVal){
				var oComboProType = oEvent.getSource().getParent().mAggregations.cells[1];
				var prfTypeMod = new sap.ui.model.json.JSONModel(that.taxArrs[s]);
				prfTypeMod.setDefaultBindingMode("OneWay");
				oComboProType.setModel(prfTypeMod,"prfcmb2Mod");
				break;
			}
		}
	},
	selcChgeTaxcmb1: function(oEvent){
		/// added by linga on 29.9.16
		var obj = oEvent.oSource.oParent.getCells()[oEvent.oSource.oParent.indexOfCell(oEvent.oSource)].mProperties;
		obj["valueChange"] = true;
		this.identifierTaxTableChange = true;
		oEvent.oSource.oParent.getBindingContext() ? oEvent.oSource.oParent.getBindingContext().getObject().isChanged = true:"";
		//-------------------------------
		var selectedItem = oEvent.mParameters.selectedItem.mProperties;
		var sItemLength = oEvent.getSource().getItems().length;
		this.oJsonPtypeMod = [];
		var oComboPTypeId = oEvent.getSource().getParent().mAggregations.cells[1];
		for(var i = 0; i<sItemLength; i++){
			if(oEvent.getSource().getItems()[i].mProperties == selectedItem){
				this.oJsonPtypeMod = new sap.ui.model.json.JSONModel(this.taxArrs[i].pfIdChild);
				oComboPTypeId.setModel(this.oJsonPtypeMod,"jsonPType");
				break;
			}
		}
		var oItemTemplate = new sap.ui.core.Item({
			key  : "{jsonPType>AttrCode}",
			text    : "{jsonPType>AttrValue}" ,
		});
		oComboPTypeId.bindItems("jsonPType>/",oItemTemplate);
	},
	//-----------------------Dealer Identifiers Table Validation for 2nd combobox-------------------------
	selcChgeTaxcmb2:function(oEvent){

		/// added by linga on 29.9.16
		var obj = oEvent.oSource.oParent.getCells()[oEvent.oSource.oParent.indexOfCell(oEvent.oSource)].mProperties;
		obj["valueChange"] = true;
		this.identifierTaxTableChange = true;
		oEvent.oSource.oParent.getBindingContext() ? oEvent.oSource.oParent.getBindingContext().getObject().isChanged = true:"";
		//-------------------------------
		var proofTypeIden = this.getView().byId("taxTable");
		for(var i=0;i<proofTypeIden.getItems().length;i++){
			var rowIndex = proofTypeIden.indexOfItem(oEvent.getSource().getParent());
			var prfType = oEvent.getSource().getSelectedKey();
			if(prfType == "ZCPSTX"){
				var hqTab = this.getView().byId("tabLocation").getVisible();
				var relSubVal;
				if(hqTab == false){
					relSubVal = this.getView().byId("cmbRelationSubType").getValue();
				}else{
					relSubVal = this.getView().byId("cmbRelationSubTypePftb2").getValue();	
				}
				if(relSubVal.search("ARD")>=0){
					oEvent.getSource().getParent().mAggregations.cells[2].setValueState("Warning");
					oEvent.getSource().getParent().mAggregations.cells[2].setValueStateText("NOAPP");
				}
			}
			if(rowIndex == i)
				continue;
			if(oEvent.getSource().getSelectedKey() == proofTypeIden.getItems()[i].mAggregations.cells[1].mProperties.selectedKey &&
					oEvent.getSource().getParent().mAggregations.cells[0].mProperties.value == proofTypeIden.getItems()[i].mAggregations.cells[0].mProperties.selectedKey){
				oEvent.getSource().setSelectedKey("");
				sap.m.MessageToast.show("Selected Proof type already exists");
				oEvent.getSource().getParent().mAggregations.cells[2].setValueState("None");
				oEvent.getSource().getParent().mAggregations.cells[2].setValueStateMessage("");

			}
		}
	},
	newTaxRow: function(){
		var oThis =this;
		var taxTable=oThis.getView().byId("taxTable");
		//validation to make sure that all values in the Dealers Identifiers table have been filled
		for(var i=0;i<taxTable.getItems().length;i++){
			var proofIden= taxTable.getItems()[i].mAggregations.cells[0].getSelectedKey();
			var proofTyp= taxTable.getItems()[i].mAggregations.cells[1].getSelectedKey();
			var DocNum= taxTable.getItems()[i].mAggregations.cells[2].getValue();
			var dtOfIss= taxTable.getItems()[i].mAggregations.cells[3].getValue();
			var dtOfExp= taxTable.getItems()[i].mAggregations.cells[4].getValue();
			if(proofIden =="" || proofTyp =="" || DocNum=="" ){
				sap.m.MessageToast.show("Please enter all the data to add a new record!");
				return;
			}
		}
		var oJsonProfIdMod = new sap.ui.model.json.JSONModel(oThis.taxArrs);
		var  oComboBox = new sap.m.ComboBox({
			selectionChange : function (oEvent){
				oThis.selcChgeTaxcmb1(oEvent);
			}
		});
		var oItemTemplate = new sap.ui.core.Item({
			key  : "{combo>pfIdeVal}",
			text    : "{combo>pfIdeVal}" ,
		});
		oComboBox.setModel(oJsonProfIdMod,"combo");
		oComboBox.bindItems("combo>/",oItemTemplate);
		taxTable.addItem(new sap.m.ColumnListItem({
			cells:[
			       oComboBox,
			       new sap.m.ComboBox({
			    	   selectionChange : function (oEvent){
			    		   oThis.selcChgeTaxcmb2(oEvent);
			    	   }
			       }),
			       new sap.m.Input({
			    	   liveChange: function (oEvent){
			    		   oThis.onChangeDealerIdent(oEvent);
			    	   }
			       }),
			       new sap.m.DatePicker({
			    	   change: function (oEvent){
			    		   oThis.onChangValidateDates(oEvent);
			    	   },
			    	   displayFormat:"dd MMM YYY"
			       }),
			       new sap.m.DatePicker({
			    	   change: function (oEvent){
			    		   oThis.onChangValidateDates(oEvent);
			    	   },
			    	   displayFormat:"dd MMM YYY"
			       }),
			       new sap.m.Input({
			       }),
			       new sap.m.Input({
			       })
			       ]
		}));
	},
	selcChgePrfcmb1: function(oEvent){
		/// added by linga on 29.9.16
		var obj = oEvent.oSource.oParent.getCells()[oEvent.oSource.oParent.indexOfCell(oEvent.oSource)].mProperties;
		obj["valueChange"] = true;
		oEvent.oSource.oParent.getBindingContext()?oEvent.oSource.oParent.getBindingContext().getObject().isChanged = true:"";
		//-------------------------------

//		var proofTable=this.getView().byId("proofTable");
		var selectedItem = oEvent.mParameters.selectedItem.mProperties;
		var sItemLength = oEvent.getSource().getItems().length;
		this.oJsonPtypeMod = [];
		var oComboPTypeId = oEvent.getSource().getParent().mAggregations.cells[1];
		for(var i = 0; i<sItemLength; i++){
			if(oEvent.getSource().getItems()[i].mProperties == selectedItem){
				this.oJsonPtypeMods = new sap.ui.model.json.JSONModel(this.proofArrs[i].pfIdChild);
				oComboPTypeId.setModel(this.oJsonPtypeMods,"jsonPTypes");
				break;
			}
		}
		var oItemTemplate = new sap.ui.core.Item({
			key  : "{jsonPTypes>AttrCode}",
			text    : "{jsonPTypes>AttrValue}" ,
		});
		oComboPTypeId.bindItems("jsonPTypes>/",oItemTemplate);
	},
	//----------------------selection change for proof type in Identifiers tab for POA---------
	selcChgePrfcmb2:function(oEvent){//
		var idTable = this.getView().byId("proofTable");
		var rowIndex =  idTable.indexOfItem(oEvent.getSource().getParent());
		idTable.getItems()[rowIndex].mAggregations.cells[2].setValue();
	},
	//----------------Proof Table validation for 2nd combobox (POA) Table----------------------
	selcChgePrfcmb2Prf:function(oEvent){
		/// added by linga on 29.9.16
		var obj = oEvent.oSource.oParent.getCells()[oEvent.oSource.oParent.indexOfCell(oEvent.oSource)].mProperties;
		obj["valueChange"] = true;
		oEvent.oSource.oParent.getBindingContext()?oEvent.oSource.oParent.getBindingContext().getObject().isChanged = true:"";
		//-------------------------------
		var proofTypeIden = this.getView().byId("proofTable");
		for(var i=0;i<proofTypeIden.getItems().length;i++){
			var rowIndex = proofTypeIden.indexOfItem(oEvent.getSource().getParent());
			if(rowIndex == i)
				continue;
			if(oEvent.getSource().getSelectedKey() == proofTypeIden.getItems()[i].mAggregations.cells[1].mProperties.selectedKey &&
					oEvent.getSource().getParent().mAggregations.cells[0].mProperties.value == proofTypeIden.getItems()[i].mAggregations.cells[0].mProperties.selectedKey){
				oEvent.getSource().setSelectedKey("");
				sap.m.MessageToast.show("Selected Proof type already exists");
			}
		}
		var idTable = this.getView().byId("proofTable");
		var rowIndex =  idTable.indexOfItem(oEvent.getSource().getParent());
		idTable.getItems()[rowIndex].mAggregations.cells[2].setValue();
	},
	newPrfRow: function(){
		var oThis =this;
		var proofTable=oThis.getView().byId("proofTable");
		//validation to make sure that all values in the POA table have been filled
		for(var i=0;i<proofTable.getItems().length;i++){
			var proofIden= proofTable.getItems()[i].mAggregations.cells[0].getSelectedKey();
			var proofTyp= proofTable.getItems()[i].mAggregations.cells[1].getSelectedKey();
			var DocNum= proofTable.getItems()[i].mAggregations.cells[2].getValue();
			var dtOfIss= proofTable.getItems()[i].mAggregations.cells[3].getValue();
			var dtOfExp= proofTable.getItems()[i].mAggregations.cells[4].getValue();
			if(proofIden =="" || proofTyp =="" ||  DocNum==""){
				sap.m.MessageToast.show("Please enter all the data to add a new record!");
				return;
			}
		}
		var oJsonProfIdMods = new sap.ui.model.json.JSONModel(oThis.proofArrs);
		var  oComboBox = new sap.m.ComboBox({
			selectionChange : function (oEvent){
				oThis.selcChgePrfcmb1(oEvent);
			}
		});
		var oItemTemplate = new sap.ui.core.Item({
			key  : "{combo>pfIdeVal}",
			text    : "{combo>pfIdeVal}" ,
		});
		oComboBox.setModel(oJsonProfIdMods,"combo");
		oComboBox.bindItems("combo>/",oItemTemplate);
		proofTable.addItem(new sap.m.ColumnListItem({
			cells:[
			       oComboBox,
			       new sap.m.ComboBox({

			    	   selectionChange : function (oEvent){
			    		   oThis.selcChgePrfcmb2Prf(oEvent);
			    	   }
			       }),
			       new sap.m.Input({
			    	   liveChange: function (oEvent){
			    		   oThis.onChangePOA(oEvent);
			    	   }
			       }),
			       new sap.m.DatePicker({
			    	   change: function (oEvent){
			    		   oThis.onChangValidateDates(oEvent);
			    	   },
			    	   displayFormat:"dd MMM YYY"
			       }),
			       new sap.m.DatePicker({
			    	   change: function (oEvent){
			    		   oThis.onChangValidateDates(oEvent);
			    	   },
			    	   displayFormat:"dd MMM YYY"
			       }),
			       new sap.m.Input({
			       }),
			       new sap.m.Input({
			       }),
			       ]
		}));
	},
	returnProofObjforAgent:function(pfi,id,idNum,issueDate,expDate,modelIndex){
		return {
			ZzdateOfExpiry:expDate ,
			ZzdateOfExpiry_X: expDate!=null ? "X":"",
			ZzdateOfIssue:issueDate,
			ZzdateOfIssue_X: issueDate!=null ? "X":"",
			ZzidNumber: idNum,
			ZzidNumber_X: idNum!=""?"X":"",
			ZzidType: id,
			ZzidType_X: id!="" ?"X":"",
			ZzissueAuth: "",
			ZzissueAuth_X: "",
			ZzplaceOfIssue: "",
			ZzplaceOfIssue_X: "",
			ZzproofIdent: pfi,
			ZzproofIdent_X: pfi!=""?"X":"",
			isBackend: false,
			isChanged:true,
			modelIndex:modelIndex,
			ZTask :"I",
		}
	},
	pushNewItemsToModel:function(){
		
	//	that.agentNameModel.oData[index].objArr;
		if(this.agentNameModel.oData != undefined && this.agentNameModel.oData.length>0){
			for(var j=0;j<this.agentNameModel.oData.length;j++){
				if(this.AgentKey_temp ==  this.agentNameModel.oData[j].extrnID){
					var items = this.byId("agent_Details_proofTable").getItems();
					for(var i=0;i<items.length;i++){
						if(!items[i].oBindingContexts.agentPrftab){
							var cells = items[i].getCells();
							var pfi = cells[0].getSelectedKey(); 
							var id = cells[1].getSelectedKey();
							var idNum = cells[2].getValue();
							var issueDate = cells[3].getDateValue();
							var expDate = cells[4].getDateValue();
							this.agentNameModel.oData[j].objArr.push(this.returnProofObjforAgent(pfi,id,idNum,issueDate,expDate,this.agentNameModel.oData[j].objArr.length));
						}
					}
					break;
				}
			}
		}
	},
	onSelectAgent : function(){
//		var onEdit = this.getView().byId("idEditButon").getVisible();
		var that=this;
		that._onSelectionAgents();
	},
	_onSelectionAgents : function(){
		var that = this;
		var oView = that.getView();
		var keyAgents = oView.byId("cbAgents").getSelectedKey();	
		for(var i=0;i<that.agentNameModel.oData.length;i++){
			if(keyAgents == that.agentNameModel.oData[i].extrnID){
				
				/* Added by linga on Oct 19, 2016 at 4:39:25 PM */
				//if( that.AgentKey_temp == that.agentNameModel.oData[i].extrnID){
					this.pushNewItemsToModel();
					that.AgentKey_temp = keyAgents;
			//	}
				
				oView.byId("cmbSaluton").setSelectedKey(that.agentNameModel.oData[i].Saluton);
				oView.byId("fname").setValue(that.agentNameModel.oData[i].fname);
				oView.byId("mName").setValue(that.agentNameModel.oData[i].mname);
				oView.byId("lName").setValue(that.agentNameModel.oData[i].lname);
				oView.byId("cmbGender").setSelectedKey(that.agentNameModel.oData[i].sex);
				oView.byId("datePickrbirthday").setDateValue(that.agentNameModel.oData[i].dob);
				oView.byId("cmbJobFnctn").setSelectedKey(that.agentNameModel.oData[i].jbFun);
				
				var dateOfJoining =that.agentNameModel.oData[i].Doj=="Invalid Date"?null:that.agentNameModel.oData[i].Doj;
				
				oView.byId("dpDOJ").setDateValue(dateOfJoining); //that.agentNameModel.oData[i].Doj
				oView.byId("cmbQualification").setSelectedKey(that.agentNameModel.oData[i].Qlf);
				oView.byId("cmbIndustry").setSelectedKey(that.agentNameModel.oData[i].Industry);
				oView.byId("inpYoExp").setValue(that.agentNameModel.oData[i].inpYOE);
				oView.byId("cmbSecLanguage").setSelectedKey(that.agentNameModel.oData[i].secLang);
				//----Contact Information---------------------
				oView.byId("inptmobileNo").setValue(that.agentNameModel.oData[i].mob);
				oView.byId("cmbAlterMbno").setValue(that.agentNameModel.oData[i].altMob);
				oView.byId("inptEmail").setValue(that.agentNameModel.oData[i].email);
				//----Owner user identification-----------------
				oView.byId("ckBxPriAgent").setEnabled(true);
				if(that.agentNameModel.oData[i].priAgent == "Y"){
					oView.byId("ckBxPriAgent").setSelected(true);
				}else{
					oView.byId("ckBxPriAgent").setSelected(false);
				}
				oView.byId("inptPRMID").setValue(that.agentNameModel.oData[i].prmId);
				oView.byId("inptExtrnlID").setValue(that.agentNameModel.oData[i].extrnID);
				oView.byId("inptjobDescr").setValue(that.agentNameModel.oData[i].jobDesc);
//				var resultData =that.agentDataDet;
				var agentPresentAdd = that.getView().getModel("agentPresentAdd");
				delete agentPresentAdd;
				var agentPermentAdd = that.getView().getModel("agentPermentAdd");
				delete agentPermentAdd; 
				//----------Adreess Binding----------------------
				var oagentPreMod = new sap.ui.model.json.JSONModel();
				var oagentPerMod = new sap.ui.model.json.JSONModel();
				if(that.agentNameModel.oData[i].PermantAdd !=""){
					oagentPerMod.setData(that.agentNameModel.oData[i].PermantAdd);
					that.getView().setModel(oagentPerMod,"agentPermentAdd");
					if(oagentPerMod.oData.Zzpin == ""){
						that.getView().byId("cmbAgentPerCity").setEnabled(false); 
						that.getView().byId("cmbAgentPerCity").setValue("");
						that.getView().byId("inpAgentPerDist").setValue("");
						that.getView().byId("inpAgentPerArea").setValue("");
					}
					that._onAgentPerState();
				}
				if(that.agentNameModel.oData[i].PresentAdd !=""){
					oagentPreMod.setData(that.agentNameModel.oData[i].PresentAdd); 
					that.getView().setModel(oagentPreMod,"agentPresentAdd");
					if(oagentPreMod.oData.Zzpin == ""){
						that.getView().byId("cmbAgentPreCity").setEnabled(false); 
						that.getView().byId("cmbAgentPreCity").setValue("");
						that.getView().byId("inpAgentPreDist").setValue("");
						that.getView().byId("inpAgentPreArea").setValue("");
					}
					that._onAgentPreState();
				}
				//--------------------Proof table--------------------------------------
				var agentPrftab = that.getView().getModel("agentPrftab");
				delete agentPrftab;
				var prfAgentArr = [];
				var oTable = that.byId("agent_Details_proofTable");
				if(that.agentNameModel.oData[i].objArr.length>0){
					var agentprfIdentMods = new sap.ui.model.json.JSONModel(that.proofArrs);
					agentprfIdentMods.setDefaultBindingMode("OneWay");
					that.getView().setModel(agentprfIdentMods,"agntprfcmdMod");
					for(var l=0;l<that.agentNameModel.oData[i].objArr.length;l++){
						if((that.agentNameModel.oData[i].objArr[l].ZzproofIdent == "POI" || that.agentNameModel.oData[i].objArr[l].ZzproofIdent == "POA")&&(!that.agentNameModel.oData[i].objArr[l].isDeleted)){
							prfAgentArr.push(that.agentNameModel.oData[i].objArr[l]);
						}
					}


					var oJsonAgentPrftabMod = new sap.ui.model.json.JSONModel(prfAgentArr);
					oJsonAgentPrftabMod.setDefaultBindingMode("OneWay");
					oTable.setModel(oJsonAgentPrftabMod,"agentPrftab");

					// added by linga on 121016 	
					//var agntProofTable =that.byId("agent_Details_proofTable").getItems();
					if(that.byId("cmbSaluton").getEnabled()){
						this.enableProofTable();
					}
					//-----------------------------------------------

					/*for(var q=0;q<oTable.getItems().length;q++){
						var oprfCombokey = oTable.mAggregations.items[q].mAggregations.cells[0].mProperties.selectedKey;
						for(var s=0;s<that.proofArrs.length;s++){
							if(oprfCombokey == that.proofArrs[s].pfIdeVal){
								var oprfComboProType = oTable.mAggregations.items[q].mAggregations.cells[1];
								var prfTypeMods = new sap.ui.model.json.JSONModel(that.proofArrs[s]);
								prfTypeMods.setDefaultBindingMode("OneWay");
								oprfComboProType.setModel(prfTypeMods,"prfcmbprfsMod");
							}
						}
						if(prfTypeMods != undefined){
							if(prfTypeMods.oData.pfIdChild !=undefined){
								for(var r =0;r<prfTypeMods.oData.pfIdChild.length;r++){
									if(that.agentNameModel.oData[i].objArr[q].ZzidType == prfTypeMods.oData.pfIdChild[r].AttrCode){
										oTable.mAggregations.items[q].mAggregations.cells[1].setSelectedKey(prfTypeMods.oData.pfIdChild[r].AttrCode);
									}
								}
							}
						}
					}*/
					
		/* Changed by linga on Oct 20, 2016 */
					
				for(var q=0;q<oTable.getItems().length;q++){
					var cell_1 = oTable.getItems()[q].getCells()[0].getSelectedKey();
					for(var s=0;s<that.proofArrs.length;s++){
						if(cell_1 == that.proofArrs[s].pfIdeVal){
							var cell_2 = oTable.getItems()[q].getCells()[1];
							var prfTypeMods = new sap.ui.model.json.JSONModel(that.proofArrs[s]);
							prfTypeMods.setDefaultBindingMode("OneWay");
							cell_2.setModel(prfTypeMods,"prfcmbprfsMod");
							break;
						}
					}
					
					if(prfTypeMods!=undefined && prfTypeMods.oData.pfIdChild !=undefined){
						for(var r=0;r<prfTypeMods.oData.pfIdChild.length;r++){
							var idType = oTable.getItems()[q].oBindingContexts.agentPrftab.getObject().ZzidType
							if(idType == prfTypeMods.oData.pfIdChild[r].AttrCode){
								oTable.getItems()[q].getCells()[1].setSelectedKey(prfTypeMods.oData.pfIdChild[r].AttrCode);
								break;
							}
						}
					}
				}
					
				}
				
				//--------------------Ref Agent-----------------------------------  
				var locRefDetArr = [];
				var agentref = that.getView().getModel("refAgeMod");
				delete agentref;
				var oRefAgentMod = new sap.ui.model.json.JSONModel();
				if(that.agentNameModel.oData[i].objRefArr.length >0){
					var refAgentModel = new sap.ui.model.json.JSONModel(that.agentNameModel.oData[i].objRefArr);
					var selRefAgent = oView.byId("selRefAgent");
					var template = new sap.ui.core.Item({key:"{ID}", text:"{value}" });
					selRefAgent.setModel(refAgentModel);
					selRefAgent.bindItems('/',template);
					if(that.agentNameModel.oData[i].objRefArr.length>0){
						oView.byId("selRefAgent").setSelectedKey(refAgentModel.oData.ID);
						locRefDetArr.push(refAgentModel.oData[0].objRefArr);
						oRefAgentMod.setData(locRefDetArr[0]);
					}
					that.getView().setModel(oRefAgentMod,"refAgeMod");
					that._onRefAgentState();
				}
				//oView.byId("agent_Details_proofTable").setMode("None");
				
				/*var locRefDetArr = [];
				var agentref = that.getView().getModel("refAgeMod");
				delete agentref;
				var oRefAgentMod = new sap.ui.model.json.JSONModel();
				if(that.agentNameModel.oData[i].objRefArr.length >0){
					var refAgentModel = new sap.ui.model.json.JSONModel(that.agentNameModel.oData);
					var selRefAgent = oView.byId("selRefAgent");
					var template = new sap.ui.core.Item({key:"{ID}", text:"{value}" });
					selRefAgent.setModel(refAgentModel);
					selRefAgent.bindItems('/',template);
					if(refAgentModel.oData.length>0){
						oView.byId("selRefAgent").setSelectedKey(refAgentModel.oData[0].ID);
						locRefDetArr.push(refAgentModel.oData[0].objRefArr);
						oRefAgentMod.setData(locRefDetArr[0]);
					}
					that.getView().setModel(oRefAgentMod,"refAgeMod");
					that._onRefAgentState();
				}*/
				
			}

		}
	},
	onChangeRef : function(){
		var that = this;
		var oView = that.getView();
//		var locRefDetArr =[];
		var keyRefAgents = oView.byId("selRefAgent").getSelectedKey();
		var oRefAgentMod = new sap.ui.model.json.JSONModel();
//		var idRef = this.getView().byId("inpRefSeqId").getValue();
		for(var i=0;i<that.locRefArr.length;i++){
			if(keyRefAgents == that.locRefArr[i].ID){
				var refAgeMod = that.getView().getModel("refAgeMod");
				delete refAgeMod;
				oRefAgentMod.setData(that.locRefArr[i].objRefArr);
				that.getView().setModel(oRefAgentMod,"refAgeMod");
				if(oRefAgentMod.oData.Zzpin == ""){
					that.getView().byId("cmbAgentRefCity").setValue("");
					that.getView().byId("cmbAgentRefCity").setEnabled(false);
					that.getView().byId("inpAgentRefArea").setValue("");
					that.getView().byId("inpAgentRefDist").setValue("");
				}
			}

		}
	},
	updateAgentModelData:function(index,property,AgentKey,value){
		if(this.agentNameModel.oData!=undefined && this.agentNameModel.oData.length>0){
			for(var i=this.agentNameModel.oData.length-1;i>=0;i--){
				if(this.agentNameModel.oData[i].extrnID == AgentKey){
					this.agentNameModel.oData[i].objArr[index][property] = value;
					this.agentNameModel.oData[i].objArr[index][property+"_X"] = "X";
					this.agentNameModel.oData[i].objArr[index]["isChanged"] = true;
					if(this.agentNameModel.oData[i].objArr[index]["isBackend"]){
						this.agentNameModel.oData[i].objArr[index]["ZTask"] = "U";	
					}
					break;
				}
			}
		}
	},
	selcChgeagentcmb: function(oEvent){
		//added by linga on 131016
		/*var obj = oEvent.oSource.oParent.getCells()[oEvent.oSource.oParent.indexOfCell(oEvent.oSource)].mProperties;
		obj["valueChange"] = true;*/
		this.agentProofTableChange = true;
		
		/* changed by linga on Oct 20, 2016 at 4:54:51 PM*/
		if(oEvent.oSource.oParent.oBindingContexts.agentPrftab){
			var modelIndex = oEvent.oSource.oParent.oBindingContexts.agentPrftab.getObject().modelIndex;
			this.updateAgentModelData(modelIndex,"ZzproofIdent",this.AgentKey_temp,oEvent.oSource.getSelectedKey());
		}
		
		/*oEvent.oSource.oParent.oBindingContexts.agentPrftab?oEvent.oSource.oParent.oBindingContexts.agentPrftab.getObject().isChanged = true : "";
		if(oEvent.oSource.oParent.oBindingContexts.agentPrftab){
			oEvent.oSource.oParent.oBindingContexts.agentPrftab.getObject().ZzTask = "U"
		}*/
		//------------------
		var proofTable=this.getView().byId("agent_Details_proofTable");
		var selectedItem = oEvent.mParameters.selectedItem.mProperties;
		var sItemLength = oEvent.getSource().getItems().length;
		this.oJsonPtypeMod = [];
		var oComboPTypeId = oEvent.getSource().getParent().mAggregations.cells[1];
		for(var i = 0; i<sItemLength; i++){
			if(oEvent.getSource().getItems()[i].mProperties == selectedItem){
				this.oJsonPtypeMods = new sap.ui.model.json.JSONModel(this.proofArrs[i].pfIdChild);
				oComboPTypeId.setModel(this.oJsonPtypeMods,"jsonPTypes");
				break;
			}
		}
		var oItemTemplate = new sap.ui.core.Item({
			key  : "{jsonPTypes>AttrCode}",
			text    : "{jsonPTypes>AttrValue}" ,
		});
		oComboPTypeId.bindItems("jsonPTypes>/",oItemTemplate);
	},

	//------------validation for Identifiers table in the Agent Details Tab----------------
	selcChgeagentcmbAgentIdent:function(oEvent){

		//added by linga on 131016
	/*	var obj = oEvent.oSource.oParent.getCells()[oEvent.oSource.oParent.indexOfCell(oEvent.oSource)].mProperties;
		obj["valueChange"] = true;*/
		this.agentProofTableChange = true;
		/* changed by linga on Oct 20, 2016 at 5:18:26 PM */
		
		if(oEvent.oSource.oParent.oBindingContexts.agentPrftab){
			var modelIndex = oEvent.oSource.oParent.oBindingContexts.agentPrftab.getObject().modelIndex;
			this.updateAgentModelData(modelIndex,"ZzidType",this.AgentKey_temp,oEvent.oSource.getSelectedKey());
			}

		/*oEvent.oSource.oParent.oBindingContexts.agentPrftab?oEvent.oSource.oParent.oBindingContexts.agentPrftab.getObject().isChanged = true : "";
		if(oEvent.oSource.oParent.oBindingContexts.agentPrftab){
			oEvent.oSource.oParent.oBindingContexts.agentPrftab.getObject().ZzTask = "U"
		}*/
		//------------------

		var proofTypeIden = this.getView().byId("agent_Details_proofTable");
		for(var i=0;i<proofTypeIden.getItems().length;i++){
			var rowIndex = proofTypeIden.indexOfItem(oEvent.getSource().getParent());
			if(rowIndex == i)
				continue;
			if(oEvent.getSource().getSelectedKey() == proofTypeIden.getItems()[i].mAggregations.cells[1].mProperties.selectedKey &&
					oEvent.getSource().getParent().mAggregations.cells[0].mProperties.value == proofTypeIden.getItems()[i].mAggregations.cells[0].mProperties.selectedKey){
				oEvent.getSource().setSelectedKey("");
				sap.m.MessageToast.show("Selected Proof type already exists");
			}
		}
	},

	enableProofTable:function(){
		var oTable=this.byId("agent_Details_proofTable")
		for(var z=0;z<oTable.getItems().length;z++){
			var modelData = oTable.getModel("agentPrftab").getData();
			var proofCells = oTable.getItems()[z].getCells();
			for(var zz=0;zz<proofCells.length;zz++){
				if(modelData[z]["isBackend"]){
					if(zz>1){
						proofCells[zz].setEnabled(true);	
					}
				}else{
					proofCells[zz].setEnabled(true);
				}
			}
		}
		oTable.setMode("Delete");
	},

	newAgntDtlsPrfRow : function(){
		var oThis =this;
		var agentTable=oThis.getView().byId("agent_Details_proofTable");
		for(var i=0;i<agentTable.getItems().length;i++){
			var ProofIden= agentTable.getItems()[i].mAggregations.cells[0].getSelectedKey();
			var ProofType= agentTable.getItems()[i].mAggregations.cells[1].getSelectedKey();
			var DocNo= agentTable.getItems()[i].mAggregations.cells[2].getValue();
			var DtOfIssue= agentTable.getItems()[i].mAggregations.cells[3].getDateValue();
			var DtofExp= agentTable.getItems()[i].mAggregations.cells[4].getDateValue();
			if(ProofIden =="" || ProofType =="" || DocNo ==""){
				sap.m.MessageToast.show("Please enter all the data to add a new record!");
				return;
			}
		}
		var oJsonProfIdMods = new sap.ui.model.json.JSONModel(oThis.proofArrs);
		var  oComboBox = new sap.m.ComboBox({
			selectionChange : function (oEvent){
				oThis.selcChgeagentcmb(oEvent);
			}
		})
		var oItemTemplate = new sap.ui.core.Item({
			key  : "{combo>pfIdeVal}",
			text    : "{combo>pfIdeVal}" ,
		});
		oComboBox.setModel(oJsonProfIdMods,"combo");
		oComboBox.bindItems("combo>/",oItemTemplate);
		agentTable.addItem(new sap.m.ColumnListItem({
			cells:[
			       oComboBox,
			       new sap.m.ComboBox({

			    	   selectionChange : function (oEvent){
			    		   oThis.selcChgeagentcmbAgentIdent(oEvent);
			    	   }
			       }),
			       new sap.m.Input({
			    	   liveChange: function (oEvent){
			    		   oThis.onChangeAgentPOA(oEvent);
			    	   }
			       }),
			       new sap.m.DatePicker({
			    	   change: function (oEvent){
			    		   oThis.onChangValidateDates(oEvent);
			    	   },
			    	   displayFormat:"dd MMM YYY"
			       }),
			       new sap.m.DatePicker({
			    	   change: function (oEvent){
			    		   oThis.onChangValidateDates(oEvent);
			    	   },
			    	   displayFormat:"dd MMM YYY"
			       }),
			       new sap.m.Input({
			       }),
			       new sap.m.Input({
			       }),
			       ]
		}));
	},

	onChangeAgentPOA:function(oEvent){
		/// added by linga on 29.9.16
	/*	var obj = oEvent.oSource.oParent.getCells()[oEvent.oSource.oParent.indexOfCell(oEvent.oSource)].mProperties;
		obj["valueChange"] = true;
	*/	
		this.agentProofTableChange = true;
		/*oEvent.oSource.oParent.oBindingContexts.agentPrftab?oEvent.oSource.oParent.oBindingContexts.agentPrftab.getObject().isChanged = true : "";
		if(oEvent.oSource.oParent.oBindingContexts.agentPrftab){
			oEvent.oSource.oParent.oBindingContexts.agentPrftab.getObject().ZzTask = "U"
		}*/
		if(oEvent.oSource.oParent.oBindingContexts.agentPrftab){
		var modelIndex = oEvent.oSource.oParent.oBindingContexts.agentPrftab.getObject().modelIndex;
		this.updateAgentModelData(modelIndex,"ZzidNumber",this.AgentKey_temp,oEvent.oSource.getValue());
		}
		//-------------------------------
		var idTable = this.getView().byId("agent_Details_proofTable");
		var rowIndex =  idTable.indexOfItem(oEvent.getSource().getParent());
		var lvPrType = idTable.getItems()[rowIndex].mAggregations.cells[1].getValue();
		if(lvPrType=="Credit Card Statement(not older 3 month)" || lvPrType=="Photo Credit Card "){
			var str = oEvent.getSource().getValue();
			oEvent.getSource().setMaxLength(16);
			str = str.replace(/[^0-9]/g, '');
			oEvent.getSource().setValue(str);
			return;
		}
		else  if(lvPrType=="Driver's License Number" || lvPrType=="Driver's License Number (POA for PRM)"){
			var str = oEvent.getSource().getValue();
			oEvent.getSource().setMaxLength(30);
			var regex="^[a-zA-Z\d\/\-]$";
			oEvent.getSource().setValue(str);
			if(str.match(regex)){
				return;
			}else{
				var str = str.replace(/[#\!`~$%^*\+\,\.\s\@\&\(\)\=\_\\\|\"\?<\>\{\}\[\]]/g, '');
				oEvent.getSource().setValue(str);
			}
			if(strlen<3){
				return;
			}
		}
		else if(lvPrType=="Passport (POA for PRM)" || lvPrType== "Passport"){//
			var str = oEvent.getSource().getValue();
			oEvent.getSource().setMaxLength(8);
			var strlen=str.length;
			str = str.replace(/[^A-Z0-9]/g, '');
			if(strlen == 1)
			{
				this.strAlp = str.replace(/[^A-Z]/g, '');
				oEvent.getSource().setValue(this.strAlp);
			}
			else
			{
				str = str.replace(/[^0-9]/g, '');
				idTable.getItems()[rowIndex].mAggregations.cells[2].setValue(this.strAlp+""+str);
			}
		}
		else if(lvPrType=="Aadhaar Number (POA for PRM)" || lvPrType=="Aadhaar Number"){
			var str = oEvent.getSource().getValue();
			oEvent.getSource().setMaxLength(12);
			str = str.replace(/[^0-9]/g, '');
			oEvent.getSource().setValue(str);
			return;
		}
		else{
			var str = oEvent.getSource().getValue();
			var  strlen =str.length;
			oEvent.getSource().setMaxLength(30);
			var regex="^[a-zA-Z\d\/\-]$";
			oEvent.getSource().setValue(str);
			if(str.match(regex)){
			}else{
				var str = str.replace(/[#\!`~$%^*\+\,\.\s\@\&\(\)\=\_\\\|\"\?<\>\{\}\[\]]/g, '');
				oEvent.getSource().setValue(str);
			}
			if(strlen<3){
				return;
			}
		}
	},

	//---------------------------------------------------
	onDeleteAgentProofTab : function(oEvent){
		var that = this;
		//var modelIndex =  oEvent.mParameters.listItem.oBindingContexts.agentPrftab.getObject().modelIndex;
		var itemIndex = oEvent.oSource.indexOfItem(oEvent.getParameter('listItem'));
		var table=that.getView().byId("agent_Details_proofTable");
		if(oEvent.mParameters.listItem.oBindingContexts.agentPrftab){
			var modelIndex =  oEvent.mParameters.listItem.oBindingContexts.agentPrftab.getObject().modelIndex;
			sap.m.MessageBox.show("Are you sure?", {
				icon: sap.m.MessageBox.Icon.INFORMATION,
				title: "Confirmation",
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
				onClose: function(oAction) { 
					if(oAction==="YES"){
						
						table.removeItem(itemIndex);
						for(var i=that.agentNameModel.oData.length-1;i>=0;i--){
							if(that.agentNameModel.oData[i].extrnID == that.AgentKey_temp){
								that.agentNameModel.oData[i].objArr[modelIndex]["isDeleted"] = true;
								that.agentNameModel.oData[i].objArr[modelIndex]["isChanged"] = true;
							}
						}
						/*
						var list = oEvent.mParameters.listItem.oBindingContexts.agentPrftab;
						if(list){
							var index = list.sPath.split("/")
							list.getModel().getData()[index[1]].isDeleted = true;
						}*/
					}}});
		}else{
			table.removeItem(itemIndex);	
		}
		

	},
	onDeleteTaxTab : function(oEvent){
		var table=this.getView().byId("taxTable");
		table.removeItem(oEvent.getParameter('listItem'));
		var list  = oEvent.mParameters.listItem.getBindingContext();
		if(list){
			var index = list.sPath.split("/");
			//list.getModel().getData()[index[1]].ZzTask = "D";
			list.getModel().getData()[index[1]]["UnivTask"] = "D";
			list.getModel().getData()[index[1]].isChanged = true;
			this.identifierTaxTableChange = true;
		}
	},
	onDeletePrfTab : function(oEvent){
		debugger
		var table=this.getView().byId("proofTable");
		table.removeItem(oEvent.getParameter('listItem'));
		var list  = oEvent.mParameters.listItem.getBindingContext();
		if(list){
			var index = list.sPath.split("/")
		//	list.getModel().getData()[index[1]].ZzTask = "D";
			list.getModel().getData()[index[1]]["UnivTask"] = "D";
			list.getModel().getData()[index[1]].isChanged = true;
			this.identifierProofTableChange = true;
		}
	},

	//Umma Mahesh
	//csrf-token fetching
	csrfToken : function(){
		var that=this;
		var a = "/sap/opu/odata/sap/ZPRM_PARTNER_CENTER_SRV/BusinessPartnerFileSet";
		var f = {
				headers : {
					"X-Requested-With" : "XMLHttpRequest",
					"Content-Type" : "application/atom+xml",
					DataServiceVersion : "2.0",
					"X-CSRF-Token" : "Fetch"
				},
				requestUri : a,
				method : "GET"
		};
		OData.request(f, function(data, oSuccess) {
			that.ViewThis.oToken = oSuccess.headers['x-csrf-token'];   
		});
	},
	docTypeChange:function(oEvent){
		var that=this;
		this.byId("comboName").destroyItems();
		this.byId("comboName").setSelectedKey("");
		this.currK = oEvent.oSource.getSelectedKey();
		this.byId("lbldocname").setVisible(true);
		this.byId("comboName").setVisible(true);
		var pathDoc = "/PartnerCenF4Set(IsParamName='ATTACH_DOC_D')?$expand=HEADITEMNAV/HEADERITEMNAV";
		this.oDataModel.read(pathDoc,null,null,true,function(oData,oResponse){
			for(var r=0;r<oData.HEADITEMNAV.results.length;r++){
				if(that.currK == oData.HEADITEMNAV.results[r].HigerLevelAttr){
					var firstHeader = oData.HEADITEMNAV.results[r];
					that.onComboBind("comboName",firstHeader);
				}
			}
		},function(oData, oResponse){
			var msg = oData.response.statusText;
			sap.m.MessageBox.alert(msg, {
				icon  : sap.m.MessageBox.Icon.ERROR,                        
				title : "Error",
				actions: [sap.m.MessageBox.Action.OK]
			});
			com.ril.PRMS.BusyD.close();
		});
	},
	//Agent Details docType SelectionChange---------------------------------------
	onChangeAgentDocType:function(oEvent){
		var that=this;
		this.byId("AgentcomboName").destroyItems(); 
		this.byId("AgentcomboName").setSelectedKey("");
		this.currK = oEvent.oSource.getSelectedKey();
		var pathDoc = "/PartnerCenF4Set(IsParamName='ATTACH_DOC_A')?$expand=HEADITEMNAV/HEADERITEMNAV";
		this.oDataModel.read(pathDoc,null,null,true,function(oData,oResponse){
			for(var r=0;r<oData.HEADITEMNAV.results.length;r++){
				if(that.currK == oData.HEADITEMNAV.results[r].HigerLevelAttr){
					var firstHeader = oData.HEADITEMNAV.results[r];
					that.onComboBind("AgentcomboName",firstHeader);
				}
			}
		},function(oData, oResponse){
			var msg = oData.response.statusText;
			sap.m.MessageBox.alert(msg, {
				icon  : sap.m.MessageBox.Icon.ERROR,                        
				title : "Error",
				actions: [sap.m.MessageBox.Action.OK]
			});
			com.ril.PRMS.BusyD.close();
		});
	},
	//-------------on changing the doc name in documents tab----------------- 
	onDocNameChange:function(){
		var agentarr=this.docArr1;
		var DocumentDocNameCode=this.byId("comboName").getSelectedKey();
		for(var i=0;i<agentarr.length;i++){
			if(DocumentDocNameCode){
				if(DocumentDocNameCode == this.docArr1[i].childKey){
					this.DocumentdocType = this.docArr1[i].parent;
				}
			}else{
				this.DocumentdocType = "";
			}
		}
		var docnameKey=this.getView().byId("comboName").getSelectedKey();
		if(docnameKey != null || docnameKey != ""){
			this.getView().byId("DocumentFileUpload").setEnabled(true);
			var fileName= this.getView().byId("DocumentFileUpload").getValue();
		}
	},
	//For browsing documents
	onBrowse:function(oEvent){
		var fileName= this.getView().byId("DocumentFileUpload").getValue();
		if(fileName !=""){
			var file = jQuery.sap.domById(this.getView().byId("DocumentFileUpload").sId+"-fu").files[0];
			var filesize = file.size; //5242880;
			var fileType = file.type.split("/")[1].toUpperCase();
			if(fileName != ""){
				this.getView().byId("iddocumentuploadbtn").setEnabled(true); 
			}
			if(filesize > 5242880){
				sap.m.MessageBox.alert("File size too large! Should be less than 5MB");
				this.getView().byId("DocumentFileUpload").setValue("");
				this.getView().byId("iddocumentuploadbtn").setEnabled(false);
				return;
			}
			if(fileType != "PDF" && fileType != "JPEG" && fileType != "PNG" && fileType != "GIF" && fileType != "TIFF"
				&& fileType != "JPG" && fileType != "TIF" ){
				sap.m.MessageBox.alert("File format not supported! Supported formats are:PDF/JPEG/PNG/GIF/BMP/TIFF/JPG/TIF.");
				this.getView().byId("DocumentFileUpload").setValue("");
				this.getView().byId("iddocumentuploadbtn").setEnabled(false);
				return;
			}
		}else{ 
			this.getView().byId("iddocumentuploadbtn").setEnabled(false);
		}
	},
//////////////////////////////For browsing Agent documents/////////////////////////////////////////////////
	onBrowseAgent:function(oEvent){
		var fileName= this.getView().byId("AgentFileUpload").getValue();
		if(fileName !=""){
			var file = jQuery.sap.domById(this.getView().byId("AgentFileUpload").sId+"-fu").files[0];
			var filesize = file.size; //5242880;
			var fileType = file.type.split("/")[1].toUpperCase();
			if(fileName != ""){
				this.getView().byId("AgentUploadButton").setEnabled(true); 
			}
			if(filesize > 5242880){
				sap.m.MessageBox.alert("File size too large! Should be less than 5MB");
				this.getView().byId("AgentFileUpload").setValue("");
				this.getView().byId("AgentUploadButton").setEnabled(false);
				return;
			}
			if(fileType != "PDF" && fileType != "JPEG" && fileType != "PNG" && fileType != "GIF"  && fileType != "TIFF"
				&& fileType != "JPG" && fileType != "TIF" ){
				sap.m.MessageBox.alert("File format not supported! Supported formats are:PDF/JPEG/PNG/GIF/BMP/TIFF/JPG/TIF.");
				this.getView().byId("AgentFileUpload").setValue("");
				this.getView().byId("AgentUploadButton").setEnabled(false);
				return;
			}
		}else{
			this.getView().byId("AgentUploadButton").setEnabled(false);
		}
	},
	//-------------on changing the doc name in Agents detail------------------ 
	onAgentDocNameChange:function(){
		var agentarr=this.docArr1;
		var AgentDocNameCode=this.byId("AgentcomboName").getSelectedKey();
		for(var i=0;i<agentarr.length;i++){
			if(AgentDocNameCode){
				if(AgentDocNameCode == this.docArr1[i].childKey){
					this.AgentdocType = this.docArr1[i].parent;
				}
			}else{
				this.AgentdocType = "";
			}
			var docnameKey=this.getView().byId("AgentcomboName").getSelectedKey();
			if(docnameKey != null || docnameKey != ""){
				this.getView().byId("AgentFileUpload").setEnabled(true);
				var fileName= this.getView().byId("AgentFileUpload").getValue();
			}
		}
	},
	DocumentUploading:function(oEvent) {
		var hqid=this.extrnlId;
		var doctype=this.DocumentdocType;
		if(doctype == ""){
			sap.m.MessageToast.show("Can not Upload this selection");
			return;
		}
		else{
			this.FileBusy=new sap.m.BusyDialog({text:"File Uploading...."});
			this.FileBusy.open();	 
			//var docname=this.getView().byId("comboName").getValue();
			var docname=this.getView().byId("comboName").getSelectedKey();
			var file = jQuery.sap.domById(this.getView().byId("DocumentFileUpload").sId+"-fu").files[0];
			var fNam = this.getView().byId("DocumentFileUpload").oFilePath.getValue();
			if(file === undefined ||fNam==""){
				this.getView().byId("DocumentFileUpload").setValue("");
				sap.m.MessageBox.show("Select file to upload ", {title:"Warning",icon:sap.m.MessageBox.Icon.WARNING});
				var file={};
				return;
			}
			try {
				if (file) {
					this._bUploading = true;
					var that = this;
					var a="/sap/opu/odata/sap/ZPRM_PARTNER_CENTER_SRV/";
					var f = {
							headers : {
								"X-Requested-With" : "XMLHttpRequest",
								"Content-Type" : "application/atom+xml",
								DataServiceVersion : "2.0",
								"X-CSRF-Token" : "Fetch"
							},
							requestUri : a,
							method : "GET"
					};
					var oHeaders;
					var sUrl="/sap/opu/odata/sap/ZPRM_PARTNER_CENTER_SRV/";
					var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
					com.ril.PRMS.core.setModel(oModel);
					that = this;
					OData.request(f, function(data, oSuccess) {
						var oToken = oSuccess.headers['x-csrf-token'];
						oHeaders = {
								"x-csrf-token" : oToken,

								"slug" :""+hqid+","+docname+","+doctype+"",
						};

						var oURL= "/sap/opu/odata/sap/ZPRM_PARTNER_CENTER_SRV/FileUpAndDelSet";
						jQuery.ajax({
							type: 'POST',
							url: oURL,
							headers: oHeaders,
							cache: false,
							contentType: file.type,
							processData: false,
							data: file,
							success: function(datas,res,args){
								// that.oModel.refresh();
								var succ=that.getView().byId("DocumentFileUpload").oFilePath.setValue(""); 
								if(succ!="")
								{
									that.DocumentUploadComplete();
								}else {sap.m.MessageToast.show("File Not Uploaded Successfully");}

							}
						});
					});
				}
			} catch(oException) {
				this.FileBusy.close();
				this.getView().byId("DocumentFileUpload").oFilePath.setValue("");
				jQuery.sap.log.error("File upload failed:\n" + oException.message);
			}
		}
	},
	DocumentUploadComplete: function(oEvent) {
		var  category= this.getView().byId("combo1").getSelectedKey();
		var table=this.getView().byId("UploadTable1");
		var docname = this.getView().byId("comboName").getValue();
		var docnameKey = this.getView().byId("comboName").getSelectedKey();
		var doctype = this.DocumentdocType;
		var fileName = this.getView().byId("DocumentFileUpload").getValue();
		for(var i=0;i<table.getItems().length;i++){
			var docTabtxt = table.getItems()[i].mAggregations.cells[1].mProperties.text;
			if(docTabtxt == docname){
				var index = table.getItems()[i];
				var docname = table.getItems()[i].mAggregations.cells[1].mProperties.text;  
				var doctype= table.getItems()[i].mAggregations.cells[3].mProperties.text;
				var path="/FileUpAndDelSet(DocType='"+doctype+"',DocName='"+docnameKey+"',HqId='"+this.extrnlId+"')";
				this.oDataModel.remove(path,{success:function(oRequest,oResponse){
					table.removeItem(index);
					table.getModel().refresh();
				}
				});
			} 
		}
		/*var items ={
				DocId:category,
				DocName:docname,
				DocKey:doctype,
				FileName:fileName,
				docnameKey:docnameKey
		}*/
		var items = new sap.m.ColumnListItem({
			cells:[
			       new sap.m.Text({text:category}),
			       new sap.m.Text({text:docnameKey,visible:true}),
			       new sap.m.Text({	text:docname,visible:true}),
			       new sap.m.Text({visible:false}),
			       new sap.m.Text({text:doctype, visible:false}),
			       new sap.ui.core.Icon({visible:false}),

			       ]
		});
		table.addItem(items);
		this.getView().byId("combo1").setValue("");
		this.getView().byId("combo1").clearSelection();
		this.getView().byId("comboName").setValue("");
		this.getView().byId("comboName").clearSelection();
		this.getView().byId("comboName").setEnabled(false);
		this.getView().byId("DocumentFileUpload").setEnabled(false);
		this.FileBusy.close();
		var tablength=table.getItems().length;
	},
	upload:function(oEvent) {
		var hqid=this.extrnlId;
		var docname=this.getView().byId("comboName").getValue();
		var file = jQuery.sap.domById(this.getView().byId("upload_1").sId+"-fu").files[0];
		var fNam = this.getView().byId("upload_1").oFilePath.getValue();
		if(file === undefined ||fNam==""){
			this.getView().byId("upload_1").setValue("");
			sap.m.MessageBox.show("Select file to upload ", {title:"Warning",icon:sap.m.MessageBox.Icon.WARNING});
			var file={};
			return;
		}
		try {
			if (file) {
				this._bUploading = true;
				var that = this;
				var a="/sap/opu/odata/sap/ZPRM_PARTNER_CENTER_SRV/";
				var f = {
						headers : {
							"X-Requested-With" : "XMLHttpRequest",
							"Content-Type" : "application/atom+xml",
							DataServiceVersion : "2.0",
							"X-CSRF-Token" : "Fetch"
						},
						requestUri : a,
						method : "GET"
				};
				var oHeaders;
				var sUrl="/sap/opu/odata/sap/ZPRM_PARTNER_CENTER_SRV/";
				var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
				com.ril.PRMS.core.setModel(oModel);
				that = this;
				OData.request(f, function(data, oSuccess) {
					var oToken = oSuccess.headers['x-csrf-token'];
					oHeaders = {
							"x-csrf-token" : oToken,
							"slug" :""+hqid+","+doctype+","+docname+"",
					};
					var oURL= "/sap/opu/odata/sap/ZPRM_PARTNER_CENTER_SRV/BusinessPartnerFileSet";
					jQuery.ajax({
						type: 'POST',
						url: oURL,
						headers: oHeaders,
						cache: false,
						contentType: file.type,
						processData: false,
						data: file,
						success: function(datas,res,args){
							var succ=that.getView().byId("upload_1").oFilePath.setValue(""); 
							if(succ!="")
							{
								that.onComplete();
							}else {sap.m.MessageToast.show("File Not Uploaded Successfully");}

						}
					});
				});
			}
		} catch(oException) {
			this.getView().byId("upload_1").oFilePath.setValue("");
			jQuery.sap.log.error("File upload failed:\n" + oException.message);
		}
	},
	DocumentUploadStart: function(evt){
		this.getView().byId("iddocumentuploadbtn").setEnabled(false);
		var that=this;
		var proofid=this.getView().byId("combo1").getSelectedKey();
		var prooftype=this.getView().byId("comboName").getValue();
		if(proofid==""){
			sap.m.MessageToast.show("PLease select Document Type ");
		} else if(prooftype=="")
		{
			sap.m.MessageToast.show("PLease select Document Name ");
		} else{
			setTimeout(function(){
				that.DocumentUploading();
			},500);
		}
	},
	onComplete: function(oEvent) {
		var a = this.getView().byId("combo1").getSelectedKey();
		var table=this.getView().byId("UploadTable1");
		var b = this.getView().byId("comboName").getValue();
		var dockey = this.getView().byId("comboName").getSelectedKey();
		var img = this.getView().byId("upload_1").getValue();
		var items ={
				DocId:a,
//				DocType:b,
				DocType:dockey,
				DocName:img
		}
		var data=this.table.getModel().getData();
		data.push(items);
		this.table.getModel().setData(data);
		this.table.updateBindings();
		this.byId("combo1").setSelectedKey("");
		this.byId("comboName").setSelectedKey("");
	},
	uploadStarting: function(eve){
		var that=this;
		var proofid=this.getView().byId("combo1").getSelectedKey();
		if(proofid==""){
			sap.m.MessageToast.show("PLease select Document Type ");
		} else if(prooftype=="")
		{
			sap.m.MessageToast.show("PLease select Document Name ");
		} else{
			setTimeout(function(){
				that.upload();
			},500);
		}
	},
	onDocumentTable : function(IvParm3){
		var oTable = this.getView().byId("UploadTable1");
		if(oTable.getItems().length>0){
			for(var i=0;i<oTable.getItems().length;i++){
				var docTabtxt = oTable.getItems()[i].mAggregations.cells[1].mProperties.text;
				if(docTabtxt == IvParm3){
					return true;
				}
			}
		}else{
			return false;
		}
	},
	onColor : function(id,valsteId){
		if(id !="default"){
			if(valsteId != "UpldTab"){
				valsteId.setValueState("Error");
				valsteId.setValueStateText(" * Required Fields...");
			}
			this.getView().byId(id).setIconColor("Critical");
		}else{
			this.getView().byId("profileTab").setIconColor("Default");
			this.getView().byId("addressTab").setIconColor("Default");
			this.getView().byId("identTab").setIconColor("Default");
			this.getView().byId("attributesTab").setIconColor("Default");
			this.getView().byId("refDealer").setIconColor("Default");
			this.getView().byId("agentDet").setIconColor("Default");
			this.getView().byId("iconTabFilterDoc").setIconColor("Default");
		}
	},   
	onSave:function(e){
		this.saveEvent = e;
		this.onColor("default","default");
		var  pfTbselectedKey=this.byId("cmbRelationSubTypePftb2").getSelectedKey();
		var cmdRelationSubType=this.byId("cmbRelationSubType").getSelectedKey();
		var HqTab = this.getView().byId("tabLocation").getVisible();
		var payoutMediaVal = this.getView().byId("cmbPayoutMedia").getSelectedKey();
		var hqsubtype = this.byId("relSubTypLoc").getSelectedKey();
		var path;
		
		
		if(cmdRelationSubType == "ED" && (this.apprvlLevel == "3" || this.apprvlLevel == "4" )){
			if(!this.onDocumentTable("Agreement_1")){
				sap.m.MessageToast.show("Please Upload Agreement Document");
				return;
			}
		}
		
		if(HqTab){
			if(this.scenarioName == "Create New Agent" || this.scenarioName == "Modify Agent" || this.scenarioName == "Move Agent" || this.scenarioName == "Terminate Agent"){
				cmdRelationSubType = hqsubtype;
				path="/ScreenFieldControlSet/?$filter=IvParam1 eq '"+cmdRelationSubType+"' and IvParam2 eq 'PRIMARYAGENT'";
			}else{
				cmdRelationSubType = pfTbselectedKey;
				path="/ScreenFieldControlSet/?$filter=IvParam1 eq '"+cmdRelationSubType+"' and IvParam2 eq 'LOCATION'";
			}
		}else{
		//	cmdRelationSubType = cmdRelationSubType;
			path="/ScreenFieldControlSet/?$filter=IvParam1 eq '"+cmdRelationSubType+"'";
		}
		

		var that=this;
		this.oDataModel.read(path, null, [], false, function(oData,oResponse){
			var results=oData.results;
			var param2 = "";
			if(results.length != 0){
				for(var v=0;v<results.length;v++){
					if(oData.results[v].Value1 == "M"){
						var relSubType=oData.results[v].IvParam1;
						if(relSubType == cmdRelationSubType){
							if(HqTab == true){
								param2=oData.results[v].IvParam3;
							}else{
								param2=oData.results[v].IvParam2;
							}
							switch(param2){
							//======================Documents Tab Table Validation Start========================================			 
							case  "ATTACH_DOC_D":
								var param3=oData.results[v].IvParam3;
								switch(param3){
								case "IndemnityBond_1":
									var resultDocTab = that.onDocumentTable(param3);
									if(resultDocTab == false || resultDocTab == undefined ){
										that.onColor("iconTabFilterDoc","UpldTab");
										var sMsg = "Please Upload Indentity Bond";
										sap.m.MessageToast.show(sMsg);
										return;
									}
									break;
								case "poiContactPerson_1":
									var resultDocTab = that.onDocumentTable(param3);
									if(resultDocTab == false || resultDocTab == undefined ){
										that.onColor("iconTabFilterDoc","UpldTab");
										var sMsg = "Please Upload POI Contact Person";
										sap.m.MessageToast.show(sMsg);
										return;
									}
									break;
								case "DeviceAnnexure_1":
									var resultDocTab = that.onDocumentTable(param3);
									if(resultDocTab == false || resultDocTab == undefined ){
										that.onColor("iconTabFilterDoc","UpldTab");
										var sMsg = "Please Upload Device Annexure";
										sap.m.MessageToast.show(sMsg);
										return;
									}
									break;
								case "RCVAnnexure_1":
									var resultDocTab = that.onDocumentTable(param3);
									if(resultDocTab == false || resultDocTab == undefined ){
										that.onColor("iconTabFilterDoc","UpldTab");
										var sMsg = "Please Upload RCV Annexure";
										sap.m.MessageToast.show(sMsg);
										return;
									}
									break;
								case "SwitchnWalkAnnexure_1":
									var resultDocTab = that.onDocumentTable(param3);
									if(resultDocTab == false || resultDocTab == undefined ){
										that.onColor("iconTabFilterDoc","UpldTab");
										var sMsg = "Please Upload SNW Annexure";
										sap.m.MessageToast.show(sMsg);
										return;
									}
									break;
								case "TelecomAnnexure_1":
									var resultDocTab = that.onDocumentTable(param3);
									if(resultDocTab == false || resultDocTab == undefined ){
										that.onColor("iconTabFilterDoc","UpldTab");
										var sMsg = "Please Upload Telecom Annexure";
										sap.m.MessageToast.show(sMsg);
										return;
									}
									break;
								case "TERMLetter_1":
									var resultDocTab = that.onDocumentTable(param3);
									if(resultDocTab == false || resultDocTab == undefined ){
										that.onColor("iconTabFilterDoc","UpldTab");
										var sMsg = "Please Upload TERM Letter";
										sap.m.MessageToast.show(sMsg);
										return;
									}
									break;
								case "JioMoneyKYCForm_1":
									
									var resultDocTab = that.onDocumentTable(param3);
									if(resultDocTab == false || resultDocTab == undefined ){
										var keysofBusGrp = that.byId("TabidAssbgroup").getSelectedItems();
										for(var vl=0;vl<keysofBusGrp.length;vl++){
											var backObj = keysofBusGrp[vl].oBindingContexts.jsonAssbgroup.getObject();
											if(backObj.AttrCode == "ZJMDEALER" || backObj.AttrCode == "ZJMMERCHANT"){
												that.onColor("iconTabFilterDoc","UpldTab");
												var sMsg = "Please Upload Jio Money KYF Form";
												sap.m.MessageToast.show(sMsg);
												return;
											}
										}
									}
									break;
								case "PrincipleAgreement":
									var resultDocTab = that.onDocumentTable(param3);
									if(resultDocTab == false || resultDocTab == undefined ){
										that.onColor("iconTabFilterDoc","UpldTab");
										var sMsg = "Please Upload Principle Agreement";
										sap.m.MessageToast.show(sMsg);
										return;
									}
									break;
								case "AgencyAgreement":
									var resultDocTab = that.onDocumentTable(param3);
									if(resultDocTab == false || resultDocTab == undefined ){
										that.onColor("iconTabFilterDoc","UpldTab");
										var sMsg = "Please Upload Agency Agreement";
										sap.m.MessageToast.show(sMsg);
										return;
									}
									break;
								case "Undertaking_1":
									var resultDocTab = that.onDocumentTable(param3);
									if(resultDocTab == false || resultDocTab == undefined ){
										that.onColor("iconTabFilterDoc","UpldTab");
										var sMsg = "Please Upload Undertaking Document";
										sap.m.MessageToast.show(sMsg);
										return;
									}
									break;
									/*case "validAddressProof_1":
									var resultDocTab = that.onDocumentTable(param3);
									if(resultDocTab == false || resultDocTab == undefined ){
										that.onColor("iconTabFilterDoc","UpldTab");
										var sMsg = "Please Upload Valid Address Proof";
										sap.m.MessageToast.show(sMsg);
										return;
									}
									break;*/
								case "CertificationAnnexure_1":
									var resultDocTab = that.onDocumentTable(param3);
									if(resultDocTab == false || resultDocTab == undefined ){
										that.onColor("iconTabFilterDoc","UpldTab");
										var sMsg = "Please Upload Certification Annexure";
										sap.m.MessageToast.show(sMsg);
										return;
									}
									break;
								case "Agreement":
									var resultDocTab = that.onDocumentTable(param3);
									if(resultDocTab == false || resultDocTab == undefined ){
										that.onColor("iconTabFilterDoc","UpldTab");
										var sMsg = "Please Upload  Agreement File";
										sap.m.MessageToast.show(sMsg);
										return;
									}
									break;
								case "applicationForm":
									var resultDocTab = that.onDocumentTable(param3);
									if(resultDocTab == false || resultDocTab == undefined ){
										that.onColor("iconTabFilterDoc","UpldTab");
										var sMsg = "Please Upload ApplicationForm File";
										sap.m.MessageToast.show(sMsg);
										return;
									}
									break;
								case "ITR_1":
									var resultDocTab = that.onDocumentTable(param3);
									if(resultDocTab == false || resultDocTab == undefined ){
										that.onColor("iconTabFilterDoc","UpldTab");
										var sMsg = "Please Upload  ITR File";
										sap.m.MessageToast.show(sMsg);
										return;
									}
									break;
								case "bankAccStatements_1":
									var resultDocTab = that.onDocumentTable(param3);
									if(resultDocTab == false || resultDocTab == undefined ){
										that.onColor("iconTabFilterDoc","UpldTab");
										var sMsg = "Please Upload  Bank Statements File";
										sap.m.MessageToast.show(sMsg);
										return;
									}
									break;
								case "cancelledCheque":
									var resultDocTab = that.onDocumentTable(param3);
									if(resultDocTab == false || resultDocTab == undefined ){
										that.onColor("iconTabFilterDoc","UpldTab");
										var sMsg = "Please Upload  Cancelled Cheque File";
										sap.m.MessageToast.show(sMsg);
										return;
									}
									break;
								case "panCard_1":
									var resultDocTab = that.onDocumentTable(param3);
									if(resultDocTab == false || resultDocTab == undefined ){
										that.onColor("iconTabFilterDoc","UpldTab");
										var sMsg = "Please Upload  Pancard File";
										sap.m.MessageToast.show(sMsg);
										return;
									}
									break;
								case "securityDeposit_1":
									var resultDocTab = that.onDocumentTable(param3);
									if(resultDocTab == false || resultDocTab == undefined ){
										that.onColor("iconTabFilterDoc","UpldTab");
										var sMsg = "Please Upload  Security Deposit File";
										sap.m.MessageToast.show(sMsg);
										return;
									}
									break;
								case "serviceTaxRegistration_1":
									var resultDocTab = that.onDocumentTable(param3);
									if(resultDocTab == false || resultDocTab == undefined ){
										that.onColor("iconTabFilterDoc","UpldTab");
										var sMsg = "Please Upload  Service Tax Registration File";
										sap.m.MessageToast.show(sMsg);
										return;
									}
									break;
								case "signatureProof_1":
									var resultDocTab = that.onDocumentTable(param3);
									if(resultDocTab == false || resultDocTab == undefined ){
										that.onColor("iconTabFilterDoc","UpldTab");
										var sMsg = "Please Upload  Signature Proof File";
										sap.m.MessageToast.show(sMsg);
										return;
									}
									break;
								case "validAddressProof_1":
									var resultDocTab = that.onDocumentTable(param3);
									if(resultDocTab == false || resultDocTab == undefined ){
										that.onColor("iconTabFilterDoc","UpldTab");
										var sMsg = "Please Upload Valid Address File";
										sap.m.MessageToast.show(sMsg);
										return;
									}
									break;
								case "propertyDocuments_1":
									var resultDocTab = that.onDocumentTable(param3);
									if(resultDocTab == false || resultDocTab == undefined ){
										that.onColor("iconTabFilterDoc","UpldTab");
										var sMsg = "Please Upload Property Documents File";
										sap.m.MessageToast.show(sMsg);
										return;
									}
									break;
								case "salesTaxRegistration_1":
									var resultDocTab = that.onDocumentTable(param3);
									if(resultDocTab == false || resultDocTab == undefined ){
										that.onColor("iconTabFilterDoc","UpldTab");
										var sMsg = "Please Upload Sales Tax Registration File";
										sap.m.MessageToast.show(sMsg);
										return;
									}
									break;
								case "shopEstablishmentRegistration_1":
									var resultDocTab = that.onDocumentTable(param3);
									if(resultDocTab == false || resultDocTab == undefined ){
										that.onColor("iconTabFilterDoc","UpldTab");
										var sMsg = "Please Upload  Shop Establishment Registration File";
										sap.m.MessageToast.show(sMsg);
										return;
									}
									break;
								case "certificationRequest":
									var resultDocTab = that.onDocumentTable(param3);
									if(resultDocTab == false || resultDocTab == undefined ){
										that.onColor("iconTabFilterDoc","UpldTab");
										var sMsg = "Please Upload  Certification Request File";
										sap.m.MessageToast.show(sMsg);
										return;
									}
									break;
								case "retailerCertificate":
									var resultDocTab = that.onDocumentTable(param3);
									if(resultDocTab == false || resultDocTab == undefined ){
										that.onColor("iconTabFilterDoc","UpldTab");
										var sMsg = "Please Upload Retailer Certificate File";
										sap.m.MessageToast.show(sMsg);
										return;
									}
									break;	
								case "actForm":
									var resultDocTab = that.onDocumentTable(param3);
									if(resultDocTab == false || resultDocTab == undefined ){
										that.onColor("iconTabFilterDoc","UpldTab");
										var sMsg = "Please Upload Act Form File";
										sap.m.MessageToast.show(sMsg);
										return;
									}
									break;	
								case "certificationApplication":
									var resultDocTab = that.onDocumentTable(param3);
									if(resultDocTab == false || resultDocTab == undefined ){
										that.onColor("iconTabFilterDoc","UpldTab");
										var sMsg = "Please Upload Certification Application File";
										sap.m.MessageToast.show(sMsg);
										return;
									}
									break;	
								case "panTanCardIdProof":
									var resultDocTab = that.onDocumentTable(param3);
									if(resultDocTab == false || resultDocTab == undefined ){
										that.onColor("iconTabFilterDoc","UpldTab");
										var sMsg = "Please Upload Pan Tan Card Proof File";
										sap.m.MessageToast.show(sMsg);
										return;
									}
									break;	
								case "posForm":
									var resultDocTab = that.onDocumentTable(param3);
									if(resultDocTab == false || resultDocTab == undefined ){
										that.onColor("iconTabFilterDoc","UpldTab");
										var sMsg = "Please Upload Pos Form File";
										sap.m.MessageToast.show(sMsg);
										return;
									}
									break;	
								case "validCAFForm":
									var resultDocTab = that.onDocumentTable(param3);
									if(resultDocTab == false || resultDocTab == undefined ){
										that.onColor("iconTabFilterDoc","UpldTab");
										var sMsg = "Please Upload  Valid CAF Form File";
										sap.m.MessageToast.show(sMsg);
										return;
									}
									break;	
								}
								break;
								//======================Documents Tab Table Validation Stop======================================== 
								//======================Profile Tab Table Validation ============================================== 		  				 
							case "OWNERSHIPTYPE":
								var ownerShipKeyId =  that.getView().byId("cmbOwnrTyp");
								var ownerShipKey =  that.getView().byId("cmbOwnrTyp").getSelectedKey();
								if(ownerShipKey == ""){
									that.onColor("profileTab",ownerShipKeyId);
									var sMsg = "Please Select OWNER SHIP TYPE";
									sap.m.MessageToast.show(sMsg);
									return;
								}
								break;
							case "LOCATIONTYPE":
								if(HqTab == true){
									var locationTypeId= that.getView().byId("cmbLocationTypePftb2");
									var locationType= that.getView().byId("cmbLocationTypePftb2").getSelectedKey();
								}else{
									var locationTypeId =  that.getView().byId("cmbLocationType");
									var locationType =  that.getView().byId("cmbLocationType").getSelectedKey();
									/*if(locationType == ""){
										that.onColor("profileTab",locationTypeId);
										var sMsg = "Please Select LOCATION TYPE";
										sap.m.MessageToast.show(sMsg);
										return;
									}
									break;*/
								}
								if(locationType == ""){
									that.onColor("profileTab",locationTypeId);
									var sMsg = "Please Select LOCATION TYPE";
									sap.m.MessageToast.show(sMsg);
									return;
								}
								break;
							case "CPTYPE":
								if(HqTab == true){
									var relationTypeId= that.getView().byId("cmbRelationTypePftb2");
									var relationType= that.getView().byId("cmbRelationTypePftb2").getSelectedKey();
								}else{
									var relationTypeId =  that.getView().byId("cmbRelationType");
									var relationType =  that.getView().byId("cmbRelationType").getSelectedKey();
								}
								if(relationType == ""){
									that.onColor("profileTab",relationTypeId);
									var sMsg = "Please Select RELATION TYPE ";
									sap.m.MessageToast.show(sMsg);
									return;
								}
								break;	
							case "CPSUBTYPE":
								if(HqTab == true){
									var relationSubTypeId= that.getView().byId("cmbRelationSubTypePftb2")
									var relationSubType= that.getView().byId("cmbRelationSubTypePftb2").getSelectedKey();
								}else{
									var relationSubTypeId =  that.getView().byId("cmbRelationSubType");
									var relationSubType =  that.getView().byId("cmbRelationSubType").getSelectedKey();
								}
								if(relationSubType == ""){
									that.onColor("profileTab",relationSubTypeId);
									var sMsg = "Please Select RELATION SUB TYPE ";
									sap.m.MessageToast.show(sMsg);
									return;
								}
								break;
							case "ZBUSGRP":
								/*var assgnBusnssGrpId= that.byId("mltcombxAssgndBussGroup");
								var assgnBusnssGrp= that.byId("mltcombxAssgndBussGroup").getSelectedKeys();*/
								var assgnBusnssGrpId= that.byId("TabidAssbgroup");
								var assgnBusnssGrp= assgnBusnssGrpId.getSelectedItems().length;
								if(assgnBusnssGrp==0){
								//	that.onColor("profileTab",assgnBusnssGrpId);
									var sMsg = "Please Select Assign Business Group Value ";
									sap.m.MessageToast.show(sMsg);
									return;
								}
								break;
							case "ZPRODGRP":
								var prdctGrpId= that.byId("tabidProgroup");
								var prdctGrp= prdctGrpId.getSelectedItems().length;
								if(prdctGrp==0){
								//	that.onColor("profileTab",prdctGrpId);
									var sMsg = "Please Select Product Group Value ";
									sap.m.MessageToast.show(sMsg);
									return;
								}
								break;
							case "DELIVERING_SITE_DC":
								var dlveryCntrId= that.byId("cmbDelvryCntr");
								var dlveryCntr= that.byId("cmbDelvryCntr").getSelectedKey();
								if(dlveryCntr==""){
									that.onColor("profileTab",dlveryCntrId);
									var sMsg = "Please Select Delivery Center";
									sap.m.MessageToast.show(sMsg);
									return;
								}
								break;
							case "R4GSTATE_ID":
								var r4gSateId=that.byId("cmbR4GState");
								var r4gSate=that.byId("cmbR4GState").getSelectedKey();
								if(r4gSate==""){
									that.onColor("profileTab",r4gSateId);
									var sMsg = "Please Select your R4GState value";
									sap.m.MessageToast.show(sMsg);
									return;
								}
								break;  
							case "R4GAREA_ID":
								var r4gAreaId=that.byId("cmbR4GArea");
								var r4gArea=that.byId("cmbR4GArea").getSelectedKey();
								if(r4gArea==""){
									that.onColor("profileTab",r4gAreaId);
									var sMsg = "Please Select your R4GArea value";
									sap.m.MessageToast.show(sMsg);
									return;
								}
								break; 
							case "CIRCLE_ID":
								var circleId=that.byId("cmbCircle");
								var circle=that.byId("cmbCircle").getSelectedKey();
								if(circle==""){
									that.onColor("profileTab",circleId);
									var sMsg = "Please Select your Circle value";
									sap.m.MessageToast.show(sMsg);
									return;
								}
								break;   
							case "JIO_CENTER_ID":
								var jioId=that.byId("cmbJiocenter");
								var jio=that.byId("cmbJiocenter").getSelectedKey();
								if(jio==""){
									that.onColor("profileTab",jioId);
									var sMsg = "Please Select your Jio Center";
									sap.m.MessageToast.show(sMsg);
									return;
								}
								break;   
							case "ZZPARENT_ID":
								var parentPrtnrDvId=that.byId("inptParentPrtnrDvc");
								var parentPrtnrDvc=that.byId("inptParentPrtnrDvc").getValue();
								var parentPrtnrSrvcId=that.byId("inptParentPrtnrSrvc");
								var parentPrtnrSrvc=that.byId("inptParentPrtnrSrvc").getValue();
								if(parentPrtnrDvc =="" && parentPrtnrSrvc ==""){
									that.onColor("profileTab",parentPrtnrDvId);
									that.onColor("profileTab",parentPrtnrSrvcId);
									var sMsg = "Please fill Parent Data";
									sap.m.MessageToast.show(sMsg);
									return;
								}
								break; 
							case "LOCATIONNAME2":
								if(HqTab == true){
									var compNameId= that.getView().byId("inptCompNamePftb2");
									var compName= that.getView().byId("inptCompNamePftb2").getValue();
								}else{
									var compNameId =  that.getView().byId("inptCompName");
									var compName =  that.getView().byId("inptCompName").getValue();
									if(compName == ""){
										that.onColor("profileTab",compNameId);
										var sMsg = "Please fill Company Name";
										sap.m.MessageToast.show(sMsg);
										return;
									}
								}
								break; 
							case "LOCATIONNAME1":
								if(HqTab == true){
									var aliasNameId= that.getView().byId("inptAliasNamePftb2");
									var aliasName= that.getView().byId("inptAliasNamePftb2").getValue();
								}else{
									var aliasNameId =  that.getView().byId("inptAliasName");
									var aliasName =  that.getView().byId("inptAliasName").getValue();
								}
								if(aliasName == ""){
									that.onColor("profileTab",aliasNameId);
									var sMsg = "Please fill Alias Name";
									sap.m.MessageToast.show(sMsg);
									return;
								}
								break; 
								//======================Profile Tab Table Validation Stop ======================================== 	   
								//======================Address Tab Table Validation ======================================== 	
							case "CITY":
								var cityId= that.byId("cmbCity");
								var cityValue= that.byId("cmbCity").getValue();
								if(cityValue==""){
									that.onColor("addressTab",cityId);
									var sMsg = "Please Select City";
									sap.m.MessageToast.show(sMsg);
									return;
								}
								break;  
							case "COUNTRY":
								var cuntryId= that.byId("cmbCountry");
								var cuntry= that.byId("cmbCountry").getSelectedKey();
								if(cuntry==""){
									that.onColor("addressTab",cuntryId);
									var sMsg = "Please Select Country";
									sap.m.MessageToast.show(sMsg);
									return;
								}
								break;   
							case "HOUSE_NO":
								var houseNoId= that.byId("inptHouseno")
								var houseNo= that.byId("inptHouseno").getValue();
								if(houseNo==""){
									that.onColor("addressTab",houseNoId);
									var sMsg = "Please fill AddressLine 1";
									sap.m.MessageToast.show(sMsg);
									return;
								}
								break;
							case "STREET":
								var streetId= that.byId("inptStreet");
								var street= that.byId("inptStreet").getValue();
								if(street==""){
									that.onColor("addressTab",streetId);
									var sMsg = "Please fill AddressLine 2";
									sap.m.MessageToast.show(sMsg);
									return;
								}
								break;
							case "POSTL_COD1":
								var postlCodeId= that.byId("inptPostalCde");
								var postlCode= that.byId("inptPostalCde").getValue();
								if(postlCode==""){
									that.onColor("addressTab",postlCodeId);
									var sMsg = "Please fill Postal Code Value";
									sap.m.MessageToast.show(sMsg);
									return;
								}
								break;
							case "REGION":
								var stateId=that.byId("cmbState");
								var state=that.byId("cmbState").getSelectedKey();
								if(state==""){
									that.onColor("addressTab",stateId);
									var sMsg = "Please fill your State value";
									sap.m.MessageToast.show(sMsg);
									return;
								}
								break;
							case "LOCATIONMAIL":
								var emailId=that.byId("inptCompEmail")
								var email=that.byId("inptCompEmail").getValue();
								if(email==""){
									that.onColor("addressTab",emailId);
									var sMsg = "Please fill your Email";
									sap.m.MessageToast.show(sMsg);
									return;
								}
								break;
							case "LOCATIONMOBILE_NO":
								var mobNoId=that.byId("inpComptMobleNo");
								var mobNo=that.byId("inpComptMobleNo").getValue();
								if(mobNo==""){
									that.onColor("addressTab",mobNoId);
									var sMsg = "Please fill your Mobile Number";
									sap.m.MessageToast.show(sMsg);
									return;
								}
								break;
							case "START_DAY":
								var startDayId= that.byId("cmbStrtWkngDay");
								var startDay= that.byId("cmbStrtWkngDay").getSelectedKey();
								if(startDay==""){
									that.onColor("addressTab",startDayId);
									var sMsg = "Please Select Start Day Value";
									sap.m.MessageToast.show(sMsg);
									return;
								}
								break;      
							case "END_DAY":
								var endDayId= that.byId("cmbEndWkngDay");
								var endDay= that.byId("cmbEndWkngDay").getSelectedKey();
								if(endDay==""){
									that.onColor("addressTab",endDayId);
									var sMsg = "Please Select End Day Value";
									sap.m.MessageToast.show(sMsg);
									return;
								}
								break;  
							case "START_TIME":
								var startTimeId= that.byId("dpStratTime");
								var startTime= that.byId("dpStratTime").getValue();
								if(startTime==""){
									that.onColor("addressTab",startTimeId);
									var sMsg = "Please Select Start Time";
									sap.m.MessageToast.show(sMsg);
									return;
								}
								break; 
							case "END_TIME":
								var endtimeId= that.byId("dpEndTime");
								var endtime= that.byId("dpEndTime").getValue();
								if(endtime==""){
									that.onColor("addressTab",endtimeId);
									var sMsg = "Please Select End Time";
									sap.m.MessageToast.show(sMsg);
									return;
								}
								break; 
								//======================Address Tab Table Validation Stop ======================================== 	 	                   
								//======================Attribute Tab Table Validation ======================================== 	 
							case "CONTRACT_ENDDATE":
								var endDateId= that.byId("datePickrEndContract");
								var endDate= that.byId("datePickrEndContract").getValue();
								if(endDate==""){
									that.onColor("attributesTab",endDateId);
									var sMsg = "Please Select Security End Date Value";
									sap.m.MessageToast.show(sMsg);
									return;
								}
								break; 
							case "CONTRACT_STARTDATE":
								var startDateId= that.byId("datePickrStartContract");
								var startDate= that.byId("datePickrStartContract").getValue();
								if(startDate==""){
									that.onColor("attributesTab",startDateId);
									var sMsg = "Please Select Security Start Date Value";
									sap.m.MessageToast.show(sMsg);
									return;
								}
								break; 
							case "CONT_SECURITY_DEPOSIT":
								var secAmtId= that.byId("inptSecrtyAmnt");
								var secAmt= that.byId("inptSecrtyAmnt").getValue();
								if(secAmt==""){
									that.onColor("attributesTab",secAmtId);
									var sMsg = "Please fill Security Amount Value";
									sap.m.MessageToast.show(sMsg);
									return;
								}
								break; 
							case "ACCOUNTHOLDERNAME":
								if(payoutMediaVal == "ZPAYMV1"){
									var actValueId= that.byId("inptAccountHldrName");
									var actValue= that.byId("inptAccountHldrName").getValue();
									if(actValue==""){
										that.onColor("attributesTab",actValueId);
										var sMsg = "Please fill Account Holder Name";
										sap.m.MessageToast.show(sMsg);
										return;
									}
								}
								break;
							case "ACCOUNTNUMBER":
								if(payoutMediaVal == "ZPAYMV1"){
									var actNoValueId= that.byId("inputAccountNo");
									var actNoValue= that.byId("inputAccountNo").getValue();
									if(actNoValue==""){
										that.onColor("attributesTab",actNoValueId);
										var sMsg = "Please fill Account No";
										sap.m.MessageToast.show(sMsg);
										return;
									}
								}
								break;
							case "BANKNAME":
								if(payoutMediaVal == "ZPAYMV1"){
									var bnkNmeId= that.byId("inptBankName");
									var bnkNmeValue= that.byId("inptBankName").getValue();
									if(bnkNmeValue==""){
										that.onColor("attributesTab",bnkNmeId);
										var sMsg = "Please fill Bank Name";
										sap.m.MessageToast.show(sMsg);
										return;
									}
								}
								break;
							case "BRANCHNAME":
								if(payoutMediaVal == "ZPAYMV1"){
									var brchNmeValueId= that.byId("inptBranchName");
									var brchNmeValue= that.byId("inptBranchName").getValue();
									if(brchNmeValue==""){
										that.onColor("attributesTab",brchNmeValueId);
										var sMsg = "Please fill Branch Name";
										sap.m.MessageToast.show(sMsg);
										return;
									}
								}
								break;
							case "IFSCCODE":
								if(payoutMediaVal == "ZPAYMV1"){
									var ifcCodeVId= that.byId("inptIfcCode");
									var ifcCodeV= that.byId("inptIfcCode").getValue();
									if(ifcCodeV==""){
										that.onColor("attributesTab",ifcCodeVId);
										var sMsg = "Please fill IFCSC Code";
										sap.m.MessageToast.show(sMsg);
										return;
									}
								}
								break;
								//======================Attribute Tab Table Validation Stop ======================================== 	 
								//======================Primary Agent Or Secondary Agent============================================================== 
							case "PRIMARYAGENT":
								if(that.agentNameModel.oData!=undefined && that.agentNameModel.oData.length>0){
									for(var i=0;i<that.agentNameModel.oData.length;i++){
										if(that.agentNameModel.oData[i].priAgent == "Y"){
											var param3=oData.results[v].IvParam3
											switch(param3){
											case "ZZBIRTHDATE":
												var agntDOBId= that.byId("datePickrbirthday");
												var agntDOB= that.agentNameModel.oData[i].dob;
												if(agntDOB==""){
													that.onColor("agentDet",agntDOBId);
													var sMsg = "Please Select Date Of Birth";
													sap.m.MessageToast.show(sMsg);
													return;
												}
												break;
											case "ZZEMAIL":
												var agntEmailId= that.byId("inptEmail");
												var agntEmail= that.agentNameModel.oData[i].email;
												if(agntEmail==""){
													that.onColor("agentDet",agntEmailId);
													var sMsg = "Please fill Agent Email";
													sap.m.MessageToast.show(sMsg);
													return;
												}
												break;
											case "ZZFNAME":
												var agntFnameId= that.byId("fname");
												var agntFname= that.agentNameModel.oData[i].fname;
												if(agntFname==""){
													that.onColor("agentDet",agntFnameId);
													var sMsg = "Please fill Agent First Name";
													sap.m.MessageToast.show(sMsg);
													return;
												}
												break;
											case "ZZGENDER":
												var agntSexId= that.byId("cmbGender");
												var agntSex=that.agentNameModel.oData[i].sex;
												if(agntSex==""){
													that.onColor("agentDet",agntSexId);
													var sMsg = "Please fill Agent Gender";
													sap.m.MessageToast.show(sMsg);
													return;
												}
												break;
												/*case "ZZJOB_DESC":
												var agntjobdes= that.byId("inptjobDescr");
												var agntjobDesc= that.agentNameModel.oData[i].jobDesc;
												if(agntjobDesc==""){
													that.onColor("agentDet",agntjobdes);
													var sMsg = "Please fill Agent Job Description";
													sap.m.MessageToast.show(sMsg);
													return;
												}
												break;*/
											case "ZZJOB_FUNCTION":
												var agntjobfun= that.byId("cmbJobFnctn");
												var agntjobFun=  that.agentNameModel.oData[i].jbFun;
												if(agntjobFun==""){
													that.onColor("agentDet",agntjobfun);
													var sMsg = "Please fill Agent Job Function";
													sap.m.MessageToast.show(sMsg);
													return;
												}
												break;
											case "ZZLNAME":
												var agntlName= that.byId("lName");
												var agntLname=  that.agentNameModel.oData[i].lname;
												if(agntLname==""){
													that.onColor("agentDet",agntlName);
													var sMsg = "Please fill Agent Last Name";
													sap.m.MessageToast.show(sMsg);
													return;
												}
												break;
											case "ZZMOBILE_NO":
												var agntMobile= that.byId("inptmobileNo");
												var agntMob=that.agentNameModel.oData[i].mob;
												if(agntMob==""){
													that.onColor("agentDet",agntMobile);
													var sMsg = "Please fill Agent Mobile Number";
													sap.m.MessageToast.show(sMsg);
													return;
												}
												break;
											case "ZZTITLE":
												var agntSalId= that.byId("cmbSaluton");
												var agntSal= that.agentNameModel.oData[i].Saluton;
												if(agntSal==""){
													that.onColor("agentDet",agntSalId);
													var sMsg = "Please fill Agent Salutation";
													sap.m.MessageToast.show(sMsg);
													return;
												}
												break;
											case "ZZID_NUMBER":
												var param4=oData.results[v].IvParam4
												if(that.agentNameModel.oData[i].objArr.length>0){
													switch(param4){
													case "POI":
														for(var j=0;j<that.agentNameModel.oData[i].objArr.length;j++){
															var DocNumber =that.agentNameModel.oData[i].objArr[j].ZzidNumber; 
															if(DocNumber== ""){
																var sMsg = "Please fill Document Number";
																sap.m.MessageToast.show(sMsg);
																return;
															}
														}
														break; 
													case "POA":
														for(var k=0;k<that.agentNameModel.oData[i].objArr.length;k++){
															var DocNumber =that.agentNameModel.oData[i].objArr[k].ZzidNumber; 
															if(DocNumber== ""){
																var sMsg = "Please fill Document Number";
																sap.m.MessageToast.show(sMsg);
																return;
															}
														}
														break;    
													}
												}
												break; 	
											}
										}
									}
								}
								break;
							case "SECONDARYAGENT":
								if(that.agentNameModel.oData!=undefined && that.agentNameModel.oData.length>0){
									for(var i=0;i<that.agentNameModel.oData.length;i++){
										if(that.agentNameModel.oData[i].priAgent == "N"){
											var param3=oData.results[v].IvParam3;
											var jbFun = that.getView().byId("cmbJobFnctn").getSelectedKey();
											if(jbFun == param3){
												switch(param3){
												case jbFun:
													var param4=oData.results[v].IvParam4;
													switch(param4){
													case "ZZGENDER":
														var agntSex= that.byId("cmbGender");
														var sex =that.agentNameModel.oData[i].sex;
														if(sex == ""){
															that.onColor("agentDet",agntSex);
															var sMsg = "Please fill Gender";
															sap.m.MessageToast.show(sMsg);
															return;
														}
														break;
													case "ZZTITLE":
														var agntSal= that.byId("cmbSaluton");
														var Salution =that.agentNameModel.oData[i].Saluton;
														if(Salution == ""){
															that.onColor("agentDet",agntSal);
															var sMsg = "Please fill Salutation";
															sap.m.MessageToast.show(sMsg);
															return;
														}
														break;
													case "ZZFNAME":
														var agntFname= that.byId("fname");
														var fname =that.agentNameModel.oData[i].fname;
														if(fname == ""){
															that.onColor("agentDet",agntFname);
															var sMsg = "Please fill FirstName";
															sap.m.MessageToast.show(sMsg);
															return;
														}
														break;
													case "ZZLNAME":
														var agntlName= that.byId("lName");
														var lname =that.agentNameModel.oData[i].lname;
														if(lname == ""){
															that.onColor("agentDet",agntlName);
															var sMsg = "Please fill LastName";
															sap.m.MessageToast.show(sMsg);
															return;
														}
														break;
													case "ZZBIRTHDATE":
														var agntDOBId= that.byId("datePickrbirthday");
														var dob =that.agentNameModel.oData[i].dob;
														if(dob == ""){
															that.onColor("agentDet",agntDOBId);
															var sMsg = "Please fill Date of Birth";
															sap.m.MessageToast.show(sMsg);
															return;
														}
														break;
													case "ZZMOBILE_NO":
														var agntMobile= that.byId("inptmobileNo");
														var mob =that.agentNameModel.oData[i].mob;
														if(mob == ""){
															that.onColor("agentDet",agntMobile);
															var sMsg = "Please fill Mobile Number";
															sap.m.MessageToast.show(sMsg);
															return;
														}
														break;
													case "ZZEMAIL":
														var agntEmail= that.byId("inptEmail");
														var email =that.agentNameModel.oData[i].email;
														if(email == ""){
															that.onColor("agentDet",agntEmail);
															var sMsg = "Please fill Email";
															sap.m.MessageToast.show(sMsg);
															return;
														}
														break;
													case "REFERENCE_DTLS":
														if(that.agentNameModel.oData[i].objRefArr.length<2){
															var sMsg = "Minimum Two Local references are required";
															sap.m.MessageToast.show(sMsg);
															return;
														}else{
															for(var j=0;j<oThis.agentNameModel.oData[i].objRefArr.length;j++){
																var fnme = that.agentNameModel.oData[i].objRefArr[j].objRefArr.Zzfname;
																var lname = that.agentNameModel.oData[i].objRefArr[j].objRefArr.ZzlastName;
																var mob = that.agentNameModel.oData[i].objRefArr[j].objRefArr.ZzmobileNumber
																var email = that.agentNameModel.oData[i].objRefArr[j].objRefArr.ZzemailId
																if(mob =="" || email ==""){
																	if(mob == ""){
																		var refContact= that.byId("inpAgentRefContact");
																		that.onColor("agentDet",refContact);
																	}
																	if(email == ""){
																		var refEmail= that.byId("inpAgentRefEmail");
																		that.onColor("agentDet",refEmail);
																	}
																	var sMsg = "Please fill Ref.Agent Contact Details";
																	sap.m.MessageToast.show(sMsg);
																	return;
																}
																if(fnme ==""){
																	var refFname= that.byId("inpAgentRefFname");
																	that.onColor("agentDet",refFname);
																	var sMsg = "Please fill Ref. Agent First Name ";
																	sap.m.MessageToast.show(sMsg);
																	return; 
																}
																if(lname ==""){
																	var refLname= that.byId("inpAgentRefLname");
																	that.onColor("agentDet",refLname);
																	var sMsg = "Please fill Ref. Agent Last Name";
																	sap.m.MessageToast.show(sMsg);
																	return; 
																}
																var houseNO = that.agentNameModel.oData[i].objRefArr[j].objRefArr.ZzhouseNo
																var bulding = that.agentNameModel.oData[i].objRefArr[j].objRefArr.Zzbuilding
																var location = that.agentNameModel.oData[i].objRefArr[j].objRefArr.Zzlocation
																var pin = that.agentNameModel.oData[i].objRefArr[j].objRefArr.Zzpin
																var city = that.agentNameModel.oData[i].objRefArr[j].objRefArr.Zzcity
																var stae = that.agentNameModel.oData[i].objRefArr[j].objRefArr.Zzstate
																var stret = that.agentNameModel.oData[i].objRefArr[j].objRefArr.Zzstreet
																var country = that.agentNameModel.oData[i].objRefArr[j].objRefArr.Zzcountry
																if(houseNO =="" ||bulding =="" ||location =="" ||pin =="" ||
																		city =="" ||stae =="" ||stret =="" ||country =="" ){
																	that.onColor("agentDet","UpldTab");
																	var sMsg = "Please fill Ref. Agent Address Details";
																	sap.m.MessageToast.show(sMsg);
																	return; 
																}
															}
														}

														break;
													case "ZZID_NUMBER":
														for(var j=0;j<that.agentNameModel.oData[i].objArr.length;j++){
															if(that.agentNameModel.oData[i].objArr[j].ZzproofIdent == oData.results[v].IvParam5 ){
																var DocNumber =that.agentNameModel.oData[i].objArr[j].ZzidNumber; 
																if(DocNumber== ""){
																	that.onColor("agentDet","UpldTab");
																	var sMsg = "Please fill Document Number";
																	sap.m.MessageToast.show(sMsg);
																	return;
																}
															}
														}
														break;
													case "ZZPROOF_IDENT":
														if(that.agentNameModel.oData.length >0){
															for(var j=0;j<that.agentNameModel.oData[i].objArr.length;j++){
																if(that.agentNameModel.oData[i].objArr[j].ZzproofIdent != oData.results[v].IvParam5){
																	if(that.agentNameModel.oData[i].objArr.length == j+1){
																		that.onColor("agentDet","UpldTab");
																		var sMsg = "POA is Mandatory";
																		sap.m.MessageToast.show(sMsg);
																		return;
																	}
																}else{
																	break;
																}
															}
														}
														break;
													case "ZZVALUE":
														if(oData.results[v].IvParam5 =="ZADOJ"){
															var dpDOJ = that.byId("dpDOJ");
															var ZDOJ = that.agentNameModel.oData[i].Doj;
															if(ZDOJ == ""){
																that.onColor("agentDet",dpDOJ);
																var sMsg = "Please fill Date of join";
																sap.m.MessageToast.show(sMsg);
																return;
															}
														}
														if(oData.results[v].IvParam5 =="ZAYOE"){
															var inpYoExp = that.byId("inpYoExp");
															var ZAYOE = that.agentNameModel.oData[i].inpYOE;
															if(ZAYOE == ""){
																that.onColor("agentDet",inpYoExp);
																var sMsg = "Please fill Year of Experience";
																sap.m.MessageToast.show(sMsg);
																return;
															}
														}
														break;
													case "ADDR_TYPE":
														if(oData.results[v].Value2 =="PER_ADD"){
															if(that.agentNameModel.oData[i].PresentAdd==""){
																var sMsg = "Please fill Present Address";
																sap.m.MessageToast.show(sMsg);
																return;
															}else{
																var add1 = that.agentNameModel.oData[i].PresentAdd.ZzhouseNo;
																var area = that.agentNameModel.oData[i].PresentAdd.Zzlocation;
																var add2 = that.agentNameModel.oData[i].PresentAdd.Zzstreet;
																var add3 = that.agentNameModel.oData[i].PresentAdd.Zzlandmark;
																var pin = that.agentNameModel.oData[i].PresentAdd.Zzpin;
																var city = that.agentNameModel.oData[i].PresentAdd.Zzcity;
																var dist = that.agentNameModel.oData[i].PresentAdd.Zzdistrict;
																var state = that.agentNameModel.oData[i].PresentAdd.Zzstate;
																var country = that.agentNameModel.oData[i].PresentAdd.Zzcountry;

																if(add1 =="" || area =="" || add2 =="" 
																	|| add3 =="" || pin == "" || city =="" || dist=="" || state =="" || country =="" ){
																	that.onColor("agentDet","UpldTab");
																	var sMsg = "Present Address all the fields Mandatory";
																	sap.m.MessageToast.show(sMsg);
																	return;
																}
															}
														}
														if(oData.results[v].Value2 =="XXDEFAULT"){
															if(that.agentNameModel.oData[i].PermantAdd==""){
																var sMsg = "Please fill Permant Address";
																sap.m.MessageToast.show(sMsg);
																return;
															}else{
																var add1 = that.agentNameModel.oData[i].PermantAdd.ZzhouseNo;
																var area = that.agentNameModel.oData[i].PermantAdd.Zzlocation;
																var add2 = that.agentNameModel.oData[i].PermantAdd.Zzstreet;
																var add3 = that.agentNameModel.oData[i].PermantAdd.Zzlandmark;
																var pin = that.agentNameModel.oData[i].PermantAdd.Zzpin;
																var city = that.agentNameModel.oData[i].PermantAdd.Zzcity;
																var dist = that.agentNameModel.oData[i].PermantAdd.Zzdistrict;
																var state = that.agentNameModel.oData[i].PermantAdd.Zzstate;
																var country = that.agentNameModel.oData[i].PermantAdd.Zzcountry;
																if(add1 =="" || area =="" || add2 =="" 
																	|| add3 =="" || pin == "" || city =="" || dist=="" || state =="" || country =="" ){
																	that.onColor("agentDet","UpldTab");
																	var sMsg = "Present Address all the fields Mandatory";
																	sap.m.MessageToast.show(sMsg);
																	return;
																}
															}
														}
														break;
													}
													break;
												}
											}
											switch(param3){
											case "ZZBIRTHDATE":
												var DOB = that.agentNameModel.oData[i].dob;
												if(DOB ==""){
													var sMsg = "Please fill Date Of Birth";
													sap.m.MessageToast.show(sMsg);
													return;
												}
												break;
											case "ZZEMAIL":
												var Email = that.agentNameModel.oData[i].email;
												if(Email ==""){
													var sMsg = "Please fill Email";
													sap.m.MessageToast.show(sMsg);
													return;
												}
												break;
											case "ZZFNAME":
												var Fname = that.agentNameModel.oData[i].fname;
												if(Fname ==""){
													var sMsg = "Please fill First Name";
													sap.m.MessageToast.show(sMsg);
													return;
												}
												break;
											case "ZZGENDER":
												var gender = that.agentNameModel.oData[i].sex;
												if(gender ==""){
													var sMsg = "Please fill Gender";
													sap.m.MessageToast.show(sMsg);
													return;
												}
												break;
											case "ZZJOB_FUNCTION":
												var jobFun = that.agentNameModel.oData[i].jbFun;
												if(jobFun ==""){
													var sMsg = "Please fill Job Function";
													sap.m.MessageToast.show(sMsg);
													return;
												}
												break;
											case "ZZLNAME":
												var lname = that.agentNameModel.oData[i].lname;;
												if(lname ==""){
													var sMsg = "Please fill Last Name";
													sap.m.MessageToast.show(sMsg);
													return;
												}
												break;
											case "ZZMOBILE_NO":
												var mob = that.agentNameModel.oData[i].mob;;
												if(mob ==""){
													var sMsg = "Please fill Mobile Number";
													sap.m.MessageToast.show(sMsg);
													return;
												}
												break;
											case "ZZTITLE":
												var title = that.agentNameModel.oData[i].Saluton;;
												if(title ==""){
													var sMsg = "Please fill Salutation";
													sap.m.MessageToast.show(sMsg);
													return;
												}
												break;

											}

										}
									}
								}
								break;
							case "ZZDATE_OF_EXPIRY":
								var param3=oData.results[v].IvParam3
								var oTable = that.getView().byId("taxTable");
								if(oTable.getItems().length >0){
									for(var i=0;i<oTable.getItems().length;i++){
										var DocNameKey =oTable.getItems()[i].mAggregations.cells[1].mProperties.selectedKey;
										if(DocNameKey == param3){
											var dofExp =oTable.getItems()[i].mAggregations.cells[4].getValue();
											if(dofExp ==""){
												that.onColor("identTab","UpldTab");
												var sMsg = "Please Select Date of Expiry";
												sap.m.MessageToast.show(sMsg);
												return;
											}
										}
									}
								}
								break;
							case "ZZDATE_OF_ISSUE":
								var param3=oData.results[v].IvParam3
								var oTable = that.getView().byId("taxTable");
								if(oTable.getItems().length >0){
									for(var i=0;i<oTable.getItems().length;i++){
										var DocNameKey =oTable.getItems()[i].mAggregations.cells[1].mProperties.selectedKey;
										if(DocNameKey == param3){
											var dofIssue =oTable.getItems()[i].mAggregations.cells[3].getValue();
											if(dofIssue ==""){
												that.onColor("identTab","UpldTab");
												var sMsg = "Please Select Date of Issue";
												sap.m.MessageToast.show(sMsg);
												return;
											}
										}
									}
								}
								break;
							case "ZZID_NUMBER":
								var param3=oData.results[v].IvParam3;
								
								switch(param3){
								case "ZCPPAN":
									var oTable = that.getView().byId("taxTable");
									if(oTable.getItems().length >0){
										for(var i=0;i<oTable.getItems().length;i++){
											var DocNameKey =oTable.getItems()[i].mAggregations.cells[1].mProperties.selectedKey;
											if(DocNameKey == param3){
												var DocNumber =oTable.getItems()[i].mAggregations.cells[2].getValue();
												if(DocNumber == ""){
													that.onColor("identTab","UpldTab");
													var sMsg = "Please Fill Document Number";
													sap.m.MessageToast.show(sMsg);
													return;
												}
											}
										}
									}
									break;
									
						// Added by LINGA REDDY on Jan 5, 2017 1:49:18 PM phase 3 requirment

								case "ZCPLST" : 
									var oTable = that.getView().byId("taxTable");
									if(oTable.getItems().length >0){
										for(var i=0;i<oTable.getItems().length;i++){
											var DocNameKey =oTable.getItems()[i].mAggregations.cells[1].mProperties.selectedKey;
											
											if(DocNameKey == param3){
												var lstMatch = true;
												var DocNumber =oTable.getItems()[i].mAggregations.cells[2].getValue();
													if(DocNumber == "" ){
														that.onColor("identTab","UpldTab");
														var sMsg = "Please Fill Document Number LST";
														sap.m.MessageToast.show(sMsg);
														return;
													}
											}
										}
									}
									if(!lstMatch){
										that.onColor("identTab","UpldTab");
										var sMsg = "Please select the LST as proof type.";
										sap.m.MessageToast.show(sMsg);
										return;
									}
									break;
								
								case "ZCPCST" : 
									var oTable = that.getView().byId("taxTable");
									if(oTable.getItems().length >0){
										for(var i=0;i<oTable.getItems().length;i++){
											var DocNameKey =oTable.getItems()[i].mAggregations.cells[1].mProperties.selectedKey;
											
											if(DocNameKey == param3){
												var cstMatch = true;
												var DocNumber =oTable.getItems()[i].mAggregations.cells[2].getValue();
													if(DocNumber == ""){
														that.onColor("identTab","UpldTab");
														var sMsg = "Please Fill Document Number for CST";
														sap.m.MessageToast.show(sMsg);
														return;
													}
											}
											
										}
									}
									if(!cstMatch){
										that.onColor("identTab","UpldTab");
										var sMsg = "Please select the CST as proof type.";
										sap.m.MessageToast.show(sMsg);
										return;
									}
									break;
								case "ZCPSTX" :
									var oTable = that.getView().byId("taxTable");
									if(oTable.getItems().length >0){
										for(var i=0;i<oTable.getItems().length;i++){
											var DocNameKey =oTable.getItems()[i].mAggregations.cells[1].mProperties.selectedKey;
											
											if(DocNameKey == param3){
											var stxMatch = true;
												var DocNumber =oTable.getItems()[i].mAggregations.cells[2].getValue();
													if(DocNumber == ""){
														that.onColor("identTab","UpldTab");
														var sMsg = "Please Fill Document Number STX";
														sap.m.MessageToast.show(sMsg);
														return;
													}
											}
										}
									}
									if(!stxMatch){
										that.onColor("identTab","UpldTab");
										var sMsg = "Please select the SERVICE TAX NUMBER  as proof type.";
										sap.m.MessageToast.show(sMsg);
										return;
									}
									break;
	 // --------------------------------------------------------------------------------------------------------	
								case "ZCPTRM":
									var param4=oData.results[v].IvParam4
									if(param4 !="" || param4 !=undefined ){
										var R4GState =that.getView().byId("cmbR4GState").getSelectedKey();
										if(R4GState == param4){
											var oTable = that.getView().byId("taxTable");
											if(oTable.getItems().length >0){
												for(var i=0;i<oTable.getItems().length;i++){
													var DocNameKey =oTable.getItems()[i].mAggregations.cells[1].mProperties.selectedKey;
													if(DocNameKey == param3){
														var DocNumber =oTable.getItems()[i].mAggregations.cells[2].getValue();
														if(DocNumber == ""){
															that.onColor("identTab","UpldTab");
															var sMsg = "Please Fill Document Number";
															sap.m.MessageToast.show(sMsg);
															return;
														}
													}
												}
											}
										}
									}

									break;
								}
								break;
							case "ZZSUBCHAR_NAME":
								var param3=oData.results[v].IvParam3;
								if(param3 !="" || param3 !=undefined ){
									var oTable =that.getView().byId("busTypeTab");
									if(oTable.getItems().length >0){
										for(var i=0;i<oTable.getItems().length;i++){
											if(param3 == "ZBTYP"){
												var busType =oTable.getItems()[i].mAggregations.cells[0].getValue();
												if(busType==""){
													that.onColor("attributesTab","UpldTab");
													var sMsg = "Please Select Bussiness Type";
													sap.m.MessageToast.show(sMsg);
													return;
												}
											}if(param3 == "ZDISTC"){
												var disComp =oTable.getItems()[i].mAggregations.cells[1].getValue();
												if(disComp==""){
													that.onColor("attributesTab","UpldTab");
													var sMsg = "Please fill Distribution Company";
													sap.m.MessageToast.show(sMsg);
													return;
												}
											}if(param3 == "ZPRMF"){
												var disComp =oTable.getItems()[i].mAggregations.cells[3].getValue();
												if(disComp==""){
													that.onColor("attributesTab","UpldTab");
													var sMsg = "Please fill Promoter Funding";
													sap.m.MessageToast.show(sMsg);
													return;
												}
											}if(param3 == "ZRINV"){
												var disComp =oTable.getItems()[i].mAggregations.cells[4].getValue();
												if(disComp==""){
													that.onColor("attributesTab","UpldTab");
													var sMsg = "Please fill ROI";
													sap.m.MessageToast.show(sMsg);
													return;
												}
											}if(param3 == "ZYOPS"){
												var disComp =oTable.getItems()[i].mAggregations.cells[2].getValue();
												if(disComp==""){
													that.onColor("attributesTab","UpldTab");
													var sMsg = "Please fill Years of Experience";
													sap.m.MessageToast.show(sMsg);
													return;
												}
											}
										}

									}
									if(param3 == "ZSLDC"){
										var oTable =that.getView().byId("deviceTab"); 
										if(oTable.getItems().length>0){
											for(var i=0;i<oTable.getItems().length;i++){
												var mnthSlsVlume= oTable.getItems()[i].mAggregations.cells[0].getSelectedKey();
												var brndService= oTable.getItems()[i].mAggregations.cells[1].getSelectedKey();
												var prdctType= oTable.getItems()[i].mAggregations.cells[2].getSelectedKey();
												if(mnthSlsVlume=="" ||brndService==""||prdctType==""){
													that.onColor("attributesTab","UpldTab");
													var sMsg = "Please Select All the Values of Sales Details(Connectivity)";
													sap.m.MessageToast.show(sMsg);
													return;
												}
											}
										}else{
											that.onColor("attributesTab","UpldTab");
											var sMsg = "Please Enter Sales Details for Connectivity";
											sap.m.MessageToast.show(sMsg);
											return;
										}
									}
									if(param3 == "ZSLDD"){
										var oTable =that.getView().byId("salesTab"); 
										if(oTable.getItems().length>0){
											for(var i=0;i<oTable.getItems().length;i++){
												var mnthSlsVlume= oTable.getItems()[i].mAggregations.cells[0].getSelectedKey();
												var brndService= oTable.getItems()[i].mAggregations.cells[1].getSelectedKey();
												var prdctType= oTable.getItems()[i].mAggregations.cells[2].getSelectedKey();
												if(mnthSlsVlume=="" ||brndService==""||prdctType==""){
													that.onColor("attributesTab","UpldTab");
													var sMsg = "Please Select All the Values of Sales Details(Devices)";
													sap.m.MessageToast.show(sMsg);
													return;
												}
											}
										}else{
											that.onColor("attributesTab","UpldTab");
											var sMsg = "Please Enter Sales Details for Devices";
											sap.m.MessageToast.show(sMsg);
											return;
										}
									}
								}
								break;
							case "ZZSEGMENT_VALUE":
								var param3=oData.results[v].IvParam3;
								if(param3 !="" || param3 !=undefined ){
									if(HqTab == true){
										var retBusTypeId =that.getView().byId("cmbSegmentTypePftb2");
										var retBusType =that.getView().byId("cmbSegmentTypePftb2").getSelectedKey();
									}else{
										var retBusTypeId = that.getView().byId("cmbSegmenttype");
										var retBusType = that.getView().byId("cmbSegmenttype").getSelectedKey();
									}
									if(retBusType ==""){

										that.onColor("profileTab",retBusTypeId);
										var sMsg = "Please Select Retailer Category";
										sap.m.MessageToast.show(sMsg);
										return;
									}
								}
								break;

							}
						}
					}
				}
			}
			var chnlFinace = that.getView().byId("cmbChannelFinanced").getSelectedKey();
			if(chnlFinace == "01"){
				var crdLmt = that.getView().byId("inputCreditLimt").getValue();
				var santonDate = that.getView().byId("DtpSantionDate").getDateValue();
				var expDate = that.getView().byId("DtpExpiryDate").getDateValue();
				var bnkName = that.getView().byId("inpBankName").getValue();
				var crdPrd = that.getView().byId("inpCrdPerid").getValue();
				if(crdLmt ==""||santonDate ==""||expDate ==""||bnkName ==""||crdPrd ==""){
					that.onColor("attributesTab","UpldTab");
					var sMsg = "Please fill ChannelFinance Details";
					sap.m.MessageToast.show(sMsg);
					return;
				}
			}



			that.onSaveData();
		},function(oData, oResponse){
			var msg = oData.response.statusText;
			sap.m.MessageBox.alert(msg,{
				icon  : sap.m.MessageBox.Icon.ERROR,                        
				title : "Error",
				actions: [sap.m.MessageBox.Action.OK]
			})
		});
		com.ril.PRMS.BusyD.close();
	},

	onSaveTaxProofTab : function(oTable,arrTaxProof,Key){
		var k=0,l=0,cells,obj={};
		if(oTable.getItems().length>0){
			if(oTable.getModel() !=undefined){
				if( oTable.getModel().getData()!=null){
					var modelData = oTable.getModel().getData();
					for(k=0;k<modelData.length;k++){
						if(modelData[k].isChanged){
							modelData[k].UnivTask == "D" ? ++l: "";
							if(modelData[k].UnivTask !="D"){
								cells = oTable.getItems()[k-l].mAggregations.cells;
							}
							
							var issue = modelData[k].UnivTask=="D"?(modelData[k].ZzdateOfIssue==null ? "":modelData[k].ZzdateOfIssue):(cells[3].getDateValue()==null ? "":cells[3].getDateValue());
							var expire = modelData[k].UnivTask=="D"?(modelData[k].ZzdateOfExpiry==null ? "":modelData[k].ZzdateOfExpiry):(cells[4].getDateValue()==null ? "":cells[4].getDateValue());
							var issue_Date = new Date(issue)=="Invalid Date"? null:new Date(issue);
							var expire_Date = new Date(expire)=="Invalid Date"? null:new Date(expire);
							var obj={};
							obj.ZzTask ="";
						//	obj.Task= modelData[k].ZzTask == ""?"U" : (modelData[k].ZzTask);
						//	obj.Task=modelData[k].UnivTask!="D"? (modelData[k].ZzTask == "D"?"D" : "U" ): (modelData[k].ZzTask=="I"?"U":modelData[k].ZzTask);
							
							if(modelData[k].UnivTask == "D"){
								obj.Task = "D";
							}else{
									obj.Task = "U";
							}
							
							
							obj.TransactionNo= this.transact;
							obj.ZzextId = "";
							obj.ZzproofIdent =modelData[k].ZzproofIdent;
							obj.ZzidType = modelData[k].ZzidType;
							obj.ZzidNumber = modelData[k].UnivTask=="D"?(modelData[k].ZzidNumber):(cells[2].getValue());
							obj.ZzdateOfIssue = com.ril.PRMS.util.Formatter.dateFormat(issue_Date);
							obj.ZzdateOfExpiry = com.ril.PRMS.util.Formatter.dateFormat(expire_Date);
							obj.ZzplaceOfIssue= modelData[k].ZzplaceOfIssue;
							obj.ZzissueAuth = modelData[k].ZzissueAuth;
							obj.ZzextId_X ="";
							obj.ZzproofIdent_X = modelData[k].UnivTask=="D"?(modelData[k].ZzproofIdent_X):(cells[0].mProperties.valueChange!=undefined &&cells[0].mProperties.valueChange && modelData[k].ZzTask!="D"?"X":"");
							obj.ZzidType_X = modelData[k].UnivTask=="D"?(modelData[k].ZzidType_X):(cells[1].mProperties.valueChange!=undefined &&cells[1].mProperties.valueChange && modelData[k].ZzTask!="D"?"X":"");
							obj.ZzidNumber_X = modelData[k].UnivTask=="D"?(modelData[k].ZzidNumber_X):(cells[2].mProperties.valueChange!=undefined &&cells[2].mProperties.valueChange&& modelData[k].ZzTask!="D"?"X":"");
							obj.ZzdateOfIssue_X = modelData[k].UnivTask=="D"?(modelData[k].ZzdateOfIssue_X):(cells[3].mProperties.valueChange!=undefined &&cells[3].mProperties.valueChange && modelData[k].ZzTask!="D"?"X":"");
							obj.ZzdateOfExpiry_X = modelData[k].UnivTask=="D"?(modelData[k].ZzdateOfExpiry_X):(cells[4].mProperties.valueChange!=undefined &&cells[4].mProperties.valueChange && modelData[k].ZzTask!="D"?"X":"");
							obj.ZzplaceOfIssue_X = modelData[k].UnivTask=="D"?(modelData[k].ZzplaceOfIssue_X):(cells[5].mProperties.valueChange!=undefined &&cells[5].mProperties.valueChange && modelData[k].ZzTask!="D"?"X":"");
							obj.ZzissueAuth_X = modelData[k].UnivTask=="D"?(modelData[k].ZzissueAuth_X):(cells[6].mProperties.valueChange!=undefined &&cells[6].mProperties.valueChange && modelData[k].ZzTask!="D"?"X":"");	
							arrTaxProof.push(obj);
						}
					}
				}
			}

			for(var a=k-l;a<oTable.getItems().length;a++){
				var cells = oTable.getItems()[a].mAggregations.cells;
				if(cells[0].getSelectedKey() !=""){
					if(Key=="PF"){
						/// changed on 300916_3.54pm
						var issue = cells[3].getDateValue()==null ? "":cells[3].getDateValue();
						var expire = cells[4].getDateValue()==null ? "":cells[4].getDateValue();
						var issue_Date = new Date(issue)=="Invalid Date"? null:new Date(issue);
						var expire_Date = new Date(expire)=="Invalid Date"? null:new Date(expire);
						var obj1 ={
								Task :"I",
								ZzTask :"",
								TransactionNo: this.transact,
								ZzextId : "",
								ZzproofIdent :cells[0].getSelectedKey(),
								ZzidType : cells[1].getSelectedKey(),
								ZzidNumber :cells[2].getValue(),
								ZzdateOfIssue :com.ril.PRMS.util.Formatter.dateFormat(issue_Date),
								ZzdateOfExpiry :com.ril.PRMS.util.Formatter.dateFormat(expire_Date),
								ZzplaceOfIssue:cells[5].getValue(),
								ZzissueAuth :cells[6].getValue(),
								ZzextId_X :"",
								ZzproofIdent_X :cells[0].mProperties.valueChange!=undefined &&cells[0].mProperties.valueChange?"X":"",
										ZzidType_X :cells[1].mProperties.valueChange!=undefined &&cells[1].mProperties.valueChange?"X":"",
												ZzidNumber_X :cells[2].mProperties.valueChange!=undefined &&cells[2].mProperties.valueChange?"X":"",
														ZzdateOfIssue_X :cells[3].mProperties.valueChange!=undefined &&cells[3].mProperties.valueChange?"X":"",
																ZzdateOfExpiry_X :cells[4].mProperties.valueChange!=undefined &&cells[4].mProperties.valueChange?"X":"",
																		ZzplaceOfIssue_X :cells[5].mProperties.valueChange!=undefined &&cells[5].mProperties.valueChange?"X":"",
																				ZzissueAuth_X :cells[6].mProperties.valueChange!=undefined &&cells[6].mProperties.valueChange?"X":"",
						}
					}
					arrTaxProof.push(obj1);
				}
			}
			this.objSaveData.PUTOPROOFNAV = arrTaxProof;
		}
	},
	busTypeBinds : function(){
		var oThis = this;
		var arrBtypes = [];
		var oTable = oThis.byId("busTypeTab");
		if(oTable.getModel() && oTable.getModel().getData()!==null && oTable.getModel().getData()!=undefined){
			oTable.getModel().oData = [];
		}
		var arrlength = Math.max(oThis.arrBtTyp.length,oThis.arrGrwthPrvsYer.length,oThis.arrDstCmp.length,
				oThis.arrinptYrs.length,oThis.arrcmbOutlt.length,oThis.arrOutltCnt.length,
				oThis.arrinptPrmt.length,oThis.arrinptRoi.length,oThis.arrCerdtRcvdcmp.length,oThis.arrBAnnulTrnvr.length);
		//lengtArr.push(oThis.arrBtTyp.length);

		if(arrlength>0){
			for(var j=0;j<arrlength;j++){
				var objType = {
						busTyepes : oThis.arrBtTyp[j]== undefined ? "":oThis.arrBtTyp[j]["value"]["ZzSubCharValue"],
								busTyepes_X:oThis.arrBtTyp[j]== undefined ? "":oThis.arrBtTyp[j]["value"]["ZsubcharValue_X"],
										zBTTask : oThis.arrBtTyp[j]== undefined ? "":oThis.arrBtTyp[j]["value"]["ZzTask"],
												busTyepes_isData : oThis.arrBtTyp[j]== undefined ? false:(oThis.arrBtTyp[j]["ZzSubCharValue"]==""?false:true),

														zDCTask :oThis.arrDstCmp[j]== undefined ? "":oThis.arrDstCmp[j]["ZzTask"],
																DstrbtnCmpny :oThis.arrDstCmp[j]== undefined ? "":oThis.arrDstCmp[j]["ZzSubCharValue"],
																		DstrbtnCmpny_X : oThis.arrDstCmp[j]== undefined ? "":oThis.arrDstCmp[j]["ZsubcharValue_X"],
																				DstrbtnCmpny_isData : oThis.arrDstCmp[j]== undefined ? false:(oThis.arrDstCmp[j]["ZzSubCharValue"]==""?false:true),

																						zYOTask : oThis.arrinptYrs[j]== undefined ? "":oThis.arrinptYrs[j]["ZzTask"],
																								YrsOprtn : oThis.arrinptYrs[j]== undefined ? "":oThis.arrinptYrs[j]["ZzSubCharValue"],
																										YrsOprtn_X : oThis.arrinptYrs[j]== undefined ? "":oThis.arrinptYrs[j]["ZsubcharValue_X"],
																												YrsOprtn_isData : oThis.arrinptYrs[j]== undefined ? false:(oThis.arrinptYrs[j]["ZzSubCharValue"]==""?false:true),

																														zPFTask :oThis.arrinptPrmt[j]== undefined ? "":oThis.arrinptPrmt[j]["ZzTask"],
																																PrmtFndng : oThis.arrinptPrmt[j]== undefined ? "":oThis.arrinptPrmt[j]["ZzSubCharValue"],
																																		PrmtFndng_X : oThis.arrinptPrmt[j]== undefined ? "":oThis.arrinptPrmt[j]["ZsubcharValue_X"],
																																				PrmtFndng_isData : oThis.arrinptPrmt[j]== undefined ? false:(oThis.arrinptPrmt[j]["ZzSubCharValue"]==""?false:true),

																																						zRoiTask :oThis.arrinptRoi[j]== undefined ? "":oThis.arrinptRoi[j]["ZzTask"],
																																								Roi : oThis.arrinptRoi[j]== undefined ? "":oThis.arrinptRoi[j]["ZzSubCharValue"],
																																										Roi_X : oThis.arrinptRoi[j]== undefined ? "":oThis.arrinptRoi[j]["ZsubcharValue_X"],
																																												Roi_isData : oThis.arrinptRoi[j]== undefined ? false:(oThis.arrinptRoi[j]["ZzSubCharValue"]==""?false:true),

																																														zCRTask :oThis.arrCerdtRcvdcmp[j]== undefined ? "":oThis.arrCerdtRcvdcmp[j]["ZzTask"],
																																																CerdtRcvdcmp : oThis.arrCerdtRcvdcmp[j]== undefined ? "":oThis.arrCerdtRcvdcmp[j]["ZzSubCharValue"],
																																																		CerdtRcvdcmp_X : oThis.arrCerdtRcvdcmp[j]== undefined ? "":oThis.arrCerdtRcvdcmp[j]["ZsubcharValue_X"],
																																																				CerdtRcvdcmp_isData : oThis.arrCerdtRcvdcmp[j]== undefined ? false:(oThis.arrCerdtRcvdcmp[j]["ZzSubCharValue"]==""?false:true),

																																																						zATTask: oThis.arrBAnnulTrnvr[j]== undefined ? "":oThis.arrBAnnulTrnvr[j]["ZzTask"],
																																																								AnnulTrnvr : oThis.arrBAnnulTrnvr[j]== undefined ? "":oThis.arrBAnnulTrnvr[j]["ZzSubCharValue"],
																																																										AnnulTrnvr_X : oThis.arrBAnnulTrnvr[j]== undefined ? "":oThis.arrBAnnulTrnvr[j]["ZsubcharValue_X"],
																																																												AnnulTrnvr_isData : oThis.arrBAnnulTrnvr[j]== undefined ? false:(oThis.arrBAnnulTrnvr[j]["ZzSubCharValue"]==""?false:true),

																																																														zGPTask :oThis.arrGrwthPrvsYer[j]== undefined ? "":oThis.arrGrwthPrvsYer[j]["ZzTask"],
																																																																GrwthPrvsYer : oThis.arrGrwthPrvsYer[j]== undefined ? "":oThis.arrGrwthPrvsYer[j]["ZzSubCharValue"],
																																																																		GrwthPrvsYer_X : oThis.arrGrwthPrvsYer[j]== undefined ? "":oThis.arrGrwthPrvsYer[j]["ZsubcharValue_X"],
																																																																				GrwthPrvsYer_isData : oThis.arrGrwthPrvsYer[j]== undefined ? false:(oThis.arrGrwthPrvsYer[j]["ZzSubCharValue"]==""?false:true),

																																																																						zOSTask :oThis.arrcmbOutlt[j]== undefined ? "":oThis.arrcmbOutlt[j]["ZzTask"],
																																																																								OutltSbtype : oThis.arrcmbOutlt[j]== undefined ? "":oThis.arrcmbOutlt[j]["ZzSubCharValue"],
																																																																										OutltSbtype_X : oThis.arrcmbOutlt[j]== undefined ? "":oThis.arrcmbOutlt[j]["ZsubcharValue_X"],	
																																																																												OutltSbtype_isData : oThis.arrcmbOutlt[j]== undefined ? false:(oThis.arrcmbOutlt[j]["ZzSubCharValue"]==""?false:true),	

																																																																														zOCTask	:oThis.arrOutltCnt[j]== undefined ? "":oThis.arrOutltCnt[j]["ZzTask"],
																																																																																OutltCnt : oThis.arrOutltCnt[j]== undefined ? "":oThis.arrOutltCnt[j]["ZzSubCharValue"],
																																																																																		OutltCnt_X : oThis.arrOutltCnt[j]== undefined ? "":oThis.arrOutltCnt[j]["ZsubcharValue_X"],
																																																																																				OutltCnt_isData : oThis.arrOutltCnt[j]== undefined ? false:(oThis.arrOutltCnt[j]["ZzSubCharValue"]==""?false:true)
				}
				arrBtypes.push(objType); 
			}
			var oJsonBTypeMod = new sap.ui.model.json.JSONModel(arrBtypes);
			oJsonBTypeMod.setDefaultBindingMode("OneWay");
			var oJsonBusTypsTypeMod = new sap.ui.model.json.JSONModel(oThis.busTypes?oThis.busTypes.HEADERITEMNAV.results:[]);
			oJsonBusTypsTypeMod.setDefaultBindingMode("OneWay");
			var  oComboBox = new sap.m.ComboBox({
				enabled:false,
				selectedKey : "{busTyepes}",
				//	valueState : com.ril.PRMS.util.Formatter.setColor("{busTyepes_X}","{zBTTask}"),
				valueState: "{parts:[{path:'busTyepes_X'},{path:'zBTTask'}],formatter:'com.ril.PRMS.util.Formatter.setColor'}",
				selectionChange:function(oEvent){
					oThis.onChangeBusinessType(oEvent);
				}
			})
			var oItemTemplate = new sap.ui.core.Item({
				key  : "{combo>AttrCode}",
				text    : "{combo>AttrValue}" ,
			});
			oComboBox.setModel(oJsonBusTypsTypeMod,"combo");
			oComboBox.bindItems("combo>/",oItemTemplate);

			var oJsonOutSunTypMod = new sap.ui.model.json.JSONModel(oThis.outltSbtype?oThis.outltSbtype.HEADERITEMNAV.results:[]);
			oJsonOutSunTypMod.setDefaultBindingMode("OneWay");
			var  oComboBox2 = new sap.m.ComboBox({
				enabled:false,
				selectedKey : "{OutltSbtype}",
				//			valueState : com.ril.PRMS.util.Formatter.setColor("{OutltSbtype_X}","{zOSTask}"),
				valueState: "{parts:[{path:'OutltSbtype_X'},{path:'zOSTask'}],formatter:'com.ril.PRMS.util.Formatter.setColor'}",
				selectionChange:function(oEvent){
					oThis.onChangeOutLet(oEvent);
				}
			})
			var oItemTemplate = new sap.ui.core.Item({
				key  : "{combo1>AttrCode}",
				text    : "{combo1>AttrValue}" ,
			});
			oComboBox2.setModel(oJsonOutSunTypMod,"combo1");
			oComboBox2.bindItems("combo1>/",oItemTemplate);
			oTable.setModel(oJsonBTypeMod);
			oTable.bindItems("/",new sap.m.ColumnListItem({
				cells:[
				       oComboBox,
				       new sap.m.Input({
				    	   enabled:false,
				    	   value:"{DstrbtnCmpny}",
				    	   //   valueState: com.ril.PRMS.util.Formatter.setColor("{DstrbtnCmpny_X}","{zDCTask}"),
				    	   valueState: "{parts:[{path:'DstrbtnCmpny_X'},{path:'zDCTask'}],formatter:'com.ril.PRMS.util.Formatter.setColor'}",
				    	   liveChange: function (oEvent){
				    		   oThis.onChangeDistributionCompany(oEvent);
				    	   }
				       }),
				       new sap.m.Input({
				    	   enabled:false,
				    	   value:"{YrsOprtn}",
				    	   //	   valueState: com.ril.PRMS.util.Formatter.setColor("{YrsOprtn_X}","{zYOTask}"),
				    	   valueState: "{parts:[{path:'YrsOprtn_X'},{path:'zYOTask'}],formatter:'com.ril.PRMS.util.Formatter.setColor'}",
				    	   liveChange: function (oEvent){
				    		   oThis.onLiveChangeYearsOfOperation(oEvent);
				    	   }
				       }),
				       new sap.m.Input({
				    	   enabled:false,
				    	   value:"{PrmtFndng}",
				    	   //   valueState:com.ril.PRMS.util.Formatter.setColor("{PrmtFndng_X}","{zPFTask}"),
				    	   valueState: "{parts:[{path:'PrmtFndng_X'},{path:'zPFTask'}],formatter:'com.ril.PRMS.util.Formatter.setColor'}",
				    	   liveChange: function (oEvent){
				    		   oThis.onLiveChangePromoterFunding(oEvent);
				    	   },
				       }),
				       new sap.m.Input({
				    	   enabled:false,
				    	   value:"{Roi}",
				    	   //   valueState: com.ril.PRMS.util.Formatter.setColor("{Roi_X}","{zRoiTask}"),
				    	   valueState: "{parts:[{path:'Roi_X'},{path:'zRoiTask'}],formatter:'com.ril.PRMS.util.Formatter.setColor'}", 
				    	   liveChange: function (oEvent){
				    		   oThis.liveChangeROIandGrwthInPrevYr(oEvent);
				    	   },
				    	   valueLiveUpdate:true,
				    	   change: function (oEvent){
				    		   oThis.changeValidateROIandGrwthInPrevYr(oEvent);
				    	   }
				       }),
				       new sap.m.Input({
				    	   enabled:false,
				    	   value:"{CerdtRcvdcmp}",
				    	   //   valueState: com.ril.PRMS.util.Formatter.setColor("{CerdtRcvdcmp_X}","{zCRTask}"),
				    	   valueState: "{parts:[{path:'CerdtRcvdcmp_X'},{path:'zCRTask'}],formatter:'com.ril.PRMS.util.Formatter.setColor'}",
				    	   liveChange: function (oEvent){
				    		   oThis.onLiveChangeCredRecFromCom(oEvent);
				    	   }
				       }),
				       new sap.m.Input({
				    	   enabled:false,
				    	   value:"{AnnulTrnvr}",
				    	   //   valueState: com.ril.PRMS.util.Formatter.setColor("{AnnulTrnvr_X}","{zATTask}"),
				    	   valueState: "{parts:[{path:'AnnulTrnvr_X'},{path:'zATTask'}],formatter:'com.ril.PRMS.util.Formatter.setColor'}",
				    	   liveChange: function (oEvent){
				    		   oThis.liveChangeCurrency(oEvent);
				    	   },
				    	   valueLiveUpdate:true,
				    	   change: function (oEvent){
				    		   oThis.changeValidateCurrency(oEvent);
				    	   }
				       }),
				       new sap.m.Input({
				    	   enabled:false,
				    	   value:"{GrwthPrvsYer}",
				    	   //   valueState: com.ril.PRMS.util.Formatter.setColor("{GrwthPrvsYer_X}","{zGPTask}"),
				    	   valueState: "{parts:[{path:'GrwthPrvsYer_X'},{path:'zGPTask'}],formatter:'com.ril.PRMS.util.Formatter.setColor'}",
				    	   liveChange: function (oEvent){
				    		   oThis.liveChangeROIandGrwthInPrevYr(oEvent);
				    	   },
				    	   valueLiveUpdate:true,
				    	   change: function (oEvent){
				    		   oThis.changeValidateROIandGrwthInPrevYr(oEvent);
				    	   }
				       }),
				       oComboBox2,            
				       new sap.m.Input({
				    	   enabled:false,
				    	   value:"{OutltCnt}",
				    	   //	   valueState: com.ril.PRMS.util.Formatter.setColor("{OutltCnt_X}","{zOCTask}"),
				    	   valueState: "{parts:[{path:'OutltCnt_X'},{path:'zOCTask'}],formatter:'com.ril.PRMS.util.Formatter.setColor'}",
				    	   liveChange: function (oEvent){
				    		   oThis.onLiveChangeOutlet(oEvent);
				    	   }  
				       })
				       ]
			})
			);
			
		}
		//For Colors Code///////////////////////////////////
	},
	onBusTypeAdd : function(){
		var oThis = this;
		var oView = oThis.getView();
		var oTable = oThis.byId("busTypeTab");
		//validation to make sure that all values in the list of business table have been filled
		for(var i=0;i<oTable.getItems().length;i++){
			var busType= oTable.getItems()[i].mAggregations.cells[0].getSelectedKey();
			var distComp= oTable.getItems()[i].mAggregations.cells[1].getValue();
			var yop= oTable.getItems()[i].mAggregations.cells[2].getValue();
			var pf= oTable.getItems()[i].mAggregations.cells[3].getValue();
			var roi= oTable.getItems()[i].mAggregations.cells[4].getValue();
			var credrecv= oTable.getItems()[i].mAggregations.cells[5].getValue();
			var anualtrnov= oTable.getItems()[i].mAggregations.cells[6].getValue();
			var grwthovrprev= oTable.getItems()[i].mAggregations.cells[7].getValue();
			var outltsubType= oTable.getItems()[i].mAggregations.cells[8].getSelectedKey();
			var outletCount= oTable.getItems()[i].mAggregations.cells[9].getValue();
			if(busType =="" || distComp =="" || yop =="" || pf=="" ||  roi =="" ||  credrecv =="" ||
					anualtrnov ==""	|| grwthovrprev =="" || outltsubType =="" || outletCount ==""){
				sap.m.MessageToast.show("Please enter all the data to add a new record!");
				return;
			}
		}
		
		var oJsonBusTypsTypeMod = new sap.ui.model.json.JSONModel(oThis.busTypes ?oThis.busTypes.HEADERITEMNAV.results:[]);
		oJsonBusTypsTypeMod.setDefaultBindingMode("OneWay");
		var  oComboBox = new sap.m.ComboBox({
			selectionChange:function(oEvent){
				oThis.onChangeBusinessType(oEvent);
			}
		})
		var oItemTemplate = new sap.ui.core.Item({
			key  : "{combo>AttrCode}",
			text    : "{combo>AttrValue}" ,
		});
		oComboBox.setModel(oJsonBusTypsTypeMod,"combo");
		oComboBox.bindItems("combo>/",oItemTemplate);

		var oJsonOutSunTypMod = new sap.ui.model.json.JSONModel(oThis.outltSbtype?oThis.outltSbtype.HEADERITEMNAV.results:[]);
		oJsonOutSunTypMod.setDefaultBindingMode("OneWay");
		var  oComboBox2 = new sap.m.ComboBox({
			selectionChange:function(oEvent){
				oThis.onChangeOutLet(oEvent);
			}
		})
		var oItemTemplate = new sap.ui.core.Item({
			key  : "{combo1>AttrCode}",
			text    : "{combo1>AttrValue}" ,
		});
		oComboBox2.setModel(oJsonOutSunTypMod,"combo1");
		oComboBox2.bindItems("combo1>/",oItemTemplate);
		var items = new sap.m.ColumnListItem({
			cells:[
			       oComboBox,
			       new sap.m.Input({    
			    	   liveChange: function (oEvent){
			    		   oThis.onChangeDistributionCompany(oEvent);
			    	   }
			       }),
			       new sap.m.Input({  
			    	   liveChange: function (oEvent){
			    		   oThis.onLiveChangeYearsOfOperation(oEvent);
			    	   }
			       }),
			       new sap.m.Input({   
			    	   liveChange: function (oEvent){
			    		   oThis.onLiveChangePromoterFunding(oEvent);
			    	   },
			       }),
			       new sap.m.Input({   
			    	   liveChange: function (oEvent){
			    		   oThis.liveChangeROIandGrwthInPrevYr(oEvent);
			    	   },
			    	   valueLiveUpdate:true,
			    	   change: function (oEvent){
			    		   oThis.changeValidateROIandGrwthInPrevYr(oEvent);
			    	   }
			       }),
			       new sap.m.Input({   
			    	   liveChange: function (oEvent){
			    		   oThis.onLiveChangeCredRecFromCom(oEvent);
			    	   }
			       }),
			       new sap.m.Input({    
			    	   liveChange: function (oEvent){
			    		   oThis.liveChangeCurrency(oEvent);
			    	   },
			    	   valueLiveUpdate:true,
			    	   change: function (oEvent){
			    		   oThis.changeValidateCurrency(oEvent);
			    	   }
			       }),
			       new sap.m.Input({     
			    	   liveChange: function (oEvent){
			    		   oThis.liveChangeROIandGrwthInPrevYr(oEvent);
			    	   },
			    	   valueLiveUpdate:true,
			    	   change: function (oEvent){
			    		   oThis.changeValidateROIandGrwthInPrevYr(oEvent);
			    	   }
			       }),
			       oComboBox2,
			       new sap.m.Input({  
			    	   liveChange: function (oEvent){
			    		   oThis.onLiveChangeOutlet(oEvent);
			    	   }  
			       })
			       ]
		});
		oTable.addItem(items);
	},
	onDeleteBusTypeTab : function(oEvent){
		var table= this.byId("busTypeTab");
		table.removeItem(oEvent.mParameters.listItem.oParent.indexOfItem(oEvent.mParameters.listItem));
		var list  = oEvent.mParameters.listItem.getBindingContext();
		if(list){
			var index = list.sPath.split("/")
			list.getModel().getData()[index[1]]["UnivTask"] = "D";
			this.LOBtableChange = true;
		}
		//table.removeItem(oEvent.getParameter('listItem'));
	},
	//-----------------AgentDetails on change of category-------------
	onChangeAgentCategory:function(oEvent){
		this.byId("AgentcomboName").destroyItems();
		this.byId("AgentcomboName").setSelectedKey("");
		var arr = this.docArr;
		var currentKey = oEvent.oSource.getSelectedKey();
		for(var l=0;l<arr.length;l++){
			if(currentKey == arr[l].parent){
				this.getView().byId("AgentcomboName").addItem(new sap.ui.core.Item({key:arr[l].code, text:arr[l].child }));
			}
		}
		var CatKey=this.getView().byId("AgentCategoryCombo").getSelectedKey();
		if(CatKey != null || CatKey != ""){
			this.getView().byId("AgentcomboName").setEnabled(true);
			this.getView().byId("AgentFileUpload").setEnabled(false);
			this.getView().byId("AgentFileUpload").setValue("");
			this.getView().byId("AgentUploadButton").setEnabled(false); 
		}
		else{
			this.getView().byId("AgentcomboName").setEnabled(false);
			this.getView().byId("AgentFileUpload").setEnabled(true);
		}
	},
	//-----------------Documents  on change of category-------------
	onChangeDocumentCategory:function(oEvent){
		this.byId("comboName").destroyItems();
		this.byId("comboName").setSelectedKey("");
		var arr = this.docArr_D;
		var currentKey = oEvent.oSource.getSelectedKey();
		for(var l=0;l<arr.length;l++){
			if(currentKey == arr[l].parent){
				this.getView().byId("comboName").addItem(new sap.ui.core.Item({key:arr[l].code, text:arr[l].child }));
			}
		}
		var CatKey=this.getView().byId("combo1").getSelectedKey;
		if(CatKey != null || CatKey != ""){
			this.getView().byId("comboName").setEnabled(true);
			this.getView().byId("DocumentFileUpload").setEnabled(false);
			this.getView().byId("DocumentFileUpload").setValue("");
			this.getView().byId("iddocumentuploadbtn").setEnabled(false); 
		}
		else{
			this.getView().byId("comboName").setEnabled(false);
			this.getView().byId("DocumentFileUpload").setEnabled(true);
		}
	},
	//Uploading AgentDetails tab bar
	AgentUploading:function(oEvent) {
		this.AgentExtId= this.getView().byId("inptExtrnlID").getValue();
		var docname=this.getView().byId("AgentcomboName").getSelectedKey();
		var doctype=this.AgentdocType;
		if(doctype == ""){
			sap.m.MessageToast.show("Can not Upload this selection");
			return;
		}
		else{
			this.FileBusy=new sap.m.BusyDialog({text:"File Uploading...."});
			this.FileBusy.open();	
			var file = jQuery.sap.domById(this.getView().byId("AgentFileUpload").sId+"-fu").files[0];
			var fNam = this.getView().byId("AgentFileUpload").oFilePath.getValue();
			if(file === undefined ||fNam==""){
				this.getView().byId("AgentFileUpload").setValue("");
				sap.m.MessageBox.show("Select file to upload ", {title:"Warning",icon:sap.m.MessageBox.Icon.WARNING});
				var file={};
				return;
			}
			try {
				if (file) {
					this._bUploading = true;
					var that = this;
					var a="/sap/opu/odata/sap/ZPRM_PARTNER_CENTER_SRV/";
					var f = {
							headers : {
								"X-Requested-With" : "XMLHttpRequest",
								"Content-Type" : "application/atom+xml",
								DataServiceVersion : "2.0",
								"X-CSRF-Token" : "Fetch"
							},
							requestUri : a,
							method : "GET"
					};
					var oHeaders;
					var sUrl="/sap/opu/odata/sap/ZPRM_PARTNER_CENTER_SRV/";
					var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
					com.ril.PRMS.core.setModel(oModel);
					that = this;
					OData.request(f, function(data, oSuccess) {
						var oToken = oSuccess.headers['x-csrf-token'];
						oHeaders = {
								"x-csrf-token" : oToken,
								"slug" :""+this.AgentExtId+","+doctype+","+docname+"",
						};
						var oURL= "/sap/opu/odata/sap/ZPRM_PARTNER_CENTER_SRV/FileUpAndDelSet";
						jQuery.ajax({
							type: 'POST',
							url: oURL,
							headers: oHeaders,
							cache: false,
							contentType: file.type,
							processData: false,
							data: file,
							success: function(datas,res,args){
								// that.oModel.refresh();
								var succ=that.getView().byId("AgentFileUpload").oFilePath.setValue(""); 
								if(succ!="")
								{
									that.AgentUploadComplete();
								}else {sap.m.MessageToast.show("File Not Uploaded Successfully");}

							}
						});
					});
				}
			} catch(oException) {
				this.FileBusy.close();
				this.getView().byId("AgentFileUpload").oFilePath.setValue("");
				jQuery.sap.log.error("File upload failed:\n" + oException.message);
			}
		}

	},
	AgentUploadComplete: function(oEvent) {
		var category = this.getView().byId("AgentCategoryCombo").getSelectedKey();
		var table=this.getView().byId("UploadTable2");
		var docname = this.getView().byId("AgentcomboName").getSelectedKey();
		var AgentFileName = this.getView().byId("AgentFileUpload").getValue();
		var doctype = this.AgentdocType;
		//var fruits = ["Banana", "Orange", "Apple", "Mango"];
		var items ={
				DocId:category,
				DocName:docname,
				DocKey:doctype,
				FileName:AgentFileName
		}
		for(var i=0;i<table.getItems().length;i++){
			var docTabtxt = table.getItems()[i].mAggregations.cells[1].mProperties.text;
			if(docTabtxt == docname){
				var index = table.getItems()[i];
				var docname = table.getItems()[i].mAggregations.cells[1].mProperties.text;  
				var doctype= table.getItems()[i].mAggregations.cells[2].mProperties.text;
				var path="/FileUpAndDelSet(DocType='"+doctype+"',DocName='"+docname+"',HqId='"+this.extrnlId+"')";
				this.oDataModel.remove(path,{success:function(oRequest,oResponse){
					table.removeItem(index);
					table.getModel().refresh();
				}
				});
			}
		} 		
		var items = new sap.m.ColumnListItem({
			cells:[

			       new sap.m.Text({text:category}),
			       new sap.m.Text({	text:docname}),
			       new sap.m.Text({visible:true}),
			       new sap.m.Text({text:doctype, visible:true}),
			       new sap.ui.core.Icon({visible:false}),
			       new sap.m.Text({visible:false})

			       ]
		});
		table.addItem(items);
		this.getView().byId("AgentCategoryCombo").setValue("");
		this.getView().byId("AgentCategoryCombo").clearSelection();
		this.getView().byId("AgentcomboName").setValue("");
		this.getView().byId("AgentcomboName").clearSelection();
		this.getView().byId("AgentcomboName").setEnabled(false);
		this.getView().byId("AgentFileUpload").setEnabled(false);
		this.FileBusy.close();

	},
	onComplete1: function(oEvent) {
		var table=this.getView().byId("UploadTable2");
		var b = this.getView().byId("AgentcomboName").getValue();
		var img = this.getView().byId("upload_2").getValue();
		var items ={
				DocId:a,
				DocType:b,
				DocName:img
		}
		var data=this.table1.getModel().getData();
		data.push(items);
		this.table1.getModel().setData(data);
		this.table1.updateBindings();
		this.byId("AgentcomboName").setSelectedKey("");
		this.byId("AgentCategoryCombo").setSelectedKey("");
	},
	uploadStarting1: function(eve){
		var that=this;
		setTimeout(function(){
			that.upload1();
		},500);
	},
	handleUploadPress: function(oEvent) {
		var oFileUploader = this.getView().byId("upload_2");
		oFileUploader.upload();
	},
	AgentUploadStart: function(eve){
		this.getView().byId("AgentUploadButton").setEnabled(false);
		var that=this;
		var proofid=this.getView().byId("AgentCategoryCombo").getSelectedKey();
		var prooftype=this.getView().byId("AgentcomboName").getValue();
		if(proofid==""){
			sap.m.MessageToast.show("PLease select proofid ");
		} else if(prooftype=="")
		{
			sap.m.MessageToast.show("PLease select prooftype ");
		} else{
			setTimeout(function(){
				that.AgentUploading();
			},500);
		}
	},
	onAddSalesTab: function(){
		var oThis = this;
		var oTable = oThis.byId("salesTab");
		for(var i=0;i<oTable.getItems().length;i++){
			var MonthSalesValDev= oTable.getItems()[i].mAggregations.cells[0].getSelectedKey();
			var BrandServicedDev= oTable.getItems()[i].mAggregations.cells[1].getSelectedKey();
			var ProductTypeDev= oTable.getItems()[i].mAggregations.cells[2].getSelectedKey();
			if(MonthSalesValDev =="" || BrandServicedDev =="" || ProductTypeDev ==""){
				sap.m.MessageToast.show("Please enter all the data to add a new record!");

				return;
			}
		}
		
		var monthSales =  oThis.mnthSale?oThis.mnthSale.HEADERITEMNAV.results:[];
		var brandServices = oThis.brndService?oThis.brndService.HEADERITEMNAV.results:[];
		var productType = oThis.prodType?oThis.prodType.HEADERITEMNAV.results:[];
		
		var oJsonMnthSaleTypeMod = new sap.ui.model.json.JSONModel(monthSales);
		oJsonMnthSaleTypeMod.setDefaultBindingMode("OneWay");
		var  oComboBox = new sap.m.ComboBox({
			selectionChange:function(oEvent){
				oThis.onchngSaleType(oEvent);
			}
		})
		var oItemTemplate = new sap.ui.core.Item({
			key  : "{combo>AttrCode}",
			text    : "{combo>AttrValue}" ,
		});
		oComboBox.setModel(oJsonMnthSaleTypeMod,"combo");
		oComboBox.bindItems("combo>/",oItemTemplate);
		var oJsonBrndServiceeMod = new sap.ui.model.json.JSONModel(brandServices);
		oJsonBrndServiceeMod.setDefaultBindingMode("OneWay");
		var oComboBox1 =  new sap.m.ComboBox({
			selectionChange:function(oEvent){
				oThis.onchngBrndType(oEvent);
			}
		})
		var oItemTemplate = new sap.ui.core.Item({
			key  : "{combo1>AttrCode}",
			text    : "{combo1>AttrValue}" ,
		});
		oComboBox1.setModel(oJsonBrndServiceeMod,"combo1");
		oComboBox1.bindItems("combo1>/",oItemTemplate);
		var oJsonProdTypeMod = new sap.ui.model.json.JSONModel(productType);
		oJsonProdTypeMod.setDefaultBindingMode("OneWay");
		var oComboBox2 =  new sap.m.ComboBox({
			selectionChange:function(oEvent){
				oThis.onchngPrdType(oEvent);
			}
		})
		var oItemTemplate = new sap.ui.core.Item({
			key  : "{combo2>AttrCode}",
			text    : "{combo2>AttrValue}" ,
		});
		oComboBox2.setModel(oJsonProdTypeMod,"combo2");
		oComboBox2.bindItems("combo2>/",oItemTemplate);
		var items = new sap.m.ColumnListItem({
			cells:[
			       oComboBox2,
			       oComboBox1,
			       oComboBox,
			       ]
		});
		oTable.addItem(items);
	},
	//************add button functionality for Connectivity Table Under ATTRIBUTE TAB- SUB SECTION LIST OF BUSINESSES***************
	onAddDeviceTab: function(){
		var oThis = this;
		var oTable = oThis.byId("deviceTab");
		for(var i=0;i<oTable.getItems().length;i++){
			var MonthSalesValCon= oTable.getItems()[i].mAggregations.cells[0].getSelectedKey();
			var BrandServicedCon= oTable.getItems()[i].mAggregations.cells[1].getSelectedKey();
			var ProductTypeCon= oTable.getItems()[i].mAggregations.cells[2].getSelectedKey();
			if(MonthSalesValCon =="" || BrandServicedCon =="" || ProductTypeCon ==""){
				sap.m.MessageToast.show("Please enter all the data to add a new record!");
				return;
			}
		}
		
		
		var monthSales =  oThis.mnthSaleDev?oThis.mnthSaleDev.HEADERITEMNAV.results:[];
		var brandServices = oThis.brndServiceDev?oThis.brndServiceDev.HEADERITEMNAV.results:[];
		var productType = oThis.prodTypeDev?oThis.prodTypeDev.HEADERITEMNAV.results:[];
		
		
		var oJsonMnthSaleTypeMod = new sap.ui.model.json.JSONModel(monthSales);
		oJsonMnthSaleTypeMod.setDefaultBindingMode("OneWay");
		var  oComboBox = new sap.m.ComboBox({
			selectionChange:function(oEvent){
				oThis.onChngeDevMnth(oEvent);
			}
		})
		var oItemTemplate = new sap.ui.core.Item({
			key  : "{combo>AttrCode}",
			text    : "{combo>AttrValue}" ,
		});
		oComboBox.setModel(oJsonMnthSaleTypeMod,"combo");
		oComboBox.bindItems("combo>/",oItemTemplate);
		var oJsonBrndServiceeMod = new sap.ui.model.json.JSONModel(brandServices);
		oJsonBrndServiceeMod.setDefaultBindingMode("OneWay");
		var oComboBox1 =  new sap.m.ComboBox({
			selectionChange:function(oEvent){
				oThis.onChngeDevBrd(oEvent);
			}
		})
		var oItemTemplate = new sap.ui.core.Item({
			key  : "{combo1>AttrCode}",
			text    : "{combo1>AttrValue}" ,
		});
		oComboBox1.setModel(oJsonBrndServiceeMod,"combo1");
		oComboBox1.bindItems("combo1>/",oItemTemplate);
		var oJsonProdTypeMod = new sap.ui.model.json.JSONModel(productType);
		oJsonProdTypeMod.setDefaultBindingMode("OneWay");
		var oComboBox2 =  new sap.m.ComboBox({
			selectionChange:function(oEvent){
				oThis.onChngeDevPrd(oEvent);
			}
		})
		var oItemTemplate = new sap.ui.core.Item({
			key  : "{combo2>AttrCode}",
			text    : "{combo2>AttrValue}" ,
		});
		oComboBox2.setModel(oJsonProdTypeMod,"combo2");
		oComboBox2.bindItems("combo2>/",oItemTemplate);
		var items = new sap.m.ColumnListItem({
			cells:[
			       oComboBox2,
			       oComboBox1,
			       oComboBox,
			       ]
		});
		oTable.addItem(items);
	},
	onDeviceTypeBinds : function(){
		var oThis = this;
		var arrBtypeDev = [];
		if(oThis.getView().getModel("salesDevval")){
			oThis.getView().getModel("salesDevval").oData = [];	
		}
		/*var salesDevval = oThis.getView().getModel("salesDevval");
		delete salesDevval;*/
		var MnthSaleDevType = oThis.getView().getModel("MnthSaleDevType");
		delete MnthSaleDevType;
		var BrndServiceDevMod = oThis.getView().getModel("BrndServiceDevMod");
		delete BrndServiceDevMod;
		var ProdTypeDevMod = oThis.getView().getModel("ProdTypeDevMod");
		delete ProdTypeDevMod;
		var oTable = oThis.byId("deviceTab");
		var arrlength = Math.max(oThis.arrMntlySlesDevVol.length,oThis.arrBrndSrvcdDev.length,oThis.arrPrdDevTyp.length);
		if(arrlength>0){
			for(var k=0;k<arrlength;k++){
				var objType = {
						zMntlySlesTask : oThis.arrMntlySlesDevVol[k]== undefined ?"":oThis.arrMntlySlesDevVol[k]["ZzTask"],
								MntlySlesVol_isData : oThis.arrMntlySlesDevVol[k]== undefined ? false:(oThis.arrMntlySlesDevVol[k]["ZzSubCharValue"]!=""?true:false),
										MntlySlesVol : oThis.arrMntlySlesDevVol[k]== undefined ? "":oThis.arrMntlySlesDevVol[k]["ZzSubCharValue"],
												MntlySlesVol_X : oThis.arrMntlySlesDevVol[k]== undefined ? "":oThis.arrMntlySlesDevVol[k]["ZsubcharValue_X"],
														BrndSrvcd_isData : oThis.arrBrndSrvcdDev[k]== undefined ? false:(oThis.arrBrndSrvcdDev[k]["ZzSubCharValue"]!=""?true:false),
																zBrndSrvcdTask : oThis.arrBrndSrvcdDev[k]== undefined ? "":oThis.arrBrndSrvcdDev[k]["ZzTask"],
																		BrndSrvcd : oThis.arrBrndSrvcdDev[k]== undefined ? "":oThis.arrBrndSrvcdDev[k]["ZzSubCharValue"],
																				BrndSrvcd_X : oThis.arrBrndSrvcdDev[k]== undefined ? "":oThis.arrBrndSrvcdDev[k]["ZsubcharValue_X"],
																						PrdTyp_isData : oThis.arrPrdDevTyp[k]== undefined ? false:(oThis.arrPrdDevTyp[k]["ZzSubCharValue"]!=""?true:false),
																								zPrdDevTypTask : oThis.arrPrdDevTyp[k]== undefined ? "": oThis.arrPrdDevTyp[k]["ZzTask"],
																										PrdTyp : oThis.arrPrdDevTyp[k]== undefined ? "":oThis.arrPrdDevTyp[k]["ZzSubCharValue"],
																												PrdTyp_X :oThis.arrPrdDevTyp[k]== undefined ? "":oThis.arrPrdDevTyp[k]["ZsubcharValue_X"],

				}
				arrBtypeDev.push(objType); 
			}
			
			var monthSales =  oThis.mnthSaleDev?oThis.mnthSaleDev.HEADERITEMNAV.results:[];
			var brandServices = oThis.brndServiceDev?oThis.brndServiceDev.HEADERITEMNAV.results:[];
			var productType = oThis.prodTypeDev?oThis.prodTypeDev.HEADERITEMNAV.results:[];
			
			var oJsonBTypeMod = new sap.ui.model.json.JSONModel(arrBtypeDev);
			oJsonBTypeMod.setDefaultBindingMode("OneWay");
			oThis.getView().setModel(oJsonBTypeMod,"salesDevval");
			var oJsonMnthDevTypeMod = new sap.ui.model.json.JSONModel(monthSales);
			oJsonMnthDevTypeMod.setDefaultBindingMode("OneWay");
			oThis.getView().setModel(oJsonMnthDevTypeMod,"MnthSaleDevType");
			var oJsonBrndServiceDevMod = new sap.ui.model.json.JSONModel(brandServices);
			oJsonBrndServiceDevMod.setDefaultBindingMode("OneWay");
			oThis.getView().setModel(oJsonBrndServiceDevMod,"BrndServiceDevMod");
			var oJsonProdTypeDevMod = new sap.ui.model.json.JSONModel(productType);
			oJsonProdTypeDevMod.setDefaultBindingMode("OneWay");
			oThis.getView().setModel(oJsonProdTypeDevMod,"ProdTypeDevMod");
		}
	},
	onSaleTypeBinds : function(){
		var oThis = this;
		var arrBtypes = [];
		//added by linga on 061016
		if(oThis.getView().getModel("salesval")){
			oThis.getView().getModel("salesval").oData = [];	
		}
		/*var salesval = oThis.getView().getModel("salesval");
		delete salesval;*/
		var MnthSaleType = oThis.getView().getModel("MnthSaleType");
		delete MnthSaleType;
		var BrndServiceeMod = oThis.getView().getModel("BrndServiceeMod");
		delete BrndServiceeMod;
		var ProdTypeMod = oThis.getView().getModel("ProdTypeMod");
		delete ProdTypeMod;
		var oTable = oThis.byId("salesTab");
		var arrlength = Math.max(oThis.arrMntlySlesVol.length,oThis.arrBrndSrvcd.length,oThis.arrPrdTyp.length);
		if(arrlength>0){
			for(var k=0;k<arrlength;k++){
				var objType = {
						zMntlySlesTask :oThis.arrMntlySlesVol[k]== undefined ? "":oThis.arrMntlySlesVol[k]["ZzTask"],
								MntlySlesVol_isData : oThis.arrMntlySlesVol[k]== undefined ? false:(oThis.arrMntlySlesVol[k]["ZzSubCharValue"]!=""?true:false),
										MntlySlesVol :oThis.arrMntlySlesVol[k]== undefined ? "":oThis.arrMntlySlesVol[k]["ZzSubCharValue"],
												MntlySlesVol_X :oThis.arrMntlySlesVol[k]== undefined ? "":oThis.arrMntlySlesVol[k]["ZsubcharValue_X"],
														BrndSrvcd_isData : oThis.arrBrndSrvcd[k]== undefined ? false:(oThis.arrBrndSrvcd[k]["ZzSubCharValue"]!=""?true:false),
																zBrndSrvcdTask :oThis.arrBrndSrvcd[k]== undefined ? "":oThis.arrBrndSrvcd[k]["ZzTask"],
																		BrndSrvcd :oThis.arrBrndSrvcd[k]== undefined ? "":oThis.arrBrndSrvcd[k]["ZzSubCharValue"],
																				BrndSrvcd_X :oThis.arrBrndSrvcd[k]== undefined ? "":oThis.arrBrndSrvcd[k]["ZsubcharValue_X"],
																						zPrdTypTask :oThis.arrPrdTyp[k]== undefined ? "":oThis.arrPrdTyp[k]["ZzTask"],
																								PrdTyp_isData : oThis.arrPrdTyp[k]== undefined ? false:(oThis.arrPrdTyp[k]["ZzSubCharValue"]!=""?true:false),
																										PrdTyp :oThis.arrPrdTyp[k]== undefined ? "":oThis.arrPrdTyp[k]["ZzSubCharValue"],
																												PrdTyp_X :oThis.arrPrdTyp[k]== undefined ? "":oThis.arrPrdTyp[k]["ZsubcharValue_X"],
				}
				arrBtypes.push(objType); 
			}
			
			var monthSales =  oThis.mnthSale?oThis.mnthSale.HEADERITEMNAV.results:[];
			var brandServices = oThis.brndService?oThis.brndService.HEADERITEMNAV.results:[];
			var productType = oThis.prodType?oThis.prodType.HEADERITEMNAV.results:[];
			
			var oJsonBTypeMod = new sap.ui.model.json.JSONModel(arrBtypes);
			oJsonBTypeMod.setDefaultBindingMode("OneWay");
			oThis.getView().setModel(oJsonBTypeMod,"salesval");
			var oJsonMnthSaleTypeMod = new sap.ui.model.json.JSONModel(monthSales);
			oJsonMnthSaleTypeMod.setDefaultBindingMode("OneWay");
			oThis.getView().setModel(oJsonMnthSaleTypeMod,"MnthSaleType");
			var oJsonBrndServiceeMod = new sap.ui.model.json.JSONModel(brandServices);
			oJsonBrndServiceeMod.setDefaultBindingMode("OneWay");
			oThis.getView().setModel(oJsonBrndServiceeMod,"BrndServiceeMod");
			var oJsonProdTypeMod = new sap.ui.model.json.JSONModel(productType);
			oJsonProdTypeMod.setDefaultBindingMode("OneWay");
			oThis.getView().setModel(oJsonProdTypeMod,"ProdTypeMod");
		}
	},
	//---chnge Connectivity------------
	onchngSaleType : function(oEvent){
		var obj = oEvent.oSource.oParent.getCells()[oEvent.oSource.oParent.indexOfCell(oEvent.oSource)].mProperties;
		obj["valueChange"] = true;
		this.salesTableChange = true;
	},
	//-----brnd Connectivity------------
	onchngBrndType : function(oEvent){
		var obj = oEvent.oSource.oParent.getCells()[oEvent.oSource.oParent.indexOfCell(oEvent.oSource)].mProperties;
		obj["valueChange"] = true;
		this.salesTableChange = true;
	},
	//---prd Connectivty---------------
	onchngPrdType : function(oEvent){
		var obj = oEvent.oSource.oParent.getCells()[oEvent.oSource.oParent.indexOfCell(oEvent.oSource)].mProperties;
		obj["valueChange"] = true;
		this.salesTableChange = true;
	},
	//----chnge mnth Devce------------
	onChngeDevMnth :function(oEvent){
		var obj = oEvent.oSource.oParent.getCells()[oEvent.oSource.oParent.indexOfCell(oEvent.oSource)].mProperties;
		obj["valueChange"] = true;
		this.devicesTableChange=true;
	},
	//---brnd Dev-----
	onChngeDevBrd :function(oEvent){
		var obj = oEvent.oSource.oParent.getCells()[oEvent.oSource.oParent.indexOfCell(oEvent.oSource)].mProperties;
		obj["valueChange"] = true;
		this.devicesTableChange=true;
	},
	//----prd Dev----------
	onChngeDevPrd : function(oEvent){
		var obj = oEvent.oSource.oParent.getCells()[oEvent.oSource.oParent.indexOfCell(oEvent.oSource)].mProperties;
		obj["valueChange"] = true;
		this.devicesTableChange=true;
	},
	onDelSales : function(oEvent){
		/*var table= this.byId("salesTab");
		table.removeItem(oEvent.getParameter('listItem'));*/
		var table= this.byId("salesTab");
		table.removeItem(oEvent.mParameters.listItem.oParent.indexOfItem(oEvent.mParameters.listItem));
	//	var list  = oEvent.mParameters.listItem.getBindingContext();
		var list  = oEvent.mParameters.listItem.oBindingContexts;
		if(list &&  list.salesval){
			var index = list.salesval.sPath.split("/")
			list.salesval.getModel().getData()[index[1]]["UnivTask"] = "D";
			this.salesTableChange = true;
		}
	},

	onDelSalesConnectivity : function(oEvent){
		/*	var table= this.byId("deviceTab");
		table.removeItem(oEvent.getParameter('listItem'));*/
		
		var table= this.byId("deviceTab");
		table.removeItem(oEvent.mParameters.listItem.oParent.indexOfItem(oEvent.mParameters.listItem));
		var list  = oEvent.mParameters.listItem.oBindingContexts;
		if(list && list.salesDevval){
			var index = list.salesDevval.sPath.split("/")
			list.salesDevval.getModel().getData()[index[1]]["UnivTask"] = "D";
			this.devicesTableChange = true;
		}
	},


	// Download function for agents and documents----
	onDownload:function(event){
		var that=this;
		var path="/BusinessFileSet(IvDocType='ITR',IvHqId='9876')/$value";
		this.oDataModel.read(path, null, null, true, function(oData, oResponse) {
			window.open(oResponse.requestUri);
		}, function(oError) {
			that.messageHandling.handleRequestFailure(oError,"",true);
		});
	},
//	Download for documents---------------------------------------------------------------------------
	onDocumentDownload:function(event){
		var that=this;
		var extidDocuments=this.extrnlId;
		var doctype =event.getSource().getBindingContext("jsonDoc").getObject().DocType;
		var docid=event.getSource().getBindingContext("jsonDoc").getObject().DocId
		var path="BusinessFileSet(IvDocId='"+docid+"',IvHqId='"+extidDocuments+"',IvDocType='"+doctype+"')/$value";
		that.oDataModel.read(path, null, null, true, function(oData, oResponse){
			window.open(oResponse.requestUri);  
		},function(oError){
			that.messageHandling.handleRequestFailure(oError, "", false);
		});
	},
	// --------------------Downloading for agents------------------------------------------------------------------	  
	onAgentDownload:function(event){
		var that=this;
		var doctype =event.getSource().getBindingContext("jsAgentRetrieve").getObject().DocType;
		var docid=event.getSource().getBindingContext("jsAgentRetrieve").getObject().DocId
		var AgentId=this.getView().byId("inptExtrnlID").getValue();
		var path="BusinessFileSet(IvDocId='"+docid+"',IvHqId='"+AgentId+"',IvDocType='"+doctype+"')/$value";
		that.oDataModel.read(path, null, null, true, function(oData, oResponse){
			window.open(oResponse.requestUri);  
		},function(oError){
			that.messageHandling.handleRequestFailure(oError, "", false);
		});
	},

	onUpdateInputFields:function(oEvent){

		//------------------------------Profile Tab input field validations--------------------------------------//
		var companyName= this.getView().byId("inptCompName").getValue();
		var companyNameLength = companyName.length;
		if(companyNameLength > 40){

			sap.m.MessageToast.show("Company code cannot exceed 40 characters");
			return;
		}

		var Alias= this.getView().byId("inptAliasName").getValue();
		var AliasLength = companyName.length;
		if(AliasLength > 40){

			sap.m.MessageToast.show("Alias field cannot exceed 40 characters");
			return;
		}


		//------------------------------Address Tab input field validations--------------------------------------//

		var AddressLine1= this.getView().byId("inptHouseno").getValue();
		var AddressLine1Length = AddressLine1.length;
		if(AddressLine1Length > 40){

			sap.m.MessageToast.show("Address Line1 field cannot exceed 40 characters");
			return;
		}

		var AddressLine2= this.getView().byId("inptStreet").getValue();
		var AddressLine2Length = AddressLine2.length;
		if(AddressLine2Length > 60){

			sap.m.MessageToast.show("Address Line2 field cannot exceed 60 characters");
			return;
		}

		var AddressLine3= this.getView().byId("inptlandmark").getValue();
		var AddressLine3Length = AddressLine3.length;
		if(AddressLine3Length > 40){

			sap.m.MessageToast.show("Address Line3 field cannot exceed 40 characters");
			return;
		}

		var AreaLocality= this.getView().byId("inptAreaLoc").getValue();
		var AreaLocalityLength = AreaLocality.length;
		if(AreaLocalityLength > 40){

			sap.m.MessageToast.show("Area/Locality field cannot exceed 40 characters");
			return;
		}

		var SubLocality= this.getView().byId("inptSubLclty").getValue();
		var SubLocalityLength = SubLocality.length;
		if(SubLocalityLength > 40){

			sap.m.MessageToast.show("Sub Locality field cannot exceed 40 characters");
			return;
		}

		var PostalCode = this.getView().byId("inptPostalCde").getValue();
		var PostalCodeLength = PostalCode.length;
		if(PostalCodeLength < 6){

			sap.m.MessageToast.show("Postal code should be 6 digits!");
			return;
		}

		var FixedLinNum = this.getView().byId("inpFaxedLneNo").getValue();
		var FixedLinNumLength = FixedLinNum.length;
		if(FixedLinNumLength > 27){

			sap.m.MessageToast.show("Fixed Line Number cannot exceed 27 characters!");
			return;
		}


		var EmailOnAddressTab = this.getView().byId("inptCompEmail").getValue();
		var EmailOnAddressTabLength = EmailOnAddressTab.length;
		if(EmailOnAddressTabLength > 240){

			sap.m.MessageToast.show("Email Addres cannot exceed 240 characters!");
			return;
		}

		var WebSiteOnAddressTab = this.getView().byId("inptCompWebsite").getValue();
		var WebSiteOnAddressTabLength = WebSiteOnAddressTab.length;
		if(WebSiteOnAddressTabLength > 132){

			sap.m.MessageToast.show("Web Site field cannot exceed 132 characters!");
			return;
		}

		//------------------------------Attributes Tab input field validations--------------------------------------//

		var AgentDssNameCode = this.getView().byId("AgentDssNme").getValue();
		var AgentDssNameCodeLength = AgentDssNameCode.length;
		if(AgentDssNameCodeLength < 3){

			sap.m.MessageToast.show("Agent(DSS) Name/Code field cannot be less than 3 characters!");
			return;
		}

		var securityInstrument = this.getView().byId("inptScurtyInstrmntDtls").getValue();
		var securityInstrumentLength = securityInstrument.length;
		if(securityInstrumentLength < 1){

			sap.m.MessageToast.show("Security Instrument details field cannot be less than 1 character!");
			return;
		}





		//-----------------------------Ref Dealer-Tab input field validations--------------------------------//

		var PinCode = this.getView().byId("inpLocRefPin").getValue();
		var PinCodeLength = PinCode.length;
		if(PinCodeLength < 6){

			sap.m.MessageToast.show("Pin code should be 6 digits!");
			return;
		}

//		-----------------------------Agent Details-Tab input field validations--------------------------------//

		var PinCodeAgentDet = this.getView().byId("inpAgentPrePin").getValue();
		var PinCodeAgentDetLength = PinCodeAgentDet.length;
		if(PinCodeAgentDetLength < 6){

			sap.m.MessageToast.show("Pin code should be 6 digits!");
			return;
		}

		var PinCodeAgentDet2 = this.getView().byId("inpAgentPerPin").getValue();
		var PinCodeAgentDet2Length = PinCodeAgentDet2.length;
		if(PinCodeAgentDet2Length < 6){

			sap.m.MessageToast.show("Pin code should be 6 digits!");
			return;
		}


		var PinCodeAgentDet3 = this.getView().byId("inpAgentRefPin").getValue();
		var PinCodeAgentDet3Length = PinCodeAgentDet3.length;
		if(PinCodeAgentDet3Length < 6){

			sap.m.MessageToast.show("Pin code should be 6 digits!");
			return;
		}
	},

	//postalcode validation for-------Address tab postalcode field----------------------
	onPostalChange : function(oEvent){
		var PostalCode = this.getView().byId("inptPostalCde").getValue();
		var str = oEvent.getSource().getValue();
		str = str.replace(/[^0-9]/g, '');
		oEvent.getSource().setValue(str);
	},

	//Fixed Line Number validation for-------Address tab Fixed Line Number field-on Address Tab---------------------

	//----------------------Address Tab-Email address validation for the email on Address Tab------------------------
	onChangeEmail: function(evt){
		var email = this.getView().byId("inptCompEmail").getValue();

		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (re.test(email)) {
			/*sap.m.MessageToast.show("Valid Mail Address");*/
		} else {
			sap.m.MessageToast.show("Invalid E-Mail Address");
			this.getView().byId("inptCompEmail").setValue("");
			return;
		}
		this.objSaveData["Email"]=email;
		this.objSaveData["Email_X"]="X";
	},


	//----------------------Address Tab-Web Site validation for the web site on Address Tab------------------------


	onChangeWebsite: function(evt){
		var userInput=this.getView().byId("inptCompWebsite").getValue();
		var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
		if (!re.test(userInput)) { 
			sap.m.MessageToast.show("url error");

		}else{/*sap.m.MessageToast.show("url suceess");*/}
		this.objSaveData["Website"]=userInput;
		this.objSaveData["Website_X"]="X";		
	},

	//----------------------Attribute Tab-Security Instrument details validation------------------------
	onSecuInstrDet:function(oEvent){

		var str = oEvent.getSource().getValue();
		str = str.replace(/[^a-z0-9]/gi,'');
		oEvent.getSource().setValue(str);

		var strlLen=str.length;
		if(strlLen<3){
			sap.m.MessageToast.show("Security Instrument Detail should be atleast 3 character!");
			return;
		}

	},

	//----------------------Attribute Tab-Security Amount Rs validation------------------------

	//------------------------------------Ref. Dealer Tab-Email validation---------------------------------------

	onChangeEmailRefDealer: function(evt){
		var email = this.getView().byId("inpLocRefEmail").getValue();

		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (re.test(email)) {
			/*sap.m.MessageToast.show("Valid Mail Address");*/
		} else {
			sap.m.MessageToast.show("Invalid E-Mail Address");
			this.getView().byId("inpLocRefEmail").setValue("");
			return;
		}
	},

	//------------------------------------Ref. Dealer pin code validation---------------------------------------
	onPinCodeRefDealer:function(oEvent){
		var PinCode = this.getView().byId("inpLocRefPin").getValue();
		var str = oEvent.getSource().getValue();
		str = str.replace(/[^0-9]/g, '');
		oEvent.getSource().setValue(str);
		var pinCode1 = PinCode.length;

	},
	//------------------------------------Agent Details pin code validation in Present Address---------------------------------------
	onPinCodeAgentDetails:function(oEvent){
		var PinCode = this.getView().byId("inpAgentPrePin").getValue();
		var str = oEvent.getSource().getValue();
		str = str.replace(/[^0-9]/g, '');
		oEvent.getSource().setValue(str);
		var pinCode1 = PinCode.length;

	},

	//------------------------------------Agent Details pin code validation in Permanant Address---------------------------------------
	onPinCodeAgentDetails2:function(oEvent){
		var PinCode = this.getView().byId("inpAgentPerPin").getValue();
		var str = oEvent.getSource().getValue();
		str = str.replace(/[^0-9]/g, '');
		oEvent.getSource().setValue(str);
		var pinCode1 = PinCode.length;

	},

	//------------------------------------Agent Details pin code validation in Reference Agents Address-------------------------------
	onPinCodeAgentDetails3:function(oEvent){
		var PinCode = this.getView().byId("inpAgentRefPin").getValue();
		var str = oEvent.getSource().getValue();
		str = str.replace(/[^0-9]/g, '');
		oEvent.getSource().setValue(str);
		var pinCode1 = PinCode.length;

	},





	//------------------------------------Agent Details email validation in Contact Information subsection---------------------------------------
	onChangeEmailAgentDetContInfo: function(evt){
		var email = this.getView().byId("inptEmail").getValue();

		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (re.test(email)) {
			/*sap.m.MessageToast.show("Valid Mail Address");*/
		} else {
			sap.m.MessageToast.show("Invalid E-Mail Address");
			this.getView().byId("inptEmail").setValue("");
			return;
		}
		if(this.byId("idIconTabBar").getSelectedKey() === "agentDtls"){
			this.changeAgentData(this.getProperty(evt));
		}
	},

	//------------------------------------Agent Details email validation in Reference Agents-Contact subsection---------------------------------------
	onChangeEmailAgentDetAgRefCon: function(evt){
		var email = this.getView().byId("inpAgentRefEmail").getValue();

		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (re.test(email)) {
			/*sap.m.MessageToast.show("Valid Mail Address");*/

		} else {
			sap.m.MessageToast.show("Invalid E-Mail Address");
			this.getView().byId("inpAgentRefEmail").setValue("");
			return;
		}
		if(this.byId("idIconTabBar").getSelectedKey() === "agentDtls"){
			this.changeAgentData(this.getProperty(evt));
		}
	},
	//====CredLimt=================
	onLiveChangeCrdLmt : function(oEvent){
		var vAmount = oEvent.getSource().getValue();
		var val = vAmount;
		var re = /^([0-9]+[\.]?[0-9]?[0-9]?|[0-9]+)$/g;
		var re1 = /^([0-9]+[\.]?[0-9]?[0-9]?|[0-9]+)/g;
		if (re.test(val)) {
		} else {
			val = re1.exec(val);
			if (val) {
				oEvent.getSource().setValue(val[0]);
			} else {
				oEvent.getSource().setValue("");
			}
		}
		var indexOfDot = vAmount.indexOf(".");
		if(indexOfDot == "-1"){
			var length = vAmount.length;
			if(length>11){
				vAmount = vAmount.slice(0,-1);
				oEvent.getSource().setValue(vAmount);
			}
			if(length==11){
				oEvent.getSource().setValue(vAmount +".00");
			}
		}
	},

	//----------------------------------Validation for Profile Tab 22nd Aug 2016  Worked Pranaksh------------------------------------
	//----------------------for Company and Alias Name --- Profile Tab------------------------
	onLiveChangeCompAliasValue:function(oEvent){
		var str = oEvent.getSource().getValue();
		var str = str.replace(/[#\!`~$%^*\+\,\:\;\=\_\\\|\"\?<\>\{\}\[\]]/g, '');
		oEvent.getSource().setValue(str);
		this.objSaveData["Locationname2"]=str;
		this.objSaveData["Locationname2_X"]="X";

	},	
	onLiveChangeCompAlias:function(oEvent){
		var str = oEvent.getSource().getValue();
		var str = str.replace(/[#\!`~$%^*\+\,\:\;\=\_\\\|\"\?<\>\{\}\[\]]/g, '');
		oEvent.getSource().setValue(str);
		this.objSaveData["Locationname1"]=str;
		this.objSaveData["Locationname1_X"]="X";

	},	
	onLiveChangeOrganization: function(oEvent){
		var str = oEvent.getSource().getValue();
		var str = str.replace(/[#\!`~$%^*\+\,\:\;\=\_\\\|\"\?<\>\{\}\[\]]/g, '');
		oEvent.getSource().setValue(str);
	},
	//--------------------------validations for All Address fields-----------------------
	onLiveChangeAddress:function(oEvent){
		var str = oEvent.getSource().getValue();
		var str = str.replace(/[@\!`~$%^*\+\=\&\:\_\|\"\?<\>\{\}\[\]]/g, '');
		oEvent.getSource().setValue(str);
		if(this.byId("idIconTabBar").getSelectedKey() === "agentDtls"){
			this.changeAgentData(this.getProperty(oEvent));
		}
	},
//	----------Fixed Line Number validation for-------Address tab Fixed Line Number field-on Address Tab---------------------
	onChangeFixedLinNum:function(oEvent){
		var str = oEvent.getSource().getValue();
		str = str.replace(/[^0-9]/g, '');
		oEvent.getSource().setValue(str);
		if(this.byId("idIconTabBar").getSelectedKey() === "agentDtls"){
			this.changeAgentData(this.getProperty(oEvent));
		}
	},
//	----------	
	//--------------------------------identifies Tab- validation for Doc Number-----------------------------------------
	onChangeDealerIdent:function(oEvent){
		/// added by linga on 29.9.16
		var obj = oEvent.oSource.oParent.getCells()[oEvent.oSource.oParent.indexOfCell(oEvent.oSource)].mProperties;
		obj["valueChange"] = true;
		this.identifierTaxTableChange = true;
		oEvent.oSource.oParent.getBindingContext() ? oEvent.oSource.oParent.getBindingContext().getObject().isChanged = true:"";

		//-------------------------------

		var idTable = this.getView().byId("taxTable");
		var rowIndex =  idTable.indexOfItem(oEvent.getSource().getParent());
		var lvPrType = idTable.getItems()[rowIndex].mAggregations.cells[1].getValue();
		if(lvPrType=="Credit Card Statement(not older 3 month)" || lvPrType=="Photo Credit Card "){
			var str = oEvent.getSource().getValue();
			oEvent.getSource().setMaxLength(16);
			str = str.replace(/[^0-9]/g, '');
			oEvent.getSource().setValue(str);

		}else if(lvPrType=="Driver's License Number" || lvPrType=="Driver's License Number (POA for PRM)"){
			var str = oEvent.getSource().getValue();
			oEvent.getSource().setMaxLength(30);
			var regex="^[a-zA-Z\d\/\-]$";
			oEvent.getSource().setValue(str);
			if(str.match(regex)){
			}else{
				var str = str.replace(/[#\!`~$%^*\+\,\.\s\@\&\(\)\=\_\\\|\"\?<\>\{\}\[\]]/g, '');
				oEvent.getSource().setValue(str);
			}
			if(strlen<3){
				return;
			}
		}else if(lvPrType=="Passport (POA for PRM)" || lvPrType== "Passport"){
			var str = oEvent.getSource().getValue();
			oEvent.getSource().setMaxLength(8);
			var strlen=str.length;
			str = str.replace(/[^A-Z0-9]/g, '');
			if(strlen == 1)
			{
				this.strAlp = str.replace(/[^A-Z]/g, '');
				oEvent.getSource().setValue(this.strAlp);
			}
			else
			{

				str = str.replace(/[^0-9]/g, '');
				idTable.getItems()[rowIndex].mAggregations.cells[2].setValue(this.strAlp+""+str);
			}
		}else if(lvPrType=="Aadhaar Number (POA for PRM)" || lvPrType=="Aadhaar Number"){
			var str = oEvent.getSource().getValue();
			oEvent.getSource().setMaxLength(12);
			str = str.replace(/[^0-9]/g, '');
			oEvent.getSource().setValue(str);

		}else if(lvPrType == "Term Code" || lvPrType == "Channel Partner LST No." || lvPrType == "Channel Partner CST No." || lvPrType == "Channel Partner Ser. tax No."){
			var str = oEvent.getSource().getValue();
			oEvent.getSource().setMaxLength(40);
			var regex = "^[a-zA-Z\d\(\)\.\,\:\;\_\#\/\\\-]$"
				if(!str.match(regex)){
						var str2 = str.replace(/[@\!`~$%^*\+\s\&\=\|\"\?<\>\{\}\[\]]/g, '');
					oEvent.getSource().setValue(str2);
				}
			
		}else{
			var str = oEvent.getSource().getValue();
			var  strlen =str.length;
			oEvent.getSource().setMaxLength(30);
			//str = str.replace(/[^0-9]/g, '');
			var regex="^[a-zA-Z\d\/\-]$";
			oEvent.getSource().setValue(str);
			if(str.match(regex)){
			}else{
				var str = str.replace(/[#\!`~$%^*\+\,\.\s\@\&\(\)\=\_\\\|\"\?<\>\{\}\[\]]/g, '');
				oEvent.getSource().setValue(str);
			}
			if(strlen<3){
				return;
			}
		}

	},
	onChangePOA:function(oEvent){
		/// added by linga on 29.9.16
		var obj = oEvent.oSource.oParent.getCells()[oEvent.oSource.oParent.indexOfCell(oEvent.oSource)].mProperties;
		obj["valueChange"] = true;
		oEvent.oSource.oParent.getBindingContext()?oEvent.oSource.oParent.getBindingContext().getObject().isChanged = true:"";
		//-------------------------------
		var idTable = this.getView().byId("proofTable");
		var rowIndex =  idTable.indexOfItem(oEvent.getSource().getParent());
		var lvPrType = idTable.getItems()[rowIndex].mAggregations.cells[1].getValue();
		if(lvPrType=="Credit Card Statement(not older 3 month)" || lvPrType=="Photo Credit Card "){
			var str = oEvent.getSource().getValue();
			oEvent.getSource().setMaxLength(16);
			str = str.replace(/[^0-9]/g, '');
			oEvent.getSource().setValue(str);
			return;
		}
		else  if(lvPrType=="Driver's License Number" || lvPrType=="Driver's License Number (POA for PRM)"){
			var str = oEvent.getSource().getValue();
			oEvent.getSource().setMaxLength(30);
			var regex="^[a-zA-Z\d\/\-]$";
			oEvent.getSource().setValue(str);
			if(str.match(regex)){
				return;
			}else{
				var str = str.replace(/[#\!`~$%^*\+\,\.\s\@\&\(\)\=\_\\\|\"\?<\>\{\}\[\]]/g, '');
				oEvent.getSource().setValue(str);
			}
			if(strlen<3){
				return;
			}
		}
		else if(lvPrType=="Passport (POA for PRM)" || lvPrType== "Passport"){//
			var str = oEvent.getSource().getValue();
			oEvent.getSource().setMaxLength(8);
			var strlen=str.length;
			var strAlp;
			str = str.replace(/[^a-zA-Z0-9]/g, '');
			if(strlen == 1){
				strAlp = str.replace(/[^a-zA-Z]/g, '').toUpperCase();
				oEvent.getSource().setValue(strAlp);
			}else{
				str = str.replace(/[^0-9]/g, '');
				idTable.getItems()[rowIndex].mAggregations.cells[2].setValue(strAlp+str);
			}
		}
		else if(lvPrType=="Aadhaar Number (POA for PRM)" || lvPrType=="Aadhaar Number"){
			var str = oEvent.getSource().getValue();
			oEvent.getSource().setMaxLength(12);
			str = str.replace(/[^0-9]/g, '');
			oEvent.getSource().setValue(str);
			return;
		}
		else{
			var str = oEvent.getSource().getValue();
			var  strlen =str.length;
			oEvent.getSource().setMaxLength(30);
			var regex="^[a-zA-Z\d\/\-]$";
			oEvent.getSource().setValue(str);
			if(str.match(regex)){
			}else{
				var str = str.replace(/[#\!`~$%^*\+\,\.\s\@\&\(\)\=\_\\\|\"\?<\>\{\}\[\]]/g, '');
				oEvent.getSource().setValue(str);
			}
			if(strlen<3){
				return;
			}
		}
	},
	//------------------------------Attributes Tab-Infrastructure----------------------------------
	//---------Full time employees----------------
	onLiveChangeFullTimeEmps:function(oEvent){

		var str = oEvent.getSource().getValue();
		str = str.replace(/[^0-9]/g, '');
		oEvent.getSource().setValue(str);
		var strlen = str.length;
	},
	onChangeFullTimeEmps:function(oEvent){
		var str = oEvent.getSource().getValue();
		str = str.replace(/[^0-9]/g, '');
		oEvent.getSource().setValue(str);
		var strlen = str.length;
		if(strlen<1){
			sap.m.MessageToast.show("Full Time Employees should be atleast 1 character!");
			return;
		}
	},
	//-------------No. Of vehicles----------------
	onLiveChangeNoOfVeh:function(oEvent){
		var str = oEvent.getSource().getValue();
		str = str.replace(/[^0-9]/g, '');
		oEvent.getSource().setValue(str);
	},
	onChangeNoOfVeh:function(oEvent){
		var str = oEvent.getSource().getValue();
		str = str.replace(/[^0-9]/g, '');
		oEvent.getSource().setValue(str);
		var strlen = str.length;
		if(strlen<1){
			sap.m.MessageToast.show("No. Of Vehicles should be atleast 1 character!");
			return;
		}
		var obj={
				TransactionNo : this.transact,
				Task :oEvent.oSource.isData ? "U":"I",
						Zzname : "ZINFR",
						Zzvalue : "ZOINF",
						Zzsubchar_Name :"ZNVEH",
						Zzsubchar_Value :oEvent.oSource.getValue(),
						ZsubcharValue_X :"X",
						ZzsubcharName_X :"",
						Zzname_X : "",
						Zzvalue_X : ""
		}
		this.removeDuplicateData(this.addChars,"Zzsubchar_Name","ZSHFS");
		this.addChars.push(obj); 
		this.objSaveData.PUTOADDCHARSNAV = this.addChars;
	},
	//------------------------------Attributes Tab-Financial Information----------------------------------
	//--------------------IFSC code--------------------------
	onChangeIFSCCode:function(oEvent){
		var str = oEvent.getSource().getValue();
		var re = /[A-Z|a-z]{4}[0][\d\w]{6}$/;
		if (re.test(str)) {
			//sap.m.MessageToast.show("Valid IFSC Address");
			this.getView().byId("inptIfcCode").setValueState("None");
		} else {

			sap.m.MessageToast.show("Invalid IFSC Code!");
			this.getView().byId("inptIfcCode").setValueStateText("Ex:SBIN0016897");	
			oEvent.getSource().setValue("");
		}
	},
	//-------------------Security Amout Rs---------------------------
	onLiveChangeSecurityAmtRs : function(oEvent){
		var vAmount = oEvent.getSource().getValue();
		var val = vAmount;
		var re = /^([0-9]+[\.]?[0-9]?[0-9]?|[0-9]+)$/g;
		var re1 = /^([0-9]+[\.]?[0-9]?[0-9]?|[0-9]+)/g;
		if (re.test(val)) {
			//do something here
		} else {
			val = re1.exec(val);
			if (val) {
				oEvent.getSource().setValue(val[0]);
			} else {
				oEvent.getSource().setValue("");
			}
		}
		var indexOfDot = vAmount.indexOf(".");
		if(indexOfDot == "-1"){
			var length = vAmount.length;
			if(length>10){
				vAmount = vAmount.slice(0,-1);
				oEvent.getSource().setValue(vAmount);
			}
			if(length==10){
				oEvent.getSource().setValue(vAmount +".00");
			}
		}
	},
	onChangeSecurityAmtRs : function(oEvent){
		var vAmount = oEvent.getSource().getValue();
		var boolDecimalPoint = vAmount.indexOf(".");
		var decimalValue = "";
		var vAmountlen=vAmount.length;
		if(vAmountlen==10){
			oEvent.getSource().setValue(vAmount +".00");
		}
		if(boolDecimalPoint != "-1"){
			decimalValue = vAmount.substring(vAmount.indexOf('.'),vAmount.length);
			if(decimalValue.length == 1 || decimalValue.length == 2){
				vAmount = parseFloat(vAmount).toFixed(2);
				oEvent.getSource().setValue(vAmount);
			}
		}else{
			vAmount = parseFloat(vAmount).toFixed(2);
			oEvent.getSource().setValue(vAmount=="NaN"?"":vAmount);
		}
		this.objSaveData["ContSecurityDeposit"]=vAmount;
		this.objSaveData["ContSecurityDeposit_X"]="X";
	},
	//-------------------Account Holder name------------------------------
	//for account holder name------ in Attributes Tab
	onLiveChangeAccHolderName:function(oEvent){
		var str = oEvent.getSource().getValue();
		var regex="^[a-zA-Z \.\(\)\\@\&\'\/\-]$";
		var strlen = str.length;
		if(str.match(regex)){
		}else{
			var str = str.replace(/[#\!`~$%^*\+\d\,\:\;\=\_\\\|\"\?<\>\{\}\[\]]/g, '');
			oEvent.getSource().setValue(str);
		}
		if(strlen<2){
			sap.m.MessageToast.show("Account Holder Name should be atleast 2 characers!")
			return;
		}
	},
	//--------------------------Bank Account Number--------------------------------
	//-------for all alphanumeric fields----
	onChangeAlphaNumeric:function(oEvent){
		var str = oEvent.getSource().getValue();
		var strlen=str.length;
		str = str.replace(/[^a-z0-9]/g, '');
		oEvent.getSource().setValue(str);
	},
	//--------------------Bank Name---------------------------------------
	onLiveChangeBankName:function(oEvent){
		var str = oEvent.getSource().getValue();
		var regex="^[a-zA-Z .\(\)\\-]$";
		var strlen = str.length;
		if(str.match(regex)){
		}
		else{
			var str = str.replace(/[#\!`~$%^*\+\d\,\\&\:\/\@\;\'\=\_\\\|\"\?<\>\{\}\[\]]/g, '');
			oEvent.getSource().setValue(str);
		}
		if(strlen<4){
			sap.m.MessageToast.show("Bank Name should be atleast 4 characters!")
			return;
		}
	},
	//------------------------branch name min length check
	onChangeBranchName:function(){
		var branchName=this.getView().byId("inptBranchName").getValue();
		var branchNameLength=branchName.length;
		if(branchNameLength<4){
			sap.m.MessageToast.show("Branch Name should be minimum of 4 characters!");
			return;
		}
	},
	//-------------------------------delivery boy name------------------------------------
	//NOTE: onLiveChangeDelvBoyName() function used in the service detail subsection of Attributes tab for Name input 
	onLiveChangeDelvBoyName:function(oEvent){
		var str = oEvent.getSource().getValue();
		var regex="^[a-zA-Z .\'\-]$";
		var strlen = str.length;
		if(str.match(regex)){
		}
		else{
			var str = str.replace(/[#\!`~$%^*\+\d\,\\&\:\/\@\(\)\;\=\_\\\|\"\?<\>\{\}\[\]]/g, '');
			oEvent.getSource().setValue(str);
		}
		if(strlen<4){
			sap.m.MessageToast.show("Delivery Boy Name should be atleast 4 characters!")
			return;
		}
	},
	//----------------------------currency field validation-------------------------
	liveChangeCurrency : function(oEvent){
		//changed by linga on 041016 
		var obj;
		if(oEvent.oSource.oParent.mAggregations.cells){
			obj = oEvent.oSource.oParent.getCells()[oEvent.oSource.oParent.indexOfCell(oEvent.oSource)].mProperties;	
			// need to change 
			if(this.byId("IdTurnProf").getSelected()){
				this.LOBtableChange= true;				
			}
			obj["valueChange"] = true;
		}else{
			oEvent.oSource.valueChange = true;
		}

		var vAmount = oEvent.getSource().getValue();
		var val = vAmount;
		var re = /^([0-9]+[\.]?[0-9]?[0-9]?|[0-9]+)$/g;
		var re1 = /^([0-9]+[\.]?[0-9]?[0-9]?|[0-9]+)/g;
		if (re.test(val)) {
			//do something here
		} else {
			val = re1.exec(val);
			if (val) {
				oEvent.getSource().setValue(val[0]);
			} else {
				oEvent.getSource().setValue("");
			}
		}
		var indexOfDot = vAmount.indexOf(".");
		if(indexOfDot == "-1"){
			var length = vAmount.length;
			if(length>12){
				vAmount = vAmount.slice(0,-1);
				oEvent.getSource().setValue(vAmount);
			}
			if(length==12){
				oEvent.getSource().setValue(vAmount +".00");
			}
		}
	},
	changeAnualturnOver : function(oEvt){
		var turnValue = oEvt.getSource().getValue();
		var obj={
				TransactionNo : this.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZCPSALES-ZYEAR1TURNOVER",
						Zzvalue : turnValue,
						Zzname_X : "",
						Zzvalue_X : "X"
		}
		this.removeDuplicateData(this.arrDelChars,"Zzname",obj.Zzname);
		this.arrDelChars.push(obj);
		this.objSaveData.PUTODEALERCHARSNAV = this.arrDelChars;
	},
	changeAnnual1Profit : function(oEvt){
		var annProfit = oEvt.getSource().getValue();
		var obj={
				TransactionNo : this.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZCPSALES-ZYEAR1PROFIT",
						Zzvalue : annProfit,
						Zzname_X : "",
						Zzvalue_X : "X"
		}
		this.removeDuplicateData(this.arrDelChars,"Zzname",obj.Zzname);
		this.arrDelChars.push(obj);
		this.objSaveData.PUTODEALERCHARSNAV = this.arrDelChars;
	},
	changeAnnual2Profit : function(oEvt){
		var annProfit = oEvt.getSource().getValue();
		var obj={
				TransactionNo : this.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZCPSALES-ZYEAR2PROFIT",
						Zzvalue : annProfit,
						Zzname_X : "",
						Zzvalue_X : "X"
		}
		this.removeDuplicateData(this.arrDelChars,"Zzname",obj.Zzname);
		this.arrDelChars.push(obj);
		this.objSaveData.PUTODEALERCHARSNAV = this.arrDelChars;
	},
	changeAnnualYearProfit : function(oEvt){
		var anturnover = oEvt.getSource().getValue();
		var obj={
				TransactionNo : this.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZCPSALES-ZYEAR2TURNOVER",
						Zzvalue : anturnover,
						Zzname_X : "",
						Zzvalue_X : "X"
		}
		this.removeDuplicateData(this.arrDelChars,"Zzname",obj.Zzname);
		this.arrDelChars.push(obj);
		this.objSaveData.PUTODEALERCHARSNAV = this.arrDelChars;
	},
	changeValidateCurrency : function(oEvent){
		var vAmount = oEvent.getSource().getValue();
		var boolDecimalPoint = vAmount.indexOf(".");
		var decimalValue = "";
		var vAmountlen=vAmount.length;
		if(vAmountlen==12){
			oEvent.getSource().setValue(vAmount +".00");
		}
		if(boolDecimalPoint != -1){
			decimalValue = vAmount.substring(vAmount.indexOf('.'),vAmount.length);
			if(decimalValue.length == 1 || decimalValue.length == 2){
				vAmount = parseFloat(vAmount).toFixed(2);
				oEvent.getSource().setValue(vAmount);
			}
		}else{
			vAmount = parseFloat(vAmount).toFixed(2);
			oEvent.getSource().setValue(vAmount=="NaN"?"":vAmount);
		}
		//return vAmount; 
	},
	//-----------------------------------------List of Business------------------------------------
	//Distribution Company validation-------------
	onChangeDistributionCompany:function(oEvent){
		//changed by linga on 041016 
		var obj = oEvent.oSource.oParent.getCells()[oEvent.oSource.oParent.indexOfCell(oEvent.oSource)].mProperties;
		obj["valueChange"] = true;
		this.LOBtableChange= true;

		var str = oEvent.getSource().getValue();
		var regex="^[a-zA-Z0-9\\.\(\)\\@\&\'\/\-]$";
		var strlen = str.length;
		if(strlen<1){
			return;
		}else{
			if(str.match(regex)){
			}else{
				var str = str.replace(/[#\!`~$%^*\+\,\=\_\\\|\"\?<\>\{\}\[\]]/g, '');
				oEvent.getSource().setValue(str);
			}
		}
	},
	//years of operation---------------
	onLiveChangeYearsOfOperation:function(oEvent){
		//changed by linga on 041016 
		var obj = oEvent.oSource.oParent.getCells()[oEvent.oSource.oParent.indexOfCell(oEvent.oSource)].mProperties;
		obj["valueChange"] = true;
		this.LOBtableChange= true;

		var str = oEvent.getSource().getValue();
		var strMaxLen=oEvent.getSource().setMaxLength(3);
		str = str.replace(/[^0-9]/g, '');
		oEvent.getSource().setValue(str);  
	},
	// Business type change 
	onChangeBusinessType:function(oEvent){
		var obj = oEvent.oSource.oParent.getCells()[oEvent.oSource.oParent.indexOfCell(oEvent.oSource)].mProperties;
		obj["valueChange"] = true;
		this.LOBtableChange= true;

	},
	// outlet type change 

	onChangeOutLet:function(oEvent){
		var obj = oEvent.oSource.oParent.getCells()[oEvent.oSource.oParent.indexOfCell(oEvent.oSource)].mProperties;
		obj["valueChange"] = true;
		this.LOBtableChange= true;
	},
	//promoter funding---------------------
	onLiveChangePromoterFunding:function(oEvent){
		//changed by linga on 041016 
		var obj = oEvent.oSource.oParent.getCells()[oEvent.oSource.oParent.indexOfCell(oEvent.oSource)].mProperties;
		obj["valueChange"] = true;
		this.LOBtableChange= true;

		var str = oEvent.getSource().getValue();
		var strMaxLen=oEvent.getSource().setMaxLength(10);
		str = str.replace(/[^0-9]/g, '');
		oEvent.getSource().setValue(str);  
		var strlen=str.length;
		if(strlen<3){
			sap.m.MessageToast.show("Promoter Funding should be atleast 3 digits!");
			return;
		}
	},
	//ROI-------------------
	liveChangeROIandGrwthInPrevYr: function(oEvent){
		//changed by linga on 041016 
		var obj = oEvent.oSource.oParent.getCells()[oEvent.oSource.oParent.indexOfCell(oEvent.oSource)].mProperties;
		obj["valueChange"] = true;
		this.LOBtableChange= true;

		var vAmount = oEvent.getSource().getValue();
		var val = vAmount;
		var re = /^([0-9]+[\.]?[0-9]?[0-9]?|[0-9]+)$/g;
		var re1 = /^([0-9]+[\.]?[0-9]?[0-9]?|[0-9]+)/g;
		if (re.test(val)) {
			//do something here
		} else {
			val = re1.exec(val);
			if (val) {
				oEvent.getSource().setValue(val[0]);
			} else {
				oEvent.getSource().setValue("");
			}
		}
		var indexOfDot = vAmount.indexOf(".");
		if(indexOfDot != "-1"){
			var folatVLength = vAmount.substring(vAmount.indexOf("."),vAmount.length).length;
			//
			if(folatVLength>2){
				vAmount = vAmount.slice(0,-1);
				oEvent.getSource().setValue(vAmount);
				return;
			}
		}
		var length = vAmount.length;
		if(length==3 && indexOfDot == "-1"){
			oEvent.getSource().setValue(vAmount +".0");
		}
	},
	changeValidateROIandGrwthInPrevYr : function(oEvent){
		var vAmount = oEvent.getSource().getValue();
		var boolDecimalPoint = vAmount.indexOf(".");
		var decimalValue = "";
		var vAmountlen=vAmount.length;
		if(vAmountlen==3 && boolDecimalPoint == "-1"){
			oEvent.getSource().setValue(vAmount +".0");
			return;
		}
		if(boolDecimalPoint != -1){
			decimalValue = vAmount.substring(vAmount.indexOf('.'),vAmount.length);
			if(decimalValue.length == 1 || decimalValue.length == 1){
				vAmount = parseFloat(vAmount).toFixed(1);
				oEvent.getSource().setValue(vAmount);
			}
		}else{
			
			vAmount = parseFloat(vAmount).toFixed(1);
			oEvent.getSource().setValue(vAmount=="NaN"?"":vAmount);
		}
	},
	//Credit recieved from company------ is the same as promoter funding function---
	onLiveChangeCredRecFromCom:function(oEvent){
		//changed by linga on 041016 
		var obj = oEvent.oSource.oParent.getCells()[oEvent.oSource.oParent.indexOfCell(oEvent.oSource)].mProperties;
		obj["valueChange"] = true;
		this.LOBtableChange= true;

		var str = oEvent.getSource().getValue();
		var strMaxLen=oEvent.getSource().setMaxLength(10);
		str = str.replace(/[^0-9]/g, '');
		oEvent.getSource().setValue(str);  
		var strlen=str.length;
		if(strlen<3){
			sap.m.MessageToast.show("Credit recieved from Company should be atleast 3 digits!");
			return;
		}
	},
	//Annual Turnover (cr)----- I have called the same function used in the validation of currency field i.e changeValidateCurrency() and  liveChangeCurrency
	//Growth over previous year I have called the same fucntion used in case of ROI for the validation of Growth over previous year--------------
	//Outlet Count-------
	onLiveChangeOutlet:function(oEvent){
		//changed by linga on 041016 
		var obj = oEvent.oSource.oParent.getCells()[oEvent.oSource.oParent.indexOfCell(oEvent.oSource)].mProperties;
		obj["valueChange"] = true;
		this.LOBtableChange= true;

		var str = oEvent.getSource().getValue();
		var strMaxLen=oEvent.getSource().setMaxLength(6);
		str = str.replace(/[^0-9]/g, '');
		oEvent.getSource().setValue(str);  
		var strlen=str.length;
		if(strlen<1){
			sap.m.MessageToast.show("Credit recieved from Company should be atleast 1 digit!");
			return;
		}
	},
	//----Name field validation-----------------
	onLiveChangeName:function(oEvent){
		var str = oEvent.getSource().getValue();
		var regex="^[a-zA-Z .\'\-]$";
		var strlen = str.length;
		if(str.match(regex)){

		}
		else{
			var str = str.replace(/[#\!`~$%^*\+\d\,\\&\:\/\@\(\)\;\=\_\\\|\"\?<\>\{\}\[\]]/g, '');
			oEvent.getSource().setValue(str);
		}

		if(this.byId("idIconTabBar").getSelectedKey() === "agentDtls"){
			this.changeAgentData(this.getProperty(oEvent));
		}
	},
	//---------------------------Organization Name (validation same as company name)-----------------------------
	//----------designation ------------------------
	onLiveChangeDesignation:function(oEvent){
		var str = oEvent.getSource().getValue();
		var regex="^[a-zA-Z.\'\-]$";
		var strlen = str.length;
		if(str.match(regex)){

		}
		else{
			var str = str.replace(/[#\!`~$%^*\+\d\s\,\\&\:\/\@\(\)\;\=\_\\\|\"\?<\>\{\}\[\]]/g, '');
			oEvent.getSource().setValue(str);
		}

		if(this.byId("idIconTabBar").getSelectedKey() === "agentDtls"){
			this.changeAgentData(this.getProperty(oEvent));
		}
	},
	//--------------------------------------------Agent Detials Tab---------------------------------------------------
	//---------permanant address subsection--------------------
	onLiveChangeYrsOfExp:function(oEvent){
		var str = oEvent.getSource().getValue();
		str = str.replace(/[^0-9]/g, '');
		oEvent.getSource().setValue(str);
		if(this.byId("idIconTabBar").getSelectedKey() === "agentDtls"){
			this.changeAgentData(["inpYOE",str]);
		}
	},	  
	//------------------------------------Agent Details mobile number validation in Contact information subsection---------------------
	onLiveChangeMno : function(oEvent) {
		var str = oEvent.getSource().getValue();
		str = str.replace(/[^0-9]/g, '');
		oEvent.getSource().setValue(str);
		var number1 = str.length;
		if(this.byId("idIconTabBar").getSelectedKey() === "agentDtls"){
			this.changeAgentData(this.getProperty(oEvent));
		}
	},
	jobfuncSelectChange : function(){
		var jobkey=this.getView().byId("cmbJobFnctn").getSelectedKey();
		var agenttable=this.getView().byId("UploadTable2");
		if(jobkey == "Y7"){
			agenttable.setVisible(true);
			this.getView().byId("agentdocsimpleform").setVisible(true);
			this.getView().byId("PanelAgentDocUpload").setVisible(true);
			this.onSelectionChangeCheck();
		}else{
			agenttable.setVisible(false);
			this.getView().byId("agentdocsimpleform").setVisible(false);
			this.getView().byId("PanelAgentDocUpload").setVisible(false);
		}
		if(this.byId("idIconTabBar").getSelectedKey() === "agentDtls"){
			this.changeAgentData(["jbFun",jobkey]);
		}
	},
	onloadAgentUploadData : function(sKey){
		var jobkey=this.getView().byId("cmbJobFnctn").getSelectedKey();
		var agenttable=this.getView().byId("UploadTable2");
		if(jobkey == "Y7"){
			agenttable.setVisible(true);
			this.getView().byId("agentdocsimpleform").setVisible(true);
			this.getView().byId("PanelAgentDocUpload").setVisible(true);
			this.onLoadCheck(sKey);
		}else{
			agenttable.setVisible(false);
			this.getView().byId("agentdocsimpleform").setVisible(false);
			this.getView().byId("PanelAgentDocUpload").setVisible(false);
		}
	},
	onLoadCheck:function(sKey){
		var that = this;
		var tabitems=this.getView().byId("UploadTable2").getItems().length;
		var AgentHQId=this.getView().byId("inptExtrnlID").getValue();
		if(sKey =="agentDtls"){
			if(this.Agentflag == 0){
				var path="/FileUpAndDelSet(DocType='',DocName='',HqId='"+AgentHQId+"')";
				this.oDataModel.remove(path,null,false,function(oRequest,oResponse){
					tabitems.getModel().getData().splice(index,1);
					tabitems.getModel().refresh();
					sap.m.MessageToast.show(JSON.parse(oResponse.headers["sap-message"]).message);
				},function(oError) {
					sap.m.MessageToast.show(oError);
				});
				this.Agentflag = 1;
			}
		}
		if(tabitems !== 0){
			return;
		}
		else{
			if (sKey === "agentDtls")
			{
				var AgentActivityId=this.getView().byId("inptExtrnlID").getValue();
				var path="/BusinessFileInfoSet/?$filter=IvUuid eq '"+AgentActivityId+"'";
				var TableAgent=this.getView().byId("UploadTable2");
				that.oDataModel.read(path, null,[],{async:true,success:function(oData, oResponse) {
					var jsonAgentRetrieve=new sap.ui.model.json.JSONModel();
					jsonAgentRetrieve.setData(oData);
					TableAgent.setModel(jsonAgentRetrieve,"jsAgentRetrieve");
				},error:function(){}

				});
			}
		}
	},
	onSelectionChangeCheck : function()
	{
		var that=this;
		var AgentActivityId=this.getView().byId("inptExtrnlID").getValue();
		var path="/BusinessFileInfoSet/?$filter=IvUuid eq '"+AgentActivityId+"'";
		var TableAgent=this.getView().byId("UploadTable2");
		that.oDataModel.read(path, null,[], true, function(oData, oResponse) {
			var jsonAgentRetrieve=new sap.ui.model.json.JSONModel();
			jsonAgentRetrieve.setData(oData);
			TableAgent.setModel(jsonAgentRetrieve,"jsAgentRetrieve");	
		});
	},
//	=============================================Modifying     TEENU===============07.09.2016=========================
	//======== PROFILE TAB==================
	//------Ownership-----------
	onChngeOwnrType: function(evt){
		var ownrshipkey=evt.oSource.getSelectedKey();
		this.objSaveData["Ownershiptype"]=ownrshipkey;
		this.objSaveData["Ownershiptype_X"]="X";
	},
	//-----Company Name------------
	chnageCompany : function(evt){
		/*var compValue=evt.oSource.getValue();
		this.objSaveData["Locationname1"]=compValue;
		this.objSaveData["Locationname1_X"]="X";*/
	},
	//-----Alias Name--------------
	onAliasName : function(evt){
		/*var aliasValue=evt.oSource.getValue();
		this.objSaveData["Locationname2"]=aliasValue;
		this.objSaveData["Locationname2_X"]="X";*/
	},
	//-----Relation Type---------------
	onChangeRelationType: function(evt){
		var HqDet = this.getView().byId("tabLocation").getVisible();
		if(HqDet == true){
			var realtionSubType=this.getView().byId("cmbRelationSubTypePftb2");
			var selectedKey =this.getView().byId("cmbRelationTypePftb2").getSelectedKey();
		}else{
			var realtionSubType=this.getView().byId("cmbRelationSubType");
			var selectedKey=this.getView().byId("cmbRelationType").getSelectedKey();
		}
		if(evt !=undefined){
			this.objSaveData["Cptype"]=selectedKey;
			this.objSaveData["Cptype_X"]="X";
		}
		realtionSubType.destroyItems();
		realtionSubType.setValue("");
		this.onBindRelSubType(selectedKey,realtionSubType);
	},
	//------------Relation SubType-----------
	onChangeRelationSubType: function(evt){
		var relationSubType=evt.oSource.getSelectedKey();
		this.objSaveData["Cpsubtype"]=relationSubType;
		this.objSaveData["Cpsubtype_X"]="X";
	},
	//------------Location Type----------------
	onLocationType: function(evt){
		var locTypekey=evt.oSource.getSelectedKey();
		this.objSaveData["Locationtype"]=locTypekey;
		this.objSaveData["Locationtype_X"]="X";
	},
	//------------Location Sub Type---------------			   
	onLocationSubType:function(evt){
		var locSubTypekey=evt.oSource.getSelectedKey();
		this.objSaveData["Locationsubtype"]=locSubTypekey;
		this.objSaveData["Locationsubtype_X"]="X";
	},
	//-----------Date of Inc---------------------
	chngeDofInc : function(evt){
		/* Added by linga on Oct 27, 2016 at 4:32:32 PM */
		var currentDate = new Date();
		var yesterdayDate = currentDate.setDate(currentDate.getDate()-1); 
		if(evt.oSource.getDateValue()> yesterdayDate){
			sap.m.MessageToast.show("Date of Incorporation should be less than Today's date. ");
			evt.oSource.setDateValue();
			return;
		}
		
		var dofInc=evt.oSource.getValue();
		this.objSaveData["DateInc"]=dofInc+"T00:00:00";
		this.objSaveData["DateInc_X"]="X";
	},
	//---------Ret Category----------------
	onChangeRetCatgry : function(evt){
		var oThis =this;
		var retCat=evt.oSource.getSelectedKey();
		var obj = {
				TransactionNo:oThis.transact,
				Task:evt.oSource.isData?"U":"I",
						ZzsegmentName:"ZDBT",
						ZzsegmentValue : retCat,
						ZzsegmentName_X:"",
						ZzsegmentValue_X:"X"

		}
		this.removeDuplicateData(this.arrRet,"ZzsegmentName",obj.ZzsegmentName);
		this.arrRet.push(obj);
	},

	removeDuplicateData:function(postingData,property,value){

		for(var i=0;i<postingData.length;i++){
			if(postingData[i][property] == value){
				postingData.splice(i,1);
				break;
			}
		}
	},
	prodfinish : function(oEvent){
		var oThis =this;
		if(this.editMultiModeTable(oEvent,false)){
			return;
		}
		var Length=oEvent.oSource.getSelectedItems().length
		oEvent.oSource.oParent.oParent.setHeaderText("Product Group "+"("+ Length+" "+"Selected"+ ")");
		var selItem = oEvent.mParameters.listItem.oBindingContexts.jsonData.getObject();
		var isBaknd = oEvent.mParameters.listItem.oBindingContexts.jsonData.getObject().isBackend;
		var isSelected = oEvent.mParameters.listItem.getSelected();
		var chck = isSelected?(isBaknd?"":"I"):(isBaknd?"D":"");
		if(chck == ""){
			for(var i=0;i<this.arrDelChars.length;i++){
				if(this.arrDelChars[i].Zzname == "PRODGROUP"){
					if(this.arrDelChars[i].Zzvalue == selItem.AttrCode){
						this.arrDelChars.splice(i,1);
					}
				}
			}
		}else{
			var obj={
					TransactionNo : this.transact,
					Task : chck,
					Zzname : "PRODGROUP",
					Zzvalue : selItem.AttrCode,
					Zzname_X : "",
					Zzvalue_X : "X"
			}
			this.arrDelChars.push(obj);	
		}
	},

	editMultiModeTable:function(e,ind){
	//	if(!this.editIndForTables){
		if(!ind){
			if(e.mParameters.listItem.getSelected()){
				e.mParameters.listItem.setSelected(false);
				return true;
			}else{
				e.mParameters.listItem.setSelected(true);
				return true;
			}
		}
	},
	//---------Ret Bus Type-------------
	onChangeRetBusType : function(evt){
		var oThis =this;
		var retBusType=evt.oSource.getSelectedKey();
		var obj = {
				TransactionNo:oThis.transact,
				Task: evt.oSource.isData?"U":"I",
						ZzsegmentName:"ZDSG",
						ZzsegmentValue : retBusType,
						ZzsegmentName_X:"",
						ZzsegmentValue_X:"X"
		}
		this.removeDuplicateData(this.arrRet,"ZzsegmentName","ZDSG");
		this.arrRet.push(obj);
	},
	//-------Ass Bus Grp-------------------------------------   
	AssBusgroupFinish : function(oEvent){
		var oThis =this;
		if(this.editMultiModeTable(oEvent,this.editIndForTables)){
			return;
		}
		var Length=oEvent.oSource.getSelectedItems().length
		oEvent.oSource.oParent.oParent.setHeaderText("Assigned Business Group "+"("+ Length+" "+"   "+"Selected"+")");
		var selItem = oEvent.mParameters.listItem.oBindingContexts.jsonAssbgroup.getObject();
		var isBaknd = oEvent.mParameters.listItem.oBindingContexts.jsonAssbgroup.getObject().isBackend;
		var isSelected = oEvent.mParameters.listItem.getSelected();
		var chck = isSelected?(isBaknd?"":"I"):(isBaknd?"D":"");
		if(chck == ""){
			for(var i=0;i<this.arrDelChars.length;i++){
				if(this.arrDelChars[i].Zzname == "BUSGROUP"){
					if(this.arrDelChars[i].Zzvalue == selItem.AttrCode){
						this.arrDelChars.splice(i,1);
					}
				}
			}
		}else{
			var obj={
					TransactionNo : this.transact,
					Task : chck,
					Zzname : "BUSGROUP",
					Zzvalue : selItem.AttrCode,
					Zzname_X : "",
					Zzvalue_X : "X"
			}
			this.arrDelChars.push(obj);	
		}
	},
	Modeofdelv:function(oEvent){
		var oThis =this;
		if(this.editMultiModeTable(oEvent,this.editIndForTables)){
			return;
		}
		var Length=oEvent.oSource.getSelectedItems().length
		oEvent.oSource.oParent.oParent.setHeaderText("Mode of Delivery "+"("+ Length+" "+"Selected"+ ")");
		var selItem = oEvent.mParameters.listItem.oBindingContexts.jsonDataModeOfdelv.getObject();
		var isBaknd = oEvent.mParameters.listItem.oBindingContexts.jsonDataModeOfdelv.getObject().isBackend;
		var isSelected = oEvent.mParameters.listItem.getSelected();
		var chck = isSelected?(isBaknd?"":"I"):(isBaknd?"D":"");
		
		if(chck == ""){
			for(var i=0;i<this.addChars.length;i++){
				if(this.addChars[i].Zzname == "ZINFR"){
					if(this.addChars[i].Zzsubchar_Value == selItem.AttrCode){
						this.addChars.splice(i,1);
					}
				}
			}
		}else{
			var obj={
					TransactionNo : this.transact,
					Task : chck,
					Zzname : "ZINFR",
					Zzvalue : "ZOINF",
					Zzsubchar_Name :"ZDELM",
					Zzsubchar_Value :selItem.AttrCode,
					Zzname_X : "",
					Zzvalue_X : "",
					ZzsubcharName_X :"",
					ZsubcharValue_X :"X"
			}
			this.addChars.push(obj);
		}
	},
	Connectoffice:function(oEvent){
		var oThis =this;
		if(this.editMultiModeTable(oEvent,this.editIndForTables)){
			return;
		}
		var Length=oEvent.oSource.getSelectedItems().length
		oEvent.oSource.oParent.oParent.setHeaderText("Connectivity "+"("+ Length+" "+"Selected"+ ")");
		var selItem = oEvent.mParameters.listItem.oBindingContexts.jsonDataConOff.getObject();
		var isBaknd = oEvent.mParameters.listItem.oBindingContexts.jsonDataConOff.getObject().isBackend;
		var isSelected = oEvent.mParameters.listItem.getSelected();
		var chck = isSelected?(isBaknd?"":"I"):(isBaknd?"D":"");if(chck == "" ){
			for(var i=0;i<this.addChars.length;i++){
				if(this.addChars[i].Zzname == "ZINFR"){
					if(this.addChars[i].Zzsubchar_Value == selItem.AttrCode){
						this.addChars.splice(i,1);
					}
				}
			}
		}else{
			var obj={
					TransactionNo : this.transact,
					Task : chck,
					Zzname : "ZINFR",
					Zzvalue : "ZOINF",
					Zzsubchar_Name :"ZOCON",
					Zzsubchar_Value :selItem.AttrCode,
					ZsubcharValue_X :"X",
					ZzsubcharName_X :"",
					Zzname_X : "",
					Zzvalue_X : ""
			}
			this.addChars.push(obj);
		}
	},
	//---------------Sales Hierachi---------------------
	//-----------R4G State -----------------------
	//check  onR4gStateChange function---  
	//------Deleivary Center------------
	onDeliveryCntr : function(evt){
		var delvryCntr=evt.oSource.getSelectedKey();
		this.objSaveData["DeliveringSiteDc"]=delvryCntr;
		this.objSaveData["DeliveringSiteDc_X"]="X";
	},   
	//-------Circle------------
	onCircleChange : function(evt){
		var circle=evt.oSource.getSelectedKey();
		this.objSaveData["CircleId"]=circle;
		this.objSaveData["CircleId_X"]="X";
	},
	//-----R4GArea-----------
	//Check onR4GAreaChange function----------
	//------Jio Center-----------
	//Check onJIOCenterChange function--
	//-----CAF PICK UP-------
	onChangeCAF : function(evt){
		var caf=evt.oSource.getSelectedKey();
		var obj={
				TransactionNo:this.transact,
				Task :"",
				ZzparentType :"CA",
				ZzparentId :caf,
				ZzparentType_X :"",
				ZzparentId_X :"X"
		}
		this.removeDuplicateData(this.arrParentNv,"ZzparentType","CA");
		this.arrParentNv.push(obj);
	},
	onFOSAgent :function(evt){
		var fos=evt.oSource.getSelectedKey();
		var obj={
				TransactionNo:this.transact,
				Task :"",
				ZzparentType :"FS",
				ZzparentId :fos,
				ZzparentType_X :"",
				ZzparentId_X :"X"
		}
		this.removeDuplicateData(this.arrParentNv,"ZzparentType","FS");
		this.arrParentNv.push(obj);
	},
	onchkBillParty : function(evt){
		var bill2Party = evt.oSource.getSelected();
		var billString;
		if(bill2Party == true){
			billString = "BP";
		}else{
			billString = "";
		}
		this.objSaveData["RelationType01"]=billString;
		this.objSaveData["RelationType01_X"]="X";
	},
	onchkshipParty : function(evt){
		var ship2Party = evt.oSource.getSelected();
		var shipString;
		if(ship2Party == true){
			shipString = "SH";
		}else{
			shipString = "";
		}
		this.objSaveData["RelationType02"]=shipString;
		this.objSaveData["RelationType02_X"]="X";
	},
	//====Address Tab=====
	//-----Add Line 1----------
	onChangeHouseNo : function(evt){
		var Add1 = evt.oSource.getValue();
		this.objSaveData["HouseNo"]=Add1;
		this.objSaveData["HouseNo_X"]="X";
	},
	//-----Add Line 2----------
	onChangeAdd2 : function(evt){
		var Add2 = evt.oSource.getValue();
		this.objSaveData["Street"]=Add2;
		this.objSaveData["Street_X"]="X";
	},			    
	//---Area/Locality--------
	onChageArea : function(evt){
		var area = evt.oSource.getSelectedKey();
		this.objSaveData["Location"]=area;
		this.objSaveData["Location_X"]="X";
		this.setLongitude_Latitude();
	},
	//---Add Line 3----------
	onChangeAddLne3 : function(evt){
		var Add3 = evt.oSource.getValue();
		this.objSaveData["StrSuppl2"]=Add3;
		this.objSaveData["StrSuppl2_X"]="X";
	},
	//----Sub Locatity----------
	onSubLocaty : function(evt){
		var subLclty = evt.oSource.getValue();
		this.objSaveData["StrSuppl3"]=subLclty;
		this.objSaveData["StrSuppl3_X"]="X";
	},
	//-----Postal code--------
	onChangePinpost : function(evt){
		var postalCde = evt.oSource.getValue();
		if(postalCde.length<6){
			this.clearCityField();
		}
		this.objSaveData["PostlCod1"]=postalCde;
		this.objSaveData["PostlCod1_X"]="X";
	},
	//---District------
	onChangeDistrict : function(evt){
		var distrct = evt.oSource.getSelectedKey();
		this.objSaveData["District"]=distrct;
		this.objSaveData["District_X"]="X";
	},
	//----State--------
	onChangeState : function(evt){
		//var state =evt.oSource.getSelectedKey();
		if(evt){
			var state = this.byId("cmbState").getSelectedKey();
			this.objSaveData["Region"]=state;
			this.objSaveData["Region_X"]="X";
		}

	},
	//-----Country------
	onChangeCountry : function(evt){
		var country =evt.oSource.getSelectedKey();
		this.objSaveData["Country"]=country;
		this.objSaveData["Country_X"]="X";
	},
	//---Comp Contact Details----------------
	//---Mob-------
	onChangeMobNo_add : function(evt){
		var mobNo =evt.oSource.getValue();
		this.objSaveData["MobileNo"]=mobNo;
		this.objSaveData["MobileNo_X"]="X";
	},
	//----Lnd line-------
	/*onChangeFaxLneNo : function(evt){
		var LandLineNumber ;

		if(evt.oSource.sId.indexOf("inpSTDCode")>0){
			LandLineNumber= evt.oSource.getValue()+"-"+this.byId("inpFaxedLneNo").getValue();
		}else{
			LandLineNumber= this.byId("inpSTDCode").getValue()+"-"+evt.oSource.getValue();
		}

		this.objSaveData["AlternateTelno"]=LandLineNumber;
		this.objSaveData["AlternateTelno_X"]="X";
	},*/
	
	onChangeFaxLneNo : function(evt){
		
        var LandLineNumber ,finalStd;

        var stdCode=this.byId("inpSTDCode").getValue().indexOf("+91");
        if(stdCode!="0"){
              var stdVal = this.byId("inpSTDCode").getValue();
              finalStd = "+91"+stdVal;
        }
        
        if(evt.oSource.sId.indexOf("inpSTDCode")>0){
              /*var stdCode=evt.oSource.getValue().indexOf("+91");
              if(stdCode!="0"){
                    var stdVal = this.byId("inpSTDCode").getValue();
                    finalStd = "+91"+stdVal;
              }*/
              
              //LandLineNumber= evt.oSource.getValue()+"-"+this.byId("inpFaxedLneNo").getValue();
              LandLineNumber= finalStd+"-"+this.byId("inpFaxedLneNo").getValue();
        }else{
        	 /*var stdCode=this.byId("inpSTDCode").getValue().indexOf("+91");
             if(stdCode!="0"){
                   var stdVal = this.byId("inpSTDCode").getValue();
                   finalStd = "+91"+stdVal;
             }*/
              //LandLineNumber= this.byId("inpSTDCode").getValue()+"-"+evt.oSource.getValue();
              LandLineNumber= finalStd+"-"+evt.oSource.getValue();
        }

        this.objSaveData["AlternateTelno"]=LandLineNumber;
        this.objSaveData["AlternateTelno_X"]="X";
  }, 

  
	//-----Email Id-------
	//Check onChangeEmail function
	//----Website-------
	//Check onChangeWebsite function
	//----Geography info------
	//---Lattitude---------------
	onChangeLatitude : function(evt){
		var Latitude =evt.oSource.getValue();
		this.objSaveData["Latitude"]=Latitude;
		this.objSaveData["Latitude_X"]="X";
	},
	//---LongiTude-------
	onChangelogtude : function(evt){
		var Longitude =evt.oSource.getValue();
		this.objSaveData["Longitude"]=Longitude;
		this.objSaveData["Longitude_X"]="X";
	},
	//----Working hours ---
	//----Start Day-----
	onSelectionStart : function(evt){
		var StrtWkngDay =evt.oSource.getSelectedKey();
		this.objSaveData["StartDay"]=StrtWkngDay;
		this.objSaveData["StartDay_X"]="X";
	},
	//---Start Work time----
	onChangeDateTime : function(evt){
		var STime =evt.oSource.getValue();
		var spTime =STime.split(":");
//		this.objSaveData["StartTime"]="0000-00-00T"+STime;
		this.objSaveData["StartTime"]="PT"+spTime[0]+"H"+spTime[1]+"M"+spTime[2]+"S";
		this.objSaveData["StartTime_X"]="X";
	},
	//---End Day-----
	onSelectionEnd : function(evt){
		var EndWkngDay =evt.oSource.getValue();
		this.objSaveData["EndDay"]=EndWkngDay;
		this.objSaveData["EndDay_X"]="X";
	},
	//---End Time-----
	onChangeEndTime: function(evt){
		var eTime =evt.oSource.getValue();
		var spTime =eTime.split(":");
//		this.objSaveData["EndTime"]="0000-00-00T"+eTime;
		this.objSaveData["EndTime"]="PT"+spTime[0]+"H"+spTime[1]+"M"+spTime[2]+"S";
		this.objSaveData["EndTime_X"]="X";
	},
	//========Attributes Tab Changed By UMMMA========================
	// InFrastructure tab //Office coretitle
	// Office
	onChangeOccType:function(oEvt){
		var oThis =this;
		//	oEvt.oSource.oParent
		var OccpnyTyp=oEvt.oSource.getSelectedKey();
		var obj={
				TransactionNo : oThis.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZCPCHAR-ZOCTYPE",
						Zzvalue : OccpnyTyp,
						Zzname_X : "",
						Zzvalue_X : "X"
		}
		this.removeDuplicateData(oThis.arrDelChars,"Zzname","ZCPCHAR-ZOCTYPE");
		oThis.arrDelChars.push(obj);
		this.objSaveData.PUTODEALERCHARSNAV = oThis.arrDelChars;
	},
	// Office Space -----SelectionChange--
	onChangeOfficeSpace:function(oEvt){
		var oThis =this;
		var OffcSpce=oEvt.oSource.getSelectedKey();
		var obj={
				TransactionNo : oThis.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZCPCHAR-ZSPACE",
						Zzvalue : OffcSpce,
						Zzname_X : "",
						Zzvalue_X : "X"
		}
		this.removeDuplicateData(oThis.arrDelChars,"Zzname","ZCPCHAR-ZSPACE");
		oThis.arrDelChars.push(obj);
		this.objSaveData.PUTODEALERCHARSNAV = oThis.arrDelChars;
	},
	onChangeLocationInsure :function(oEvt){
		var oThis =this;
		var LoctonInsurd=oEvt.oSource.getSelectedKey();
		var obj={
				TransactionNo : oThis.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZINFR",
						Zzvalue : "ZOFFC",
						Zzsubchar_Name :"ZLINS",
						Zzsubchar_Value :LoctonInsurd,
						ZsubcharValue_X :"X",
						ZzsubcharName_X :"",
						Zzname_X : "",
						Zzvalue_X : ""
		}
		this.removeDuplicateData(oThis.addChars,"Zzsubchar_Name","ZLINS");
		oThis.addChars.push(obj);
		this.objSaveData.PUTOADDCHARSNAV = oThis.addChars;
	},
	onChangeAgentDss :function(oEvt){
		var oThis =this;
		var agentDss=oEvt.oSource.getSelectedKey();
		var obj={
				TransactionNo : oThis.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZINFR",
						Zzvalue : "ZMPOW",
						Zzsubchar_Name :"ZDSSR",
						Zzsubchar_Value :agentDss,
						ZsubcharValue_X :"X",
						ZzsubcharName_X :"",
						Zzname_X : "",
						Zzvalue_X : ""
		}
		this.removeDuplicateData(oThis.addChars,"Zzsubchar_Name","ZDSSR");
		oThis.addChars.push(obj);
		this.objSaveData.PUTOADDCHARSNAV = oThis.addChars;
	},
	onChangeAgentDssNme :function(oEvt){
		var oThis =this;
		var agentDssNme=oEvt.oSource.getValue();
		var obj={
				TransactionNo : oThis.transact,
				Task : oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZINFR",
						Zzvalue : "ZMPOW",
						Zzsubchar_Name :"ZDSSN",
						Zzsubchar_Value :agentDssNme,
						ZsubcharValue_X :"X",
						ZzsubcharName_X :"",
						Zzname_X : "",
						Zzvalue_X : ""
		}
		this.removeDuplicateData(oThis.addChars,"Zzsubchar_Name","ZDSSN");
		oThis.addChars.push(obj);
		this.objSaveData.PUTOADDCHARSNAV = oThis.addChars;
	},
	onChangeAgentlocCombo :function(oEvt){
		var oThis =this;
		var agentlocCombo=oEvt.oSource.getSelectedKey();
		var obj={
				TransactionNo : oThis.transact,
				Task : oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZINFR",
						Zzvalue : "ZMPOW",
						Zzsubchar_Name :"ZLOWN",
						Zzsubchar_Value :agentlocCombo,
						ZsubcharValue_X :"X",
						ZzsubcharName_X :"",
						Zzname_X : "",
						Zzvalue_X : ""
		}
		//this.removeDuplicateData(oThis.addChars,"Zzsubchar_Name","ZDSSN");
		oThis.addChars.push(obj);
		this.objSaveData.PUTOADDCHARSNAV = oThis.addChars;
	},
	onChangeFootFall:function(oEvt){
		var oThis =this;
		var fotfall=oEvt.oSource.getSelectedKey();
		var obj={
				TransactionNo : oThis.transact,
				Task : oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZINFR",
						Zzvalue : "ZOFFC",
						Zzsubchar_Name :"ZFTFL",
						Zzsubchar_Value :fotfall ,
						ZsubcharValue_X :"X",
						ZzsubcharName_X :"",
						Zzname_X : "",
						Zzvalue_X : ""
		}
		this.removeDuplicateData(oThis.addChars,"Zzsubchar_Name","ZFTFL");
		oThis.addChars.push(obj);
		this.objSaveData.PUTOADDCHARSNAV = oThis.addChars;
	},
	onChangeShopFront:function(oEvt){
		var oThis =this;
		var shpfrntSpce=oEvt.oSource.getSelectedKey();
		var obj={
				TransactionNo : oThis.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZINFR",
						Zzvalue : "ZOFFC",
						Zzsubchar_Name :"ZSHFS",
						Zzsubchar_Value :shpfrntSpce ,
						ZsubcharValue_X :"X",
						ZzsubcharName_X :"",
						Zzname_X : "",
						Zzvalue_X : ""
		}
		this.removeDuplicateData(oThis.addChars,"Zzsubchar_Name","ZSHFS");
		oThis.addChars.push(obj);
		this.objSaveData.PUTOADDCHARSNAV = oThis.addChars;
	},
	onChangePcsLap:function(oEvt){
		var oThis =this;
		var PcsLap=oEvt.oSource.getSelectedKey();
		var obj={
				TransactionNo : oThis.transact,
				Task : oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZINFR",
						Zzvalue : "ZITIN",
						Zzsubchar_Name :"ZCPCL",
						Zzsubchar_Value :PcsLap ,
						ZsubcharValue_X :"X",
						ZzsubcharName_X :"",
						Zzname_X : "",
						Zzvalue_X : ""
		}
		this.removeDuplicateData(oThis.addChars,"Zzsubchar_Name","ZCPCL");
		oThis.addChars.push(obj);
		this.objSaveData.PUTOADDCHARSNAV = oThis.addChars;
	},
	onChangePrinerScanner:function(oEvt){
		var oThis =this;
		var PrntrScnrs=oEvt.oSource.getSelectedKey();
		var obj={
				TransactionNo : oThis.transact,
				Task : oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZINFR",
						Zzvalue : "ZITIN",
						Zzsubchar_Name :"ZPRSC",
						Zzsubchar_Value :PrntrScnrs  ,
						ZsubcharValue_X :"X",
						ZzsubcharName_X :"",
						Zzname_X : "",
						Zzvalue_X : ""
		}
		this.removeDuplicateData(oThis.addChars,"Zzsubchar_Name","ZPRSC");
		oThis.addChars.push(obj);
		this.objSaveData.PUTOADDCHARSNAV = oThis.addChars;
	},
	onChangeCountBackStaff:function(oEvt){
		var oThis =this;
		var CntBnkEndStf=oEvt.oSource.getSelectedKey();
		var obj={
				TransactionNo : oThis.transact,
				Task : oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZINFR",
						Zzvalue : "ZMPOW",
						Zzsubchar_Name :"ZCBES",
						Zzsubchar_Value :CntBnkEndStf  ,
						ZsubcharValue_X :"X",
						ZzsubcharName_X :"",
						Zzname_X : "",
						Zzvalue_X : ""
		}
		this.removeDuplicateData(oThis.addChars,"Zzsubchar_Name","ZCBES");
		oThis.addChars.push(obj);
		this.objSaveData.PUTOADDCHARSNAV = oThis.addChars;
	},
	onChangeFullTimeEmpLoyees:function(oEvt){
		var oThis =this;
		var FullTmeEmploys=oEvt.oSource.getValue();
		var obj={
				TransactionNo : oThis.transact,
				Task : oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZINFR",
						Zzvalue : "ZMPOW",
						Zzsubchar_Name :"ZCFTE",
						Zzsubchar_Value :FullTmeEmploys  ,
						ZsubcharValue_X :"X",
						ZzsubcharName_X :"",
						Zzname_X : "",
						Zzvalue_X : ""
		}
		this.removeDuplicateData(oThis.addChars,"Zzsubchar_Name","ZCFTE");
		oThis.addChars.push(obj);
		this.objSaveData.PUTOADDCHARSNAV = oThis.addChars;  
	},
	onChangeTotalManpowerStren:function(oEvt){
		var oThis =this;
		var TotlMnpwrStrngt=oEvt.oSource.getSelectedKey();
		var obj={
				TransactionNo : oThis.transact,
				Task : oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZINFR",
						Zzvalue : "ZMPOW",
						Zzsubchar_Name :"ZTMPS",
						Zzsubchar_Value :TotlMnpwrStrngt  ,
						ZsubcharValue_X :"X",
						ZzsubcharName_X :"",
						Zzname_X : "",
						Zzvalue_X : ""
		}
		this.removeDuplicateData(oThis.addChars,"Zzsubchar_Name","ZTMPS");
		oThis.addChars.push(obj);
		this.objSaveData.PUTOADDCHARSNAV = oThis.addChars;
	},
	onChangeFosStaff:function(oEvt){
		var oThis =this;
		var CntofFsStf=oEvt.oSource.getSelectedKey();
		var obj={
				TransactionNo : oThis.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZINFR",
						Zzvalue : "ZMPOW",
						Zzsubchar_Name :"ZCFOS",
						Zzsubchar_Value :CntofFsStf   ,
						ZsubcharValue_X :"X",
						ZzsubcharName_X :"",
						Zzname_X : "",
						Zzvalue_X : ""
		}
		this.removeDuplicateData(oThis.addChars,"Zzsubchar_Name","ZCFOS");
		oThis.addChars.push(obj);
		this.objSaveData.PUTOADDCHARSNAV = oThis.addChars;
	},

	onChangeSuperviseSalestaff:function(oEvt){
		var oThis =this;
		var SprvsonSlesStf=oEvt.oSource.getSelectedKey(); 
		var obj={
				TransactionNo : oThis.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZINFR",
						Zzvalue : "ZMPOW",
						Zzsubchar_Name :"ZCSUP",
						Zzsubchar_Value :SprvsonSlesStf   ,
						ZsubcharValue_X :"X",
						ZzsubcharName_X :"",
						Zzname_X : "",
						Zzvalue_X : ""
		}
		this.removeDuplicateData(oThis.addChars,"Zzsubchar_Name","ZCSUP");
		oThis.addChars.push(obj);
		this.objSaveData.PUTOADDCHARSNAV = oThis.addChars;
	},
	onChangeCountOfEndStaff:function(oEvt){
		var oThis =this;
		var CntofFrntEdStf=oEvt.oSource.getSelectedKey(); 
		var obj={
				TransactionNo : oThis.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZINFR",
						Zzvalue : "ZMPOW",
						Zzsubchar_Name :"ZCFES",
						Zzsubchar_Value :CntofFrntEdStf,
						ZsubcharValue_X :"X",
						ZzsubcharName_X :"",
						Zzname_X : "",
						Zzvalue_X : ""
		}
		this.removeDuplicateData(oThis.addChars,"Zzsubchar_Name","ZCFES");
		oThis.addChars.push(obj);
		this.objSaveData.PUTOADDCHARSNAV = oThis.addChars;

	},
	//OnChange For Financial information-----------------------------
	//Payout Details
	onChaangePayoutDetails:function(oEvt){
		var oThis =this;
		var PayoutMedia=oEvt.oSource.getSelectedKey(); 
		var obj={
				TransactionNo : oThis.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZFINC",
						Zzvalue : "ZPAYD",
						Zzsubchar_Name :"ZPAYM",
						Zzsubchar_Value :PayoutMedia,
						ZsubcharValue_X :"X",
						ZzsubcharName_X :"",
						Zzname_X : "",
						Zzvalue_X : ""
		}
		this.removeDuplicateData(oThis.addChars,"Zzsubchar_Name","ZPAYM");
		oThis.addChars.push(obj);
		this.objSaveData.PUTOADDCHARSNAV = oThis.addChars;
	},
	//onChange Security Details//////////////////////////////////////////////////////////
	onChangeSecurityTypeRs:function(oEvt){
		var oThis =this;
		var SurtyType=oEvt.oSource.getSelectedKey(); 
		var obj={

				TransactionNo : oThis.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZFINC",
						Zzvalue : "ZSECD",
						Zzsubchar_Name :"ZSTYP",
						Zzsubchar_Value :SurtyType ,
						ZsubcharValue_X :"X",
						ZzsubcharName_X :"",
						Zzname_X : "",
						Zzvalue_X : ""
		}
		this.removeDuplicateData(oThis.addChars,"Zzsubchar_Name","ZSTYP");
		oThis.addChars.push(obj);
		this.objSaveData.PUTOADDCHARSNAV = oThis.addChars;
	},
	onChangeSecurityInstrDetls:function(oEvt){
		var oThis =this;
		var ScurtyInstrmntDtls=oEvt.oSource.getValue(); 
		var obj={
				TransactionNo : oThis.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZFINC",
						Zzvalue : "ZSECD",
						Zzsubchar_Name :"ZSINST",
						Zzsubchar_Value :ScurtyInstrmntDtls  ,
						ZsubcharValue_X :"X",
						ZzsubcharName_X :"",
						Zzname_X : "",
						Zzvalue_X : ""
		}
		this.removeDuplicateData(oThis.addChars,"Zzsubchar_Name","ZSINST");
		oThis.addChars.push(obj);
		this.objSaveData.PUTOADDCHARSNAV = oThis.addChars;
	},
	onChangeSecurityStartDate:function(oEvt){
		var oThis =this;
		var ScurtyStrtDte=com.ril.PRMS.util.Formatter.dateFormat(oEvt.getSource().getDateValue());
		var obj={
				TransactionNo : oThis.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZFINC",
						Zzvalue : "ZSECD",
						Zzsubchar_Name :"ZSEST",
						Zzsubchar_Value :ScurtyStrtDte   ,
						ZsubcharValue_X :"X",
						ZzsubcharName_X :"",
						Zzname_X : "",
						Zzvalue_X : ""
		}
		this.removeDuplicateData(oThis.addChars,"Zzsubchar_Name","ZSEST");
		oThis.addChars.push(obj);
		this.objSaveData.PUTOADDCHARSNAV = oThis.addChars;
		var secEndDate=this.getView().byId("DtpckScurtyEndDte").getDateValue();

		if(secEndDate!=undefined || secEndDate!=null){
			if(ScurtyStrtDte>secEndDate){
				sap.m.MessageToast.show("Security Start Date cannot be after Security End Date!");
				this.getView().byId("DtpckScurtyStrtDte").setValue("");
			}
		}
	},
	onChangeSecurityEndDate:function(oEvt){
		var oThis =this;
		var ScurtyEndDte=com.ril.PRMS.util.Formatter.dateFormat(oEvt.getSource().getDateValue());
		var obj={
				TransactionNo : oThis.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZFINC",
						Zzvalue : "ZSECD",
						Zzsubchar_Name :"ZSEND",
						Zzsubchar_Value :ScurtyEndDte   ,
						ZsubcharValue_X :"X",
						ZzsubcharName_X :"",
						Zzname_X : "",
						Zzvalue_X : ""
		}
		this.removeDuplicateData(oThis.addChars,"Zzsubchar_Name","ZSEND");
		oThis.addChars.push(obj);
		this.objSaveData.PUTOADDCHARSNAV = oThis.addChars;
		var secStrtDate=this.getView().byId("DtpckScurtyStrtDte").getDateValue();
		if(secStrtDate!=undefined || secStrtDate!=null){
			if(ScurtyEndDte<secStrtDate){
				sap.m.MessageToast.show("Security End Date cannot be before Security Start Date!");
				this.getView().byId("DtpckScurtyEndDte").setValue("");
			}
		}
	},

	onChangeAccHolderName:function(oEvt){
		var AccountHldrName=oEvt.getSource().getValue();
		this.objSaveData["Accountholdername"]=AccountHldrName;
		this.objSaveData["Accountholdername_X"]="X";
	},
	onChangeBankAccNum:function(oEvt){
		var AccountNo=oEvt.getSource().getValue();
		this.objSaveData["Accountnumber"]=AccountNo;
		this.objSaveData["Accountnumber_X"]="X";
	},
	onChangeBankName:function(oEvt){
		var BankName=oEvt.getSource().getValue();
		this.objSaveData["Bankname"]=BankName ;
		this.objSaveData["Bankname_X"]="X";
	},
	onChangeBranchName:function(oEvt){
		var BranchName=oEvt.getSource().getValue();
		this.objSaveData["Branchname"]=BranchName;
		this.objSaveData["Branchname_X"]="X";
	},
	onChangeIFSCCode:function(oEvt){
		var IfcCode=oEvt.getSource().getValue();
		this.objSaveData["Ifsccode"]=IfcCode;
		this.objSaveData["Ifsccode_X"]="X"; 

	},
	//For Channel Finance==============================================
	onChangeFinanced:function(oEvt){
		var ChannelFinanced=oEvt.oSource.getSelectedKey();
		this.objSaveData["ChannelFinanced"]=ChannelFinanced;
		this.objSaveData["ChannelFinanced_X"]="X";  
	},
	onChangeCreditLimit:function(oEvent){
		// var turnOverVal = this.onChangeSecurityAmtRs(oEvent);
		var parseCredLimt = oEvent.getSource().getValue();
		var boolDecimalPoint = parseCredLimt.indexOf(".");
		var decimalValue = "";
		var vAmountlen=parseCredLimt.length;
		if(vAmountlen==10){
			oEvent.getSource().setValue(parseCredLimt +".00");
		}
		if(boolDecimalPoint != "-1"){
			decimalValue = parseCredLimt.substring(parseCredLimt.indexOf('.'),parseCredLimt.length);
			if(decimalValue.length == 1 || decimalValue.length == 2){
				parseCredLimt = parseFloat(parseCredLimt).toFixed(2);
				oEvent.getSource().setValue(parseCredLimt);
			}
		}else{
			parseCredLimt = parseFloat(parseCredLimt).toFixed(2);
			oEvent.getSource().setValue(parseCredLimt);
		}
		this.objSaveData["CreditLimit"]=parseCredLimt;
		this.objSaveData["CreditLimit_X"]="X";   
	},
	onChangeSantionDate:function(oEvt){
		var SantionDate=com.ril.PRMS.util.Formatter.dateFormat(oEvt.getSource().getDateValue());
		this.objSaveData["SanctionDate"]=SantionDate;
		this.objSaveData["SanctionDate_X"]="X";
		var ExpDt=this.getView().byId("DtpExpiryDate").getDateValue();

		if(ExpDt!=undefined || ExpDt!=null){
			if(SantionDate>ExpDt){
				sap.m.MessageToast.show("Sanction Date cannot be after Expiry Date!");
				this.getView().byId("DtpSantionDate").setValue("");
			}
		}
	},
	onChangeExpiryDate:function(oEvt){
		var ExpiryDate=com.ril.PRMS.util.Formatter.dateFormat(oEvt.getSource().getDateValue());
		this.objSaveData["ExpiryDate"]=ExpiryDate;
		this.objSaveData["ExpiryDate_X"]="X";
		var SantionDate=this.getView().byId("DtpSantionDate").getDateValue();
		if(SantionDate!=undefined || SantionDate!=null){
			if(ExpiryDate<SantionDate){
				sap.m.MessageToast.show("Expiry Date cannot be before Sanction Date!");
				this.getView().byId("DtpExpiryDate").setValue("");
			}
		}
	},

	onInpChangeBankName:function(oEvt){
		var BankName=oEvt.getSource().getValue();
		this.objSaveData["BankName"]=BankName;
		this.objSaveData["BankName_X"]="X"; 
	},
	onChangeCreditPeriod:function(oEvt){
		var CrdPerid=oEvt.getSource().getValue();
		this.objSaveData["CreditPeriod"]=CrdPerid;
		this.objSaveData["CreditPeriod_X"]="X";
	},
	//SelectionChangeFor onlineFullFillMent//////////////////////////////////////////
	onSelectChangeOnlineFullFill:function(oEvt){
		var oThis=this;
		var OnlneFulmnt=oEvt.oSource.getSelectedKey();
		var obj={
				TransactionNo : oThis.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZOFLD",
						Zzvalue : "ZOFLDV",
						Zzsubchar_Name :"ZOLFL",
						Zzsubchar_Value :OnlneFulmnt ,
						ZsubcharValue_X :"X",
						ZzsubcharName_X :"",
						Zzname_X : "",
						Zzvalue_X : ""
		}
		this.removeDuplicateData(oThis.addChars,"Zzsubchar_Name","ZOLFL");
		oThis.addChars.push(obj);
		this.objSaveData.PUTOADDCHARSNAV = oThis.addChars;  
	},
	onInpChangeDeliveryBoy:function(oEvt){
		var oThis=this;
		var DlverByNme=oEvt.oSource.getValue();
		var obj={
				TransactionNo : oThis.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZOFLD",
						Zzvalue : "ZOFLDV",
						Zzsubchar_Name :"ZDBNM",
						Zzsubchar_Value :DlverByNme  ,
						ZsubcharValue_X :"X",
						ZzsubcharName_X :"",
						Zzname_X : "",
						Zzvalue_X : ""
		}
		this.removeDuplicateData(oThis.addChars,"Zzsubchar_Name","ZDBNM");
		oThis.addChars.push(obj);
		this.objSaveData.PUTOADDCHARSNAV = oThis.addChars;
	},
	onSelectChangeQualification:function(oEvt){
		var oThis=this;
		var DlvryQual=oEvt.oSource.getSelectedKey(); 
		var obj={
				TransactionNo : oThis.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZOFLD",
						Zzvalue : "ZOFLDV",
						Zzsubchar_Name :"ZOLFQ",
						Zzsubchar_Value :DlvryQual   ,
						ZsubcharValue_X :"X",
						ZzsubcharName_X :"",
						Zzname_X : "",
						Zzvalue_X : ""
		}
		this.removeDuplicateData(oThis.addChars,"Zzsubchar_Name","ZOLFQ");
		oThis.addChars.push(obj);
		this.objSaveData.PUTOADDCHARSNAV = oThis.addChars;
	},
	//Service Details IconTab bar Change/////////////////////////////////////
	onChangeServiceArea:function(oEvt){
		var oThis=this;
		var SrvcAra=oEvt.oSource.getSelectedKey();   
		var obj={
				TransactionNo : oThis.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZSRVD",
						Zzvalue : "ZSRVDV",
						Zzsubchar_Name :"ZSRVA",
						Zzsubchar_Value :SrvcAra     ,
						ZsubcharValue_X :"X",
						ZzsubcharName_X :"",
						Zzname_X : "",
						Zzvalue_X : ""
		}
		this.removeDuplicateData(oThis.addChars,"Zzsubchar_Name","ZSRVA");
		oThis.addChars.push(obj); 
		this.objSaveData.PUTOADDCHARSNAV = oThis.addChars;
	},
	onChangeAreaForService:function(oEvt){
		var oThis=this;
		var AreaServc=oEvt.oSource.getSelectedKey();   
		var obj={
				TransactionNo : oThis.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZSRVD",
						Zzvalue : "ZSRVDV",
						Zzsubchar_Name :"ZARFS",
						Zzsubchar_Value :AreaServc      ,
						ZsubcharValue_X :"X",
						ZzsubcharName_X :"",
						Zzname_X : "",
						Zzvalue_X : ""
		}
		this.removeDuplicateData(oThis.addChars,"Zzsubchar_Name","ZARFS");
		oThis.addChars.push(obj);
		this.objSaveData.PUTOADDCHARSNAV = oThis.addChars;  
	},
	onChangeServiceEngineer:function(oEvt){
		var oThis=this;
		var ShpServ=oEvt.oSource.getSelectedKey();  
		var obj={
				TransactionNo : oThis.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZSRVD",
						Zzvalue : "ZSRVDV",
						Zzsubchar_Name :"ZSBOY",
						Zzsubchar_Value :ShpServ       ,
						ZsubcharValue_X :"X",
						ZzsubcharName_X :"",
						Zzname_X : "",
						Zzvalue_X : ""
		}
		this.removeDuplicateData(oThis.addChars,"Zzsubchar_Name","ZSBOY");
		oThis.addChars.push(obj);
		this.objSaveData.PUTOADDCHARSNAV = oThis.addChars;
	},
	onChangeName:function(oEvt){
		var oThis=this;
		var ServcName=oEvt.getSource().getValue(); 
		var obj={
				TransactionNo : oThis.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZSRVD",
						Zzvalue : "ZSRVDV",
						Zzsubchar_Name :"ZBNAM",
						Zzsubchar_Value :ServcName        ,
						ZsubcharValue_X :"X",
						ZzsubcharName_X :"",
						Zzname_X : "",
						Zzvalue_X : ""
		}
		this.removeDuplicateData(oThis.addChars,"Zzsubchar_Name","ZBNAM");
		oThis.addChars.push(obj);
		this.objSaveData.PUTOADDCHARSNAV = oThis.addChars;
	},
	onChangequalification:function(oEvt){
		var oThis=this;
		var Qualfcton=oEvt.oSource.getSelectedKey();  
		var obj={
				TransactionNo : oThis.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZSRVD",
						Zzvalue : "ZSRVDV",
						Zzsubchar_Name :"ZSRVQ",
						Zzsubchar_Value :Qualfcton         ,
						ZsubcharValue_X :"X",
						ZzsubcharName_X :"",
						Zzname_X : "",
						Zzvalue_X : ""
		}
		this.removeDuplicateData(oThis.addChars,"Zzsubchar_Name","ZSRVQ");
		oThis.addChars.push(obj);
		this.objSaveData.PUTOADDCHARSNAV = oThis.addChars;
	},
	//For JioMoneyDealer===================================================================Change++++++++++++
	onChangeCommissionMedium:function(oEvt){
		var oThis=this;
		var JioMnyCmson=oEvt.oSource.getSelectedKey();  
		var obj={
				TransactionNo : oThis.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZCPCHAR-ZCOMMISSIONMED",
						Zzvalue : JioMnyCmson,
						Zzname_X : "",
						Zzvalue_X : "X"
		}
		this.removeDuplicateData(oThis.arrDelChars,"Zzname",obj.Zzname);
		oThis.arrDelChars.push(obj);
		this.objSaveData.PUTODEALERCHARSNAV = oThis.arrDelChars;
	},
	onChangeSettleFreq:function(oEvt){
		var oThis=this;
		var JioMnystlmntFreq=oEvt.oSource.getSelectedKey();  
		var obj={
				TransactionNo : oThis.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZCPCHAR-ZSETTLEFRQ",
						Zzvalue : JioMnystlmntFreq,
						Zzname_X : "",
						Zzvalue_X : "X"
		}
		this.removeDuplicateData(oThis.arrDelChars,"Zzname",obj.Zzname);
		oThis.arrDelChars.push(obj);
		this.objSaveData.PUTODEALERCHARSNAV = oThis.arrDelChars; 
	},
	onChangeEnableTip:function(oEvt){
		var oThis=this;
		var EnbleTIP=oEvt.oSource.getSelectedKey();   
		var obj={
				TransactionNo : oThis.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZCPCHAR-ZTIPENABLED",
						Zzvalue : EnbleTIP,
						Zzname_X : "",
						Zzvalue_X : "X"
		}
		this.removeDuplicateData(oThis.arrDelChars,"Zzname",obj.Zzname);
		oThis.arrDelChars.push(obj);
		this.objSaveData.PUTODEALERCHARSNAV = oThis.arrDelChars;
	},
	onChangeBusiChannel:function(oEvt){
		var oThis=this;
		var BusnsChnl=oEvt.oSource.getSelectedKey(); 
		var obj={
				TransactionNo : oThis.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZCPCHAR-ZBUSCHANNEL",
						Zzvalue : BusnsChnl,
						Zzname_X : "",
						Zzvalue_X : "X"
		}
		this.removeDuplicateData(oThis.arrDelChars,"Zzname",obj.Zzname);
		oThis.arrDelChars.push(obj);
		this.objSaveData.PUTODEALERCHARSNAV = oThis.arrDelChars;
	},
	onChangeMobNo:function(oEvt){
		var oThis=this;
		var inptJioMnyCmsonMbleNmbr=oEvt.getSource().getValue(); 
		var obj={
				TransactionNo : oThis.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZCPCHAR-ZJMMOBILE",
						Zzvalue : inptJioMnyCmsonMbleNmbr,
						Zzname_X : "",
						Zzvalue_X : "X"
		}
		this.removeDuplicateData(oThis.arrDelChars,"Zzname",obj.Zzname);
		oThis.arrDelChars.push(obj);
		this.objSaveData.PUTODEALERCHARSNAV = oThis.arrDelChars;
	},
	onChangeDailyTransCnt:function(oEvt){
		var oThis=this;
		var DlyTrncCnt=oEvt.oSource.getSelectedKey();  
		var obj={
				TransactionNo : oThis.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZCPCHAR-ZDLYTRANSCOUNT",
						Zzvalue : DlyTrncCnt,
						Zzname_X : "",
						Zzvalue_X : "X"
		}
		this.removeDuplicateData(oThis.arrDelChars,"Zzname",obj.Zzname);
		oThis.arrDelChars.push(obj);
		this.objSaveData.PUTODEALERCHARSNAV = oThis.arrDelChars;
	},
	onChangeDailyRevenueInr:function(oEvt){
		var oThis=this;
		var DlyRvnuINR=oEvt.oSource.getSelectedKey();  
		var obj={
				TransactionNo : oThis.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZCPCHAR-ZDLYREVENUE",
						Zzvalue : DlyRvnuINR,
						Zzname_X : "",
						Zzvalue_X : "X"
		}
		this.removeDuplicateData(oThis.arrDelChars,"Zzname",obj.Zzname);
		oThis.arrDelChars.push(obj);
		this.objSaveData.PUTODEALERCHARSNAV = oThis.arrDelChars;
	},
	onChangePaymentAccept:function(oEvt){
		var oThis=this;
		var PymntAccptTyp=oEvt.oSource.getSelectedKey();  
		var obj={
				TransactionNo : oThis.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZCPCHAR-ZPAYTYPE",
						Zzvalue : PymntAccptTyp,
						Zzname_X : "",
						Zzvalue_X : "X"
		}
		this.removeDuplicateData(oThis.arrDelChars,"Zzname",obj.Zzname);
		oThis.arrDelChars.push(obj);
		this.objSaveData.PUTODEALERCHARSNAV = oThis.arrDelChars;
	},
	onChangeReturnPloicy:function(oEvt){
		var oThis=this;
		var RtrnPolcy=oEvt.oSource.getSelectedKey();   
		var obj={
				TransactionNo : oThis.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZCPCHAR-ZRETPOL",
						Zzvalue : RtrnPolcy,
						Zzname_X : "",
						Zzvalue_X : "X"
		}
		this.removeDuplicateData(oThis.arrDelChars,"Zzname",obj.Zzname);
		oThis.arrDelChars.push(obj);
		this.objSaveData.PUTODEALERCHARSNAV = oThis.arrDelChars;
	},
	onChangeSettlementDet:function(oEvt){
		var oThis=this;
		var StleDtls=oEvt.oSource.getSelectedKey();  
		var obj={
				TransactionNo : oThis.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZCPCHAR-ZSETTLEDET",
						Zzvalue : StleDtls,
						Zzname_X : "",
						Zzvalue_X : "X"
		}
		this.removeDuplicateData(oThis.arrDelChars,"Zzname",obj.Zzname);
		oThis.arrDelChars.push(obj);
		this.objSaveData.PUTODEALERCHARSNAV = oThis.arrDelChars;
	},
	deleteDuplicateData:function(key){

		for(var i=0;i<this.arrDelChars.length;i++){
			if(this.arrDelChars[i].Zzvalue == key){
				this.arrDelChars.splice(i,1);
				break;
			}
		}
	},
	onChangeLineOfBusiness:function(oEvt){
		var oThis=this;
		var LnsBusnssId=oEvt.oSource.getSelectedKey();
		//added by linga on 081016 	
		//copy
		for(var i=0;i<this.LOB_SUBCATEGORY.length;i++){
			if(this.LOB_SUBCATEGORY[i].HigerLevelAttr == LnsBusnssId){
				this.byId("cmbLnsBusnssDesc").clearSelection();
				this.byId("cmbLnsBusnssDesc").setValue("");
				this.byId("cmbLnsBusnssDesc").setEnabled(true);
				this.onComboBind("cmbLnsBusnssDesc",this.LOB_SUBCATEGORY[i]);
				break;
			}
		}  
		var obj={
				TransactionNo : oThis.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
					//	Zzname : "ZCPCHAR-ZLOBUSID",
						Zzname : "ZCPCHAR-ZLOBUSDESC",
						Zzvalue : LnsBusnssId,
						Zzname_X : "",
						Zzvalue_X : "X"
		}
		//	this.deleteDuplicateData(LnsBusnssId);
		this.removeDuplicateData(oThis.arrDelChars,"Zzname",obj.Zzname);
		oThis.arrDelChars.push(obj);
		this.objSaveData.PUTODEALERCHARSNAV = oThis.arrDelChars;
	},
	onChangeLineOfBusinessDesc:function(oEvt){

		var oThis=this;
		var lobDesc=oEvt.oSource.getSelectedKey(); 
		var obj={
				TransactionNo : oThis.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
					//	Zzname : "ZCPCHAR-ZLOBUSDESC",
						Zzname : "ZCPCHAR-ZLOBUSID",
						Zzvalue : lobDesc,
						Zzname_X : "",
						Zzvalue_X : "X"
		}
		//this.deleteDuplicateData(lobDesc);
		this.removeDuplicateData(oThis.arrDelChars,"Zzname",obj.Zzname);
		oThis.arrDelChars.push(obj);
		this.objSaveData.PUTODEALERCHARSNAV = oThis.arrDelChars;
	},
	onChangeYearsOfBusiness:function(oEvt){
		var oThis=this;
		var YrsBusns=oEvt.oSource.getSelectedKey(); 
		var obj={
				TransactionNo : oThis.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZCPCHAR-ZYRSOFBUSINESS",
						Zzvalue : YrsBusns,
						Zzname_X : "",
						Zzvalue_X : "X"
		}
		this.removeDuplicateData(oThis.arrDelChars,"Zzname",obj.Zzname);
		oThis.arrDelChars.push(obj);
		this.objSaveData.PUTODEALERCHARSNAV = oThis.arrDelChars;
	},
	//For TurnOver And Profit Change===============================
	onChangeTurnYear:function(oEvt){
		var oThis=this;
		var SYear=oEvt.getSource().getValue(); 
		var obj={
				TransactionNo : oThis.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZCPSALES-ZYEAR1",
						Zzvalue : SYear,
						Zzname_X : "",
						Zzvalue_X : "X"
		}
		this.removeDuplicateData(oThis.arrDelChars,"Zzname",obj.Zzname);
		oThis.arrDelChars.push(obj);
		this.objSaveData.PUTODEALERCHARSNAV = oThis.arrDelChars;
	},
	onChangeTurnYear2:function(oEvt){
		var oThis=this;
		var SYear2=oEvt.getSource().getValue(); 
		var obj={
				TransactionNo : oThis.transact,
				Task :oEvt.oSource.isData ? "U":"I",
						ZzTask :"",
						Zzname : "ZCPSALES-ZYEAR2",
						Zzvalue : SYear2,
						Zzname_X : "",
						Zzvalue_X : "X"
		}
		this.removeDuplicateData(oThis.arrDelChars,"Zzname",obj.Zzname);
		oThis.arrDelChars.push(obj);
		this.objSaveData.PUTODEALERCHARSNAV = oThis.arrDelChars;
	},
	ChangeContracStartDate:function(oEvt){
		this.objSaveData["ContractStartdate"]=oEvt.getSource().getValue()+"T00:00:00";
		this.objSaveData["ContractStartdate_X"]="X";
		var conStartDate=oEvt.getSource().getDateValue();   
		var ContractEndDt=this.getView().byId("datePickrEndContract").getDateValue();

		if(ContractEndDt!=undefined || ContractEndDt!=null){
			if(conStartDate>ContractEndDt){
				sap.m.MessageToast.show("Contract Start Date cannot be after Contract End Date!");
				this.getView().byId("datePickrStartContract").setValue("");
			}

		}
	},
	ChangeContractEndDate:function(oEvt){
		this.objSaveData["ContractEnddate"]=oEvt.getSource().getValue()+"T00:00:00";
		this.objSaveData["ContractEnddate_X"]="X";
		var conEndDate=oEvt.getSource().getDateValue(); 
		var ContractStartDate=this.getView().byId("datePickrStartContract").getDateValue();
		if(ContractStartDate!=undefined || ContractStartDate!=null){
			if(conEndDate<ContractStartDate){
				sap.m.MessageToast.show("Contract End Date cannot be before Contract Start Date!");
				this.getView().byId("datePickrEndContract").setValue("");
			}

		}
	},

	//============END========================================   
	//------------Agent Details------------------------------------
	editSaveValues : function(){
		var oThis =this;
		var oView =oThis.getView();
		var hqDet = oView.byId("tabLocation").getVisible();
		//----------------Reference Dealer-------------------------
		oThis.refId =  oView.byId("inpLocRefID").getValue();
		oThis.refFirstName=oView.byId("inpLocRefFname").getValue();
		oThis.refMdleName=oView.byId("inpLocRefMname").getValue();
		oThis.refLstName=oView.byId("inpLocRefLname").getValue();
		oThis.refOrgName=oView.byId("inpLocRefOrg").getValue();
		oThis.refDestination=oView.byId("inpLocRefDesg").getValue();
		oThis.refAddr1=oView.byId("inpLocRefAdd1").getValue();
		oThis.refAddrLoc=oView.byId("inpLocRefAL").getValue();
		oThis.refSubLoc=oView.byId("inpLocRefSubLoc").getValue();
		oThis.refAddr2=oView.byId("inpLocRefAdd2").getValue();
		oThis.refAddr3=oView.byId("inpLocRefAdd3").getValue();
		oThis.refPinCode=oView.byId("inpLocRefPin").getValue();
		oThis.refCity=oView.byId("cmbLocCity").getValue();
		oThis.refDistrct=oView.byId("cmbDistrict").getValue();
		oThis.refState=oView.byId("cmbRefState").getSelectedKey();
		oThis.refCuntry=oView.byId("cmbRefCountry").getSelectedKey();
		oThis.refContct=oView.byId("inpLocRefMob").getValue();
		oThis.refEmail=oView.byId("inpLocRefEmail").getValue();
		oThis.Zzsequence=oView.byId("inpLocRefID").getValue();
	},

	onSaveData : function(){
		this.buttonFlag=0;
		var oThis =this;
		var oView = oThis.getView();
		var arrParentNav = [];
		var hqDet = oView.byId("tabLocation").getVisible();
		//-----Retailor in Proof tab---------------------
		if(oThis.arrRet.length>0){
			oThis.objSaveData.PUTODEALERSEGNAV = oThis.arrRet;
		}
		if(oThis.arrParentNv.length>0){
			oThis.objSaveData.PUTOPARENTNAV = oThis.arrParentNv;
		}
		if(this.arrDelChars.length>0){
			this.objSaveData.PUTODEALERCHARSNAV = this.arrDelChars;
		}
		if(this.addChars.length>0){
			this.objSaveData.PUTOADDCHARSNAV = this.addChars;
		}
		//----------------------------Reference Dealer------------------
		var refId =  oView.byId("inpLocRefID").getValue();
		var refFirstName=oView.byId("inpLocRefFname").getValue();
		var refMdleName=oView.byId("inpLocRefMname").getValue();
		var refLstName=oView.byId("inpLocRefLname").getValue();
		var refOrgName=oView.byId("inpLocRefOrg").getValue();
		var refDestination=oView.byId("inpLocRefDesg").getValue();
		var refAddr1=oView.byId("inpLocRefAdd1").getValue();
		var refAddrLoc=oView.byId("inpLocRefAL").getValue();
		var refSubLoc=oView.byId("inpLocRefSubLoc").getValue();
		var refAddr2=oView.byId("inpLocRefAdd2").getValue();
		var refAddr3=oView.byId("inpLocRefAdd3").getValue();
		var refPinCode=oView.byId("inpLocRefPin").getValue();
		var refCity=oView.byId("cmbLocCity").getValue();
		var refDistrct=oView.byId("cmbDistrict").getValue();
		var refState=oView.byId("cmbRefState").getSelectedKey();
		var refCuntry=oView.byId("cmbRefCountry").getSelectedKey();
		var refContct=oView.byId("inpLocRefMob").getValue();
		var refEmail=oView.byId("inpLocRefEmail").getValue();
		var Zzsequence=oView.byId("inpLocRefID").getValue();
		//----------------------Reference Dealer------------------------
		var refDelrAry=[];  
		if(oThis.refFirstName != refFirstName){
			var Zzfname=refFirstName;
			var Zzfname_X ="X";
		}else{
			var Zzfname="";
			var Zzfname_X ="";
		}
		if(oThis.refMdleName != refMdleName){
			var ZzmiddileName =refMdleName;
			var ZzmiddileName_X="X";
		}else{
			var ZzmiddileName ="";
			var ZzmiddileName_X="";
		}
		if(oThis.refLstName != refLstName){
			var ZzlastName=refLstName;
			var ZzlastName_X="X";
		}else{
			var ZzlastName="";
			var ZzlastName_X="";
		}
		if(oThis.refOrgName != refOrgName){
			var ZzcompanyName=refOrgName;
			var ZzcompanyName_X="X";
		}else{
			var ZzcompanyName="";
			var ZzcompanyName_X="";
		}
		if(oThis.refDestination != refDestination){
			var Zzdesignation=refDestination;
			var Zzdesignation_X="X";
		}else{
			var Zzdesignation="";
			var Zzdesignation_X="";
		}
		if(oThis.refAddr1 != refAddr1){
			var ZzhouseNo=refAddr1;
			var ZzhouseNo_X="X";
		}else{
			var ZzhouseNo="";
			var ZzhouseNo_X="";
		}
		if(oThis.refAddrLoc != refAddrLoc){
			var Zzlocation=refAddrLoc;
			var Zzlocation_X="X";
		}else{
			var Zzlocation="";
			var Zzlocation_X="";
		}
		if(oThis.refSubLoc != refSubLoc){
			var Zzsublocality=refSubLoc;
			var Zzsublocality_X="X";
		}else{
			var Zzsublocality="";
			var Zzsublocality_X="";
		}
		if(oThis.refAddr2 != refAddr2){
			var Zzstreet=refAddr2;
			var Zzstreet_X="X";
		}else{
			var Zzstreet="";
			var Zzstreet_X="";
		}
		if(oThis.refAddr3 != refAddr3){
			var Zzlandmark=refAddr3;
			var Zzlandmark_X="X";
		}else{
			var Zzlandmark="";
			var Zzlandmark_X="";
		}
		if(oThis.refPinCode != refPinCode){
			var Zzpin=refPinCode;
			var Zzpin_X="X";
		}else{
			var Zzpin="";
			var Zzpin_X="";
		}if(oThis.refCity != refCity){
			var Zzcity=refCity;
			var Zzcity_X="X";
		}else{
			var Zzcity="";
			var Zzcity_X="";
		}if(oThis.refDistrct != refDistrct){
			var Zzdistrict=refDistrct;
			var Zzdistrict_X="X";
		}else{
			var Zzdistrict="";
			var Zzdistrict_X="";
		}
		if(oThis.refState != refState){
			var Zzstate=refState;
			var Zzstate_X="X";
		}else{
			var Zzstate="";
			var Zzstate_X="";
		}
		if(oThis.refCuntry != refCuntry){
			var Zzcountry=refCuntry;
			var Zzcountry_X="X";
		}else{
			var Zzcountry="";
			var Zzcountry_X="";
		}
		if(oThis.refContct != refContct){
			var ZzmobileNumber=refContct;
			var ZzmobileNumber_X="X";
		}else{
			var ZzmobileNumber="";
			var ZzmobileNumber_X="";
		}
		if(oThis.refEmail != refEmail){
			var ZzemailId=refEmail;
			var ZzemailId_X="X";
		}else{
			var ZzemailId="";
			var ZzemailId_X="";
		}
		var obj={
				Task:"U",
				ZzrefKey:"",
				ZzcompanyName: ZzcompanyName,
				ZzcompanyName_X:ZzcompanyName_X,
				Zzstreet:Zzstreet,
				Zzstreet_X:Zzstreet_X,
				Zzstate:Zzstate,
				Zzstate_X:Zzstate_X,
				Zzcountry:Zzcountry,
				Zzcountry_X:Zzcountry_X,
				Zzdesignation: Zzdesignation,
				Zzdesignation_X:Zzdesignation_X,
				Zzdistrict: Zzdistrict,
				Zzdistrict_X:Zzdistrict_X,
				ZzemailId: ZzemailId,
				ZzemailId_X:ZzemailId_X,
				Zzfname: Zzfname,
				Zzfname_X:Zzfname_X,
				ZzhouseNo: ZzhouseNo,
				ZzhouseNo_X:ZzhouseNo_X,
				Zzlandmark:Zzlandmark,
				Zzlandmark_X:Zzlandmark_X,
				ZzlastName: ZzlastName,
				ZzlastName_X:ZzlastName_X,
				Zzlocation: Zzlocation,
				Zzlocation_X:Zzlocation_X,
				ZzmiddileName: ZzmiddileName,
				ZzmiddileName_X:ZzmiddileName_X,
				ZzmobileNumber: ZzmobileNumber,
				ZzmobileNumber_X:ZzmobileNumber_X,
				Zzpin: Zzpin,
				Zzpin_X:Zzpin_X,
				Zzsequence: Zzsequence,
		}
		refDelrAry.push(obj);
		this.objSaveData.PUTOLOCREFERNAV=refDelrAry;
		//---------------Attribute-----------List of Business-----------------------
		if(this.LOBtableChange){			
			var tabStateAttributesTab =this.getView().byId("attributesTab").getVisible();
			if (tabStateAttributesTab == true ){
				var oTable = this.getView().byId("busTypeTab");
				var addBusChars =[];
				var that = this;
				var returnObj = function (Task,Zzsubchar_Name,Zzsubchar_Value,ZsubcharValue_X,Zzvalue){
					var obj={
							TransactionNo : oThis.transact,
							Task : Task,
							ZzTask:"",
							Zzname : Zzsubchar_Value=="ZOUTC"|| Zzsubchar_Value=="ZOUTS"?"ZLOUT":"ZLOBS",
									//	Zzvalue : "1,2,3,4,5",
									Zzvalue : Zzvalue,
									Zzsubchar_Name :Zzsubchar_Name,
									Zzsubchar_Value :Zzsubchar_Value,
									ZsubcharValue_X :ZsubcharValue_X,
									ZzsubcharName_X :"",
									Zzname_X : "",
									Zzvalue_X : ""
					}
					oThis.addChars.push(obj);
					oThis.objSaveData.PUTOADDCHARSNAV = oThis.addChars;
				}

				var delLth = 0,m=0;
				if(oTable.getModel() && oTable.getModel().getData() != null){
					var data = oTable.getModel().getData();
					for(m=0;m<data.length;m++){
						data[m].UnivTask == "D" ? ++delLth:"";
						//paste it
						if(data[m].UnivTask != "D"){
							if(oTable.mAggregations.items[m-delLth].mAggregations.cells[0].mProperties.valueChange){
								var changeVal = this.scenarioName=="Create New Agent"?undefined :oTable.mAggregations.items[m-delLth].mAggregations.cells[0].mProperties.valueChange;
								var c0 = (changeVal?(data[m].busTyepes_isData?"U":"I"):data[m].zBTTask);
								returnObj(c0,"ZBTYP",oTable.mAggregations.items[m-delLth].mAggregations.cells[0].getSelectedKey(),changeVal?"X":data[m].busTyepes_X,("ZLOBSQ"+(m+1)));	
							}
						}else{
							returnObj("D","ZBTYP",data[m].busTyepes,"X",("ZLOBSQ"+(m+1)));
						}

						if(data[m].UnivTask != "D"){
							if(oTable.mAggregations.items[m-delLth].mAggregations.cells[1].mProperties.valueChange){
								var changeVal = this.scenarioName=="Create New Agent"?undefined :oTable.mAggregations.items[m-delLth].mAggregations.cells[1].mProperties.valueChange;
								var c1 = (changeVal?(data[m].DstrbtnCmpny_isData?"U":"I"):data[m].zDCTask);
								returnObj(c1 ,"ZDISTC",oTable.mAggregations.items[m-delLth].mAggregations.cells[1].getValue(),changeVal?"X":data[m].DstrbtnCmpny_X ,("ZLOBSQ"+(m+1)));	
							}
						}else{
							returnObj("D","ZDISTC",data[m].DstrbtnCmpny,"X",("ZLOBSQ"+(m+1)));
						}

						if(data[m].UnivTask != "D"){
							if(oTable.mAggregations.items[m-delLth].mAggregations.cells[2].mProperties.valueChange){
								var changeVal = this.scenarioName=="Create New Agent"?undefined :oTable.mAggregations.items[m-delLth].mAggregations.cells[2].mProperties.valueChange;
								var c2 = (changeVal?(data[m].YrsOprtn_isData?"U":"I"):data[m].zYOTask);
								returnObj(c2,"ZYOPS",oTable.mAggregations.items[m-delLth].mAggregations.cells[2].getValue(),changeVal?"X":data[m].YrsOprtn_X,("ZLOBSQ"+(m+1)) );
							}
						}else{
							returnObj("D","ZYOPS",data[m].YrsOprtn,"X",("ZLOBSQ"+(m+1)));
						}

						if(data[m].UnivTask != "D"){
							if(oTable.mAggregations.items[m-delLth].mAggregations.cells[3].mProperties.valueChange){
								var changeVal = this.scenarioName=="Create New Agent"?undefined :oTable.mAggregations.items[m-delLth].mAggregations.cells[3].mProperties.valueChange;
								var c3 = (changeVal?(data[m].PrmtFndng_isData?"U":"I"):data[m].zPFTask);
								returnObj(c3,"ZPRMF",oTable.mAggregations.items[m-delLth].mAggregations.cells[3].getValue(),changeVal?"X":data[m].PrmtFndng_X,("ZLOBSQ"+(m+1)));
							}
						}else{
							returnObj("D","ZPRMF",data[m].PrmtFndng,"X",("ZLOBSQ"+(m+1)));
						}

						if(data[m].UnivTask != "D"){
							if(oTable.mAggregations.items[m-delLth].mAggregations.cells[4].mProperties.valueChange){
								var changeVal = this.scenarioName=="Create New Agent"?undefined :oTable.mAggregations.items[m-delLth].mAggregations.cells[4].mProperties.valueChange;
								var c4 = (changeVal?(data[m].Roi_isData?"U":"I"):data[m].zRoiTask);
								returnObj(c4,"ZRINV",oTable.mAggregations.items[m-delLth].mAggregations.cells[4].getValue(),changeVal?"X":data[m].Roi_X ,("ZLOBSQ"+(m+1)));
							}
						}else{
							returnObj("D","ZRINV",data[m].Roi,"X",("ZLOBSQ"+(m+1)));
						}

						if(data[m].UnivTask != "D"){
							if(oTable.mAggregations.items[m-delLth].mAggregations.cells[5].mProperties.valueChange){
								var changeVal = this.scenarioName=="Create New Agent"?undefined :oTable.mAggregations.items[m-delLth].mAggregations.cells[5].mProperties.valueChange;
								var c5 = (changeVal?(data[m].CerdtRcvdcmp_isData?"U":"I"):data[m].zCRTask);
								returnObj(c5,"ZCRFC",oTable.mAggregations.items[m-delLth].mAggregations.cells[5].getValue(),changeVal?"X":data[m].CerdtRcvdcmp_X,("ZLOBSQ"+(m+1)));
							}
						}else{
							returnObj("D","ZCRFC",data[m].CerdtRcvdcmp,"X",("ZLOBSQ"+(m+1)));
						}

						if(data[m].UnivTask != "D" ){
							if(oTable.mAggregations.items[m-delLth].mAggregations.cells[6].mProperties.valueChange){
								var changeVal = this.scenarioName=="Create New Agent"?undefined :oTable.mAggregations.items[m-delLth].mAggregations.cells[6].mProperties.valueChange;
								var c6 = (changeVal?(data[m].AnnulTrnvr_isData?"U":"I"):data[m].zATTask);
								returnObj(c6,"ZLOTRO",oTable.mAggregations.items[m-delLth].mAggregations.cells[6].getValue(),changeVal?"X":data[m].AnnulTrnvr_X,("ZLOBSQ"+(m+1)));
							}
						}else{//copy 
							returnObj("D","ZLOTRO",data[m].AnnulTrnvr,"X",("ZLOBSQ"+(m+1)));
						}

						if(data[m].UnivTask != "D"){
							if(oTable.mAggregations.items[m-delLth].mAggregations.cells[7].mProperties.valueChange){
								var changeVal = this.scenarioName=="Create New Agent"?undefined :oTable.mAggregations.items[m-delLth].mAggregations.cells[7].mProperties.valueChange;
								var c7 = (changeVal?(data[m].busTyepes_isData?"U":"I"):data[m].zGPTask);
								returnObj(c7,"ZPGRW",oTable.mAggregations.items[m-delLth].mAggregations.cells[7].getValue(),changeVal?"X":data[m].GrwthPrvsYer_X,("ZLOBSQ"+(m+1)));
							}
						}else{
							returnObj("D","ZPGRW",data[m].GrwthPrvsYer,"X",("ZLOBSQ"+(m+1)));
						}

						if(data[m].UnivTask != "D"){
							if(oTable.mAggregations.items[m-delLth].mAggregations.cells[8].mProperties.valueChange){
								var changeVal = this.scenarioName=="Create New Agent"?undefined :oTable.mAggregations.items[m-delLth].mAggregations.cells[8].mProperties.valueChange;
								var c8 = (changeVal?(data[m].OutltSbtype_isData?"U":"I"):data[m].zOSTask);
								returnObj(c8,"ZOUTS",oTable.mAggregations.items[m-delLth].mAggregations.cells[8].getSelectedKey(),changeVal?"X":data[m].OutltSbtype_X,("ZLOBSQ"+(m+1)))
							}
						}else{
							returnObj("D","ZOUTS",data[m].OutltSbtype,"X",("ZLOBSQ"+(m+1)));
						}

						if(data[m].UnivTask != "D"){
							if(oTable.mAggregations.items[m-delLth].mAggregations.cells[9].mProperties.valueChange){
								var changeVal =this.scenarioName=="Create New Agent"?undefined:oTable.mAggregations.items[m-delLth].mAggregations.cells[9].mProperties.valueChange;
								var c9 = (changeVal?(data[m].OutltCnt_isData?"U":"I"):data[m].zOCTask);
								returnObj(c9,"ZOUTC",oTable.mAggregations.items[m-delLth].mAggregations.cells[9].getValue(),changeVal?"X":data[m].OutltCnt_X,("ZLOBSQ"+(m+1)));
							}
						}else{
							returnObj("D","ZOUTC",data[m].OutltCnt,"X",("ZLOBSQ"+(m+1)));
						}

					}
				}
				for(var i= m-delLth;i<oTable.getItems().length;i++){
					if(oTable.mAggregations.items[i].mAggregations.cells[0].getSelectedKey() !=""){
						returnObj("I","ZBTYP",oTable.mAggregations.items[i].mAggregations.cells[0].getSelectedKey(),"X",("ZLOBSQ"+(i+1)));
					}
					if(oTable.mAggregations.items[i].mAggregations.cells[1].getValue() !=""){
						returnObj("I","ZDISTC",oTable.mAggregations.items[i].mAggregations.cells[1].getValue(),"X",("ZLOBSQ"+(i+1)));
					}
					if(oTable.mAggregations.items[i].mAggregations.cells[2].getValue() !=""){
						returnObj("I","ZYOPS",oTable.mAggregations.items[i].mAggregations.cells[2].getValue(),"X",("ZLOBSQ"+(i+1)));
					}
					if(oTable.mAggregations.items[i].mAggregations.cells[3].getValue() !=""){
						returnObj("I","ZPRMF",oTable.mAggregations.items[i].mAggregations.cells[3].getValue(),"X",("ZLOBSQ"+(i+1)));
					}
					if(oTable.mAggregations.items[i].mAggregations.cells[4].getValue() !=""){
						returnObj("I","ZRINV",oTable.mAggregations.items[i].mAggregations.cells[4].getValue(),"X",("ZLOBSQ"+(i+1)));
					}
					if(oTable.mAggregations.items[i].mAggregations.cells[5].getValue() !=""){
						returnObj("I","ZCRFC",oTable.mAggregations.items[i].mAggregations.cells[5].getValue(),"X",("ZLOBSQ"+(i+1)));
					}
					//copy
					if(oTable.mAggregations.items[i].mAggregations.cells[6].getValue() !=""){
						returnObj("I","ZLOTRO",oTable.mAggregations.items[i].mAggregations.cells[6].getValue(),"X",("ZLOBSQ"+(i+1)));
					}
					if(oTable.mAggregations.items[i].mAggregations.cells[7].getValue() !=""){
						returnObj("I","ZPGRW",oTable.mAggregations.items[i].mAggregations.cells[7].getValue(),"X",("ZLOBSQ"+(i+1)));
					}
					if(oTable.mAggregations.items[i].mAggregations.cells[8].getSelectedKey() !=""){
						returnObj("I","ZOUTS",oTable.mAggregations.items[i].mAggregations.cells[8].getSelectedKey(),"X",("ZLOBSQ"+(i+1)))
					}
					if(oTable.mAggregations.items[i].mAggregations.cells[9].getValue() !=""){
						returnObj("I","ZOUTC",oTable.mAggregations.items[i].mAggregations.cells[9].getValue(),"X",("ZLOBSQ"+(i+1)));
					}
				}
			}

		}	
		//-------------Attribute---------Sales Details for Devices---------------

		var SDforDevices = function(Task,Zzname,Zzsubchar_Name,Zzsubchar_Value,ZsubcharValue_X,Zzvalue){
			var objSDFD={
					TransactionNo : oThis.transact,
					Task : Task,
					ZzTask:"",
					Zzname : Zzname,
					//Zzvalue : "1,2,3,4,5,6,7,8,9",
					Zzvalue :Zzvalue,
					Zzsubchar_Name :Zzsubchar_Name,
					Zzsubchar_Value :Zzsubchar_Value ,
					ZsubcharValue_X :ZsubcharValue_X,
					ZzsubcharName_X :"",
					Zzname_X : "",
					Zzvalue_X : ""
			}
			oThis.addChars.push(objSDFD);
			oThis.objSaveData.PUTOADDCHARSNAV = oThis.addChars;
		}

		if(this.devicesTableChange){
			var saleTable = this.getView().byId("deviceTab"); 
			var addSalesChars =[];

			var SDDdelLth = 0,mD=0;
			if(saleTable.getModel("salesDevval") && saleTable.getModel("salesDevval").getData() != null && saleTable.getModel("salesDevval").getData().length>0){
				var SDdata = saleTable.getModel("salesDevval").getData();
				for(mD=0;mD<SDdata.length;mD++){
					SDdata[mD].UnivTask == "D" ? ++SDDdelLth:"";
					//SDD 
					//if(saleTable.mAggregations.items.length>mD){
					if(SDdata[mD].UnivTask != "D" ){
						if(saleTable.mAggregations.items[mD-SDDdelLth].mAggregations.cells[0].mProperties.valueChange){
							var changeVal = this.scenarioName=="Create New Agent"?undefined :saleTable.mAggregations.items[mD-SDDdelLth].mAggregations.cells[0].mProperties.valueChange;
							SDforDevices((changeVal?(SDdata[mD].MntlySlesVol_isData?"U":"I"):SDdata[mD].zMntlySlesTask),"ZSLCD","ZPRODTD",saleTable.mAggregations.items[mD-SDDdelLth].mAggregations.cells[0].getSelectedKey(),(changeVal?"X":SDdata[mD].MntlySlesVol_X),("ZSLDSQ"+(mD+1)));
						}
						
					}else{
						SDforDevices("D","ZSLCD","ZPRODTD",SDdata[mD].MntlySlesVol,"X",("ZSLDSQ"+(mD+1)));
					}
					if(SDdata[mD].UnivTask != "D"){

						if(saleTable.mAggregations.items[mD-SDDdelLth].mAggregations.cells[1].mProperties.valueChange){
							var changeVal = this.scenarioName=="Create New Agent"?undefined :saleTable.mAggregations.items[mD-SDDdelLth].mAggregations.cells[1].mProperties.valueChange;
							SDforDevices((changeVal?(SDdata[mD].BrndSrvcd_isData?"U":"I"):SDdata[mD].zBrndSrvcdTask),"ZSLCD","ZBRNDSD",saleTable.mAggregations.items[mD-SDDdelLth].mAggregations.cells[1].getSelectedKey(),(changeVal?"X":SDdata[mD].BrndSrvcd_X),("ZSLDSQ"+(mD+1)));	
						}

					}else{
						SDforDevices("D","ZSLCD","ZBRNDSD",SDdata[mD].BrndSrvcd,"X",("ZSLDSQ"+(mD+1)));
					}
					if(SDdata[mD].UnivTask != "D"){
						if(saleTable.mAggregations.items[mD-SDDdelLth].mAggregations.cells[2].mProperties.valueChange){
							var changeVal = this.scenarioName=="Create New Agent"?undefined :saleTable.mAggregations.items[mD-SDDdelLth].mAggregations.cells[2].mProperties.valueChange;
							SDforDevices((changeVal?(SDdata[mD].PrdTyp_isData?"U":"I"):SDdata[mD].zPrdTypTask),"ZSLCD","ZMSLVD",saleTable.mAggregations.items[mD-SDDdelLth].mAggregations.cells[2].getSelectedKey(),(changeVal?"X":SDdata[mD].PrdTyp_X),("ZSLDSQ"+(mD+1)));	
						}

					}else{
						SDforDevices("D","ZSLCD","ZMSLVD",SDdata[mD].PrdTyp,"X",("ZSLDSQ"+(mD+1)));
					}
				}
			}
			for(var j=mD-SDDdelLth;j<saleTable.getItems().length;j++){
				if(saleTable.mAggregations.items[j].mAggregations.cells[0].getSelectedKey() !=""){
					SDforDevices("I","ZSLCD","ZPRODTD",saleTable.mAggregations.items[j].mAggregations.cells[0].getSelectedKey(),"X",("ZSLDSQ"+(j+1)));
				}
				if(saleTable.mAggregations.items[j].mAggregations.cells[1].getSelectedKey() !=""){
					SDforDevices("I","ZSLCD","ZBRNDSD",saleTable.mAggregations.items[j].mAggregations.cells[1].getSelectedKey(),"X",("ZSLDSQ"+(j+1)));
				}
				if(saleTable.mAggregations.items[j].mAggregations.cells[2].getSelectedKey() !=""){
					SDforDevices("I","ZSLCD","ZMSLVD",saleTable.mAggregations.items[j].mAggregations.cells[2].getSelectedKey(),"X",("ZSLDSQ"+(j+1)));
				}
			}

		}


		//-------------Attribute---------Sales Details-Connectivity---------------
		if(this.salesTableChange){
			var saleTableConnectivity = this.getView().byId("salesTab");
			var addSalesCharsConnectivity =[];

			var SDCdelLth = 0,mC=0;
			var model = saleTableConnectivity.getModel("salesval");
			if(model && model.getData() != null &&  model.getData().length>0){
				var SCdata = saleTableConnectivity.getModel("salesval").getData();
				for(mC=0;mC<SCdata.length;mC++){
					SCdata[mC].UnivTask == "D" ? ++SDCdelLth:"";
					if(SCdata[mC].UnivTask != "D" ){
						if(saleTableConnectivity.mAggregations.items[mC-SDCdelLth].mAggregations.cells[0].mProperties.valueChange){
							var changeVal = this.scenarioName=="Create New Agent"?undefined :saleTableConnectivity.mAggregations.items[mC-SDCdelLth].mAggregations.cells[0].mProperties.valueChange;
							SDforDevices((changeVal?(SCdata[mC].MntlySlesVol_isData?"U":"I"):SCdata[mC].zMntlySlesTask),"ZSLCC","ZPRODTC",saleTableConnectivity.mAggregations.items[mC-SDCdelLth].mAggregations.cells[0].getSelectedKey(),(changeVal?"X":SCdata[mC].MntlySlesVol_X),("ZSLCSQ"+(mC+1)));	
						}
					}else{
						SDforDevices("D","ZSLCC","ZPRODTC",SCdata[mC].MntlySlesVol,"X",("ZSLCSQ"+(mC+1)));
					}
					if(SCdata[mC].UnivTask != "D"){
						if(saleTableConnectivity.mAggregations.items[mC-SDCdelLth].mAggregations.cells[1].mProperties.valueChange){
							var changeVal = this.scenarioName=="Create New Agent"?undefined :saleTableConnectivity.mAggregations.items[mC-SDCdelLth].mAggregations.cells[1].mProperties.valueChange;
							SDforDevices((changeVal?(SCdata[mC].BrndSrvcd_isData?"U":"I"):SCdata[mC].zBrndSrvcdTask),"ZSLCC","ZBRNDS",saleTableConnectivity.mAggregations.items[mC-SDCdelLth].mAggregations.cells[1].getSelectedKey(),(changeVal?"X":SCdata[mC].BrndSrvcd_X),("ZSLCSQ"+(mC+1)));
						}	
					}else{
						SDforDevices("D","ZSLCC","ZBRNDSC",SCdata[mC].BrndSrvcd,"X",("ZSLCSQ"+(mC+1)));
					}
					if(SCdata[mC].UnivTask != "D"){
						if(saleTableConnectivity.mAggregations.items[mC-SDCdelLth].mAggregations.cells[2].mProperties.valueChange){
							var changeVal = this.scenarioName=="Create New Agent"?undefined :saleTableConnectivity.mAggregations.items[mC-SDCdelLth].mAggregations.cells[2].mProperties.valueChange;
							SDforDevices((changeVal?(SCdata[mC].PrdTyp_isData?"U":"I"):SCdata[mC].zPrdTypTask),"ZSLCC","ZMSLVC",saleTableConnectivity.mAggregations.items[mC-SDCdelLth].mAggregations.cells[2].getSelectedKey(),(changeVal?"X":SCdata[mC].PrdTyp_X),("ZSLCSQ"+(mC+1)));	
						}

					}else{
						SDforDevices("D","ZSLCC","ZMSLVC",SCdata[mC].PrdTyp,"X",("ZSLCSQ"+(mC+1)));
					}
				}
			}

			for(var j=mC-SDCdelLth;j<saleTableConnectivity.getItems().length;j++){
				if(saleTableConnectivity.mAggregations.items[j].mAggregations.cells[0].getSelectedKey() !=""){
					SDforDevices("I","ZSLCC","ZPRODTC",saleTableConnectivity.mAggregations.items[j].mAggregations.cells[0].getSelectedKey(),"X",("ZSLCSQ"+(j+1)));
				}
				if(saleTableConnectivity.mAggregations.items[j].mAggregations.cells[1].getSelectedKey() !=""){
					SDforDevices("I","ZSLCC","ZBRNDSC",saleTableConnectivity.mAggregations.items[j].mAggregations.cells[1].getSelectedKey(),"X",("ZSLCSQ"+(j+1)));
				}
				if(saleTableConnectivity.mAggregations.items[j].mAggregations.cells[2].getSelectedKey() !=""){
					SDforDevices("I","ZSLCC","ZMSLVC",saleTableConnectivity.mAggregations.items[j].mAggregations.cells[2].getSelectedKey(),"X",("ZSLCSQ"+(j+1)));
				}
			}
		}

		//---------------------Agent Details----------------------------------
		/* changed by linga on Oct 20, 2016 at 7:13:00 PM */
		
		this.pushNewItemsToModel();
		
		var arrAgents= [];
		if(oThis.agentNameModel.oData != undefined ){
			if(oThis.agentNameModel.oData.length>0){
				for(var k=0;k<oThis.agentNameModel.oData.length;k++){
					oThis.arrAgentDetAdd =[];
					oThis.arrAgentAddress=[];
					oThis.arrAgentProofTab=[];
					oThis.arrRefAgents =[];
					if(oThis.agentNameModel.oData[k].PresentAdd !=""){
						var presentAdd  = oThis.agentNameModel.oData[k].PresentAdd;

						if(presentAdd.isChanged){
							var obj={
									Task :presentAdd.isBackend ? "U" :"I",
											ZzaddrType :"XXDEFAULT",
											ZzhouseNo : presentAdd.ZzhouseNo,
											Zzlocation : presentAdd.Zzlocation,
											Zzstreet : presentAdd.Zzstreet,
											Zzlandmark : presentAdd.Zzlandmark,
											Zzpin : presentAdd.Zzpin,
											Zzdistrict:presentAdd.Zzdistrict,
											Zzstate :presentAdd.Zzstate,
											Zzcountry: presentAdd.Zzcountry,
											ZzhouseNo_X : presentAdd.ZzhouseNo_XX ? presentAdd.ZzhouseNo_XX : "",
											Zzlocation_X : presentAdd.Zzlocation_XX? presentAdd.Zzlocation_XX : "",
											Zzstreet_X : presentAdd.Zzstreet_XX? presentAdd.Zzstreet_XX : "",
											Zzlandmark_X :presentAdd.Zzlandmark_XX? presentAdd.Zzlandmark_XX : "",
											Zzpin_X : presentAdd.Zzpin_XX? presentAdd.Zzpin_XX : "",
											Zzdistrict_X :presentAdd.Zzdistrict_XX? presentAdd.Zzdistrict_XX : "",
											Zzstate_X : presentAdd.Zzstate_XX? presentAdd.Zzstate_XX : "",
											Zzcountry_X : presentAdd.Zzcountry_XX? presentAdd.Zzcountry_XX : "",
							}
							oThis.arrAgentAddress.push(obj);
						}else{
							var obj={
									Task :"",
									ZzaddrType :"XXDEFAULT",
									ZzhouseNo : "",
									Zzlocation : "",
									Zzstreet : "",
									Zzlandmark : "",
									Zzpin : "",
									Zzdistrict: "",
									Zzstate : "",
									Zzcountry: "",
									ZzhouseNo_X : "",
									Zzlocation_X : "",
									Zzstreet_X : "",
									Zzlandmark_X : "",
									Zzpin_X : "",
									Zzdistrict_X : "",
									Zzstate_X : "",
									Zzcountry_X : ""
							}
							oThis.arrAgentAddress.push(obj);
						}
					}else{
						var obj={
								Task :"",
								ZzaddrType :"XXDEFAULT",
								ZzhouseNo : "",
								Zzlocation : "",
								Zzstreet : "",
								Zzlandmark : "",
								Zzpin : "",
								Zzdistrict: "",
								Zzstate : "",
								Zzcountry: "",
								ZzhouseNo_X : "",
								Zzlocation_X : "",
								Zzstreet_X : "",
								Zzlandmark_X : "",
								Zzpin_X : "",
								Zzdistrict_X : "",
								Zzstate_X : "",
								Zzcountry_X : ""
						}
						oThis.arrAgentAddress.push(obj);
					}

					if(oThis.agentNameModel.oData[k].PermantAdd !=""){
						var permntAdd  = oThis.agentNameModel.oData[k].PermantAdd;
						//oThis.arrAgentAddress.push(permntAdd);
						if(permntAdd.isChanged){
							var obj={
									Task :permntAdd.isBackend ? "U" :"I",
											ZzaddrType :"PER_ADDR",
											ZzhouseNo : permntAdd.ZzhouseNo,
											Zzlocation : permntAdd.Zzlocation,
											Zzstreet : permntAdd.Zzstreet,
											Zzlandmark : permntAdd.Zzlandmark,
											Zzpin : permntAdd.Zzpin,
											Zzdistrict:permntAdd.Zzdistrict,
											Zzstate :permntAdd.Zzstate,
											Zzcountry: permntAdd.Zzcountry,
											ZzhouseNo_X : permntAdd.ZzhouseNo_XX ?permntAdd.ZzhouseNo_XX:"",
											Zzlocation_X : permntAdd.Zzlocation_XX ?permntAdd.Zzlocation_XX:"",
											Zzstreet_X : permntAdd.Zzstreet_XX ?permntAdd.Zzstreet_XX:"",
											Zzlandmark_X :permntAdd.Zzlandmark_XX ?permntAdd.Zzlandmark_XX:"",
											Zzpin_X : permntAdd.Zzpin_XX ?permntAdd.Zzpin_XX:"",
											Zzdistrict_X :permntAdd.Zzdistrict_XX ?permntAdd.Zzdistrict_XX:"",
											Zzstate_X : permntAdd.Zzstate_XX ?permntAdd.Zzstate_XX:"",
											Zzcountry_X : permntAdd.Zzcountry_XX ?permntAdd.Zzcountry_XX:"",
							}
							oThis.arrAgentAddress.push(obj);
						}else{
							var obj={
									Task :"",
									ZzaddrType :"PER_ADDR",
									ZzhouseNo : "",
									Zzlocation : "",
									Zzstreet : "",
									Zzlandmark : "",
									Zzpin : "",
									Zzdistrict: "",
									Zzstate : "",
									Zzcountry: "",
									ZzhouseNo_X : "",
									Zzlocation_X : "",
									Zzstreet_X : "",
									Zzlandmark_X : "",
									Zzpin_X : "",
									Zzdistrict_X : "",
									Zzstate_X : "",
									Zzcountry_X : ""
							}
							oThis.arrAgentAddress.push(obj);
						}
					}else{
						var obj={
								Task :"",
								ZzaddrType :"PER_ADDR",
								ZzhouseNo : "",
								Zzlocation : "",
								Zzstreet : "",
								Zzlandmark : "",
								Zzpin : "",
								Zzdistrict: "",
								Zzstate : "",
								Zzcountry: "",
								ZzhouseNo_X : "",
								Zzlocation_X : "",
								Zzstreet_X : "",
								Zzlandmark_X : "",
								Zzpin_X : "",
								Zzdistrict_X : "",
								Zzstate_X : "",
								Zzcountry_X : ""
						}
						oThis.arrAgentAddress.push(obj);
					}
					
				/* Added by linga on Oct 20, 2016 at 7:13:17 PM */
				//	if(this.agentProofTableChange){
					if(oThis.agentNameModel.oData[k].objArr !="" && this.agentProofTableChange){
						for(var l=0;l<oThis.agentNameModel.oData[k].objArr.length;l++){
							var modelData = oThis.agentNameModel.oData[k].objArr;
							if((modelData[l].ZzproofIdent == "POA" || modelData[l].ZzproofIdent == "POI" )&& modelData[l].isChanged){
							var issue = modelData[l].ZzdateOfIssue==null ? "":modelData[l].ZzdateOfIssue;
							var expire = modelData[l].ZzdateOfExpiry==null ? "":modelData[l].ZzdateOfExpiry;
							var issue_Date = new Date(issue)=="Invalid Date"? null:new Date(issue);
							var expire_Date = new Date(expire)=="Invalid Date"? null:new Date(expire);
							var obj={};
							obj.ZzTask ="";
							obj.Task= modelData[l].isDeleted?"D":(modelData[l].ZTask);
							obj.ZzextId = this.byId("cbAgents").getSelectedKey();
							obj.ZzproofIdent =modelData[l].ZzproofIdent;
							obj.ZzidType = modelData[l].ZzidType;
							obj.ZzidNumber = modelData[l].ZzidNumber,
							obj.ZzdateOfIssue = com.ril.PRMS.util.Formatter.dateFormat(issue_Date);
							obj.ZzdateOfExpiry = com.ril.PRMS.util.Formatter.dateFormat(expire_Date);
							obj.ZzplaceOfIssue= modelData[l].ZzplaceOfIssue;
							obj.ZzissueAuth = modelData[l].ZzissueAuth;
							obj.ZzextId_X ="";
							obj.ZzproofIdent_X = modelData[l].ZzproofIdent_X;
							obj.ZzidType_X = modelData[l].ZzidType_X;
							obj.ZzidNumber_X = modelData[l].ZzidNumber_X;
							obj.ZzdateOfIssue_X = modelData[l].ZzdateOfIssue_X;
							obj.ZzdateOfExpiry_X = modelData[l].ZzdateOfExpiry_X;
							obj.ZzplaceOfIssue_X = modelData[l].ZzplaceOfIssue_X;
							obj.ZzissueAuth_X = modelData[l].ZzissueAuth_X;
							oThis.arrAgentProofTab.push(obj);
							}							
						}
					}
					

					//refData
					if(this.agentProofTableChange){
						if(oThis.agentNameModel.oData[k].objRefArr !=""){
							for(var m=0;m<oThis.agentNameModel.oData[k].objRefArr.length;m++){
								var refAgent  = oThis.agentNameModel.oData[k].objRefArr[m].objRefArr;
								//oThis.arrRefAgents.push(refAgent);
								var obj={
										Task :"",
										Zzsequence :refAgent.Zzsequence,
										Zzfname : refAgent.Zzfname,
										Zzfname_X : refAgent.Zzfname_XX ?refAgent.Zzfname_XX :"",
										ZzmiddileName : refAgent.ZzmiddileName,
										ZzmiddileName_X :refAgent.ZzmiddileName_XX ?refAgent.ZzmiddileName_XX :"",
										ZzlastName : refAgent.ZzlastName,
										ZzlastName_X :refAgent.ZzlastName_XX ?refAgent.ZzlastName_XX :"",
										ZzcompanyName : refAgent.ZzcompanyName,
										ZzcompanyName_X : refAgent.ZzcompanyName_XX ?refAgent.ZzcompanyName_XX :"",
										Zzdesignation :refAgent.Zzdesignation,
										Zzdesignation_X : refAgent.Zzdesignation_XX ?refAgent.Zzdesignation_XX :"",
										ZzhouseNo : refAgent.ZzhouseNo,
										ZzhouseNo_X : refAgent.ZzhouseNo_XX ?refAgent.ZzhouseNo_XX :"",
										Zzlocation : refAgent.Zzlocation,
										Zzlocation_X : refAgent.Zzlocation_XX ?refAgent.Zzlocation_XX :"",
										Zzsublocality : refAgent.Zzsublocality,
										Zzsublocality_X : refAgent.Zzsublocality_XX ?refAgent.Zzsublocality_XX :"",
										Zzstreet : refAgent.Zzstreet,
										Zzstreet_X : refAgent.Zzstreet_XX ?refAgent.Zzstreet_XX :"",
										Zzlandmark : refAgent.Zzlandmark ,
										Zzlandmark_X :refAgent.Zzlandmark_XX ?refAgent.Zzlandmark_XX :"",
										Zzpin : refAgent.Zzpin ,
										Zzpin_X :refAgent.Zzpin_XX ?refAgent.Zzpin_XX :"", 
										Zzdistrict : refAgent.Zzdistrict ,
										Zzdistrict_X : refAgent.Zzdistrict_XX ?refAgent.Zzdistrict_XX :"",
										Zzstate : refAgent.Zzstate ,
										Zzstate_X : refAgent.Zzstate_XX ?refAgent.Zzstate_XX :"", 
										Zzcountry : refAgent.Zzcountry ,
										Zzcountry_X : refAgent.Zzcountry_XX ?refAgent.Zzcountry_XX :"",
										ZzmobileNumber : refAgent.ZzmobileNumber ,
										ZzmobileNumber_X : refAgent.ZzmobileNumber_XX ?refAgent.ZzmobileNumber_XX :"",
										ZzemailId :  refAgent.ZzemailId ,
										ZzemailId_X : refAgent.ZzemailId_XX ?refAgent.ZzemailId_XX :"" 
								}
								oThis.arrRefAgents.push(obj);
							}
						}

						oThis._on2LevelObj("ZADOJ",oThis.agentNameModel.oData[k],"Doj");
						oThis._on2LevelObj("ZAQLF",oThis.agentNameModel.oData[k],"Qlf");
						oThis._on2LevelObj("ZAIND",oThis.agentNameModel.oData[k],"Industry");
						oThis._on2LevelObj("ZAYOE",oThis.agentNameModel.oData[k],"inpYOE");
						oThis._on2LevelObj("ZASLN",oThis.agentNameModel.oData[k],"secLang");

						var obj ={
								TransactionNo : oThis.transact, 
								ZzagentAction : "",
								ZzextAgentid : oThis.agentNameModel.oData[k].extrnID,
								ZzagentId : oThis.agentNameModel.oData[k].prmId,
								ZzagentId_X :oThis.agentNameModel.oData[k].prmId_XX ?oThis.agentNameModel.oData[k].prmId_XX:"",
								Zztitle : oThis.agentNameModel.oData[k].Saluton,
								Zztitle_X : oThis.agentNameModel.oData[k].Saluton_XX ?oThis.agentNameModel.oData[k].Saluton_XX:"",
								Zzfname :oThis.agentNameModel.oData[k].fname,
								Zzfname_X :oThis.agentNameModel.oData[k].fname_XX?oThis.agentNameModel.oData[k].fname_XX:"",
								Zzmname:oThis.agentNameModel.oData[k].mname,
								Zzmname_X :oThis.agentNameModel.oData[k].mname_XX?oThis.agentNameModel.oData[k].mname_XX:"",
								Zzlname :oThis.agentNameModel.oData[k].lname,
								Zzlname_X:oThis.agentNameModel.oData[k].lname_XX?oThis.agentNameModel.oData[k].lname_XX:"",
								Zzgender :oThis.agentNameModel.oData[k].sex,
								Zzgender_X :oThis.agentNameModel.oData[k].sex_XX?oThis.agentNameModel.oData[k].sex_XX:"",
								Zzbirthdate :com.ril.PRMS.util.Formatter.dateFormat(oThis.agentNameModel.oData[k].dob),
								Zzbirthdate_X :oThis.agentNameModel.oData[k].dob_XX?oThis.agentNameModel.oData[k].dob_XX:"",
								ZzjobFunction :oThis.agentNameModel.oData[k].jbFun,
								ZzjobFunction_X : oThis.agentNameModel.oData[k].jbFun_XX?oThis.agentNameModel.oData[k].jbFun_XX:"",
								ZzmobileNo :oThis.agentNameModel.oData[k].mob,
								ZzworkTelNo :oThis.agentNameModel.oData[k].altMob,
								Zzemail:oThis.agentNameModel.oData[k].email,
								ZzmobileNo_X :oThis.agentNameModel.oData[k].mob_XX?oThis.agentNameModel.oData[k].mob_XX:"",
								ZzworkTelNo_X :oThis.agentNameModel.oData[k].altMob_XX?oThis.agentNameModel.oData[k].altMob_XX:"",
								Zzemail_X :oThis.agentNameModel.oData[k].email_XX?oThis.agentNameModel.oData[k].email_XX:"",
								Zzprimarycontact :oThis.agentNameModel.oData[k].priAgent,
								Zzprimarycontact_X :oThis.agentNameModel.oData[k].priAgent_XX?oThis.agentNameModel.oData[k].priAgent_XX:"",
								ZzjobDesc :oThis.agentNameModel.oData[k].jobDesc,
								ZzjobDesc_X :oThis.agentNameModel.oData[k].jobDesc_XX?oThis.agentNameModel.oData[k].jobDesc_XX:"",
								UPDATEAGENTREFNAV :  oThis.arrRefAgents,
								UPDATEAGENTADDNAV : oThis.arrAgentAddress,
								UPDATEAGENTADDCHARNAV : oThis.arrAgentDetAdd,
								UPDATEAGENTPROOFNAV :oThis.arrAgentProofTab,
								ZzpreferredLang_X:"",
								ZzcommPref_X :"",
								ZzpreferredLang :"",
								ZzcommPref :"",
						}
						arrAgents.push(obj);


					}

					/*oThis._on2LevelObj("ZADOJ",oThis.agentNameModel.oData[k].Doj,oThis.agentNameModel.oData[k].Doj_X,oThis.agentNameModel.oData[k].Doj_isChanged);
				oThis._on2LevelObj("ZAQLF",oThis.agentNameModel.oData[k].Qlf,oThis.agentNameModel.oData[k].Qlf_X,oThis.agentNameModel.oData[k].Qlf_isChanged);
				oThis._on2LevelObj("ZAIND",oThis.agentNameModel.oData[k].Industry,oThis.agentNameModel.oData[k].Industry_X,oThis.agentNameModel.oData[k].Industry_isChanged);
				oThis._on2LevelObj("ZAYOE",oThis.agentNameModel.oData[k].inpYOE,oThis.agentNameModel.oData[k].inpYOE_X,oThis.agentNameModel.oData[k].inpYOE_isChanged);
				oThis._on2LevelObj("ZASLN",oThis.agentNameModel.oData[k].secLang,oThis.agentNameModel.oData[k].secLang_X,oThis.agentNameModel.oData[k].secLang_isChanged);*/


				}
			}

			this.objSaveData.PUTOAGENTDTLSNAV = arrAgents;
		}
		//-------------Identifier Tab----------------------
		var arrTaxProof =[];
		var taxTable = oView.byId("taxTable");
		var proofTable = oView.byId("proofTable");

		if(this.identifierTaxTableChange){
			oThis.onSaveTaxProofTab(taxTable,arrTaxProof,"PF");
		}

		if(this.identifierProofTableChange){
			oThis.onSaveTaxProofTab(proofTable,arrTaxProof,"PF");
		}

		this.objSaveData["TransactionNo"]=oThis.transact;
		//--------------------------------------
		oView.byId("btnApprove").setVisible(true);
		oView.byId("btnReject").setVisible(true);
		//oView.byId("btnSendBack").setVisible(true);

		//----------------------Identifiers---------------------------
		var data=this.objSaveData;
		var that = this;

		sap.m.MessageBox.show("Are you sure?", {
			icon: sap.m.MessageBox.Icon.INFORMATION,
			title: "Confirmation",
			actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose: function(oAction) { 
				if(oAction==="YES"){
					//return;
					var path="/ProspectUpdateSet";
					com.ril.PRMS.BusyD.open();
					that.oDataModel.create(path,data,{async: true , success:function(oData,oResponse){
						com.ril.PRMS.BusyD.close();
					//	var msgObj = 
						if(oResponse.headers['sap-message']){
							var msgObj =JSON.parse(oResponse.headers['sap-message']);
							var severity = msgObj.severity;
							var message = msgObj.message;
							
							sap.m.MessageBox.alert(
									message, {
										icon  : oData.EvSuccess == "S"?sap.m.MessageBox.Icon.SUCCESS:sap.m.MessageBox.Icon.ERROR,                        
										title : oData.EvSuccess == "S"?"Success":"Error",
										actions: [sap.m.MessageBox.Action.OK],
									}
							);
							
						}
						
						
							that.LOBtableChange=false,that.salesTableChange=false,that.devicesTableChange=false,that.identifierTaxTableChange=false;
							that.identifierProofTableChange=false,that.agentProofTableChange=false,that.arrRet=[],that.arrParentNv=[],that.arrDelChars=[],that.addChars;
							that.editIndForTables=false;
							that.addChars = [],that.objSaveData={};
							com.ril.PRMS.POPupValiDation = "";
							that.refreshAgentModel();
						/*	that.byId("idIconTabBar").setSelecteKey("profile");
							com.ril.PRMS.core.byId("idIconTabBarAttribute").setSelectedKey("KeyInfrastructure");*/
							that.onBindTab();
							that._onsetDocumentList();


					}, error:function(oResponse){
						//var message = oResponse.statusText;
						com.ril.PRMS.BusyD.close();
						sap.m.MessageBox.alert(
								"Something Went Wrong. Try Again " , {
									icon  : sap.m.MessageBox.Icon.ERROR,                        
									title : "Error",
									actions: [sap.m.MessageBox.Action.OK],
								}
						)
						return;
					}});

					//Shadab - 05-10-2016  12:34 AM
					//-----------------------------Proof Table--------------//
					var prfAddrTable=that.byId("proofTable");
					var prfTableItems=prfAddrTable.getItems();
					for(var i=0;i<prfTableItems.length;i++){
						var pcRoofTypeValue=prfTableItems[i].mAggregations.cells[1].getValue();
						var PrfTableCells=prfTableItems[i].mAggregations.cells;
						if(pcRoofTypeValue=="ZCPPAN"){
							var cells=PrfTableCells[2].setValueState("Warning");
						}
					}
					//--------------------------Agent Table--------------------------//
					var agntTable=that.byId("agent_Details_proofTable");
					var agtTbleItems=agntTable.getItems();
					for(var a=0;a<agtTbleItems.length;a++){
						var cells=agtTbleItems[a].mAggregations.cells;
						for(var j=0;j<cells.length;j++){
							var value = cells[j].getValue();
							if(value==""){
								agtTbleItems[a].mAggregations.cells[j].setValueState("Warning");
							}else if(value!=""){
								agtTbleItems[a].mAggregations.cells[j].setValueState("None"); 
							}
						}
					}
					var taxTable=that.getView().byId("taxTable");
					var taxItem=taxTable.getItems();
					for(var i=0;i<taxItem.length;i++){
						taxTable.getItems()[i].mAggregations.cells[0].setEnabled(false);
						taxTable.getItems()[i].mAggregations.cells[1].setEnabled(false);
						taxTable.getItems()[i].mAggregations.cells[2].setEnabled(false);
						taxTable.getItems()[i].mAggregations.cells[3].setEnabled(false);
						taxTable.getItems()[i].mAggregations.cells[4].setEnabled(false);
						taxTable.getItems()[i].mAggregations.cells[5].setEnabled(false);
						taxTable.getItems()[i].mAggregations.cells[6].setEnabled(false);
					}
					var prfTable=that.getView().byId("proofTable");
					var prfITems=prfTable.getItems();
					for(var j=0;j<prfITems.length;j++){
						prfTable.getItems()[j].mAggregations.cells[0].setEnabled(false);
						prfTable.getItems()[j].mAggregations.cells[1].setEnabled(false);
						prfTable.getItems()[j].mAggregations.cells[2].setEnabled(false);
						prfTable.getItems()[j].mAggregations.cells[3].setEnabled(false);
						prfTable.getItems()[j].mAggregations.cells[4].setEnabled(false);
						prfTable.getItems()[j].mAggregations.cells[5].setEnabled(false);
						prfTable.getItems()[j].mAggregations.cells[6].setEnabled(false);

					}
					
					
					// done by mahesh for table enabling and disbling
					
					var busTypeTable = that.byId("busTypeTab");
					//busTypeTable.setMode("Delete");
					//this.byId("busTypeBtAdd").setVisible(true);
					busTypeTable.setMode("None");
					for(var k=0;k<busTypeTable.getItems().length;k++){
						busTypeTable.getItems()[k].mAggregations.cells[0].setEnabled(false);
						busTypeTable.getItems()[k].mAggregations.cells[1].setEnabled(false);
						busTypeTable.getItems()[k].mAggregations.cells[2].setEnabled(false);
						busTypeTable.getItems()[k].mAggregations.cells[3].setEnabled(false);
						busTypeTable.getItems()[k].mAggregations.cells[4].setEnabled(false);
						busTypeTable.getItems()[k].mAggregations.cells[5].setEnabled(false);
						busTypeTable.getItems()[k].mAggregations.cells[6].setEnabled(false);
						busTypeTable.getItems()[k].mAggregations.cells[7].setEnabled(false);
						busTypeTable.getItems()[k].mAggregations.cells[8].setEnabled(false);
						busTypeTable.getItems()[k].mAggregations.cells[9].setEnabled(false);
					}
					//For sales details Connectivity tab visible false//////////////////////
					var salesTable = that.byId("salesTab");
					salesTable.setMode("None");
					that.byId("btSalestab").setVisible(false);
					for(var l=0;l<salesTable.getItems().length;l++){
						salesTable.getItems()[l].mAggregations.cells[0].setEnabled(false);
						salesTable.getItems()[l].mAggregations.cells[1].setEnabled(false);
						salesTable.getItems()[l].mAggregations.cells[2].setEnabled(false);
					}
					//For Devices tab visiblity aftersave/////////////////////
					var salesTableConnectivity = that.byId("deviceTab");
					salesTableConnectivity.setMode("None");
				//	that.byId("btSalestabConnectivity").setVisible(false);
					for(var l=0;l<salesTableConnectivity.getItems().length;l++){
						salesTableConnectivity.getItems()[l].mAggregations.cells[0].setEnabled(false);
						salesTableConnectivity.getItems()[l].mAggregations.cells[1].setEnabled(false);
						salesTableConnectivity.getItems()[l].mAggregations.cells[2].setEnabled(false);
					}
					var agntTable=that.byId("agent_Details_proofTable");
//					var agntTableLngth=agntTable.getItems().length;
					agntTable.setMode("None");
					for(var ap=0;ap<agntTable.getItems().length;ap++){
						agntTable.getItems()[ap].mAggregations.cells[0].setEnabled(false);
						agntTable.getItems()[ap].mAggregations.cells[1].setEnabled(false);
						agntTable.getItems()[ap].mAggregations.cells[2].setEnabled(false);
						agntTable.getItems()[ap].mAggregations.cells[3].setEnabled(false);
						agntTable.getItems()[ap].mAggregations.cells[4].setEnabled(false);
					}
					

					com.ril.PRMS.POPupValiDation="Y";
					that.onundoEdit("false");
					that.getView().byId("idEditButon").setVisible(true);
					that.getView().byId("idEditSave").setVisible(false);
					that.getView().byId("idEditCancel").setVisible(false);
					if(that.apprvlLevel== that.depoLevel){
						that.getView().byId("depstChckTlbar").setVisible(true);
						
					/*	// added by linga 
						if(that.scenarioName=="Treminate HQ"){
							that.byId("idDevHandover").setVisible(true); 
							that.byId("idSettlement").setVisible(true);
						}else{
							that.byId("idDevHandover").setVisible(false); 
							that.byId("idSettlement").setVisible(false);
						}
						//------------ 
						
*/						
						if(com.ril.PRMS.Master.scenarioCode == "S011" || com.ril.PRMS.Master.scenarioCode == "S012" || com.ril.PRMS.Master.scenarioCode == "S013"){
							that.byId("idDevHandover").setVisible(true); 
							that.byId("idSettlement").setVisible(true);
							that.getView().byId("switchDepst").setVisible(false);
							that.getView().byId("depositCheckLabel").setVisible(false);
						//	that.byId("idDevHandover").setSelected(oData.HandoverOfDeviceDone=="X"?true:false); 
						//	that.byId("idSettlement").setVisible(oData.FinalSettlementDone=="X"?true:false);
							
						}else{
							that.getView().byId("switchDepst").setVisible(true);
							that.getView().byId("depositCheckLabel").setVisible(true);
							that.byId("idDevHandover").setVisible(false); 
							that.byId("idSettlement").setVisible(false);
						}
					}else{
						that.getView().byId("depstChckTlbar").setVisible(false);
						that.byId("idDevHandover").setVisible(false); 
						that.byId("idSettlement").setVisible(false);
						that.getView().byId("switchDepst").setVisible(false);
						that.getView().byId("depositCheckLabel").setVisible(false);
					}
					if(that.apprvlLevel== "99"){
						that.getView().byId("idAccept").setVisible(true);
						that.byId("btnApprove").setVisible(false);
						that.byId("btnReject").setVisible(false);
						//that.byId("btnSendBack").setVisible(false);
						that.getView().byId("idHold").setVisible(false);
						that.byId("idEditButon").setVisible(false);
					}else{
						that.byId("btnApprove").setVisible(true);
						that.byId("btnReject").setVisible(true);
						that.getView().byId("idHold").setVisible(true);
						that.getView().byId("idAccept").setVisible(false);
						that.byId("idEditButon").setVisible(true);
					}
					that.fullScreen(that.saveEvent);
				}else{
					oView.byId("btnApprove").setVisible(false);
					//oView.byId("btnSendBack").setVisible(false);
					oView.byId("btnReject").setVisible(false);
					that.addChars = [];
					that.editIndForTables=false;
				}
				
			}});

	},
	refreshAgentModel:function(){
		var data = this.agentNameModel.oData
		if(this.agentNameModel.oData!=undefined){
			for(var i=0;i<data.length;i++){
				var keys = Object.keys(this.agentNameModel.oData[i]);
				for(var j=0;j<keys.length;j++){

					if(keys[j] == "PermantAdd"){
						data[i][keys[j]]["isChanged"]=false;
					}
					if(keys[j] == "PresentAdd"){
						data[i][keys[j]]["isChanged"]=false;
					}
					if(keys[j] == "objArr"){
						for(var k=0;k<data[i][keys[j]].length;k++){
							data[i][keys[j]][k]["isChanged"]=false;
						}
					}
					data[i][keys[j]+"_isChanged"]=false;
				}
			}
		}
		
	},
	_on2LevelObj : function(name,data,property){
		/*if(data[property] == undefined){
			value ="";
		}*/
		if(data[property+"_isChanged"]){
			var obj={
					ZzagentId:"",
					Task:data[property+"_isData"]?"U":"I",
							ZzextNo:"",
							Zzname: name,
							Zzvalue: data[property] == undefined ?"":data[property],
									ZzsubcharName:"",
									ZzsubcharValue:"",
									ZzextNo_X:"",
									Zzname_X:"",
									Zzvalue_X:data[property+"_XX"]?data[property+"_XX"]:"",
									ZzsubcharName_X:"",
									ZzsubcharValue_X :""
			}
			this.arrAgentDetAdd.push(obj); 
		}

	},

	/* changed by linga on Oct 22, 2016 at 4:52:11 PM */
	onAgent_SalutationChange:function(e){
		var key = e.oSource.getSelectedKey();
		this.byId("cmbGender").setSelectedKey();
		this.byId("cmbGender").setValue("");
		/*
		if(key == "0001" || key == "Z008"){
			this.byId("cmbGender").getItems()[0].setVisible(false);
			this.byId("cmbGender").getItems()[1].setVisible(true);
		}else if(key == "0002"){
			this.byId("cmbGender").getItems()[0].setVisible(true);
			this.byId("cmbGender").getItems()[1].setVisible(true);
		}else if(key == "Z004"){
			this.byId("cmbGender").getItems()[0].setVisible(true);
			this.byId("cmbGender").getItems()[1].setVisible(false);
		}*/
		this.changeAgentData(this.getProperty(e));
	},
	
	/* changed by linga on Oct 22, 2016 at 4:52:16 PM */
	onAgentDetails_Change:function(e){
		
		if(e.oSource.sId.indexOf("cmbGender")> 0){
				var key = e.oSource.getSelectedKey();
				var salutation = this.byId("cmbSaluton").getSelectedKey();
				if(key == "M" && (salutation == "Z004" || salutation == "0002") && salutation != "Z017"){
				this.changeAgentData(this.getProperty(e));
				}else if(key == "F" && salutation != "0002" && salutation != "Z017"){
				this.changeAgentData(this.getProperty(e));
				} else if(key == "0" && salutation == "Z017"){
				this.changeAgentData(this.getProperty(e));
				}else{
				e.oSource.setValue("");
				e.oSource.setSelectedKey();
				sap.m.MessageToast.show("Incorrect Gender for selected Salutation");
				return;
				}

		}else{
			this.changeAgentData(this.getProperty(e));
		}
		
		
	},
	docNumberChange:function(event){
		var value = event.oSource.getValue();
		var itemIndex = event.oSource.oParent.oParent.indexOfItem(event.oSource.oParent);
		this.changeAgentData(["ZzidNumber",value,"objArr",itemIndex]); // [propertyName,newValue,arrayName/objectName,Itemindex]
	},
	dateOfIssueChange:function(event){
		var value = event.oSource.getDateValue();
		var itemIndex = event.oSource.oParent.oParent.indexOfItem(event.oSource.oParent);
		this.changeAgentData(["ZzdateOfIssue",value,"objArr",itemIndex]);
	},
	dateOfexpireChange:function(event){
		var value = event.oSource.getDateValue();
		var itemIndex = event.oSource.oParent.oParent.indexOfItem(event.oSource.oParent);
		this.changeAgentData(["ZzdateOfExpiry",value,"objArr",itemIndex]);
	},
	placeChange:function(event){
		var value = event.oSource.getValue();
		var itemIndex = event.oSource.oParent.oParent.indexOfItem(event.oSource.oParent);
		this.changeAgentData(["ZzplaceOfIssue",value,"objArr",itemIndex]);
	},
	issueAuthChange:function(event){

		var value = event.oSource.getValue();
		var itemIndex = event.oSource.oParent.oParent.indexOfItem(event.oSource.oParent);
		this.changeAgentData(["ZzissueAuth",value,"objArr",itemIndex]);
	},
	changeAgentData:function(property){ 
		
		if(com.ril.PRMS.POPupValiDation == "X"){
			this.agentProofTableChange = true;
			// property[0] is propetry name 
			// property[1] is changed value 
			// property[2] is array name in the model.  
			// property[3] is index of item in the array
			// property[4] is agent or reference Agent
			var cbAgent = this.getView().byId("cbAgents"),
			cbRefAgent = this.getView().byId("selRefAgent"),
			refID = this.getView().byId("inpRefSeqId"),
			prospectData = this.agentNameModel.oData;
			for(var i=prospectData.length-1;i>=0;i--){
				if(prospectData[i].extrnID == cbAgent.getSelectedKey()){
					var data;
					switch(property[2]){
					case "PresentAdd" :
						if(prospectData[i].PresentAdd == ""){
							prospectData[i].PresentAdd = this.addAddressFields();
						}
						prospectData[i].PresentAdd["ZzTask"] = prospectData[i].PresentAdd["isBackend"] ? "U" : "I";
						prospectData[i].PresentAdd["isChanged"]= true; 
						prospectData[i].PresentAdd[property[0]]= property[1];
						prospectData[i].PresentAdd[property[0]+"_XX"]="X";
						break;
					case "PermantAdd" :
						if(prospectData[i].PermantAdd == ""){
							prospectData[i].PermantAdd = this.addAddressFields();
						}
						prospectData[i].PermantAdd["ZzTask"] = prospectData[i].PermantAdd["isBackend"] ? "U" : "I";
						prospectData[i].PermantAdd["isChanged"]= true;
						prospectData[i].PermantAdd[property[0]]= property[1];
						prospectData[i].PermantAdd[property[0]+"_XX"]="X";
						break;
					case "objArr" :
						prospectData[i].PresentAdd["isChanged"]= true;
						prospectData[i].objArr[property[3]][property[0]] = property[1];
						prospectData[i].objArr[property[3]][property[0]+"_X"] = "X";
						break;
					default:
						// it'll check agent or reference agent
						if(property[4] == undefined){
							prospectData[i][property[0]]= property[1];
							prospectData[i][property[0]+"_XX"]="X";
							prospectData[i][property[0]+"_isChanged"]=true;
						}else{
							for(var j=prospectData[i].objRefArr.length-1;j>=0;j--){
								var refArr = prospectData[i].objRefArr[j];
								if(prospectData[i].extrnID == refArr.extrnID  && refArr.ID == refID.getValue()){
									refArr.objRefArr[property[0]]= property[1];
									refArr.objRefArr[property[0]+"_XX"]="X";
									refArr.objRefArr["isChanged"] = true;
									break;
								}
							}
						}
					break;
					}
					break;
				}
			}
		}
		
	},
	getProperty:function(e){
		var id = e.oSource.getId();
		var inpID = id.substring(id.lastIndexOf("-")+1,id.length);
		//----Agent Profile---------------------
		if(inpID == "cmbSaluton"){
			return ["Saluton",e.oSource.getSelectedKey()]
		}else if(inpID == "fname"){
			return ["fname",e.oSource.getValue()]
		}else if(inpID == "mName"){
			return ["mname",e.oSource.getValue()]
		}else if(inpID == "lName"){
			return ["lname",e.oSource.getValue()]
		}else if(inpID == "cmbGender"){
			return ["sex",e.oSource.getSelectedKey()]
		}else if(inpID == "datePickrbirthday"){
			return ["dob",e.oSource.getDateValue()]
		}else if(inpID == "cmbJobFnctn"){
			return ["jbFun",e.oSource.getSelectedKey()]
		}else if(inpID == "dpDOJ"){
			return ["Doj",e.oSource.getDateValue()]
		}else if(inpID == "cmbQualification"){
			return ["Qlf",e.oSource.getSelectedKey()]
		}else if(inpID == "cmbIndustry"){
			return ["Industry",e.oSource.getSelectedKey()]
		}else if(inpID == "inpYoExp"){
			return ["inpYOE",e.oSource.getValue()]
		}else if(inpID == "cmbSecLanguage"){
			return ["secLang",e.oSource.getSelectedKey()]
		}
		// -------------- contact Information ----------
		else if(inpID == "inptmobileNo"){
			return ["mob",e.oSource.getValue()]
		}else if(inpID == "cmbAlterMbno"){
			return ["altMob",e.oSource.getValue()]
		}else if(inpID == "inptEmail"){
			return ["email",e.oSource.getValue()]
		}
		//----Owner user identification-----------------
		else if(inpID == "ckBxPriAgent"){
			return ["priAgent",e.oSource.getSelected()?"Y":"N"]
		}else if(inpID == "inptPRMID"){
			return ["prmId",e.oSource.getValue()]
		}else if(inpID == "inptExtrnlID"){
			return ["extrnID",e.oSource.getValue()]
		}else if(inpID == "inptjobDescr"){
			return ["jobDesc",e.oSource.getValue()]
		}
		//-----  present address ------------------
		else if(inpID == "inpAgentPreAdd1"){
			return ["ZzhouseNo",e.oSource.getValue(),"PresentAdd"]
		}else if(inpID == "inpAgentPreArea"){
			return ["Zzlocation",e.oSource.getSelectedKey(),"PresentAdd"]
		}else if(inpID == "inpAgentPreSub"){
			return ["",e.oSource.getValue(),"PresentAdd"]
		}else if(inpID == "inpAgentPreAdd2"){
			return ["Zzstreet",e.oSource.getValue(),"PresentAdd"]
		}else if(inpID == "inpAgentPreAdd3"){
			return ["Zzlandmark",e.oSource.getValue(),"PresentAdd"]
		}else if(inpID == "inpAgentPrePin"){
			return ["Zzpin",e.oSource.getValue(),"PresentAdd"]
		}else if(inpID == "cmbAgentPreCity"){
			return ["Zzcity",e.oSource.getSelectedKey(),"PresentAdd"]
		}else if(inpID == "inpAgentPreDist"){
			return ["Zzdistrict",e.oSource.getSelectedKey(),"PresentAdd"]
		}else if(inpID == "cmbAgentPreState"){
			return ["Zzstate",e.oSource.getSelectedKey(),"PresentAdd"]
		}else if(inpID == "cmbAgentPreCountry"){
			return ["Zzcountry",e.oSource.getSelectedKey(),"PresentAdd"]
		}
		//----- perminent address -----------------
		else if(inpID == "inpAgentPerAdd1"){
			return ["ZzhouseNo",e.oSource.getValue(),"PermantAdd"]
		}else if(inpID == "inpAgentPerArea"){
			return ["Zzlocation",e.oSource.getSelectedKey(),"PermantAdd"]
		}else if(inpID == "inpAgentPerSub"){
			return ["",e.oSource.getValue(),"PermantAdd"]
		}else if(inpID == "inpAgentPerAdd2"){
			return ["Zzstreet",e.oSource.getValue(),"PermantAdd"]
		}else if(inpID == "inpAgentPerAdd3"){
			return ["Zzlandmark",e.oSource.getValue(),"PermantAdd"]
		}else if(inpID == "inpAgentPerPin"){
			return ["Zzpin",e.oSource.getValue(),"PermantAdd"]
		}else if(inpID == "cmbAgentPerCity"){
			return ["Zzcity",e.oSource.getSelectedKey(),"PermantAdd"]
		}else if(inpID == "inpAgentPerDist"){
			return ["Zzdistrict",e.oSource.getSelectedKey(),"PermantAdd"]
		}else if(inpID == "cmbAgentPerState"){
			return ["Zzstate",e.oSource.getSelectedKey(),"PermantAdd"]
		}else if(inpID == "cmbAgentPerCount"){
			return ["Zzcountry",e.oSource.getSelectedKey(),"PermantAdd"]
		}
		//----- Reference AgentDetails------------
		else if(inpID == "inpRefSeqId"){
			return ["Zzsequence",e.oSource.getValue(),"","","refAgent"]
		}else if(inpID == "inpAgentRefFname"){
			return ["Zzfname",e.oSource.getValue(),"","","refAgent"]
		}else if(inpID == "inpAgentRefMname"){
			return ["ZzmiddileName",e.oSource.getValue(),"","","refAgent"]
		}else if(inpID == "inpAgentRefLname"){
			return ["ZzlastName",e.oSource.getValue(),"","","refAgent"]
		}else if(inpID == "inpAgentRefCompName"){
			return ["ZzcompanyName",e.oSource.getValue(),"","","refAgent"]
		}else if(inpID == "inpAgentRefDesg"){
			return ["Zzdesignation",e.oSource.getValue(),"","","refAgent"]
		}else if(inpID == "inpAgentRefAdd1"){
			return ["ZzhouseNo",e.oSource.getValue(),"","","refAgent"]
		}else if(inpID == "inpAgentRefArea"){
			return ["Zzlocation",e.oSource.getSelectedKey(),"","","refAgent"]
		}else if(inpID == "inpAgentRefSubLoc"){
			return ["Zzsublocality",e.oSource.getValue(),"","","refAgent"]
		}else if(inpID == "inpAgentRefAdd2"){
			return ["Zzstreet",e.oSource.getValue(),"","","refAgent"]
		}else if(inpID == "inpAgentRefAdd3"){
			return ["Zzlandmark",e.oSource.getValue(),"","","refAgent"]
		}else if(inpID == "inpAgentRefPin"){
			return ["Zzpin",e.oSource.getValue(),"","","refAgent"]
		}else if(inpID == "cmbAgentRefCity"){
			return ["Zzcity",e.oSource.getSelectedKey(),"","","refAgent"]
		}else if(inpID == "inpAgentRefDist"){
			return ["Zzdistrict",e.oSource.getSelectedKey(),"","","refAgent"]
		}else if(inpID == "cmbAgentRefState"){
			return ["Zzstate",e.oSource.getSelectedKey(),"","","refAgent"]
		}else if(inpID == "cmdAgentRefCountry"){
			return ["Zzcountry",e.oSource.getSelectedKey(),"","","refAgent"]
		}
		// ---- contact Details----------
		else if(inpID == "inpAgentRefContact"){
			return ["ZzmobileNumber",e.oSource.getValue(),"","","refAgent"]
		}else if(inpID == "inpAgentRefEmail"){
			return ["ZzemailId",e.oSource.getValue(),"","","refAgent"]
		}
	},
	addAddressFields:function(){
		return {
			ZzTask :"I",
			ZzaddrType :"",
			ZzaddrType_X :"",
			Zzbuilding :"",
			Zzbuilding_X:"",
			ZzcOName:"",
			ZzcOName_X:"",
			Zzcity:"",
			Zzcity_X:"",
			Zzcountry:"",
			Zzcountry_X:"",
			Zzdistrict:"",
			Zzdistrict_X:"",
			ZzhouseNo:"",
			ZzhouseNo_X:"",
			Zzlandmark:"",
			Zzlandmark_X:"",
			Zzlocation:"",
			Zzlocation_X:"",
			Zzpin:"",
			Zzpin_X:"",
			ZzsocietyName:"",
			ZzsocietyName_X:"",
			Zzstate:"",
			Zzstate_X:"",
			Zzstreet:"",
			Zzstreet_X:"",
			isBackend:false,
			isChanged:true
		}
	},
	setLongitude_Latitude:function(){
		var that =this;
		var locality = that.byId("inptAreaLoc").getSelectedKey();
		var city = that.byId("cmbCity").getSelectedKey();
		var state = that.byId("cmbState").getSelectedKey();
		var country = that.byId("cmbCountry").getSelectedKey();
		that.byId("inptLatitude").setValue("");
		that.byId("inptLongitude").setValue("");
		var sServiceUrl = "/sap/opu/odata/sap/ZTEST_FIORI_HANA_SRV/";
		var path = "/LBSSet(Locality='"+locality+"',City='"+city+"',State='"+state+"',Country='"+country+"')";

		that.oDataModel.read(path, null,[], true, function(oData, oResponse) {

			//var address =  JSON.parse(oData.Result).response.addressList;
			if(JSON.parse(oData.Result).response !=undefined){
				var address =  JSON.parse(oData.Result).response.addressList;
				var latitude = address[0].lat;
				var logitude = address[0].lon;
				that.byId("inptLatitude").setValue(latitude);
				that.byId("inptLongitude").setValue(logitude);
			}else{
				sap.m.MessageToast.show("Data Not Found");				
			}


		},function(oData, oResponse){
		});
	},
	_agentDataSetting:function(agentDataDet){
		for(var a=0;a<agentDataDet.results.length;a++){
			var extId =this.getView().byId("inptExtrnlID").getValue(); //External ID for Agent from View
			var extID =agentDataDet.results[a].ZzextAgentid; //External ID for Agent from Odata  
			if(extId==extID){
				var oView=this.getView();
				//===============for fields that are not included in the NAVIGATION=============================
				oView.byId("cmbSaluton").setValueState(com.ril.PRMS.util.Formatter.setHeaderColor(agentDataDet.results[a].Zztitle_X));
				oView.byId("fname").setValueState(com.ril.PRMS.util.Formatter.setHeaderColor(agentDataDet.results[a].Zzfname_X));
				oView.byId("mName").setValueState(com.ril.PRMS.util.Formatter.setHeaderColor(agentDataDet.results[a].Zzmname_X));
				oView.byId("lName").setValueState(com.ril.PRMS.util.Formatter.setHeaderColor(agentDataDet.results[a].Zzlname_X));
				oView.byId("cmbGender").setValueState(com.ril.PRMS.util.Formatter.setHeaderColor(agentDataDet.results[a].Zzgender_X));
				oView.byId("datePickrbirthday").setValueState(com.ril.PRMS.util.Formatter.setHeaderColor(agentDataDet.results[a].Zzbirthdate_X));
				oView.byId("cmbJobFnctn").setValueState(com.ril.PRMS.util.Formatter.setHeaderColor(agentDataDet.results[a].ZzjobFunction_X));
				oView.byId("inptmobileNo").setValueState(com.ril.PRMS.util.Formatter.setHeaderColor(agentDataDet.results[a].ZzmobileNo_X));
				oView.byId("cmbAlterMbno").setValueState(com.ril.PRMS.util.Formatter.setHeaderColor(agentDataDet.results[a].ZzworkTelNo_X));
				oView.byId("inptEmail").setValueState(com.ril.PRMS.util.Formatter.setHeaderColor(agentDataDet.results[a].Zzemail_X));
				oView.byId("cmbPref_lang").setValueState(com.ril.PRMS.util.Formatter.setHeaderColor(agentDataDet.results[a].ZzpreferredLang_X));
				oView.byId("inptPRMID").setValueState(com.ril.PRMS.util.Formatter.setHeaderColor(agentDataDet.results[a].ZzagentId_X));
				oView.byId("inptExtrnlID").setValueState(com.ril.PRMS.util.Formatter.setHeaderColor(agentDataDet.results[a].ZzextAgentid_X));
				oView.byId("inptjobDescr").setValueState(com.ril.PRMS.util.Formatter.setHeaderColor(agentDataDet.results[a].ZzjobDesc_X));
				//=============================For Navigation one================================
				var nav1=agentDataDet.results[a].PDAGENTTOADDCHARNAV;
				for(var i=0;i<nav1.results.length;i++){
					var name=nav1.results[i].Zzname;
					var ZTask=nav1.results[i].ZzTask;
					switch(name){
					case "ZADOJ":
						oView.byId("dpDOJ").setValueState(com.ril.PRMS.util.Formatter.setColor(nav1.results[i].ZzsubcharValue_X,ZTask));
						break;
					case "ZAQLF":
						oView.byId("cmbQualification").setValueState(com.ril.PRMS.util.Formatter.setColor(nav1.results[i].ZzsubcharValue_X,ZTask));
						break; 
					case "ZAIND":
						oView.byId("cmbIndustry").setValueState(com.ril.PRMS.util.Formatter.setColor(nav1.results[i].ZzsubcharValue_X,ZTask));
						break;
					case "ZAYOE":
						oView.byId("inpYoExp").setValueState(com.ril.PRMS.util.Formatter.setColor(nav1.results[i].ZzsubcharValue_X,ZTask));
						break;
					case "ZASLN":
						oView.byId("cmbSecLanguage").setValueState(com.ril.PRMS.util.Formatter.setColor(nav1.results[i].ZzsubcharValue_X,ZTask));
						break;
					}
				}
			}
		}
	},
	
	onChangValidateDates:function(oEvent){
		var oThis =this;
		var index = oEvent.oSource.oParent.indexOfCell(oEvent.oSource);
		var val = oEvent.oSource.getDateValue();
		var cells = oEvent.oSource.getParent().getCells();
		
		if(cells[index+1].mProperties.dateValue!= undefined){
			if(val > cells[index+1].getDateValue()){
				sap.m.MessageToast.show("Date of Expiry should be greater than the Date of Issue");
				oEvent.oSource.setDateValue();      
			}

		}else{
			if(val < cells[index-1].mProperties.dateValue){
				sap.m.MessageToast.show("Date of Issue should be less than the Date of Expiry ");
				oEvent.oSource.setDateValue();      
			}
		}
		/* changed by linga on Oct 20, 2016 at 5:40:30 PM */
		if(oEvent.oSource.oParent.oParent.sId.indexOf("taxTable")>0){
			this.identifierTaxTableChange = true;
			oEvent.oSource.oParent.getBindingContext() ? oEvent.oSource.oParent.getBindingContext().getObject().isChanged = true:"";
			var obj = oEvent.oSource.oParent.getCells()[oEvent.oSource.oParent.indexOfCell(oEvent.oSource)].mProperties;
			obj["valueChange"] = true;
		}
		if(oEvent.oSource.oParent.oParent.sId.indexOf("proofTable")>0){
			this.identifierProofTableChange = true;
			oEvent.oSource.oParent.getBindingContext()?oEvent.oSource.oParent.getBindingContext().getObject().isChanged = true:"";
			var obj = oEvent.oSource.oParent.getCells()[oEvent.oSource.oParent.indexOfCell(oEvent.oSource)].mProperties;
			obj["valueChange"] = true;
		}
		if(oEvent.oSource.oParent.oParent.sId.indexOf("agent_Details_proofTable")>0){
			this.agentProofTableChange = true;
			/*oEvent.oSource.oParent.oBindingContexts.agentPrftab?oEvent.oSource.oParent.oBindingContexts.agentPrftab.getObject().isChanged = true : "";*/
			if(oEvent.oSource.oParent.oBindingContexts.agentPrftab){
			var modelIndex = oEvent.oSource.oParent.oBindingContexts.agentPrftab.getObject().modelIndex;
			var property = oEvent.oSource.oParent.indexOfCell(oEvent.oSource) == "4"?"ZzdateOfExpiry":"ZzdateOfIssue";
			this.updateAgentModelData(modelIndex,property,this.AgentKey_temp,oEvent.oSource.getDateValue());
		}
		}

	},
	//Shadab - 16/10
	clearCityField:function(){
		this.byId("cmbCity").setValue("");
		this.byId("cmbCity").clearSelection();
	},
	
	clearCityDependent:function(){
		this.byId("cmbDistrct").setValue("");
		this.byId("cmbDistrct").clearSelection();
		this.byId("inptAreaLoc").setValue("");
		this.byId("inptAreaLoc").clearSelection();
	},
	
	TableSelectedItems:function(id,keys,jsonalias,property){
		var tableprod=this.getView().byId(id);
		if(tableprod.getItems()!=undefined && tableprod.getItems().length>0){
			
		for(var i=0;i<keys.length;i++){
			for(var j=0;j<tableprod.getItems().length;j++){
				var itemObj=tableprod.getItems()[j].oBindingContexts[jsonalias].getObject();
				//tableprod.getItems()[j].setEnabled(false);
				if(keys[i][property]==itemObj.AttrCode){
					tableprod.getModel(jsonalias).oData.results[j].isBackend=true;
					//var state = keys[i].ZzTask != ""?(keys[i]["ZzTask"] == "U" && keys[i][property+"_X"]=="X"? "Warning":(keys[i]["ZzTask"] == "I"?"Success":"Error" )):"None";
				
					if(keys[i].ZzTask != ""){
						if(keys[i]["ZzTask"] == "U" && keys[i][property+"_X"]=="X"){
							var state = "Warning";	
						}else if(keys[i]["ZzTask"] == "I" && keys[i][property+"_X"]=="X"){
							var state = "Success";	
						}else if(keys[i]["ZzTask"] == "D" && keys[i][property+"_X"]=="X"){
							var state = "Error";	
						}else{
							var state = "None";	
						}
					}else{
						var state = "None";	
					}
					
					tableprod.getItems()[j].getCells()[0].setState(state);
					tableprod.getItems()[j].setSelected(true);
				//	break;
				}
			}
		}
		
		var panel=tableprod.oParent.oParent;
		var header = panel.getHeaderText();
		var headerText = header.split('(');
		panel.setHeaderText("");
		var selectlen=tableprod.getSelectedItems().length+" "+"Selected";
		panel.setHeaderText( headerText[0].trim()+" " +" "+"("+selectlen+")");
		}
	},
	
	onExit : function(oEvent){
		if(this.fragment !=undefined){
			this.fragment.destroy();
		}
		var oEventBus = this.getEventBus();
		oEventBus.unsubscribe("Master", "InitialLoadFinished", this.onMasterLoaded, this);
		oEventBus.unsubscribe("Component", "MetadataFailed", this.onMetadataFailed, this);
		
	},
	
	ReferenceAgentPanelExpand:function(e){
		
	},
});