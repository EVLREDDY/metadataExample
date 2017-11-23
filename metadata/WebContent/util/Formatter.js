jQuery.sap.declare("metadata.util.Formatter");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");
metadata.util.Formatter = {

	CRM_SERVICE : "http://services.odata.org/V3/Northwind/Northwind.svc/", /*ZFIORI_CORPORATE_MANAGEMENT_SRV ZCORPORATE_MASTER_AGREEMENT_SRV*/
	proxy : ".." + window.location.pathname + "proxy",
	serviceUrl : "/sap/opu/odata/sap/@ServiceUrl/",
	getServiceUrl : function(service, saml2Required) {
		var saml2 = saml2Required ? "?saml2=disabled" : "";
		return ((this.codeOnServer()) ? (this.serviceUrl) : (this.proxy
				+ this.serviceUrl + saml2)).replace("@ServiceUrl", service);
	}, //(this.proxy + this.serviceUrl + "?saml2=disabled")

	codeOnServer : function() {
		var regExp = /^localhost$/;
		var hostname = window.location.hostname;
		return (!regExp.test(hostname));
	},
	dateFormatDisplayTime : function(value) {
		if (value == undefined)
			return "";
		var oDateFormat = sap.ca.ui.model.format.DateFormat.getInstance({
			pattern : "yyyy-MM-ddTHH:mm:ss"
		});
		return oDateFormat.format(value);
	},

};