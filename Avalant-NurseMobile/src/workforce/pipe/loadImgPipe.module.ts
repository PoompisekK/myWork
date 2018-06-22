import { NgModule } from '@angular/core';

import { LoadImgPipe } from './loadImg.pipe';

/**
 * @author Bundit.Ng
 * @since  Wed Apr 04 2018
 * Copyright (c) 2018 Avalant Co.,Ltd.
 */

const PIPES_DECLARATIONS = [
    LoadImgPipe,
];

@NgModule({
    imports: [],
    declarations: [
        ...PIPES_DECLARATIONS
    ],
    exports: [
        ...PIPES_DECLARATIONS
    ]
})
export class LoadImgModule {
}