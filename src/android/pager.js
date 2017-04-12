"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dependency_observable_1 = require("ui/core/dependency-observable");
var proxy_1 = require("ui/core/proxy");
var types = require("utils/types");
var common = require("../common");
var app = require("application");
var builder_1 = require("ui/builder");
var observable_1 = require("data/observable");
global.moduleMerge(common, exports);
function notifyForItemAtIndex(owner, nativeView, view, eventName, index) {
    var args = { eventName: eventName, object: owner, index: index, view: view, ios: undefined, android: nativeView };
    owner.notify(args);
    return args;
}
function onPagesCountChanged(data) {
    var item = data.object;
    item.updatePagesCount(item.pagesCount);
}
var Pager = (function (_super) {
    __extends(Pager, _super);
    function Pager() {
        var _this = _super.call(this) || this;
        _this._viewMap = new Map();
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
    Object.defineProperty(Pager.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Pager.prototype, "pagesCount", {
        get: function () {
            return this._getValue(Pager.pagesCountProperty);
        },
        set: function (value) {
            this._setValue(Pager.pagesCountProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Pager.prototype, "pagerAdapter", {
        get: function () {
            return this._pagerAdapter;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Pager.prototype, "_nativeView", {
        get: function () {
            return this._android;
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
    Pager.prototype._createUI = function () {
        var that = new WeakRef(this);
        if (this.disableSwipe) {
            this._android = new TNSViewPager(app.android.context, true);
        }
        else {
            this._android = new TNSViewPager(app.android.context);
        }
        this._android.setOnPageChangeListener(new android.support.v4.view.ViewPager.OnPageChangeListener({
            onPageSelected: function (position) {
                var owner = that.get();
                if (owner) {
                    owner._selectedIndexUpdatedFromNative(position);
                }
            },
            onPageScrolled: function (position, positionOffset, positionOffsetPixels) {
            },
            onPageScrollStateChanged: function (state) {
            }
        }));
        this._pagerAdapter = new PagerAdapter(this);
        this._android.setAdapter(this._pagerAdapter);
        if (this.transformer) {
            this._android.setPageTransformer(false, new this._transformer());
        }
        if (this.pagesCount > 0) {
            this._android.setOffscreenPageLimit(this.pagesCount);
        }
        this._android.setClipToPadding(false);
        if (this.pageSpacing) {
            this._android.setPageMargin(this.pageSpacing);
        }
    };
    Pager.prototype.refresh = function () {
        if (this._android && this._pagerAdapter) {
            this._pagerAdapter.notifyDataSetChanged();
        }
    };
    Pager.prototype.updatePagesCount = function (value) {
        if (this._android) {
            this._pagerAdapter.notifyDataSetChanged();
            this._android.setOffscreenPageLimit(value);
        }
    };
    Pager.prototype.updateNativeIndex = function (oldIndex, newIndex) {
        if (this._android) {
            this._android.setCurrentItem(newIndex);
        }
    };
    Pager.prototype.updateNativeItems = function (oldItems, newItems) {
        if (oldItems) {
            this._pagerAdapter.notifyDataSetChanged();
        }
        if (newItems) {
            if (this._pagerAdapter) {
                this._pagerAdapter.notifyDataSetChanged();
            }
        }
    };
    Pager.prototype.onUnloaded = function () {
        this._viewMap.clear();
        _super.prototype.onUnloaded.call(this);
    };
    Pager.prototype._eachChildView = function (callback) {
        if (this._viewMap.size > 0) {
            this._viewMap.forEach(function (view, key) {
                callback(view);
            });
        }
    };
    Object.defineProperty(Pager.prototype, "transformer", {
        get: function () {
            return this._transformer;
        },
        set: function (value) {
            switch (value) {
                case "AccordionTransformer":
                    this._transformer = com.eftimoff.viewpagertransformers.AccordionTransformer;
                    break;
                case "BackgroundToForegroundTransformer":
                    this._transformer = com.eftimoff.viewpagertransformers.BackgroundToForegroundTransformer;
                    break;
                case "CubeInTransformer":
                    this._transformer = com.eftimoff.viewpagertransformers.CubeInTransformer;
                    break;
                case "CubeOutTransformer":
                    this._transformer = com.eftimoff.viewpagertransformers.CubeOutTransformer;
                    break;
                case "DefaultTransformer":
                    this._transformer = com.eftimoff.viewpagertransformers.DefaultTransformer;
                    break;
                case "DepthPageTransformer":
                    this._transformer = com.eftimoff.viewpagertransformers.DepthPageTransformer;
                    break;
                case "DrawFromBackTransformer":
                    this._transformer = com.eftimoff.viewpagertransformers.DrawFromBackTransformer;
                    break;
                case "FlipHorizontalTransformer":
                    this._transformer = com.eftimoff.viewpagertransformers.FlipHorizontalTransformer;
                    break;
                case "FlipVerticalTransformer":
                    this._transformer = com.eftimoff.viewpagertransformers.FlipVerticalTransformer;
                    break;
                case "ForegroundToBackgroundTransformer":
                    this._transformer = com.eftimoff.viewpagertransformers.ForegroundToBackgroundTransformer;
                    break;
                case "RotateDownTransformer":
                    this._transformer = com.eftimoff.viewpagertransformers.RotateDownTransformer;
                    break;
                case "RotateUpTransformer":
                    this._transformer = com.eftimoff.viewpagertransformers.RotateUpTransformer;
                    break;
                case "StackTransformer":
                    this._transformer = com.eftimoff.viewpagertransformers.StackTransformer;
                    break;
                case "TabletTransformer":
                    this._transformer = com.eftimoff.viewpagertransformers.TabletTransformer;
                    break;
                case "ZoomInTransformer":
                    this._transformer = com.eftimoff.viewpagertransformers.ZoomInTransformer;
                    break;
                case "ZoomOutSlideTransformer":
                    this._transformer = com.eftimoff.viewpagertransformers.ZoomOutSlideTransformer;
                    break;
                case "ZoomOutTranformer":
                    this._transformer = com.eftimoff.viewpagertransformers.ZoomOutTranformer;
                    break;
            }
        },
        enumerable: true,
        configurable: true
    });
    Pager.prototype.updateAdapter = function () {
        this._pagerAdapter.notifyDataSetChanged();
    };
    Pager.prototype._selectedIndexUpdatedFromNative = function (newIndex) {
        console.log("Pager.selectedIndexUpdatedFromNative -> " + newIndex);
        if (this.selectedIndex !== newIndex) {
            var oldIndex = this.selectedIndex;
            this._onPropertyChangedFromNative(common.Pager.selectedIndexProperty, newIndex);
            this.notify({ eventName: common.Pager.selectedIndexChangedEvent, object: this, oldIndex: oldIndex, newIndex: newIndex });
        }
    };
    return Pager;
}(common.Pager));
Pager.pagesCountProperty = new dependency_observable_1.Property("pagesCount", "Pager", new proxy_1.PropertyMetadata(undefined, dependency_observable_1.PropertyMetadataSettings.None, onPagesCountChanged));
exports.Pager = Pager;
var PagerAdapter = (function (_super) {
    __extends(PagerAdapter, _super);
    function PagerAdapter(owner) {
        var _this = _super.call(this) || this;
        _this.owner = owner;
        return global.__native(_this);
    }
    PagerAdapter.prototype.instantiateItem = function (collection, position) {
        if (this.owner._viewMap.has(position)) {
            var convertView = this.owner._viewMap.get(position) ? this.owner._viewMap.get(position)._nativeView : null;
            if (convertView) {
                collection.addView(convertView);
                return convertView;
            }
        }
        var view = !types.isNullOrUndefined(this.owner.itemTemplate) ? builder_1.parse(this.owner.itemTemplate, this.owner) : null;
        var _args = notifyForItemAtIndex(this.owner, view ? view._nativeView : null, view, common.ITEMSLOADING, position);
        view = view || _args.view;
        if (view) {
            view.bindingContext = new observable_1.Observable(this.owner._getData(position));
            if (!view.parent) {
                this.owner._addView(view);
            }
            this.owner._viewMap.set(position, view);
        }
        collection.addView(view._nativeView);
        return view._nativeView;
    };
    PagerAdapter.prototype.destroyItem = function (collection, position, object) {
        if (this.owner._viewMap.has(position)) {
            var convertView = this.owner._viewMap.get(position) ? this.owner._viewMap.get(position) : null;
            if (convertView && convertView._nativeView) {
                collection.removeView(convertView._nativeView);
                this.owner._viewMap.delete(position);
            }
        }
    };
    PagerAdapter.prototype.getCount = function () {
        return this.owner.items ? this.owner.items.length : 0;
    };
    PagerAdapter.prototype.isViewFromObject = function (view, object) {
        return view === object;
    };
    return PagerAdapter;
}(android.support.v4.view.PagerAdapter));
exports.PagerAdapter = PagerAdapter;
var TNSViewPager = (function (_super) {
    __extends(TNSViewPager, _super);
    function TNSViewPager(context, disableSwipe) {
        var _this = _super.call(this, context) || this;
        if (disableSwipe) {
            _this.disableSwipe = disableSwipe;
        }
        return global.__native(_this);
    }
    TNSViewPager.prototype.onInterceptTouchEvent = function (ev) {
        if (this.disableSwipe) {
            return false;
        }
        else {
            return _super.prototype.onInterceptTouchEvent.call(this, ev);
        }
    };
    TNSViewPager.prototype.onTouchEvent = function (ev) {
        if (this.disableSwipe) {
            return false;
        }
        else {
            return _super.prototype.onTouchEvent.call(this, ev);
        }
    };
    return TNSViewPager;
}(android.support.v4.view.ViewPager));
exports.TNSViewPager = TNSViewPager;
//# sourceMappingURL=pager.js.map