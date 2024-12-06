import { useEffect, useState } from 'react';
import {
  BackgroundOverlay,
  BottomSheet,
  ContentHeader,
  ContentContainer,
  ContentWrapper,
  HeaderWrapper,
  HeaderHandler,
} from './LocationListBottonSheetStyles';
import LocationList from '@/components/Layout/Home/LocationList/LocationList';

interface LocationListBottomSheetProps {
  isVisible: boolean;
  setLocationListVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const LocationListBottomSheet = ({
  isVisible,
  setLocationListVisible,
}: LocationListBottomSheetProps) => {
  const [isExpand, setIsExpand] = useState(false);
  const [locationList, setLocationList] = useState({});

  useEffect(() => {
    const getLocationList = async () => {
      const params = new URLSearchParams();
      params.append('limit', (5).toString());
      console.log(params.toString());

      const nickname = 'min';
      const response = await fetch(`/api/content/${nickname}?${params}`);
      const data = await response.json();
      if (!data) {
        console.log('데이터를 가져오는 것에 실패했습니다!');
        return;
      }
      console.log(data.userContents);
      setLocationList(data.userContents);
    };
    if (isVisible) {
      getLocationList();
    }
  }, [isVisible]);

  return (
    <>
      {isVisible && (
        <>
          <BackgroundOverlay
            initial={{ x: '-50%' }}
            animate={{ opacity: isVisible ? 1 : 0 }}
          />
          <BottomSheet
            initial={{ x: '-50%' }}
            animate={{ y: isVisible ? '0%' : '100%' }}
            style={{ height: isExpand ? '100vh' : '50vh' }}
            transition={{ type: 'tween' }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(event, info) => {
              const isScrollToBottom = info.delta.y > 5 || info.offset.y > 150;
              if (isScrollToBottom) {
                // 스크롤 아래로 내리는 경우
                setIsExpand(false);
                setLocationListVisible(false);
              } else {
                // 스크롤 위로 올리는 경우
                setIsExpand(true);
              }
            }}
          >
            <HeaderWrapper>
              <HeaderHandler />
            </HeaderWrapper>
            <ContentWrapper>
              <ContentHeader>저장한 장소 (999)</ContentHeader>
              <ContentContainer>
                <LocationList />
                <LocationList />
                <LocationList />
                <LocationList />
                <LocationList />
                <LocationList />
                <LocationList />
                <LocationList />
                <LocationList />
                <LocationList />
                <LocationList />
              </ContentContainer>
            </ContentWrapper>
          </BottomSheet>
        </>
      )}
    </>
  );
};

export default LocationListBottomSheet;
