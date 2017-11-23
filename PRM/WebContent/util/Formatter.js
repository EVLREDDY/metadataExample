jQuery.sap.declare("com.ril.PRMS.util.Formatter");
jQuery.sap.require("sap.ui.core.format.DateFormat");
com.ril.PRMS.util.Formatter = {
		
		  onRefresh:function(value){
			  if(value == undefined)
					return;
				else
					var dateVal = value.toString();
				if(dateVal.charAt(0) == "/"){
					var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
						pattern : "dd-MM-yyyy"
					});
					return oDateFormat.format(new Date(parseInt(value.split("(")[1]
							.split(")")[0])));
				}else{
					var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
						pattern : "dd-MM-yyyy"
					});
					return oDateFormat.format(new Date(value));
				}
		  },
		  string_to_Date: function(date){
			  var year=date.substr(0,4);
			  var month=date.substr(4,2);
			  var day=date.substr(6,2);
			  var newDate=day+"-"+month+"-"+year;
			  return newDate;
			
			  
		  },
		  
		  formatYear : function(date){
              var dayt = date.getDate();
              var day = ('0' + dayt).slice(-2);
              var monthIndext = date.getMonth()+1;
              var monthIndex = ('0' + monthIndext).slice(-2);
              var year = date.getFullYear();
              var stryear = year+'-'+monthIndex+'-'+day;/*+'T'+Hour+':'+Minutes+':'+Seconds;*/
              return stryear;

     },

		  
		  dateIncFrmt: function(value){
			  
			  var date=new Date(value);
			  var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					pattern : "dd-MM-yyyy"
				});
			  var validDate=oDateFormat.format(date);
			  return validDate;
		  },
		  ApprovalStatus: function(value){
			  if(value=="Approval In Process"){
			 return "Warning";
			  }
		  },
		  status: function(value){
			  if(value=="Approval In Process"){
				  return "In Process"
			  }
			  
		  },
		  toDate: function(date){
			  var date=new Date(date);
			  var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					pattern : "dd-MM-yyyy"
				});
			 return oDateFormat.format(date);
		  },
		  dateFrmt: function(date){
			  if(date !=null && date !=undefined && date !=""){
			  var newDate= new Date(date);
			  var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					pattern : "dd-MMM-yyyy"
				});
			 return oDateFormat.format(newDate);  
			  }
		  },
		  millsectoSec: function(millisec){
			  var seconds = (millisec / 1000).toFixed(0);
		        var minutes = Math.floor(seconds / 60);
		        var hours = "";
		        if (minutes > 59) {
		            hours = Math.floor(minutes / 60);
		            hours = (hours >= 10) ? hours : "0" + hours;
		            minutes = minutes - (hours * 60);
		            minutes = (minutes >= 10) ? minutes : "0" + minutes;
		        }

		        seconds = Math.floor(seconds % 60);
		        seconds = (seconds >= 10) ? seconds : "0" + seconds;
		        minutes = Math.floor(minutes % 60);
		        minutes = (minutes >= 10) ? minutes : "0" + minutes;
		        if (hours != "") {
		            return hours + ":" + minutes + ":" + seconds;
		        }else{
		        	hours ="00";
		        	return hours + ":"+ minutes + ":" + seconds;
		        }
		        
		  },
      //----Edited  By Teenu 0n 09-06-2016
		  
		  statusState : function(value){
			  if(value == "Approval In Process"){
				  return "Warning";
			  }else if(value == "Approved"){
				  return "Success";
			  }else if(value == "Rejected"){
				  return "Error";
			  }else if(value == "Sent Back"){
				  return "Error";
			  }else if(value == "Hold"){
				  return "Warning";
			  }else if(value == "Accepted"){
				  return "Success";
			  }
			  
		  },
		  dateFormat:function(value) {

				if(value == null){
					var  frmatdate ="0000-00-00T00:00:00"
					return frmatdate;
				}
				var _smonth = value.getMonth() + 1;
				var _sdate = value.getDate();
				if (_smonth.toString().length < 2) {

					_smonth = "0" + _smonth.toString();
				}
				if (_sdate.toString().length < 2) {

					_sdate = "0" + _sdate.toString();
				}
				var    formatDate = value.getFullYear()  + '-' + _smonth + '-' + _sdate + "T00:00:00";

				return formatDate;
			},	
			setHeaderColor:function(ind){
				return ind != "X" ?"None":"Warning";
			},
			setColor : function(ind,task){
                return task =="U"?(ind != "X"?"None":"Warning"):(task == "I" ?"Success": (task == "D"?"Error":"None"));
          },
          datePRMnPC : function(value){
              if(value !="" || value !=null || value!=undefined){
                    if(value.search('/')>0){
                          var sd = value.split("/");
                          var fdate = sd[1]+"-"+sd[0]+"-"+sd[2];
                          return new Date(fdate);
                    }else if(value.search('T')>0){
                    	var segr = value.split("T");
                    	var datesegr = segr[0].split("-");
                    	var fdate = datesegr[1]+"-"+datesegr[2]+"-"+datesegr[0];
                    	return new Date(fdate);
                    }else{
                          var ftDate = this.string_to_Date(value);
                          return new Date(ftDate);
                    }
              }else{
                    return;
              }
             
        },
        getWeekList:function(){
            return{
                  "Week_Offs":
                        [
                        {
                        "Day":"SUNDAY",
                        "key":"SUNDAY"
                        },
                        {
                        "Day":"MONDAY",
                        "key":"MONDAY"
                        },
                        {
                        "Day":"TUESDAY",
                        "key":"TUESDAY"
                        },
                        {
                        "Day":"WEDNESDAY",
                        "key":"WEDNESDAY"
                        },
                        {
                        "Day":"THURSDAY",
                        "key":"THURSDAY"
                        },
                        {
                        "Day":"FRIDAY",
                        "key":"FRIDAY"
                        },
                        {
                        "Day":"SATURDAY",
                        "key":"SATURDAY"
                        }
                        ]
                        };
        },
        yesterdayDate:function(){
        	var todayDate = new Date();
        	todayDate.setDate(todayDate.getDate()-1);
        	return todayDate;
        },
          
        mesgtrip:function(){
    		 /* var that=this;
    		  var deviceLimit,connLimit,cred1,cred2;
    		  var deviceHtml = "",connHtml = "";*/
    			var messageStrip = new com.ril.PRMS.util.MessageStrip({
    				showIcon:false,showCloseButton:true
    			});
    		   
    			var ul="<ul><li>Insert/Added</li> <li>Update/Modify</li> <li>Delete/Remove</li></ul>";
    			$("#" + messageStrip.sId + ">.sapMMsgStripMessage>.sapMText").html(ul);
    		
    	         
    	      messageStrip.addEventDelegate({
    				onAfterRendering : function(){
    					$(document).ready(function(){
    					
    						var ul="<ul class=\"lists\">" +
    								"<li class=\"green\">Inserted / Added</li>" +
    								"<li class=\"yellow\">Updated / Modified</li> " +
    								"<li class=\"red\">Deleted / Removed</li></ul>";
    						$("#" + messageStrip.sId + ">.sapMMsgStripMessage>.sapMText").html(ul );
    					});
    				}
    			}); 
    	      return messageStrip;
    	  },
    	  
    	  
    	    PRM_SERVICE : "ZPRM_PARTNER_CENTER_SRV",
    	    proxy : ".." + window.location.pathname + "proxy", 
    	    serviceUrl : "/sap/opu/odata/sap/@ServiceUrl/",
    	    getServiceUrl : function(service){
    	      return ((this.codeOnServer()) ? (this.serviceUrl) : (this.proxy + this.serviceUrl + "?saml2=disabled")).replace("@ServiceUrl", service);
    	    },
    	    codeOnServer : function(){
    	      var regExp = /^localhost$/;
    	      var hostname = window.location.hostname;
    	      return (!regExp.test(hostname));
    	    },
    	    
    	    
};