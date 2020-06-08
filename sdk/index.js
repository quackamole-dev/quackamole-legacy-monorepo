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
            console.log('emit callback', callback, eventType);
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
        this.__init();
    }

    broadcastData = (eventType, data, includeSelf = true) => {
        const action = {type: 'PLUGIN_SEND_TO_ALL_PEERS', payload: {eventType, data}};
        console.log('broadcastData', action);
        window.top.postMessage(action, '*');
        this.eventManager.emit(eventType, data);
    };

    sendDataTo = (peerIds, eventType, data) => {
        const action = {type: 'PLUGIN_SEND_TO_PEER', payload: {peerIds, eventType, data}};
        window.top.postMessage(action, '*');
    };

    // requestConnectedPeers = () => {
    //     const action = {type: 'PLUGIN_REQUEST_CONNECTED_PEER_IDS'};
    //     window.top.postMessage(action, '*');
    // };
    //
    // requestLocalPeer = () => {
    //     const action = {type: 'PLUGIN_REQUEST_LOCAL_PEER'};
    //     window.top.postMessage(action, '*');
    // };

    __init = () => {
        window.addEventListener('message', this.__receiveMessage);
    }

    __receiveMessage = event => {
        console.log('__receive message', event);
        switch(event.data.type) {
            case 'PLUGIN_DATA': {
                // emit the event received from another peer.
                const {eventType, data} = event.data.payload;
                this.eventManager.emit(eventType, data);
            }
            // case 'RECEIVE_LOCAL_PEER': {
            //     // emit the event received from another peer.
            //     const {eventType, data} = event.data.payload;
            //     this.eventManager.emit(eventType, data);
            // }
        }
    }
}

try {
    module.exports = {
        quackamoleEventManager: quackamoleEventManagerSingleton,
        Quackamole: Quackamole
    };
} catch(e) {}

// TODO quackamole.requestConnectedPeers() and requestLocalPeer() should return a promise

// TODO create a Peer class with useful abstractions like: -> peer.send(eventType, data) - (basically just a OOP wrapper for existing sendDataTo() and other relevant methods)

// TODO add ability to control some things on the platform. Those things could be visual appearance of app, indicators, audio, video.
//  Keep security in mind. Don't give plugins any more freedom than they need to function.

// TODO "quackamole.lockstepLoop(main)", the callback (main) is triggered each time you get the currentStep data from ALL connections
//  each time main is called, currentStep is incremented and it starts all over again and again.
//  Imagine it like a gameloop with uncertain updates/second.
//  for now resolve conflicts using only timestamps and don't worry about manipulation/cheating (experiment with pouchDB or gunDB for more sophisticated conflict resolution)

// TODO think about using observables instead of callbacks and promises
//  Example1: quackamole.localPeer can be an observable. use .subscribe() to react to it when it is available
//  Example2: const counter = new quackamole.observe('counter'); - creates observable, assigning value leads to cross-peer event that updates same observable of other peers.
//  Observables should NOT be mandatory. Create a wrapper that uses existing functionality under the hood.
//  Try rxjs but research more lightweight alternatives. Potentially add support for multiple observable libraries and let developer choose what they prefer.
