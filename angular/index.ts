import { Component, NgModule } from "@angular/core";
import { Pager, PagerAdapter } from "../";
import { registerElement, ViewClassMeta, NgView, TEMPLATE } from "nativescript-angular/element-registry";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { View } from "ui/core/view";
import { Placeholder } from "ui/placeholder";

const pagerMeta: ViewClassMeta = {
    skipAddToDom: false,
    insertChild(parent: any, child: any, index: number) {
        const pager: any = <Pager>parent;
        const childView = <any>child;
        if (!Array.isArray(pager.items)) {
            pager.items = [];
        }
        if (child instanceof Placeholder) {
        }
        else if (child.nodeName === TEMPLATE) {
            child.templateParent = parent;
        }
        if (child.nodeName !== "#text" && child instanceof View) {
            let items = (pager.views || []).concat([childView]);
            items.forEach((item) => {
                pager.items.push(item);
            });
        }
    },
    removeChild(parent: any, child: NgView) {
        const pager: any = <Pager>parent;
        const childView = <any>child;
    }
};
registerElement("Pager", () => require("../").Pager, pagerMeta);

@Component({
    selector: 'Pager',
    template: '<ng-content></ng-content>'
})
export class PagerComponent {
}

@NgModule({
    declarations: [PagerComponent],
    imports: [NativeScriptFormsModule],
    exports: [PagerComponent]
})
export class PagerModule {
}

