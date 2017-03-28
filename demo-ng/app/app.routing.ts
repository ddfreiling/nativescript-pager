import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { TestComponent } from "./test/test.component";
import { DetailComponent } from "./detail/detail.component";

const routes: Routes = [
    { path: "", redirectTo: "/test", pathMatch: "full" },
    { path: "test", component: TestComponent },
    { path: "detail", component: DetailComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }