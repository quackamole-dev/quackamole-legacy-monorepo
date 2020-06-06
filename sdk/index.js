class QuackamoleEventManager {
    static syntheticEvents = new Map();

    on = (eventType, callback, repeat = true) => {
        const eventListeners = this.__getEventListenersFor(eventType);
        eventListeners.set(callback, repeat);
    };

    off = (eventType, callback) => {
        const eventListeners = this.__getEventListenersFor(eventType);
        eventListeners.delete(callback);
    };

    emit = (eventType, payload, metadata) => {
        const eventListeners = this.__getEventListenersFor(eventType);

        for (const [callback, repeat] of eventListeners) {
            if (!repeat) {
                eventListeners.delete(callback);
            }
            callback(payload, metadata);
        }
    };

    __getEventListenersFor = (eventType) => {
        if (!QuackamoleEventManager.syntheticEvents.get(eventType)) {
            QuackamoleEventManager.syntheticEvents.set(eventType, new Map());
        }
        return QuackamoleEventManager.syntheticEvents.get(eventType);
    };
}

const quackamoleEventManagerSingleton = new QuackamoleEventManager();


class Quackamole {
    constructor() {
        this.eventManager = quackamoleEventManagerSingleton;
        this._init();
    }

    send = (payload) => {
        const message = {type: 'broadcast', payload};
        window.top.postMessage(message, '*');
    };

    listen = (type, callback) => {
        window.addEventListener('message', (event) => {
            this.__eventManager.on(type, callback);
        })
    };

    __receiveMessage = event => {
        switch(event.data.type) {
            case 'pluginData': {

            }
        }
    }


}

module.exports = {
    quackamoleEventManager: quackamoleEventManagerSingleton,
    Quackamole: Quackamole
};
