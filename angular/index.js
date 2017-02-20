"use strict";
var core_1 = require("@angular/core");
var element_registry_1 = require("nativescript-angular/element-registry");
var forms_1 = require("nativescript-angular/forms");
var view_1 = require("ui/core/view");
var placeholder_1 = require("ui/placeholder");
var pagerMeta = {
    skipAddToDom: false,
    insertChild: function (parent, child, index) {
        var pager = parent;
        var childView = child;
        if (!Array.isArray(pager.items)) {
            pager.items = [];
        }
        if (child instanceof placeholder_1.Placeholder) {
        }
        else if (child.nodeName === element_registry_1.TEMPLATE) {
            child.templateParent = parent;
        }
        if (child.nodeName !== "#text" && child instanceof view_1.View) {
            var items = (pager.views || []).concat([childView]);
            items.forEach(function (item) {
                pager.items.push(item);
            });
        }
    },
    removeChild: function (parent, child) {
        var pager = parent;
        var childView = child;
    }
};
element_registry_1.registerElement("Pager", function () { return require("../").Pager; }, pagerMeta);
var PagerComponent = (function () {
    function PagerComponent() {
    }
    return PagerComponent;
}());
PagerComponent = __decorate([
    core_1.Component({
        selector: 'Pager',
        template: '<ng-content></ng-content>'
    })
], PagerComponent);
exports.PagerComponent = PagerComponent;
var PagerModule = (function () {
    function PagerModule() {
    }
    return PagerModule;
}());
PagerModule = __decorate([
    core_1.NgModule({
        declarations: [PagerComponent],
        imports: [forms_1.NativeScriptFormsModule],
        exports: [PagerComponent]
    })
], PagerModule);
exports.PagerModule = PagerModule;
