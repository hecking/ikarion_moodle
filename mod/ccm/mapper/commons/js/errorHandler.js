/**
 * Created with IntelliJ IDEA.
 * User: SikkenJ
 * Date: 12-7-12
 * Time: 15:31
 * To change this template use File | Settings | File Templates.
 */

var isMobile = navigator.appVersion.toLowerCase().indexOf("mobile") >= 0

window.onerror = function (msg, url, line) {
    if (isMobile) {
        // You can view the information in an alert to see things working
        // like so:
        alert("Error: " + msg + "\nurl: " + url + "\nline #: " + line);
    } else {
        // assume the browser will show the error
    }

    // TODO: Report this error via ajax so you can keep track
    //       of what pages have JS issues

    var suppressErrorAlert = false;
    // If you return true, then error alerts (like in older versions of
    // Internet Explorer) will be suppressed.
    return suppressErrorAlert;
};