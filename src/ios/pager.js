"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("ui/core/view");
var label_1 = require("ui/label");
var color_1 = require("color");
var types = require("utils/types");
var common = require("../common");
var builder_1 = require("ui/builder");
var observable_1 = require("data/observable");
function notifyForItemAtIndex(owner, nativeView, view, eventName, index) {
    var args = { eventName: eventName, object: owner, index: index, view: view, ios: nativeView, android: undefined };
    owner.notify(args);
    return args;
}
global.moduleMerge(common, exports);
var Pager = (function (_super) {
    __extends(Pager, _super);
    function Pager() {
        var _this = _super.call(this) || this;
        _this.left = 0;
        _this.top = 0;
        _this.right = 0;
        _this.bottom = 0;
        _this.cachedViewControllers = [];
        _this._views = [];
        _this._viewMap = new Map();
        var that = new WeakRef(_this);
        _this._orientation = 0;
        _this._transformer = 1;
        var nsVal = [0.0];
        var nsKey = [UIPageViewControllerOptionInterPageSpacingKey];
        _this._options = NSDictionary.dictionaryWithObjectsForKeys(nsKey, nsVal);
        _this._ios = UIPageViewController.alloc().initWithTransitionStyleNavigationOrientationOptions(_this._transformer, _this._orientation, _this._options);
        _this._ios.dataSource = PagerDataSource.initWithOwner(that);
        _this._ios.delegate = PagerViewControllerDelegate.initWithOwner(that);
        var sv = _this._nativeView.subviews[1];
        if (_this.borderRadius) {
            sv.layer.cornerRadius = _this.borderRadius;
        }
        if (_this.borderColor) {
            sv.layer.borderColor = new color_1.Color(_this.borderColor).ios.CGColor;
        }
        if (_this.backgroundColor) {
            sv.layer.backgroundColor = new color_1.Color(_this.backgroundColor).ios.CGColor;
        }
        if (_this.borderWidth) {
            sv.layer.borderWidth = _this.borderWidth;
        }
        return _this;
    }
    Pager.prototype.itemTemplateUpdated = function (oldData, newData) {
    };
    Object.defineProperty(Pager.prototype, "views", {
        get: function () {
            return this._views;
        },
        set: function (value) {
            this._views = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Pager.prototype, "transformer", {
        get: function () {
            return this._transformer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Pager.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Pager.prototype, "_nativeView", {
        get: function () {
            return this._ios.view;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Pager.prototype, "_childrenCount", {
        get: function () {
            return this.items ? this.items.length : 0;
        },
        enumerable: true,
        configurable: true
    });
    Pager.prototype.updateNativeIndex = function (oldIndex, newIndex) {
        this._navigateNativeViewPagerToIndex(oldIndex, newIndex);
    };
    Pager.prototype.updateNativeItems = function (oldItems, newItems) {
        if (oldItems) {
            this.cachedViewControllers = [];
        }
        if (newItems.length > 0) {
            this._initNativeViewPager();
        }
    };
    Pager.prototype.runUpdate = function () { };
    Pager.prototype.refresh = function () { };
    Pager.prototype.getViewController = function (selectedIndex) {
        var vc;
        if (this.cachedViewControllers[selectedIndex]) {
            vc = this.cachedViewControllers[selectedIndex].get();
        }
        if (!vc) {
            vc = PagerView.initWithOwnerTag(new WeakRef(this), selectedIndex);
            this.cachedViewControllers[selectedIndex] = new WeakRef(vc);
        }
        var view;
        if (this.items && this.items.length) {
            view = !types.isNullOrUndefined(this.itemTemplate) ? builder_1.parse(this.itemTemplate, this) : null;
            var _args = notifyForItemAtIndex(this, view ? view._nativeView : null, view, common.ITEMSLOADING, selectedIndex);
            view = view || _args.view;
            if (view) {
                var item = (typeof this.items.getItem === "function") ? this.items.getItem(selectedIndex) : this.items[selectedIndex];
                view.bindingContext = new observable_1.Observable(item);
            }
        }
        else {
            var lbl = new label_1.Label();
            lbl.text = "Pager.items not set.";
            view = lbl;
        }
        this._viewMap.set(selectedIndex, view);
        this.prepareView(view);
        vc.view = view._nativeView;
        return vc;
    };
    Pager.prototype.measure = function (widthMeasureSpec, heightMeasureSpec) {
        this.widthMeasureSpec = widthMeasureSpec;
        this.heightMeasureSpec = heightMeasureSpec;
        _super.prototype.measure.call(this, widthMeasureSpec, heightMeasureSpec);
    };
    Pager.prototype.onLayout = function (left, top, right, bottom) {
        var _this = this;
        _super.prototype.onLayout.call(this, left, top, right, bottom);
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        if (this._viewMap && this._viewMap.size > 0) {
            this._viewMap.forEach(function (item) {
                view_1.View.layoutChild(_this, item, 0, 0, right - left, bottom - top);
            });
            this._initNativeViewPager();
        }
    };
    Pager.prototype.onUnloaded = function () {
        this._ios.delegate = null;
        this._ios = null;
        this.cachedViewControllers = null;
        _super.prototype.onUnloaded.call(this);
    };
    Pager.prototype._selectedIndexUpdatedFromNative = function (newIndex) {
        var oldIndex = this.selectedIndex;
        this._onPropertyChangedFromNative(common.Pager.selectedIndexProperty, newIndex);
        this.notify({ eventName: common.Pager.selectedIndexChangedEvent, object: this, oldIndex: oldIndex, newIndex: newIndex });
    };
    Pager.prototype._viewControllerRemovedFromParent = function (controller) {
    };
    Pager.prototype._initNativeViewPager = function () {
        var controller = this.getViewController(this.selectedIndex);
        this._ios.setViewControllersDirectionAnimatedCompletion([controller], 0, false, function () { });
    };
    Pager.prototype._navigateNativeViewPagerToIndex = function (fromIndex, toIndex) {
        var vc = this.getViewController(toIndex);
        if (!vc)
            throw new Error('no VC');
        var direction = fromIndex < toIndex ?
            0 : 1;
        this._ios.setViewControllersDirectionAnimatedCompletion(NSArray.arrayWithObject(vc), direction, true, function () { });
    };
    Pager.prototype.prepareView = function (view) {
        view_1.View.adjustChildLayoutParams(view, this.widthMeasureSpec, this.heightMeasureSpec);
        var result = view_1.View.measureChild(this, view, this.widthMeasureSpec, this.heightMeasureSpec);
        view_1.View.layoutChild(this, view, 0, 0, result.measuredWidth, result.measuredHeight);
        view_1.View.restoreChildOriginalParams(view);
    };
    return Pager;
}(common.Pager));
exports.Pager = Pager;
var PagerViewControllerDelegate = (function (_super) {
    __extends(PagerViewControllerDelegate, _super);
    function PagerViewControllerDelegate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(PagerViewControllerDelegate.prototype, "owner", {
        get: function () {
            return this._owner.get();
        },
        enumerable: true,
        configurable: true
    });
    PagerViewControllerDelegate.initWithOwner = function (owner) {
        var pv = new PagerViewControllerDelegate();
        pv._owner = owner;
        return pv;
    };
    PagerViewControllerDelegate.prototype.pageViewControllerDidFinishAnimatingPreviousViewControllersTransitionCompleted = function (pageViewController, finished, previousViewControllers, completed) {
        if (finished) {
            var vc = pageViewController.viewControllers[0];
            var owner = this.owner;
            if (owner) {
                owner._selectedIndexUpdatedFromNative(vc.tag);
            }
        }
    };
    return PagerViewControllerDelegate;
}(NSObject));
PagerViewControllerDelegate.ObjCProtocols = [UIPageViewControllerDelegate];
var PagerDataSource = (function (_super) {
    __extends(PagerDataSource, _super);
    function PagerDataSource() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(PagerDataSource.prototype, "owner", {
        get: function () {
            return this._owner.get();
        },
        enumerable: true,
        configurable: true
    });
    PagerDataSource.initWithOwner = function (owner) {
        var ds = new PagerDataSource();
        ds._owner = owner;
        return ds;
    };
    PagerDataSource.prototype.pageViewControllerViewControllerBeforeViewController = function (pageViewController, viewControllerBefore) {
        var pos = viewControllerBefore.tag;
        if (pos === 0 || !this.owner || !this.owner.items) {
            return null;
        }
        else {
            var prev = pos - 1;
            return this.owner.getViewController(prev);
        }
    };
    PagerDataSource.prototype.pageViewControllerViewControllerAfterViewController = function (pageViewController, viewControllerAfter) {
        var pos = viewControllerAfter.tag;
        if (!this.owner || !this.owner.items || this.owner.items.length - 1 === pos) {
            return null;
        }
        else {
            return this.owner.getViewController(pos + 1);
        }
    };
    PagerDataSource.prototype.presentationCountForPageViewController = function (pageViewController) {
        if (!this.owner || !this.owner.items || !this.owner.showNativePageIndicator) {
            return -1;
        }
        return this.owner.items.length;
    };
    PagerDataSource.prototype.presentationIndexForPageViewController = function (pageViewController) {
        if (!this.owner || !this.owner.items) {
            return -1;
        }
        return this.owner.selectedIndex;
    };
    return PagerDataSource;
}(NSObject));
PagerDataSource.ObjCProtocols = [UIPageViewControllerDataSource];
var PagerView = (function (_super) {
    __extends(PagerView, _super);
    function PagerView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PagerView.initWithOwnerTag = function (owner, tag) {
        var pv = new PagerView(null);
        pv.owner = owner;
        pv.tag = tag;
        return pv;
    };
    PagerView.prototype.didMoveToParentViewController = function (parent) {
        var owner = this.owner.get();
        if (!parent && owner) {
            owner._viewControllerRemovedFromParent(this);
        }
    };
    return PagerView;
}(UIViewController));
exports.PagerView = PagerView;
var PagerItem = (function (_super) {
    __extends(PagerItem, _super);
    function PagerItem() {
        var _this = _super.call(this) || this;
        _this._ios = UIView.new();
        return _this;
    }
    Object.defineProperty(PagerItem.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PagerItem.prototype, "_nativeView", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    return PagerItem;
}(common.PagerItem));
exports.PagerItem = PagerItem;
//# sourceMappingURL=pager.js.map