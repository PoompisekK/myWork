import { style, transition, trigger, animate, keyframes } from "@angular/animations";

/***
 * Animate.css Ported into Angular
 * 
 * @author Daniel Eden
 * @see https://daneden.github.io/animate.css/
 */

export class AnimateCss {
  public static bounce(delay: number = 1000) {
    return trigger('bounce', [
      transition('* => animate', animate(delay, keyframes([

        style({
          'animation-timing-function': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
          transform: 'translate3d(0,0,0)',
          offset: 0//from
        }),
        style({
          'animation-timing-function': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
          transform: 'translate3d(0,0,0)',
          offset: .2//20%
        }),
        style({
          'animation-timing-function': 'cubic-bezier(0.755, 0.050, 0.855, 0.060)',
          transform: 'translate3d(0, -30px, 0)',
          offset: .4
        }),
        style({
          'animation-timing-function': 'cubic-bezier(0.755, 0.050, 0.855, 0.060)',
          transform: 'translate3d(0, -30px, 0)',
          offset: .43
        }),
        style({
          'animation-timing-function': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
          transform: 'translate3d(0,0,0)',
          offset: .53//53%
        }),
        style({
          'animation-timing-function': 'cubic-bezier(0.755, 0.050, 0.855, 0.060)',
          transform: 'translate3d(0, -15px, 0)',
          offset: .7
        }),
        style({
          'animation-timing-function': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
          transform: 'translate3d(0,0,0)',
          offset: .8//80%
        }),
        style({
          'animation-timing-function': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
          transform: 'translate3d(0,0,0)',
          offset: .89//to
        }),
        style({
          transform: 'translate3d(0,-4px,0)',
          offset: .9
        }),
      ]))),
    ]);
  }

  public static fade(delay: number | string = 300) {
    return trigger('fadeAnimation', [
      transition(
        ':enter', [
          style({ opacity: 0 }),
          animate(delay, style({ opacity: '*' }))
        ]
      ),
      transition(
        ':leave', [
          style({ opacity: '*' }),
          animate(delay, style({ opacity: 0 }))
        ]
      )
    ]);
  }

  public static fadeFromBottom(delay: number | string = 300) {
    return trigger('fadeFromBottomAnimation', [
      transition(
        ':enter', [
          style({ opacity: 0, transform: 'translate3d(0, 100%, 0)' }),
          animate(delay, style({ opacity: '*' }))
        ]
      ),
      transition(
        ':leave', [
          style({ opacity: '*' }),
          animate(delay, style({ opacity: 0 }))
        ]
      )
    ]);
  }

  public static fadeInRight(delay = 500) {
    return trigger('fadeInRight', [
      transition(':enter', animate(delay, keyframes([
        style({
          opacity: 0,
          'transform': 'translate3d(100%, 0, 0)',
          offset: 0
        }),

        style({
          opacity: 1,
          'transform': 'translate3d(0, 0, 0)',
          offset: 1
        }),
      ]))),
    ]);
  }

  public static fadeOutLeft(delay = 500) {
    return trigger('fadeOutLeft', [
      transition(':leave', animate(delay, keyframes([
        style({
          opacity: 1,
          offset: 0
        }),

        style({
          opacity: 0,
          'transform': 'translate3d(-100%, 0, 0)',
          offset: 1
        }),
      ]))),
    ]);
  }

  public static zoomIn(delay = 300) {
    return trigger('zoomIn', [
      transition(':enter', animate(delay, keyframes([
        style({
          opacity: 0,
          'transform': 'scale3d(.3, .3, .3)',
          offset: 0
        }),

        style({
          opacity: 1,
          'transform': 'scale3d(1, 1, 1)',
          offset: .5
        }),
      ])))
    ]);
  }

  public static zoomOut(delay = 300) {
    return trigger('zoomOut', [
      transition(':leave', animate(delay, keyframes([
        style({
          opacity: 1,
          offset: 0
        }),

        style({
          opacity: 0,
          'transform': 'scale3d(.3, .3, .3)',
          offset: .5
        }),
      ])))
    ]);
  }

  /* public static expandEnter(delay = 300) {
    // return trigger('expandAnimation', [
    //   transition(':enter', [
    //     style({
    //       height: '0px',
    //       overflow: 'hidden',
    //     }),
    //     animate(delay, style({
    //       height: '*',
    //     }))
    //   ])
    // ]);

    return trigger('peek', [
      state('0', style({
        height: '0px',
        overflow: 'hidden',
      })),
      state('1', style({
        height: '40px',
        overflow: 'hidden',
      })),
      transition('void => *', [
        animate(0)
      ]),

      transition('* => *', [
        animate(delay + 'ms ease-in-out')
      ]),

    ]);

  } */

  public static peek(delay: number | string = 300) {
    return trigger('peekAnimation', [
      transition(
        ':enter', [
          style({ height: '0px', overflow: 'hidden', opacity: 0 }),
          animate(delay, style({ height: '*', overflow: 'hidden', 'opacity': 1 }))
        ]
      ),
      transition(
        ':leave', [
          style({ height: '*', overflow: 'hidden', 'opacity': 1 }),
          animate(delay, style({ height: '0px', overflow: 'hidden', 'opacity': 0 })),
        ]
      )
    ]);
  }

}
