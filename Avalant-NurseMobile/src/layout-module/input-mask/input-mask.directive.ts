// import { Directive, Attribute } from '@angular/core';
// import { NgModel } from '@angular/forms';

// /**
//  * Input Mask for Textbox inputs / Ion-Inputs
//  * 
//  * @example
//  * InputMask.html
//  *
//  * <ion-input type="tel" pattern="\d*" placeholder="(xxx) xxx-xxxx" mask="(***) ***-****" [(ngModel)]="phone" name="phone"></ion-input>
//  *
//  * <ion-input type="tel" pattern="\d*" placeholder="xxx-xx-xxxx" mask="***-**-****" [(ngModel)]="ssn" name="ssn"></ion-input>
//  * InputMask.ts
//  *
//  * import { Directive, Attribute } from '@angular/core';
//  * import { NgModel } from '@angular/forms';
//  *
//  * @Directive({
//  *     selector: '[mask]',
//  *     host: {
//  *         '(keyup)': 'onInputChange($event)'
//  *     },
//  *     providers: [NgModel]
//  * })
//  * 
//  * @author ederribeiro
//  * @see https://gist.github.com/ederribeiro
//  * forked from mhartington/mask.ts
//  * @see https://forum.ionicframework.com/t/mask-number-field/52864/33
//  * @see https://gist.github.com/ederribeiro/4768c75e539f0d718bfb875270fc5fd2
//  */
// @Directive({
//   selector: '[mask]',
//   host: {
//     '(keyup)': 'onInputChange($event)'
//   },
//   providers: [NgModel]
// })
// export class MaskDirective {
//   maskPattern: string;
//   placeHolderCounts: number;
//   dividers: string[];
//   modelValue: string;
//   viewValue: string;

//   constructor(
//     public model: NgModel,
//     @Attribute("mask") maskPattern: string
//   ) {
//     this.dividers = maskPattern.replace(/\*/g, "").split("");
//     this.dividers.push(" ");
//     this.generatePattern(maskPattern);
//   }

//   onInputChange(event) {
//     this.modelValue = this.getModelValue(event);
//     let stringToFormat = this.modelValue;
//     if (stringToFormat.length < 10) {
//       stringToFormat = this.padString(stringToFormat);
//     }

//     this.viewValue = this.format(stringToFormat);
//     this.writeValue(event.target, this.viewValue);
//   }

//   writeValue(target, value) {
//     return target.value = value;
//   }

//   generatePattern(patternString) {
//     this.placeHolderCounts = (patternString.match(/\*/g) || []).length;
//     for (let i = 0; i < this.placeHolderCounts; i++) {
//       patternString = patternString.replace('*', "{" + i + "}");
//     }
//     this.maskPattern = patternString;
//   }

//   format(s) {
//     let formattedString = this.maskPattern;
//     for (let i = 0; i < this.placeHolderCounts; i++) {
//       formattedString = formattedString.replace("{" + i + "}", s.charAt(i));
//     }
//     return formattedString;
//   }

//   padString(s) {
//     let pad = "          ";
//     return (s + pad).substring(0, pad.length);
//   }

//   getModelValue(event) {
//     let modelValue = event.target.value;
//     for (let i = 0; i < this.dividers.length; i++) {
//       while (modelValue.indexOf(this.dividers[i]) > -1) {
//         modelValue = modelValue.replace(this.dividers[i], "");
//       }
//     }
//     return modelValue;
//   }
// }