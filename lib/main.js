var timer = require('sdk/timers');
var prefs = require("sdk/simple-prefs").prefs;

var ResetSearchTimer = {

  reset_search_timer_id: 0,
  init: function(options) {
    console.info("hello from init: " + options);
    if(prefs.resetSearchEngine != '' && prefs.resetSearchTime != "0") {
      this.setTimer();
    }
  },
  clearTimer: function() {
    console.info("hello from clearTimer");
    if(this.reset_search_timer_id != "0") {
      console.info("clearing old interval : " + this.reset_search_timer_id);
      timer.clearInterval(this.reset_search_timer_id);
    }
  },
  setTimer: function() {
    console.info("hello from setTimer: " + this.reset_search_timer_id);
    this.clearTimer();
    this.reset_search_timer_id = timer.setInterval(
      ResetSearchTimer.setSearch,
      prefs.resetSearchTime
    );

  },
  setSearch: function() {
    console.info("hello from setSearch: " + prefs.resetSearchEngine);
    require("sdk/preferences/service").set("browser.search.defaultenginename", prefs.resetSearchEngine);
  },
  onPrefChange: function(prefName) {
    console.info("hello from onPrefChange");
    if(prefs.resetSearchTime == "0") {
      ResetSearchTimer.clearTimer();
    } else {
      prefs.resetSearchEngine = require("sdk/preferences/service").get("browser.search.defaultenginename");
      ResetSearchTimer.init();
    }
  }

}

require("sdk/simple-prefs").on("setResetSearchEngine", ResetSearchTimer.onPrefChange);

exports.main = function(options, callbacks) {
  ResetSearchTimer.init(options);
  return true;
}
