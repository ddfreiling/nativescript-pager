import { Property } from "ui/core/dependency-observable";
import { View } from "ui/core/view";
export declare const ITEMSLOADING = "itemsLoading";
export declare module knownTemplates {
    const itemTemplate = "itemTemplate";
}
export declare module knownCollections {
    const items = "items";
}
export declare abstract class Pager extends View {
    private _disableSwipe;
    private _pageSpacing;
    static selectedIndexProperty: Property;
    static itemsProperty: Property;
    static itemTemplateProperty: Property;
    static showNativePageIndicatorProperty: Property;
    static selectedIndexChangedEvent: string;
    _getData(index: number): any;
    itemTemplate: string;
    items: any;
    selectedIndex: number | any;
    disableSwipe: boolean;
    pageSpacing: number;
    showNativePageIndicator: boolean;
    abstract updateNativeItems(oldItems: Array<View>, newItems: Array<View>): void;
    abstract updateNativeIndex(oldIndex: number, newIndex: number): void;
    abstract itemTemplateUpdated(oldData: any, newData: any): void;
}
export declare abstract class PagerItem extends View {
}
