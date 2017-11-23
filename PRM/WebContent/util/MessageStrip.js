/*!
* UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
*/
sap.ui.define(['jquery.sap.global', 'sap/m/library', 'sap/ui/core/Control', 'com/ril/PRMS/util/MessageStripUtilities', 'sap/m/Text', 'sap/m/Link'], function(q, l, C, M, T, L) {
    'use strict';
    var a = C.extend('com.ril.PRMS.util.MessageStrip', {    	
        metadata: {
            library: 'sap.m',
            properties: {
                text: {
                    type: 'string',
                    group: 'Appearance',
                    defaultValue: ''
                },
                type: {
                    type: 'sap.ui.core.MessageType',
                    group: 'Appearance',
                    defaultValue: sap.ui.core.MessageType.Information
                },
                customIcon: {
                    type: 'sap.ui.core.URI',
                    group: 'Appearance',
                    defaultValue: ''
                },
                showIcon: {
                    type: 'boolean',
                    group: 'Appearance',
                    defaultValue: false
                },
                showCloseButton: {
                    type: 'boolean',
                    group: 'Appearance',
                    defaultValue: false
                },
            },
            defaultAggregation: 'link',
            aggregations: {
                link: {
                    type: 'sap.m.Link',
                    multiple: false,
                    singularName: 'link'
                },
                _text: {
                    type: 'sap.m.Text',
                    multiple: false,
                    visibility: 'hidden'
                }
            },
            events: {
                close: {}
            }
        }
    });
    a.prototype.init = function() {
        //this.data('sap-ui-fastnavgroup', 'true', true);
        this.setAggregation('_text', new T());
    }
    ;
    a.prototype.setText = function(t) {
        this.getAggregation('_text').setText(t);
        return this.setProperty('text', t, true);
    }
    ;
    a.prototype.setType = function(t) {
        if (t === sap.ui.core.MessageType.None) {
            q.sap.log.warning(M.MESSAGES.TYPE_NOT_SUPPORTED);
            t = sap.ui.core.MessageType.Information;
        }
        return this.setProperty('type', t);
    }
    ;
    a.prototype.setAggregation = function(n, c, s) {
        if (n === 'link' && c instanceof L) {
            c.addAriaLabelledBy(this.getId());
        }
        C.prototype.setAggregation.call(this, n, c, s);
        return this;
    }
    ;
    a.prototype.ontap = M.handleMSCloseButtonInteraction;
    a.prototype.onsapenter = M.handleMSCloseButtonInteraction;
    a.prototype.onsapspace = M.handleMSCloseButtonInteraction;
    a.prototype.ontouchmove = function(e) {
        e.setMarked();
    }
    ;
    a.prototype.close = function() {
        var c = function() {
            this.fireClose();
            this.setVisible(false);
        }
        .bind(this);
        if (!sap.ui.getCore().getConfiguration().getAnimation()) {
            c();
            return;
        }
        if (sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version < 10) {
            M.closeTransitionWithJavascript.call(this, c);
        } else {
            M.closeTransitionWithCSS.call(this, c);
        }
    }
    ;
    return a;
}, true);