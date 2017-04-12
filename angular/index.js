"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var element_registry_1 = require("nativescript-angular/element-registry");
exports.ITEMSLOADING = "itemsLoading";
var collection_facade_1 = require("nativescript-angular/collection-facade");
var lang_facade_1 = require("nativescript-angular/lang-facade");
var utils_1 = require("nativescript-angular/common/utils");
var layout_base_1 = require("ui/layouts/layout-base");
var observable_array_1 = require("data/observable-array");
var NG_VIEW = "_ngViewRef";
element_registry_1.registerElement("Pager", function () { return require("../").Pager; });
;
function getSingleViewRecursive(nodes, nestLevel) {
    var actualNodes = nodes.filter(function (n) { return !!n && n.nodeName !== "#text"; });
    if (actualNodes.length === 0) {
        throw new Error("No suitable views found in list template! Nesting level: " + nestLevel);
    }
    else if (actualNodes.length > 1) {
        throw new Error("More than one view found in list template! Nesting level: " + nestLevel);
    }
    else {
        if (actualNodes[0]) {
            var parentLayout = actualNodes[0].parent;
            if (parentLayout instanceof layout_base_1.LayoutBase) {
                parentLayout.removeChild(actualNodes[0]);
            }
            return actualNodes[0];
        }
        else {
            return getSingleViewRecursive(actualNodes[0].children, nestLevel + 1);
        }
    }
}
function getItemViewRoot(viewRef, rootLocator) {
    if (rootLocator === void 0) { rootLocator = getSingleViewRecursive; }
    var rootView = rootLocator(viewRef.rootNodes, 0);
    rootView.on("unloaded", function () {
        viewRef.destroy();
    });
    return rootView;
}
exports.getItemViewRoot = getItemViewRoot;
var PagerItemTemplate = (function () {
    function PagerItemTemplate(owner, templateRef) {
        this.owner = owner;
        this.templateRef = templateRef;
        owner.itemTemplate = this.templateRef;
    }
    return PagerItemTemplate;
}());
PagerItemTemplate = __decorate([
    core_1.Directive({
        selector: "[pagerItemTemplate]"
    }),
    __param(0, core_1.Inject(core_1.forwardRef(function () { return PagerComponent; }))),
    __metadata("design:paramtypes", [PagerComponent,
        core_1.TemplateRef])
], PagerItemTemplate);
exports.PagerItemTemplate = PagerItemTemplate;
var PagerComponent = (function () {
    function PagerComponent(el, _iterableDiffers, _cdr, loader) {
        this._iterableDiffers = _iterableDiffers;
        this._cdr = _cdr;
        this.loader = loader;
        this.pager = el.nativeElement;
        this.pager.on(exports.ITEMSLOADING, this.itemsLoading, this);
    }
    Object.defineProperty(PagerComponent.prototype, "items", {
        get: function () {
            return this._items;
        },
        set: function (value) {
            this._items = value;
            var needDiffer = true;
            if (value instanceof observable_array_1.ObservableArray) {
                needDiffer = false;
            }
            if (needDiffer && !this._differ && collection_facade_1.isListLikeIterable(value)) {
                this._differ = this._iterableDiffers.find(this._items)
                    .create(this._cdr, function (_index, item) { return item; });
            }
            this.pager.items = this._items;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PagerComponent.prototype, "selectedIndex", {
        get: function () {
            return this._selectedIndex;
        },
        set: function (value) {
            this._selectedIndex = utils_1.convertToInt(value);
            if (this.viewInitialized) {
                this.pager.selectedIndex = this._selectedIndex;
            }
        },
        enumerable: true,
        configurable: true
    });
    PagerComponent.prototype.ngAfterViewInit = function () {
        this.viewInitialized = true;
        if (!lang_facade_1.isBlank(this._selectedIndex)) {
            this.pager.selectedIndex = this._selectedIndex;
        }
    };
    PagerComponent.prototype.itemsLoading = function (args) {
        if (this.itemTemplate) {
            var data = this.pager._getData(args.index);
            var viewRef = this.loader.createEmbeddedView(this.itemTemplate, new PagerItemContext(), 0);
            args.view = getItemViewRoot(viewRef);
            args.view[NG_VIEW] = viewRef;
            this.setupViewRef(viewRef, data, args.index);
            this.detectChangesOnChild(viewRef, args.index);
        }
    };
    PagerComponent.prototype.setupViewRef = function (viewRef, data, index) {
        if (lang_facade_1.isBlank(viewRef)) {
            return;
        }
        var context = viewRef.context;
        context.$implicit = data;
        context.item = data;
        context.items = ((data && (typeof data.get === "function")) ? data.get("items") : data["items"]);
        context.index = index;
        context.even = (index % 2 === 0);
        context.odd = !context.even;
    };
    PagerComponent.prototype.detectChangesOnChild = function (viewRef, index) {
        var childChangeDetector = viewRef;
        childChangeDetector.markForCheck();
        childChangeDetector.detectChanges();
    };
    PagerComponent.prototype.ngDoCheck = function () {
        if (this._differ) {
            var changes = this._differ.diff(this._items);
            if (changes) {
                if (this.pager) {
                    this.pager.refresh();
                }
            }
        }
    };
    return PagerComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], PagerComponent.prototype, "items", null);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [Object])
], PagerComponent.prototype, "selectedIndex", null);
PagerComponent = __decorate([
    core_1.Component({
        selector: 'Pager',
        template: '',
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [core_1.ElementRef,
        core_1.IterableDiffers,
        core_1.ChangeDetectorRef,
        core_1.ViewContainerRef])
], PagerComponent);
exports.PagerComponent = PagerComponent;
var PagerItemContext = (function () {
    function PagerItemContext($implicit, item, index, even, odd) {
        this.$implicit = $implicit;
        this.item = item;
        this.index = index;
        this.even = even;
        this.odd = odd;
    }
    return PagerItemContext;
}());
exports.PagerItemContext = PagerItemContext;
var PagerModule = (function () {
    function PagerModule() {
    }
    return PagerModule;
}());
PagerModule = __decorate([
    core_1.NgModule({
        declarations: [
            PagerComponent,
            PagerItemTemplate
        ],
        exports: [
            PagerComponent,
            PagerItemTemplate
        ],
        schemas: [
            core_1.NO_ERRORS_SCHEMA
        ]
    })
], PagerModule);
exports.PagerModule = PagerModule;
//# sourceMappingURL=index.js.map