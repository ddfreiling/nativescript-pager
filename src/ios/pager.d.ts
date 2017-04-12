import { View } from "ui/core/view";
import * as common from "../common";
export declare class Pager extends common.Pager {
    itemTemplateUpdated(oldData: any, newData: any): void;
    private _orientation;
    private _options;
    private _views;
    private _transformer;
    private _ios;
    _viewMap: Map<any, any>;
    private widthMeasureSpec;
    private heightMeasureSpec;
    private left;
    private top;
    private right;
    private bottom;
    private cachedViewControllers;
    borderRadius: number;
    borderWidth: number;
    borderColor: string;
    backgroundColor: any;
    constructor();
    views: any[];
    readonly transformer: any;
    readonly ios: UIPageViewController;
    readonly _nativeView: UIView;
    readonly _childrenCount: number;
    updateNativeIndex(oldIndex: number, newIndex: number): void;
    updateNativeItems(oldItems: View[], newItems: View[]): void;
    runUpdate(): void;
    refresh(): void;
    getViewController(selectedIndex: number): UIViewController;
    measure(widthMeasureSpec: number, heightMeasureSpec: number): void;
    onLayout(left: number, top: number, right: number, bottom: number): void;
    onUnloaded(): void;
    _selectedIndexUpdatedFromNative(newIndex: number): void;
    _viewControllerRemovedFromParent(controller: PagerView): void;
    private _initNativeViewPager();
    private _navigateNativeViewPagerToIndex(fromIndex, toIndex);
    private prepareView(view);
}
export declare class PagerView extends UIViewController {
    owner: WeakRef<Pager>;
    tag: number;
    static initWithOwnerTag(owner: WeakRef<Pager>, tag: number): PagerView;
    didMoveToParentViewController(parent: UIViewController): void;
}
export declare class PagerItem extends common.PagerItem {
    private _ios;
    constructor();
    readonly ios: UIView;
    readonly _nativeView: UIView;
}
