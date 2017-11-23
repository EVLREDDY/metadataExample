jQuery.sap.require("sap.m.MessageBox");
sap.ui.controller("metadata.view.TodayCaf", {
	

    onInit : function() {
    	this.fnGetRouter().attachRoutePatternMatched(
    	this.fnOnRouteMatched, this);
    	this.oModel = this.getOwnerComponent().getModel();
	},
    
	fnGetRouter : function() {
		return sap.ui.core.UIComponent.getRouterFor(this);
	},
	
    fnOnRouteMatched : function(oEvent) {
    if (oEvent.mParameters.name == "TodayCaf") {
    	if(metadata.appData.HQID == undefined){
	  		this.fnGetRouter().navTo("S1",{
			  });
	  		return;
	  	}
			this.bindTextData();
			this.byId("idCAFNumberToday").setValue(metadata.appData.CAFNum);
			this.UOLTableArray=[];
		  	this.MNPTableArray=[];
		  	this.byId("idUOLTable").setModel(new sap.ui.model.json.JSONModel(this.UOLTableArray));
		  	this.byId("idMNPTable").setModel(new sap.ui.model.json.JSONModel(this.MNPTableArray));
		} 
    },
       
      /*metadata.appData.cafOrderId = selItem.CafOrderNo; 
    	   metadata.appData.CAFNum = selItem.CafNo; 
    	   metadata.appData.cfPONum = selItem.PoNumber;  */
	  bindTextData:function(){
		  var that=this;
		  metadata.busyDialog.open();
		  var ojsonModel=new sap.ui.model.json.JSONModel();
		  var sPath = "/MaCafDisplaySet?$filter=IvCafOrderNo eq '"+metadata.appData.cafOrderId+"' &$expand=userordlistnavg";
		  this.oModel.read(sPath,null,true,[],function(oData,oresp){
			  that.PartnerNoHqDet = oData.results[0].PartnerNoHqDet;
			  that.mnp = oData.results[0].EvYyreceiptNo;
			  
			  if(that.mnp == "05"){
				  
				  that.byId("mnpPanel").setVisible(true);
        		  //that.getView().byId("CfulMNP").setVisible(true);
        		  //that.getView().byId("idMNPLetterToday").setVisible(true);
        	  }else{
        		  that.byId("mnpPanel").setVisible(false);
        		  //that.getView().byId("CfulMNP").setVisible(false);
        		  //that.getView().byId("idMNPLetterToday").setVisible(false); 
        	  }
			  
		   ojsonModel.setData(oData);
		   that.getView().setModel(ojsonModel,"HqLocationDisplayJSON");
		  },function(error){
			  metadata.busyDialog.close();
		  });
		  
		  this.oModel.read("/PlanOfferCodeSet/?$filter=IvCafNo eq '"+metadata.appData.CAFNum+"'",null,true,[],function(oData,oResponse){
			  var gg = []; 
         	 that.offerkeys=[];
           	for(var i=0;i<oData.results.length;i++){
           		that.offerkeys.push(oData.results[i].PlanId);
           		var offerString = {
           				key:oData.results[i].PlanId, 
           				text:oData.results[i].PlanId
           		};
           		gg.push(offerString);
           	}
           	var jsonFF = new sap.ui.model.json.JSONModel(gg);
           	that.byId("idPlanIdToday").setModel(jsonFF,"jsonFFA");
           	that.byId("idPlanIdToday").setSelectedKeys(that.offerkeys);
           	metadata.busyDialog.close();
		  },function(error){
			  that.offerkeys=[];
			  metadata.busyDialog.close();
		  });
	  },
	  
       
       getSlug:function(file,sId,fysplit){
	   		
	   		var offercode ="",slug = "",
	   			proofOfIdentifier = "", documentNumber = "", 
	   			dateOfissue = "", placeOfissue = "",
	   			issuingAuth = "", docType="",
	   			actstat= metadata.appData.s1Reference.byId("idActType").getSelectedKey(), caftype="", custcafno=this.byId("idCAFNumberToday").getValue(),
	   			//locabc=metadata.appData.LocId,
	   		 sessionId = sessionStorage.getItem("SessionUniqueID"),
	   			circleid = this.byId("idCLCircleLc").getSelectedKey();
	   		var cafType = metadata.appData.s1Reference.byId("idTypeCAF").getSelectedKey();
	   		var cafKey = "";
	   		
	   		if(sId == "idUserOrderListToday" && (fysplit == 'CSV' || fysplit == 'csv')){

	   			if(cafType == 1 || cafType == 6){
	   				cafKey = "N";
	   			}else if(cafType == 2){
	   				cafKey = "E";
	   			}
	   			offercode = this.offerkeys.join("|");
	   			docType = "UOL";
	   			cafType = this.mnp == "05" ? "M" : cafKey;
	   			slug = custcafno+"@"+file.name+"@"+docType+"@"+proofOfIdentifier+"@"
                +documentNumber+"@"+dateOfissue+"@"+placeOfissue+"@"+issuingAuth+"@"+'S'+"@"+actstat+"@"+offercode+"@"+caftype+"@"+circleid+"@"+metadata.appData.cafOrderId+"@"+sessionId;
	   			
	   		} else if(sId == "idMNPLetterToday" && (fysplit == 'jpeg' || fysplit == 'jpg' || fysplit == 'pdf')){
	   			docType = 'MNP';
	   			if(cafType == 2){
	   				cafKey = "E";
	   			}
	   			slug = custcafno+"@"+file.name+"@"+docType+"@"+proofOfIdentifier+"@"
                +documentNumber+"@"+dateOfissue+"@"+placeOfissue+"@"+issuingAuth+"@"+'S'+"@"+actstat+"@"+offercode+"@"+cafKey+"@"+circleid+"@"+this.cafordno+"@"+sessionId;
	   			
	   		}else {
	   			slug = "";
	   		}
	   		return slug;
	   	},
	   	
       uploadFiles : function(oEvent){
 	      var file = "",sId="",fysplit="",slug="";
 	      var that =this;
 	      
 	      if (oEvent != null){
 	    	   sId = oEvent.getSource().getId().split("--")[1];
 	    	   file = oEvent.oSource.oFileUpload.files[0];
 	      }
 	    
 	    try {
 	      if (file) {
 	    	  
 	      if(file.size > "26214400"){
 	    	  sap.m.MessageToast.show("File Size should be < 25 MB");
 	    	  return;
 	      }
 	        if(file.type =="application/pdf" || file.type=="image/jpeg" || file.type=="image/jpg"
 	          ||file.type=="application/vnd.ms-excel" ||file.type=="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
 	          
 	          var ftype =  file.name.split('.');
 	          if (ftype[2] != null){
 	           fysplit = ftype[2];
 	          }else if (ftype[1] != null){
 	            fysplit = ftype[1];
 	          }else if (ftype[0] != null){
 	            fysplit = ftype[0];
 	          }
 	          
 	          var f = {
 	              headers : {
 	                "X-Requested-With" : "XMLHttpRequest",
 	                "Content-Type" : "application/atom+xml",
 	                DataServiceVersion : "2.0",
 	                "X-CSRF-Token" : "Fetch"
 	              },
 	              requestUri : metadata.util.Formatter.getServiceUrl(metadata.util.Formatter.CRM_SERVICE,false),
 	              method : "GET"
 	          };
 	          
 	          	slug =  this.getSlug(file,sId,fysplit);
 	          	if(slug == ""){
 	          		sap.m.MessageToast.show("Upload Proper file Format");
 	          		return ;
 	          	}
 	          	
 	          	metadata.busyDialog.open();
 	            OData.request(f, function(data, oSuccess) {
 	            this.oToken = oSuccess.headers['x-csrf-token'];
 	            var oHeaders = {
 	                "x-csrf-token" : this.oToken,
 	                "slug" : slug
 	            };
 	            var oURL = metadata.util.Formatter.getServiceUrl(metadata.util.Formatter.CRM_SERVICE,false)+"/MaFileuploadSet";
 	            jQuery.ajax({
 	              type: 'POST',
 	              url: oURL,
 	              headers: oHeaders,
 	              cache: false,
 	              contentType: file.type,
 	              processData: false,
 	              data: file,
 	              dataType:"json",
 	              success: function(data,oResponse){
 	            	  var flag = data.d.FileType;
 	            	  var message = data.d.FileName;
 	            	  var finalMsgArr="";
 	            	  var msgArr= message.split("~");
 	               for(var u=0;u<msgArr.length;u++){
 	            	   var tempArr = msgArr[u].split('|');
 	            	   finalMsgArr  +=tempArr[0] + "     \t\t\t\t\t\t\t\t      "+tempArr[1] +" \n";
 	            	   tempArr=[];
 	               }
 	               metadata.busyDialog.close();
 	               if (flag == 'E'){
 	            	  that.byId("idUserOrderListToday").clear();
 	            	 that.byId("idMNPLetterToday").clear();
 	                 sap.m.MessageBox.show(finalMsgArr , {
 	                             icon  : sap.m.MessageBox.Icon.ERROR,                        
 	                             title : "Error",
 	                             actions: [sap.m.MessageBox.Action.OK],
 	                           });
 	               return;
 	               }else {
 	            	   if(sId=="idUserOrderListToday"){
 	            		that.UOLTableArray.push({file:file.name});
 	            		that.byId("idUOLTable").setModel(new sap.ui.model.json.JSONModel(that.UOLTableArray));
 	            		that.byId("idUserOrderListToday").clear();
 	            	   }else if(sId=="idMNPLetterToday"){
 	            		   that.MNPTableArray.push({file:file.name});
 	            		   that.byId("idMNPTable").setModel(new sap.ui.model.json.JSONModel(that.MNPTableArray));
 	            		   that.byId("idMNPLetterToday").clear();
 	            	   }
 	            	   sap.m.MessageToast.show("File Uploaded Successfully");
 	               }
 	              }, error:function(data,oResponse){
 	            	 that.byId("idUserOrderListToday").clear();
 	            	 that.byId("idMNPLetterToday").clear();
 	               sap.m.MessageToast.show("File Uploaded Failed");
 	               metadata.busyDialog.close();
 	              }
 	            });
 	          });
 	        } 
 	      }
 	    } catch(oException) {
 	    	  metadata.busyDialog.close();
 	    	  jQuery.sap.log.error("File upload failed:\n" + oException.message);
 	    }
 	    
 	  },
       
       onSaveCafToday : function() {
           var that = this;
           var poNumber = that.getView().byId("idPONumberToday").getValue();
           var MNPTable = that.getView().byId("idMNPTable").getItems().length;//.getValue();
           var UOLTable = that.getView().byId("idUOLTable").getItems().length;//.getValue();
           
           if(UOLTable == 0){
        	   this.byId("tbIconTabBar").setSelectedKey("cafDetails");
        	   sap.m.MessageToast.show("Please Upload the UOL documents");
        	   return;
           }else if(this.mnp==5 && MNPTable == 0){
        	   this.byId("tbIconTabBar").setSelectedKey("cafDetails");
        	   sap.m.MessageToast.show("Please Upload the MNP documents");
        	   return;
           }
        
          var payloadUpdateCAF = {
       	        IvCafOrderNo : metadata.appData.cafOrderId, 
       	          IvDocStatus : 'X',
       	          IvUsrType : '0',
       	          PartnerNoHqDet :this.PartnerNoHqDet,
       	          PoNum  : poNumber  
       	    };
          
          payloadUpdateCAF.MACAFUPDTOORDLISTNAV  = [];
          metadata.busyDialog.open();
          this.oModel.create("/MaCafUpdateSet",payloadUpdateCAF,null,function(oData,Response){
        	  metadata.busyDialog.close();
              if(oData.EvFlag == "S"){   
                 sap.m.MessageBox.show("Record Updated Successfully.", {
                       icon: sap.m.MessageBox.Icon.SUCCESS,
                       title: "Success",
                       actions: [sap.m.MessageBox.Action.OK],
                       onClose: function(oAction) {
                           that.getView().byId("btnSaveCAFToday").setEnabled(false);
                           that.onNavBack();
                       }
                     });
               }else{
                 sap.m.MessageBox.show(oData.EvMessage , {
                       icon: sap.m.MessageBox.Icon.WARNING,
                       title: "Alert",
                       actions: [sap.m.MessageBox.Action.OK],
                       onClose: function(oAction) {

                       }
                     });
               } 
              
              },function(e){
            	  metadata.busyDialog.close();
              });
           },
           
           onNavBack:function(){
        	   this.fnGetRouter().navTo("S1");
        	   this.clearAllFields();
           },
         clearAllFields:function(){
        	   var oview=this.getView();
        	   oview.byId("idHQNameToday").setValue("");
        	   oview.byId("idCINNumberToday").setValue("");
        	   oview.byId("idHQHouseToday").setValue("");
        	   oview.byId("idHQBuildNameToday").setValue("");
        	   oview.byId("IdHQFloorBldgToday").setValue("");
        	   oview.byId("IdHQWingToday").setValue("");
        	   oview.byId("idHQSocietyNameToday").setValue("");
        	   oview.byId("idHQAreaToday").setValue("");
        	   oview.byId("idHQStreetToday").setValue("");
        	   oview.byId("idHQLandmarkToday").setValue("");
        	   oview.byId("idHQCitypcToday").setValue("");
        	   oview.byId("idHQCityToday").setSelectedKey("");
        	   oview.byId("idCityDisplayHq").setValue("");
        	   oview.byId("idHQDistrictToday").setValue("");
        	   oview.byId("idHQRegionToday").setSelectedKey("");
        	   oview.byId("idHQRegionToday").setSelectedKey("");
        	   oview.byId("idHqJioCenter").setSelectedKey("");
        	   oview.byId("idHQCountryKeyToday").setSelectedKey("");
        	   oview.byId("idWalletTodayCAFDisp").setValue("");
        	   oview.byId("idOrderCreatedToday").setValue("");
        	   oview.byId("idPONumberToday").setValue("");
        	   oview.byId("idCounterToday").setValue("");
        	   oview.byId("idTotConnToday").setValue("");
        	   oview.byId("idProdTypeToday").setValue("");
        	   oview.byId("idPlanIdToday").setValue("");
        	   oview.byId("idActiveToday").setValue("");
        	   oview.byId("idValidFromToday").setValue("");
        	   oview.byId("idValidToToday").setValue("");
        	   oview.byId("idLocationIdToday").setValue("");
        	   oview.byId("idLocationNameToday").setValue("");
        	   oview.byId("idLocEmailIdToday").setValue("");
        	   oview.byId("idLocMobileNumberToday").setValue("");
        	   oview.byId("idLocLandlineNumberToday").setValue("");
        	   oview.byId("idLocHouseToday").setValue("");
        	   oview.byId("idLocBuildNameToday").setValue("");
        	   oview.byId("IdLocFloorBldgToday").setValue("");
        	   oview.byId("IdLocWingToday").setValue("");
        	   oview.byId("idLocSocietyNameToday").setValue("");
        	   oview.byId("idLocAreaToday").setValue("");
        	   oview.byId("idLocStreetToday").setValue("");
        	   oview.byId("idLocLandmarkToday").setValue("");
        	   oview.byId("idLocCitypcToday").setValue("");
        	   oview.byId("idLocCityToday").setSelectedKey("");
        	   oview.byId("idCityDisplayLc").setValue("");
        	   oview.byId("idLocDistrictToday").setValue("");
        	   oview.byId("idLocRegionToday").setSelectedKey("");
        	   oview.byId("cbCLstateDisplayLc").setSelectedKey("");
        	   oview.byId("idLocJioCenter").setSelectedKey("");
        	   oview.byId("idLocCountryKeyToday").setSelectedKey("");
        	   oview.byId("idCLCircleLc").setSelectedKey("");
        	   oview.byId("idBillingType").setValue("");
        	   oview.byId("idBillLocDesc").setValue("");
        	   oview.byId("idSummLocDesc").setValue("");
        	   
        	   oview.byId("idUserOrderListToday").setValue("");
        	   oview.byId("idMNPLetterToday").setValue("");
        	   
        	   this.byId("idMNPTable").removeAllItems();
        	   this.byId("idUOLTable").removeAllItems();
        	   
           }
});