jQuery.sap.require("sap.m.MessageBox");
sap.ui.controller("metadata.view.cafDisplay", {
	
	 /*metadata.appData.HQId = this.LOCId;
		metadata.appData.LocId = this.HQID;
		metadata.appData.AUTId = cfPONum;
		metadata.appData.cfPONum = cfPONum;
		metadata.appData.validFrom = validFrom;
		metadata.appData.validTo = validTo;
		metadata.appData.numberOfConnections = numberOfConnections;
		metadata.appData.connectionsExhausted = connectionsExhausted;
		metadata.appData.offerKeys = offerKeys;*/	
	
	onInit: function() {
	    this.fnGetRouter().attachRoutePatternMatched(this.fnOnRouteMatched, this);
	    this.oModel=this.getOwnerComponent().getModel();
	  },

	  fnGetRouter : function () {
	    return sap.ui.core.UIComponent.getRouterFor(this);
	  },
	  
	  fnOnRouteMatched:function(oEvent){
		  if(oEvent.mParameters.name=="cafDisplay"){
			  	metadata.busyDialog.open();
			  	if(metadata.appData.AUTId == undefined){
			  		this.fnGetRouter().navTo("S1",{
					  });
			  		return;
			  	}
			  	
			  	var sPath="/MaCafPrefilledSet(IvAuthSignBpId='"+metadata.appData.AUTId+"',IvHqId='"+metadata.appData.HQId+"',IvLocationId='"+metadata.appData.LocId+"',IvBillingBpId='')";
				this.bindHQ_LocData(sPath); 
			  	this.bindInv_SummLocData();
			  	this.offerDataBind();
			  	this.bindCommertialDetails();
			  	this.UOLTableArray=[];
			  	this.MNPTableArray=[];
			  	this.byId("uolTable").setModel(new sap.ui.model.json.JSONModel(this.UOLTableArray));
			  	this.byId("mnpTable").setModel(new sap.ui.model.json.JSONModel(this.MNPTableArray));
		  } 
	  },
	  
	  bindHQ_LocData : function(sPath){ 
		  var that=this;
		  var oJsonModel = new sap.ui.model.json.JSONModel();
		  oJsonModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
		  this.oModel.read(sPath, null, null, true, function(oData, oResponse) {
			  oJsonModel.setData(oData);
			  that.getView().setModel(oJsonModel, "JSONCafDisplay");
			  metadata.busyDialog.close();
		  },function(error){
			  metadata.busyDialog.close();
		  });
	  },

	  bindInv_SummLocData : function(){
		    var that = this;
		    this.oModel.read("/CorpSearchSet?$filter=IvHqId eq '"+metadata.appData.HQId+"'",null,null,true,function(oData,resp){
		      that.getView().setModel(new sap.ui.model.json.JSONModel(oData.results),"invoiceloc");
		    },function(error){});
		    
	  },
	  
	  offerDataBind:function(){
			 var jsonData =  new sap.ui.model.json.JSONModel(metadata.appData.offerComboData);
			 this.getView().setModel(jsonData,"offers");
			 this.byId("idPlanId").setSelectedKeys(metadata.appData.offerKeys);
	  },
		  
	  bindCommertialDetails:function(){
		 this.byId("idPONumber").setValue(metadata.appData.cfPONum);
	     this.byId("idCounter").setValue(metadata.appData.connectionsExhausted);
	     this.byId("idTotConn").setValue(metadata.appData.numberOfConnections);
	     this.byId("idActive").setValue("X");
	     this.byId("idValidFrom").setValue(metadata.appData.validFrom);
	     this.byId("idValidTo").setValue(metadata.appData.validTo);
	  },
	 
	  
	  handleSelectionChange:function(){
		  this.byId("idPlanId").setSelectedKeys(metadata.appData.offerKeys);
	  },
	  
	  cafNumLiveSearch:function(oEvent){
		    var name = oEvent.getSource().getValue().trim();
		    oEvent.getSource().setValue(name.toUpperCase());
		            if(name==" "){
		             oEvent.getSource().setValue("");
		            }
		            var NReg = /^[a-zA-Z0-9]*$/;
		            if (!name.match(NReg)) {
		              oEvent.getSource().setValue("");
		            }
	  },
	  
	  cafNumChange:function(){

	      var that = this;
	      var cafNumber = this.byId("idCAFNumber").getValue();
	      var circId = this.byId("idCLCircleLc").getSelectedKey();
	      var circleName = cafNumber.substring(0,2);
	      
	      if(cafNumber.length > 10){
	    	  sap.m.MessageToast.show("CAF Number should not be less than 10 Characters");
	    	  return;
	      }
	      if(circId != circleName){
	    	  sap.m.MessageToast.show("Please Enter First 2 Characters as CircleId Key of the Location");
	    	  return;
	      }
	      
	      metadata.busyDialog.open();
	      
	      if(cafNumber !=""){
	    	  var sPath = "/CAFValidationSet(IvCafNum='"+cafNumber+"')";
	    	  this.oModel.read(sPath,null,null,true,function(oData,resp){
	    		  
	    		  if(oData.EvValFail == "S"){
	    			  that.byId("idCafRefresh").setVisible(true);
	    			  that.byId("idCAFNumber").setEnabled(false);
	    			  that.byId("btnSaveCAF").setEnabled(true);
	    			  that.DisplayUploads(oData.EvValFail);
	    		  }else{
	    			  that.DisableUploads();
	    			  sap.m.MessageBox.show( "CAF Number already Exists", {
	    		                icon: sap.m.MessageBox.Icon.WARNING,
	    		                title: "Alert",
	    		                actions: [sap.m.MessageBox.Action.OK],
	    		              });
	    			  
	    			  this.byId("idCAFNumber").setValue("");
	    		  }
	    		  metadata.busyDialog.close();
			    },function(error){
			    	that.DisableUploads();
			    	metadata.busyDialog.close();
			    	this.byId("idCAFNumber").setValue("");
			    	sap.m.MessageToast.show("CAF Number already Exists");
			    });
	      }
	  },
	  
	  DisableUploads:function(){
		  this.byId("uolPanelId").setVisible(false);
		  this.byId("idNoc").setVisible(false);
		  this.byId("idCafform").setVisible(false);
		  this.byId("idCommericialform").setVisible(false);
		  this.byId("mnpPanelId").setVisible(false);
		  this.byId("idPhysVerif").setVisible(false);
		  this.byId("idPo").setVisible(false);
		  
		  this.byId("idNocL").setVisible(false);
		  this.byId("idCafformL").setVisible(false);
		  this.byId("idCommericialformL").setVisible(false);
		  this.byId("idPhysVerifL").setVisible(false);
		  this.byId("idPoL").setVisible(false);
		  
		  this.byId("btnSaveCAF").setEnabled(false);
	  },
	  DisplayUploads : function(flag){
		  
		  var cafType = metadata.appData.s1Reference.byId("idTypeCAF").getSelectedKey();
		if(flag == "S"){
			this.byId("uolPanelId").setVisible(true);
			if(cafType == 1){
				  
				  this.byId("uolPanelId").setVisible(true);
				  this.byId("idUserOrderListL").setRequired(true);
				  
				  this.byId("idNoc").setVisible(false);
				  this.byId("idNocL").setRequired(false);
				  this.byId("idNocL").setVisible(false);
				  
				  this.byId("idCafform").setVisible(true);
				  this.byId("idCafformL").setRequired(true);
				  this.byId("idCafformL").setVisible(true);
				  
				  this.byId("idCommericialform").setVisible(true);
				  this.byId("idCommericialformL").setRequired(true);
				  this.byId("idCommericialformL").setVisible(true);
				  
				  this.byId("mnpPanelId").setVisible(false);
				//this.byId("idMNPLetterL").setVisible(true);
				  
				  this.byId("idPhysVerif").setVisible(true);
				  this.byId("idPhysVerifL").setRequired(false);
				  this.byId("idPhysVerifL").setVisible(true);
				  
				  this.byId("idPo").setVisible(true);
				  this.byId("idPoL").setRequired(false);
				  this.byId("idPoL").setVisible(true);
				  
				  
			  }else if(cafType == 3){
				  
				  this.byId("idUserOrderList").setVisible(true);
				  this.byId("idUserOrderListL").setRequired(true);
				  
				  this.byId("idNoc").setVisible(false);
				  this.byId("idNocL").setRequired(false);
				  this.byId("idNocL").setVisible(false);
				  
				  this.byId("idCafform").setVisible(true);
				  this.byId("idCafformL").setRequired(true);
				  this.byId("idCafformL").setVisible(true);
				  
				  this.byId("idCommericialform").setVisible(true);
				  this.byId("idCommericialformL").setRequired(true);
				  this.byId("idCommericialformL").setVisible(true);
				  
				  this.byId("mnpPanelId").setVisible(true);
				  this.byId("idMNPLetterL").setRequired(true);
				  
				  this.byId("idPhysVerif").setVisible(true);
				  this.byId("idPhysVerifL").setRequired(false);
				  this.byId("idPhysVerifL").setVisible(true);
				  
				  this.byId("idPo").setVisible(true);
				  this.byId("idPoL").setRequired(false);
				  this.byId("idPoL").setVisible(true);
				  
			  }else if(cafType == 6){
				  
				  this.byId("idUserOrderList").setVisible(true);
				  this.byId("idUserOrderListL").setRequired(false);
				  
				  this.byId("idNoc").setVisible(true);
				  this.byId("idNocL").setRequired(true);
				  this.byId("idNocL").setVisible(true);
				  
				  this.byId("idCafform").setVisible(true);
				  this.byId("idCafformL").setRequired(true);
				  this.byId("idCafformL").setVisible(true);
				  
				  this.byId("idCommericialform").setVisible(true);
				  this.byId("idCommericialformL").setRequired(true);
				  this.byId("idCommericialformL").setVisible(true);
				  
				  this.byId("mnpPanelId").setVisible(true);
				  this.byId("idMNPLetterL").setRequired(true);
				  
				  this.byId("idPhysVerif").setVisible(true);
				  this.byId("idPhysVerifL").setRequired(false);
				  this.byId("idPhysVerifL").setVisible(true);
				  
				  this.byId("idPo").setVisible(true);
				  this.byId("idPoL").setRequired(false);
				  this.byId("idPoL").setVisible(true);
			  }
		}
		  
		    },
	 
	  handleBackPressCAFDisplay:function(){
		  this.byId("tbIconTabBar").setSelectedKey("cafDetails");
		  this.DisableUploads();
		  this.clearUploads();
		  this.byId("idCAFNumber").setValue("");
		  this.byId("idCAFNumber").setEnabled(true);
		  this.byId("idCafRefresh").setVisible(false);
		  this.byId("btnSaveCAF").setEnabled(false);
		  
		  this.clearDisplayData();
		  this.fnGetRouter().navTo("S1",{
		  });
	  },
	  
	  clearUploads:function(){
		  
		  this.byId("idNoc").clear();
		  this.byId("idCafform").clear();
		  this.byId("idCommericialform").clear();
		  this.byId("idPhysVerif").clear();
		  this.byId("idPo").clear();
		  
		  this.byId("uolTable").removeAllItems();
		  this.byId("mnpTable").removeAllItems();
		  
	  },
	  getSlug:function(file,sId,fysplit){
	   		
	   		var offercode ="",slug = "",
	   			proofOfIdentifier = "", documentNumber = "", 
	   			dateOfissue = "", placeOfissue = "",
	   			issuingAuth = "", docType="",
	   			actstat="", caftype="", custcafno=this.byId("idCAFNumber").getValue(),
	   			locabc=metadata.appData.LocId,
	   			circleid = this.byId("idCLCircleLc").getSelectedKey(),
	   		    sessionId = sessionStorage.getItem("SessionUniqueID");
	   		var cafType = metadata.appData.s1Reference.byId("idTypeCAF").getSelectedKey();
	   		
	   		var cafKey = "";
	   		
	   		
	   		if(sId == "idUserOrderList" && (fysplit == 'CSV' || fysplit == 'csv')){

	   			if(cafType == 1 || cafType == 6){
	   				cafKey = "N";
	   			}else {
	   				cafKey = "M";
	   			}
	   			offercode = metadata.appData.offerKeys.join("|");
	   			docType = "UOL";
	   			actstat = metadata.appData.s1Reference.byId("idActType").getSelectedKey();
	   			cafType =  cafKey;
	   			slug = custcafno+"@"+file.name+"@"+docType+"@"+proofOfIdentifier+"@"
             +documentNumber+"@"+dateOfissue+"@"+placeOfissue+"@"+issuingAuth+"@"+'S'+"@"+actstat+"@"+offercode+"@"+caftype+"@"+circleid+"@"+locabc+"@"+sessionId;
	   		} else if(sId == "idCafform" && (fysplit == 'jpeg' || fysplit == 'jpg' || fysplit == 'pdf')){
	   			docType = 'CAF';
	   			slug = custcafno+"@"+file.name+"@"+docType+"@"+proofOfIdentifier+"@"
             +documentNumber+"@"+dateOfissue+"@"+placeOfissue+"@"+issuingAuth+"@"+'S'+"@"+'S'+"@"+''+"@"+''+"@"+''+"@"+'S'+"@"+sessionId+"@"+'';
	   		}else if(sId == "idCommericialform" && (fysplit == 'jpeg' || fysplit == 'jpg' || fysplit == 'pdf' )){
	   			docType = 'CFC';
	   			slug = custcafno+"@"+file.name+"@"+docType+"@"+proofOfIdentifier+"@"
             +documentNumber+"@"+dateOfissue+"@"+placeOfissue+"@"+issuingAuth+"@"+'S'+"@"+'S'+"@"+''+"@"+''+"@"+''+"@"+'S'+"@"+sessionId+"@"+'';
	   		}else if(sId == "idMNPLetter" && (fysplit == 'jpeg' || fysplit == 'jpg' || fysplit == 'pdf' )){
	   			docType = 'MNP';
	   			slug = custcafno+"@"+file.name+"@"+docType+"@"+proofOfIdentifier+"@"
              +documentNumber+"@"+dateOfissue+"@"+placeOfissue+"@"+issuingAuth+"@"+'S'+"@"+'S'+"@"+''+"@"+''+"@"+''+"@"+'S'+"@"+sessionId+"@"+'';
	   		}else if(sId == "idPhysVerif" && (fysplit == 'jpeg' || fysplit == 'jpg' || fysplit == 'pdf' )){
	   			docType = 'PVF';
	   			slug = custcafno+"@"+file.name+"@"+docType+"@"+proofOfIdentifier+"@"
	   	       +documentNumber+"@"+dateOfissue+"@"+placeOfissue+"@"+issuingAuth+"@"+'S'+"@"+'S'+"@"+''+"@"+''+"@"+''+"@"+'S'+"@"+sessionId+"@"+'';
	   		}else if(sId == "idPo" && (fysplit == 'jpeg' || fysplit == 'jpg' || fysplit == 'pdf' )){
	   			docType = 'POL';
	   			slug = custcafno+"@"+file.name+"@"+docType+"@"+proofOfIdentifier+"@"
	   	     +documentNumber+"@"+dateOfissue+"@"+placeOfissue+"@"+issuingAuth+"@"+'S'+"@"+'S'+"@"+''+"@"+''+"@"+''+"@"+'S'+"@"+sessionId+"@"+'';
	   		}else if(sId == "idNoc" && (fysplit == 'jpeg' || fysplit == 'jpg')){
	   			docType = 'NOC';
	   			slug = custcafno+"@"+file.name+"@"+docType+"@"+proofOfIdentifier+"@"
	   	   +documentNumber+"@"+dateOfissue+"@"+placeOfissue+"@"+issuingAuth+"@"+'S'+"@"+'S'+"@"+''+"@"+''+"@"+''+"@"+'S'+"@"+sessionId+"@"+'';
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
	          		if(sId == "idCafform"){
	          			this.byId("idCafform").clear();
	          		}else if(sId == "idUserOrderList"){
	          			this.byId("idUserOrderList").clear();
	          		}else if(sId == "idCommericialform"){
	          			this.byId("idCommericialform").clear();
	          		}else if(sId == "idMNPLetter"){
	          			this.byId("idMNPLetter").clear();
	          		}else if(sId == "idPhysVerif"){
	          			this.byId("idPhysVerif").clear();
	          		}else if(sId == "idPo"){
	          			this.byId("idPo").clear();
	          		}else{
	          			this.byId("idNoc").clear();
	          		}
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
	            	   that.byId("idUserOrderList").clear();
	            	   that.byId("idMNPLetter").clear();
	                 sap.m.MessageBox.show(finalMsgArr , {
	                             icon  : sap.m.MessageBox.Icon.ERROR,                        
	                             title : "Error",
	                             actions: [sap.m.MessageBox.Action.OK],
	                           });
	               return;
	               }else {
	            	   if(sId=="idUserOrderList"){
	            		that.UOLTableArray.push({file:file.name});
	            		that.byId("uolTable").setModel(new sap.ui.model.json.JSONModel(that.UOLTableArray));
	            		that.byId("idUserOrderList").clear();
	            	   }else if(sId=="idMNPLetter"){
	            		   that.MNPTableArray.push({file:file.name});
	            		   that.byId("mnpTable").setModel(new sap.ui.model.json.JSONModel(that.MNPTableArray));
	            		   that.byId("idMNPLetter").clear();
	            	   }
	            	   sap.m.MessageToast.show("File Uploaded Successfully");
	               }
	              }, error:function(data,oResponse){
	            	  that.byId("idUserOrderList").clear();
	            	   that.byId("idMNPLetter").clear();
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
	  onSaveCaf:function(){
		  var cafNumber = this.byId("idCAFNumber").getValue();
		  var invoice = this.byId("idInvoiceoffId").getSelectedKey();
		  var summary = this.byId("cbSummLocId").getSelectedKey();
		  var NOC = this.byId("idNoc"); 
		  var CAF = this.byId("idCafform");
		  var commertialForm = this.byId("idCommericialform");
		  //var physicalVer=this.byId("idPhysVerif");
		  //var poFile = this.byId("idPo");
		  var UolTable = this.byId("uolTable").getItems().length;
		 // var UOL =  this.byId("idUserOrderList");
		  var mnpTable = this.byId("mnpTable").getItems().length;
		 // var MNP = this.byId("idMNPLetter");
		  
		  var cafTypeKey = metadata.appData.s1Reference.byId("idTypeCAF").getSelectedKey();
		  var activationType = metadata.appData.s1Reference.byId("idActType").getSelectedKey();
		  var offerArr = [];
		  var cafType = "";
		  
		  if(invoice == ""){
			  sap.m.MessageToast.show("Please select Invoice Location");
			  return;
		  }else if(summary ==""){
			  sap.m.MessageToast.show("Please select Summary Location");
			  return;
		  }
		  
		  if(cafTypeKey == "1" && (UolTable == 0 ||  (CAF.oFileUpload && CAF.oFileUpload.files.length==0) || (commertialForm.oFileUpload && commertialForm.oFileUpload.files.length==0) )){
			  this.byId("tbIconTabBar").setSelectedKey("fileUpload");
			  sap.m.MessageToast.show("Please Upload Mandatory Documents(UOL/CAF/CommertialForm)");
			  return;
			  
		  }else if(cafTypeKey == "3" && (UolTable == 0 || (CAF.oFileUpload && CAF.oFileUpload.files.length==0)||(commertialForm.oFileUpload && commertialForm.oFileUpload.files.length==0) || mnpTable==0)){
			  this.byId("tbIconTabBar").setSelectedKey("fileUpload");
			  sap.m.MessageToast.show("Please Upload Mandatory Documents(UOL/CAF/CommertialForm/MNP)");
			  return;
			  
		  }else if(cafTypeKey == "6" && ((NOC.oFileUpload && NOC.oFileUpload.files.length==0) ||  (CAF.oFileUpload && CAF.oFileUpload.files.length==0)|| (commertialForm.oFileUpload && commertialForm.oFileUpload.files.length==0) || mnpTable==0)){
			  this.byId("tbIconTabBar").setSelectedKey("fileUpload");
			  sap.m.MessageToast.show("Please Upload Mandatory Documents(NOC/CAF/CommertialForm/MNP)");
			  return;
		  }
		  
		  var oIds =  metadata.appData.offerKeys;
	      for(var z=0;z<oIds.length;z++){
	     	 var obj = {
	     			PoNum : metadata.appData.cfPONum,
	     			PlanId : oIds[z],
	     			IvCafNo : cafNumber,
	     			IvNhqId : metadata.appData.HQId
	     	 };
	    	  offerArr.push(obj); 
	      }
	      
	      if(cafTypeKey == 1){
	    	  cafType = "04";
	      }else if(cafTypeKey == 3){
	    	  cafType = "05";
	      }else if(cafTypeKey == 6){
	    	  cafType = "06";
	      }
	      
		  var payloadCreateCAF = {
		    		
		    		 PoNum : metadata.appData.cfPONum,
		    		 Counter : metadata.appData.connectionsExhausted,
		     		 ValidFm : metadata.appData.validFrom ,
		     		 ValidTo : metadata.appData.validTo,
		     		 Active : "X",
		     		 TotConnects : metadata.appData.numberOfConnections,
		     		 ProdType : "",
		     		 PlannId : "",
		     		 IvAuthSignatory : metadata.appData.AUTId==0?"": metadata.appData.AUTId,
		     		 IvBillLocid : invoice,
		     		 IvBillType : "",
		     		 IvCafNo : cafNumber,
		     		 IvCafNoOld : metadata.oldCAFNo?metadata.oldCAFNo:"",
		     		 IvCafType : cafType,
		     		 IvFileName : "",
		     		 IvLocationId : metadata.appData.LocId,
		     		 IvNhqId : metadata.appData.HQId,
		     		 IvSubsType : activationType,
		     		 IvSummLocid : summary,
		             CAFPODETAILS:offerArr
		             };
		  
		  var that = this;
		  this.oModel.create("/CafCreateSet",payloadCreateCAF,null,function(oData,Response){
			  if(oData.EvFlag == "S"){
			        sap.m.MessageBox.show(oData.EvMessage,{
			              icon: sap.m.MessageBox.Icon.SUCCESS,
			              title: "Success",
			              actions: [sap.m.MessageBox.Action.OK],
			              onClose: function(oAction) { 
			            	  that.handleBackPressCAFDisplay();
			            	  /*if(sap.ushell){
			            		  var navigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
					      			navigationService.toExternal({
					      				target : { semanticObject : "ZONBOARDING_CAF", action: "display" },
					      			});	  
			            	  }*/
			              }
			            });
			  }else {
				  sap.m.MessageBox.show(oData.EvMessage , {
				              icon: sap.m.MessageBox.Icon.WARNING,
				              title: "Alert",
				              actions: [sap.m.MessageBox.Action.OK],
				              onClose: function(oAction) {
				              }
				            }
				        );
			  }
			        
		  },function(error){
			  
		  });

		  
	  },
	  
	  clearDisplayData:function(){
		  
		this.byId("idHQId").setValue("");  
		this.byId("idHQName").setValue("");  
		this.byId("idCINNumber").setValue("");  
		this.byId("idHQHouse").setValue("");  
		this.byId("idHQBuildName").setValue("");  
		this.byId("IdHQFloorBldg").setValue("");  
		this.byId("IdHQWing").setValue("");  
		this.byId("idHQSocietyName").setValue("");  
		this.byId("idHQArea").setValue("");  
		this.byId("idHQStreet").setValue("");  
		this.byId("idHQLandmark").setValue("");  
		this.byId("idHQCitypc").setValue("");  
		this.byId("idCityDisplayHq").setValue("");  
		this.byId("idHQDistrict").setValue("");  
		
		this.byId("cbCLstateDisplayHq").setValue("");  
		this.byId("idHQCity").setValue("");  
		this.byId("idHQRegion").setValue("");  
		this.byId("idHqJioCenter").setValue("");  
		this.byId("idCLCircleHq").setValue("");  
		this.byId("idHQCountryKey").setValue("");  
		
		this.byId("idWalletCAFDisp").setValue("");  
		this.byId("idOrderCreated").setValue("");  
		this.byId("idPONumber").setValue("");  
		this.byId("idCounter").setValue("");  
		this.byId("idTotConn").setValue("");  
		this.byId("idProdType").setValue("");  
		this.byId("idPlanId").setValue("");  
		this.byId("idActive").setValue("");  
		this.byId("idValidFrom").setDateValue();  
		this.byId("idValidTo").setDateValue();  
		this.byId("idLocationId").setValue("");  
		this.byId("idLocationName").setValue("");  
		this.byId("idLocEmailId").setValue("");  
		this.byId("idLocMobileNumber").setValue("");  
		this.byId("idLocLandlineNumber").setValue("");  
		this.byId("idLocHouse").setValue("");  
		this.byId("idLocBuildName").setValue("");  
		this.byId("IdLocFloorBldg").setValue("");  
		this.byId("IdLocWing").setValue("");  
		this.byId("idLocSocietyName").setValue(""); 
		this.byId("idLocArea").setValue("");  
		this.byId("idLocStreet").setValue("");  
		this.byId("idLocLandmark").setValue("");  
		this.byId("idLocCitypc").setValue("");  
		this.byId("idCityDisplayLc").setValue("");  
		this.byId("idLocDistrict").setValue("");
		
		this.byId("cbCLstateDisplayLc").setValue("");
		this.byId("idLocJioCenter").setValue("");
		this.byId("idCLCircleLc").setValue("");
		this.byId("idLocCountryKey").setValue("");
		this.byId("idBillingLoca").setValue("");
		this.byId("idInvoiceoffId").setValue("");
		this.byId("cbSummLocId").setValue("");
		
		
	  },
	  onCAFRefresh:function(){
		debugger;  
		 this.byId("idCafRefresh").setVisible(false);
		 this.byId("idCAFNumber").setEnabled(true);
		 this.byId("idCAFNumber").setValue("");
		 this.byId("btnSaveCAF").setEnabled(false);
		 this.DisableUploads();
		 this.clearUploads();
	  },
	  //For download/////UOL/////////////
	  onPressDowload : function(){
          var attachpath="FileDownloadSet(IvObjectId='',IvDocNumber='',IvDocType='99')/$value";
          this.oModel.read(attachpath,null,null,true,function(oData,response){
           var url = response.requestUri;
           sap.m.URLHelper.redirect(url, true);
            },function(oData, oResponse) {
                        var message=oData.response.body;
                        var messageValue=message.split(":")[5];
                        var msg=messageValue.substr(0,39);
                        sap.m.MessageBox.alert("oData Response: "+messageValue, {
                        icon  : sap.m.MessageBox.Icon.ERROR,                        
                        title : "Error",
                        actions: [sap.m.MessageBox.Action.OK],
                                           });
                                      });

                              },

	  
});