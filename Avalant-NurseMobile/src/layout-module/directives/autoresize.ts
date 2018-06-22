// An autoresize directive that works with ion-textarea in Ionic 2
// Usage example: <ion-textarea autoresize [(ngModel)]="body"></ion-textarea>
// Based on https://www.npmjs.com/package/angular2-autosize

import { Directive, HostListener, ElementRef } from "@angular/core";

@Directive({
    selector: "ion-textarea[autoresize]" // Attribute selector
})
export class Autoresize {

    @HostListener("input", ["$event.target"])
    public onInput(textArea: HTMLTextAreaElement): void {
        this.adjust();
    }
    constructor(public element: ElementRef) {
    }
    public ngOnInit(): void {
        this.adjust();
    }
    public adjust(): void {
        let ta = this.element.nativeElement.querySelector("textarea");
        if (ta) {
            ta.style.overflow = "hidden";
            ta.style.height = "auto";
            ta.style.height = ta.scrollHeight + "px";
        }
    }

}