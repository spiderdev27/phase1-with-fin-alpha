class WebSocketService {
  constructor() {
    this.ws = null;
    this.subscribers = new Map();
  }

  connect() {
    this.ws = new WebSocket('wss://your-websocket-server');

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (this.subscribers.has(data.symbol)) {
        this.subscribers.get(data.symbol).forEach(callback => callback(data));
      }
    };

    this.ws.onclose = () => {
      setTimeout(() => this.connect(), 5000);
    };
  }

  subscribe(symbol, callback) {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, new Set());
    }
    this.subscribers.get(symbol).add(callback);
    this.ws.send(JSON.stringify({ type: 'subscribe', symbol }));
  }

  unsubscribe(symbol, callback) {
    if (this.subscribers.has(symbol)) {
      this.subscribers.get(symbol).delete(callback);
    }
  }
}

export default new WebSocketService(); 