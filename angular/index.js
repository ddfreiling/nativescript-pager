import { Component, NgModule } from "@angular/core";
import { registerElement, TEMPLATE } from "nativescript-angular/element-registry";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { View } from "ui/core/view";
import { Placeholder } from "ui/placeholder";
var pagerMeta = {
    skipAddToDom: false,
    insertChild: function (parent, child, index) {
        var pager = parent;
        var childView = child;
        if (!Array.isArray(pager.items)) {
            pager.items = [];
        }
        if (child instanceof Placeholder) {
        }
        else if (child.nodeName === TEMPLATE) {
            child.templateParent = parent;
        }
        if (child.nodeName !== "#text" && child instanceof View) {
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
registerElement("Pager", function () { return require("../").Pager; }, pagerMeta);
var PagerComponent = (function () {
    function PagerComponent() {
    }
    return PagerComponent;
}());
PagerComponent = __decorate([
    Component({
        selector: 'Pager',
        template: '<ng-content></ng-content>'
    })
], PagerComponent);
export { PagerComponent };
var PagerModule = (function () {
    function PagerModule() {
    }
    return PagerModule;
}());
PagerModule = __decorate([
    NgModule({
        declarations: [PagerComponent],
        imports: [NativeScriptFormsModule],
        exports: [PagerComponent]
    })
], PagerModule);
export { PagerModule };
//# sourceMappingURL=index.js.map