# Changelog

### 2.0.3, 2014-09-10
- Manager.set improvements. 
- Fix requireFailure() call in Manager.options.recognizers. 
- Make DIRECTION_ALL for pan and swipe gestures less blocking.
- Fix Swipe recognizer threshold option.
- Expose the Input classes.
- Added the option `inputClass` to set the used input handler.

### 2.0.2, 2014-07-26
- Improved mouse and pointer-events input, now able to move outside the window.
- Added the export name (`Hammer`) as an argument to the wrapper.
- Add the option *experimental* `inputTarget` to change the element that receives the events.
- Improved performance when only one touch being active.
- Fixed the jumping deltaXY bug when going from single to multi-touch.
- Improved velocity calculations.

### 2.0.1, 2014-07-15
- Fix issue when no document.body is available
- Added pressup event for the press recognizer
- Removed alternative for Object.create

### 2.0.0, 2014-07-11
- Full rewrite of the library.
