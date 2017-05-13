window.ude = window.ude || {};
window.ude.commons = window.ude.commons || {};

ude.commons.NotificationClient = (function() {
    NotificationClient = function(metadataHandler) {
        this.listeners = [];
        this.clientId = metadataHandler.getProvider().id + metadataHandler.getActor().id + metadataHandler.getGenerator().id;
        this._initServerConnection(this.clientId);
    };

    NotificationClient.prototype = {
        register: function(premise, callback) {
            this.listeners.push({
                premise: premise,
                callback: callback
            });
        },

        processNotification: function(notification) {
            this.listeners.some(function(listener) {
                if (listener.premise(notification)) {
                    isGreedy = listener.callback(notification);
                    if (isGreedy) {
                        return true;
                    }
                }
                return false;
            });
        },

        _initServerConnection: function(socketId) {
            // initialize the server connection only if http
            // (to prevent browser from blocking "unsecure content")
            if (window.location.protocol == "http:") {
                //var socket = io.connect('http://localhost:8899');
                var socket = io.connect('http://golab.collide.info:80');
                socket.on(socketId, function (data) {
                    this.processNotification(data);
                }.bind(this));
            } else {
                console.warn("Notification client has not been started due to http/https issues.");
            }
        }
    };

    return NotificationClient;
})();