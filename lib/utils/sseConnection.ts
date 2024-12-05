export class SSEConnection {
  private eventSource: EventSource | null = null;

  connect(userId: string, onMessage: (event: MessageEvent) => void) {
    if (typeof window === 'undefined') return null;

    if (this.eventSource) {
      this.disconnect();
    }

    // 기존 API Route 사용
    const url = `/api/notification-service/connect/${encodeURIComponent(userId)}`;

    try {
      this.eventSource = new EventSource(url);

      this.eventSource.onopen = () => {
        console.log('SSE connection established (Client)');
      };

      this.eventSource.onmessage = (event) => {
        console.log('Received SSE message (Client):', event.data);
        onMessage(event);
      };

      this.eventSource.onerror = (error) => {
        console.error('SSE Connection Error (Client):', error);
        if (this.eventSource?.readyState === EventSource.CLOSED) {
          this.disconnect();
        }
      };

      return this.eventSource;
    } catch (error) {
      console.error('Failed to initialize SSE (Client):', error);
      return null;
    }
  }

  disconnect() {
    if (this.eventSource) {
      console.log('Disconnecting SSE (Client)');
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}
