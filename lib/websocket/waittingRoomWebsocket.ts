import { Client } from '@stomp/stompjs';
import useWebSocketStore from '@/stores/useWebSocketStore';
import useUserStore from '@/stores/useUserStore';
import toast from 'react-hot-toast';
import { API_URL_CONFIG } from '@/config/apiEndPointConfig';

interface WebSocketEvent {
  eventType: 'READY' | 'PARTICIPANT' | 'START';
  data: {
    nickname: string;
    role?: string;
  };
}

class WaitingRoomWebSocket {
  private static instance: WaitingRoomWebSocket;
  private stompClient: Client | null = null;
  private groupId: number | null = null;

  private constructor() {}

  public static getInstance(): WaitingRoomWebSocket {
    if (!WaitingRoomWebSocket.instance) {
      WaitingRoomWebSocket.instance = new WaitingRoomWebSocket();
    }
    return WaitingRoomWebSocket.instance;
  }

  public async connect(
    groupId: number,
    isManager: boolean = false
  ): Promise<boolean> {
    this.groupId = groupId;
    const isProduction = process.env.NODE_ENV === 'production';
    const wsUrl = isProduction
      ? API_URL_CONFIG.GROUP.WS_URL.PROD
      : API_URL_CONFIG.GROUP.WS_URL.DEV;

    if (this.stompClient?.active) {
      console.warn('WebSocket is already active.');
      return true;
    }

    return new Promise((resolve, reject) => {
      this.stompClient = new Client({
        brokerURL: wsUrl,
        debug: (str) => {
          console.log('Debug:', str);
          if (str.includes('accept-version')) {
            console.log('Protocol versions:', str);
          }
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      this.stompClient.onConnect = () => {
        console.log('Connected to WebSocket');
        this.setupSubscription();
        this.sendParticipantEvent(isManager);
        resolve(true);
      };

      this.stompClient.onStompError = (frame) => {
        console.error('STOMP error:', frame);
        toast.error('웹소켓 연결에 실패했습니다.');
        reject(new Error(frame.headers['message']));
      };

      try {
        this.stompClient.activate();
      } catch (error) {
        console.error('Failed to activate WebSocket:', error);
        reject(error);
      }
    });
  }

  private setupSubscription(): void {
    if (!this.stompClient?.active || !this.groupId) return;

    this.stompClient.subscribe(
      `${process.env.NEXT_PUBLIC_GROUP_SUBSCRIBE}/${this.groupId}`,
      (message) => {
        console.log('Received message:', message.body);
        const parsedMessage = JSON.parse(message.body);
        const addMessage = useWebSocketStore.getState().addMessage;
        addMessage({
          ...parsedMessage,
          timestamp: Date.now(),
        });
      }
    );
  }

  public sendEvent(event: WebSocketEvent): void {
    if (this.stompClient?.active && this.groupId) {
      this.stompClient.publish({
        destination: `${process.env.NEXT_PUBLIC_GROUP_PUBLISH}/${this.groupId}`,
        body: JSON.stringify(event),
      });
    }
  }

  private sendParticipantEvent(isManager: boolean): void {
    if (!this.stompClient?.active || !this.groupId) return;

    const nickname = useUserStore.getState().nickname;
    if (!nickname) {
      toast.error('닉네임 정보를 찾을 수 없습니다.');
      this.disconnect();
      return;
    }

    const participantEvent = {
      eventType: 'PARTICIPANT',
      data: {
        nickname: nickname,
        role: isManager ? 'MANAGER' : 'MEMBER',
      },
    };

    this.stompClient.publish({
      destination: `${process.env.NEXT_PUBLIC_GROUP_PUBLISH}/${this.groupId}`,
      body: JSON.stringify(participantEvent),
    });
  }

  public disconnect(): void {
    if (this.stompClient?.active) {
      this.stompClient.deactivate();
      this.groupId = null;
      console.log('Disconnected from WebSocket');
    }
  }

  public isConnected(): boolean {
    return !!this.stompClient?.active;
  }
}

export default WaitingRoomWebSocket;
