import { Property } from "ui/core/dependency-observable";
import { View } from "ui/core/view";
import * as common from "../common";
export declare class Pager extends common.Pager {
    private _android;
    private _pagerAdapter;
    private _views;
    private _transformer;
    static pagesCountProperty: Property;
    constructor();
    views: Array<any>;
    readonly android: android.support.v4.view.ViewPager;
    pagesCount: number;
    readonly pagerAdapter: android.support.v4.view.PagerAdapter;
    readonly _nativeView: android.support.v4.view.ViewPager;
    readonly _childrenCount: number;
    _createUI(): void;
    updatePagesCount(value: number): void;
    updateNativeIndex(oldIndex: number, newIndex: number): void;
    updateNativeItems(oldItems: Array<View>, newItems: Array<View>): void;
    _eachChildView(callback: (child: View) => boolean): void;
    transformer: any;
    updateAdapter(): void;
    _selectedIndexUpdatedFromNative(newIndex: number): void;
}
export declare class PagerAdapter extends android.support.v4.view.PagerAdapter {
    private owner;
    constructor(owner: any);
    instantiateItem(collection: android.view.ViewGroup, position: number): android.support.v4.view.ViewPager;
    destroyItem(container: android.view.ViewGroup, position: number, object: any): void;
    getCount(): number;
    isViewFromObject(view: android.view.View, object: any): boolean;
}
export declare class TNSViewPager extends android.support.v4.view.ViewPager {
    disableSwipe: boolean;
    constructor(context: any, disableSwipe?: boolean);
    onInterceptTouchEvent(ev: any): boolean;
    onTouchEvent(ev: any): boolean;
}
