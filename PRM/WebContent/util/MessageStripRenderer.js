/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['com/ril/PRMS/util/MessageStripUtilities'], function(M) {
    'use strict';
    var a = {};
    a.render = function(r, c) {
        this.startMessageStrip(r, c);
        this.renderAriaTypeText(r, c);
        if (c.getShowIcon()) {
            this.renderIcon(r, c);
        }
        this.renderTextAndLink(r, c);
        if (c.getShowCloseButton()) {
            this.renderCloseButton(r);
        }
        this.endMessageStrip(r);
    }
    ;
    a.startMessageStrip = function(r, c) {
        r.write('<div');
        r.addClass(M.CLASSES.ROOT);
        r.addClass(M.CLASSES.ROOT + c.getType());
        r.writeControlData(c);
        r.writeClasses();
        r.writeAttribute(M.ATTRIBUTES.CLOSABLE, c.getShowCloseButton());
        r.writeAccessibilityState(c, M.getAccessibilityState.call(c));
        r.write('>');
    }
    ;
    a.renderAriaTypeText = function(r, c) {
        r.write("<span class='sapUiPseudoInvisibleText'>");
        r.write(M.getAriaTypeText.call(c));
        r.write('</span>');
    }
    ;
    a.renderIcon = function(r, c) {
        r.write("<div class='" + M.CLASSES.ICON + "'>");
        r.writeIcon(M.getIconURI.call(c), null , {
            'title': null 
        });
        r.write('</div>');
    }
    ;
    a.renderTextAndLink = function(r, c) {
        r.write("<div class='" + M.CLASSES.MESSAGE + "'>");
        r.renderControl(c.getAggregation('_text'));
        r.renderControl(c.getLink());
        r.write('</div>');
    }
    ;
    a.renderCloseButton = function(r) {
        r.write('<button');
        r.writeAttribute('class', M.CLASSES.CLOSE_BUTTON);
        r.writeAttribute('aria-label', M.RESOURCE_BUNDLE.getText('CLOSE'));
        r.write('></button>');
    }
    ;
    a.endMessageStrip = function(r) {
        r.write('</div>');
    }
    ;
    return a;
}, true);