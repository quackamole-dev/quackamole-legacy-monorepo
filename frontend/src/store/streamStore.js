// streams cannot be directly stored in redux because they are a data blob. Thats why we reference them here
// This is experimental and possibly subject to change if we find a better solution.

class StreamStore {
    constructor() {
        this.streams = {};
    }

    setStream = (peerId, stream) => {
        return this.streams[peerId] = stream;
    };

    getStream = peerId => {
        return this.streams[peerId];
    };

    clearStream = peerId => {
        const stream = this.streams[peerId];
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
    };

    clearAllStreams = () => {
        Object.keys(this.streams).forEach(peerId => {
            this.clearStream(peerId);
        })
    };
}

const streamStore = new StreamStore();
window.streamStore = streamStore; // for debugging

export default streamStore;
