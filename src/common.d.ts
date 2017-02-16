import { Property } from "ui/core/dependency-observable";
import { View, AddArrayFromBuilder } from "ui/core/view";
export declare module knownCollections {
    const items = "items";
}
export declare abstract class Pager extends View implements AddArrayFromBuilder {
    private _disableSwipe;
    private _pageSpacing;
    static selectedIndexProperty: Property;
    static itemsProperty: Property;
    static selectedIndexChangedEvent: string;
    _addArrayFromBuilder(name: string, value: Array<any>): void;
    items: Array<any>;
    selectedIndex: number | any;
    disableSwipe: boolean;
    pageSpacing: number;
    abstract updateNativeItems(oldItems: Array<View>, newItems: Array<View>): void;
    abstract updateNativeIndex(oldIndex: number, newIndex: number): void;
}
export declare abstract class PagerItem extends View {
}
