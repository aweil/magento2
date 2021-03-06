/**
 * Magento
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License (AFL 3.0)
 * that is bundled with this package in the file LICENSE_AFL.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/afl-3.0.php
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@magentocommerce.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Magento to newer
 * versions in the future. If you wish to customize Magento for your
 * needs please refer to http://www.magentocommerce.com for more information.
 *
 * @category    mage.js
 * @package     test
 * @copyright   Copyright (c) 2013 X.commerce, Inc. (http://www.magentocommerce.com)
 * @license     http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
 */

TreeSuggestTest = TestCase('TreeSuggestTest');
TreeSuggestTest.prototype.setUp = function() {
    /*:DOC += <input name="test-suggest" id="tree-suggest" />*/
    this.suggestElement = jQuery('#tree-suggest');
};
TreeSuggestTest.prototype.tearDown = function() {
    this.treeSuggestDestroy();
};
TreeSuggestTest.prototype.treeSuggestDestroy = function() {
    if(this.suggestElement.data('treeSuggest')) {
        this.suggestElement.treeSuggest('destroy');
    }
};
TreeSuggestTest.prototype.treeSuggestCreate = function(options, element) {
    return (element || this.suggestElement).treeSuggest(options || {} ).data('treeSuggest');
};
TreeSuggestTest.prototype.uiHash = {
    item: {
        id: 1,
        label: 'Test Label'
    }
};
TreeSuggestTest.prototype.stub = function(instance, methodName, retVal) {
    var d = $.Deferred();
    if(instance && instance[methodName]) {
        instance[methodName] = function() {
            d.resolve(arguments);
            if(retVal) {
                return retVal;
            }
        }
    }
    return d.promise();
};

TreeSuggestTest.prototype.testInit = function() {
    var treeSuggestInstance = this.treeSuggestCreate();
    assertTrue(this.suggestElement.is(':mage-treeSuggest'));
    assertEquals(treeSuggestInstance.widgetEventPrefix, 'suggest');
};
TreeSuggestTest.prototype.testBind = function() {
    var event = jQuery.Event('keydown'),
        proxyEventsExecuted = false,
        treeSuggestInstance = this.treeSuggestCreate();

    treeSuggestInstance.dropdown.show();

    event.keyCode = jQuery.ui.keyCode.LEFT;
    this.stub(treeSuggestInstance, '_proxyEvents').done(function() {
        proxyEventsExecuted = true
    });

    treeSuggestInstance.element.trigger(event);
    assertTrue(proxyEventsExecuted);

    event.keyCode = $.ui.keyCode.RIGHT;
    proxyEventsExecuted = false;
    this.stub(treeSuggestInstance, '_proxyEvents').done(function() {
        proxyEventsExecuted = true
    });

    treeSuggestInstance.dropdown.show();
    treeSuggestInstance.element.trigger(event);
    assertTrue(proxyEventsExecuted);
};
TreeSuggestTest.prototype.testFilterSelected = function() {
    var treeSuggestInstance = this.treeSuggestCreate();
    assertEquals(treeSuggestInstance._filterSelected([this.uiHash.item], {_allShown: true}), [this.uiHash.item]);
};