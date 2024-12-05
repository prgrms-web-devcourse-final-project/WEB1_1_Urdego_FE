'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import TopBar from '@/components/Common/TopBar/TopBar';
import { MainBanner } from '@/components/Layout/Home/MainBanner/MainBanner';
import ChannelButton from '@/components/Layout/Home/ChannelButton/ChannelButton';
import { HomeTitle, ChannelWrapper } from '@/app/(nav)/home/Home.styles';
import { HomePageWrapper } from '@/app/commonPage.styles';
import useSSEStore from '@/stores/useSSEStore';
import { InviteToast } from '@/components/Layout/Home/InviteToast/InviteToast';
import type { NotificationMessage } from '@/lib/types/notification';

const Home = () => {
  const { eventSource, connect, disconnect } = useSSEStore();
  const router = useRouter();

  useEffect(() => {
    // 컴포넌트 마운트 시 userId 가져와서 SSE 연결
    const userId = localStorage.getItem('userId');
    if (userId && !eventSource) {
      connect(userId);
    }

    return () => {
      // 컴포넌트 언마운트 시 연결 해제
      disconnect();
    };
  }, []);

  useEffect(() => {
    if (!eventSource) return;

    const messageHandler = (event: MessageEvent) => {
      console.log('Handling message in Home component:', event.data);
      try {
        const notification: NotificationMessage = JSON.parse(event.data);

        if (notification.action.includes('게임에 초대')) {
          toast.custom(
            (t) => (
              <InviteToast
                message={`${notification.senderNickName}님이 ${notification.groupName}에서 당신을 초대했습니다. 수락하시겠습니까?`}
                onAccept={() => {
                  router.push(`/game/${notification.groupId}/waitingRoom`);
                }}
                onReject={() => {
                  console.log('초대 거절:', notification.notificationId);
                }}
                toastId={t.id}
              />
            ),
            { position: 'top-center', duration: Infinity }
          );
        } else {
          // ... 기존 토스트 로직
        }
      } catch (error) {
        console.error('Failed to parse SSE message in Home:', error);
      }
    };

    eventSource.onmessage = messageHandler;

    return () => {
      if (eventSource) {
        eventSource.onmessage = null;
      }
    };
  }, [eventSource, router]);

  return (
    <>
      <TopBar NavType="main" />
      <HomePageWrapper>
        <MainBanner />
        <ChannelWrapper>
          <HomeTitle>게임채널</HomeTitle>
          <Link href="/groupList">
            <ChannelButton title="그룹 게임" />
          </Link>
          <ChannelButton title="랭킹 게임" />
        </ChannelWrapper>
      </HomePageWrapper>
      <MainBanner />
      <HomeTitle>게임채널</HomeTitle>
      <ChannelWrapper>
        <Link href="/groupList">
          <ChannelButton title="그룹 게임" />
        </Link>
        <ChannelButton title="랭킹 게임" />
      </ChannelWrapper>
    </>
  );
};

export default Home;
