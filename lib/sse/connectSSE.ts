import useSSEStore from '@/stores/useSSEStore';

export const connectSSE = (userId: string) => {
  const { eventSource, setEventSource } = useSSEStore.getState();

  // 기존 연결이 있으면 정리
  if (eventSource) {
    console.log('Cleaning up existing SSE connection');
    eventSource.close();
    setEventSource(null);
  }

  try {
    console.log('Initializing SSE connection for:', userId);
    const newEventSource = new EventSource(
      `/api/notification-service/connect/${encodeURIComponent(userId)}`,
      {
        withCredentials: true,
      }
    );

    newEventSource.onopen = () => {
      console.log('SSE connection established');
      setEventSource(newEventSource);
    };

    newEventSource.onerror = (error) => {
      console.error('SSE Connection Error:', error);
      if (newEventSource.readyState === EventSource.CLOSED) {
        console.log('SSE connection closed');
        newEventSource.close();
        setEventSource(null);
      }
    };

    return newEventSource;
  } catch (error) {
    console.error('Failed to initialize SSE:', error);
    return null;
  }
};
