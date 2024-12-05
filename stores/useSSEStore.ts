import { create } from 'zustand';
import { SSEConnection } from '@/lib/utils/sseConnection';
import type { NotificationMessage } from '@/lib/types/notification';

interface SSEState {
  connection: SSEConnection;
  eventSource: EventSource | null;
  currentNotification: NotificationMessage | null;
  setEventSource: (eventSource: EventSource | null) => void;
  setCurrentNotification: (notification: NotificationMessage | null) => void;
  connect: (userId: string) => EventSource | null;
  disconnect: () => void;
}

const useSSEStore = create<SSEState>((set, get) => ({
  connection: new SSEConnection(),
  eventSource: null,
  currentNotification: null,

  setEventSource: (eventSource) => set({ eventSource }),
  setCurrentNotification: (notification) =>
    set({ currentNotification: notification }),

  connect: (userId) => {
    const connection = get().connection;
    const eventSource = connection.connect(userId, (event) => {
      try {
        const notification: NotificationMessage = JSON.parse(event.data);
        set({ currentNotification: notification });
      } catch (error) {
        console.error('Error parsing SSE message:', error);
      }
    });
    set({ eventSource });
    return eventSource;
  },

  disconnect: () => {
    const connection = get().connection;
    connection.disconnect();
    set({ eventSource: null, currentNotification: null });
  },
}));

export default useSSEStore;
