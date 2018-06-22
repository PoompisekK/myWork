/**
 * UglifyJS Config for production env.
 * 
 * @see https://github.com/ionic-team/ionic-app-scripts/blob/master/config/uglifyjs.config.js
 * @see https://forum.ionicframework.com/t/solved-configuring-app-scripts-for-uglification-and-minification/92248
 */

module.exports = {
  /**
   * mangle: uglify 2's mangle option
   */
  mangle: {
    reserved: ['$', 'require', 'export', '__eaf__', '__eafmap__']
  },
  // mangle: true,

  /**
   * compress: uglify 2's compress option
   */
  compress: {
    unused: true,
    dead_code: true,
    toplevel: true,
    drop_console: true, // Wipe out any console logs
  },

  /**
   * comments: uglify 2's comments option
   */
  // comments: false
}