import { create } from 'zustand';

export type UserRole = 'MANAGER' | 'MEMBER';

export interface User {
  id: number;
  name: string;
  isHost: boolean;
  isReady: boolean;
  role: UserRole;
}

interface WaitingRoomData {
  waitingRoomParticipants: {
    nickname: string;
    status: string;
    id: number;
  }[];
}

interface GameStartData {
  action: 'startGame';
  gameId: string;
  joinedUser: string[];
  totalRounds: number;
}

export interface RoundData {
  roundId: number;
  roundNum: number;
  roundTimer: number;
  contentUrls: string[];
  hint?: string;
}

export interface ResultData {
  answerCoordinate: {
    lat: number;
    lng: number;
  };
  submitCoordinates: {
    nickname: string;
    lat: number;
    lng: number;
    score: number;
    totalScore: number;
  }[];
}

interface WebSocketMessage {
  data: WaitingRoomData | GameStartData | RoundData | ResultData;
  eventType?:
    | 'PARTICIPANT'
    | 'READY'
    | 'START'
    | 'ROUND_START'
    | 'RESULT'
    | 'SCORE'
    | 'ROUND_END';
}

interface WebSocketStore {
  messages: WebSocketMessage[];
  users: User[];
  hostNickname: string | null;
  addMessage: (message: WebSocketMessage) => void;
  clearMessages: () => void;
  setUsers: (users: User[]) => void;
  setHostNickname: (nickname: string) => void;
}

export interface GameState {
  roundState?: {
    roundId: number;
    roundNum: number;
    roundTimer: number;
    contentUrls: string[];
    hint?: string;
  };
  scoreState?: {
    answerCoordinate: {
      lat: number;
      lng: number;
    };
    submitCoordinates: {
      nickname: string;
      lat: number;
      lng: number;
      score: number;
      totalScore: number;
    }[];
  };
}

const useWebSocketStore = create<WebSocketStore>((set) => ({
  messages: [],
  users: [],
  hostNickname: null,
  addMessage: (message) => {
    set((state) => {
      // WaitingRoomData 타입인 경우에만 users 업데이트
      if ('waitingRoomParticipants' in message.data) {
        const updatedUsers = message.data.waitingRoomParticipants.map(
          (participant): User => ({
            id: participant.id,
            name: participant.nickname,
            isHost: participant.nickname === state.hostNickname,
            isReady:
              participant.status === 'Ready' ||
              participant.nickname === state.hostNickname,
            role:
              participant.nickname === state.hostNickname
                ? 'MANAGER'
                : 'MEMBER',
          })
        );

        return {
          ...state,
          messages: [...state.messages, message],
          users: updatedUsers,
        };
      }

      return {
        ...state,
        messages: [...state.messages, message],
      };
    });
  },
  clearMessages: () => set({ messages: [], hostNickname: null }),
  setUsers: (users) => set({ users }),
  setHostNickname: (nickname) => set({ hostNickname: nickname }),
}));

export default useWebSocketStore;
