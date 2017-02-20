"use strict";
var dependency_observable_1 = require("ui/core/dependency-observable");
var proxy_1 = require("ui/core/proxy");
var view_1 = require("ui/core/view");
var types = require("utils/types");
var knownCollections;
(function (knownCollections) {
    knownCollections.items = "items";
})(knownCollections = exports.knownCollections || (exports.knownCollections = {}));
function onItemsChanged(data) {
    var pager = data.object;
    if (data.newValue) {
        pager.updateNativeItems(data.oldValue, data.newValue);
    }
}
function onSelectedIndexChanged(data) {
    var pager = data.object;
    if (pager && pager.items && types.isNumber(data.newValue)) {
        pager.updateNativeIndex(data.oldValue, data.newValue);
        pager.notify({ eventName: Pager.selectedIndexChangedEvent, object: pager, oldIndex: data.oldValue, newIndex: data.newValue });
    }
}
var Pager = (function (_super) {
    __extends(Pager, _super);
    function Pager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._pageSpacing = 0;
        return _this;
    }
    Pager.prototype._addArrayFromBuilder = function (name, value) {
        if (name === "items") {
            this.items = value;
        }
    };
    Object.defineProperty(Pager.prototype, "items", {
        get: function () {
            return this._getValue(Pager.itemsProperty);
        },
        set: function (value) {
            this._setValue(Pager.itemsProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Pager.prototype, "selectedIndex", {
        get: function () {
            return this._getValue(Pager.selectedIndexProperty);
        },
        set: function (newVal) {
            if (types.isNumber(newVal)) {
                newVal = Math.max(0, newVal);
                if (this.items) {
                    newVal = Math.min(this.items.length - 1, newVal);
                }
                this._setValue(Pager.selectedIndexProperty, newVal);
            }
            else {
                throw new Error("invalid selectedIndex, should be between [0, " + (this.items.length - 1) + "]");
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Pager.prototype, "disableSwipe", {
        get: function () {
            return this._disableSwipe;
        },
        set: function (value) {
            this._disableSwipe = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Pager.prototype, "pageSpacing", {
        get: function () {
            return this._pageSpacing;
        },
        set: function (value) {
            this._pageSpacing = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Pager.prototype, "showNativePageIndicator", {
        get: function () {
            return this._getValue(Pager.showNativePageIndicatorProperty);
        },
        set: function (value) {
            this._setValue(Pager.showNativePageIndicatorProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    return Pager;
}(view_1.View));
Pager.selectedIndexProperty = new dependency_observable_1.Property("selectedIndex", "Pager", new proxy_1.PropertyMetadata(0, dependency_observable_1.PropertyMetadataSettings.None, null, null, onSelectedIndexChanged));
Pager.itemsProperty = new dependency_observable_1.Property("items", "Pager", new proxy_1.PropertyMetadata(undefined, dependency_observable_1.PropertyMetadataSettings.AffectsLayout, null, null, onItemsChanged));
Pager.showNativePageIndicatorProperty = new dependency_observable_1.Property("showNativePageIndicator", "Pager", new proxy_1.PropertyMetadata(false));
Pager.selectedIndexChangedEvent = "selectedIndexChanged";
exports.Pager = Pager;
var PagerItem = (function (_super) {
    __extends(PagerItem, _super);
    function PagerItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PagerItem;
}(view_1.View));
exports.PagerItem = PagerItem;
