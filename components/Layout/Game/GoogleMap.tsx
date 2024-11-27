'use client';

import { useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import colors from '@/styles/color/palette';
import UserMarker from '@/styles/Icon/UserMarker.svg';
import AnswerMarker from '@/styles/Icon/AnswerMarker.svg';

interface MapContainerProps {
  mode: 'game' | 'rank';
}

interface MapComponentProps {
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  mode: 'game' | 'rank';
  onCoordinateSelect?: (coordinate: google.maps.LatLngLiteral | null) => void;
  answerCoordinate: google.maps.LatLngLiteral | null;
  userCoordinates?: {
    nickname: string;
    lat: number;
    lng: number;
    score: number;
  }[];
}

const MapContainer = styled.div<MapContainerProps>`
  width: 100%;
  position: relative;

  ${({ mode }) =>
    mode === 'game'
      ? css`
          height: calc(100vh - 235px);
        `
      : css`
          height: 250px;
        `}
`;

const MapComponent: React.FC<MapComponentProps> = ({
  center = { lat: 36.5, lng: 127.5 },
  zoom = 7,
  mode,
  onCoordinateSelect,
  answerCoordinate,
  userCoordinates,
}) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const mapElementRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<google.maps.Marker[]>([]);
  const polylineRefs = useRef<google.maps.Polyline[]>([]);

  // 지도 초기화 함수
  const initializeMap = () => {
    if (!mapElementRef.current) {
      console.error('지도 컨테이너 요소를 찾을 수 없습니다.');
      return;
    }

    if (!mapRef.current) {
      const mapOptions: google.maps.MapOptions = {
        center: answerCoordinate || center || { lat: 36.5, lng: 127.5 },
        zoom: mode === 'rank' ? 15 : zoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: false,
      };

      mapRef.current = new google.maps.Map(mapElementRef.current, mapOptions);

      // 지도 클릭 이벤트 추가 (게임 모드일 때만)
      if (mode === 'game' && onCoordinateSelect) {
        mapRef.current.addListener(
          'click',
          (event: google.maps.MapMouseEvent) => {
            if (event.latLng) {
              const position = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
              };
              handleMarkerPlacement(position);
            }
          }
        );
      }
    }
  };

  // 마커 배치 함수
  const handleMarkerPlacement = (position: google.maps.LatLngLiteral) => {
    // 기존 마커 제거
    markerRefs.current.forEach((marker) => marker.setMap(null));
    markerRefs.current = [];

    // 새 마커 생성
    const marker = new google.maps.Marker({
      position,
      map: mapRef.current!,
      icon: {
        url: UserMarker.src,
        scaledSize: new google.maps.Size(50, 53), // TODO: 사이즈 조절
      },
    });

    markerRefs.current.push(marker);

    // 부모 컴포넌트로 선택된 좌표 전달
    if (onCoordinateSelect) {
      onCoordinateSelect(position);
    }
  };

  // 정답 좌표 및 유저 좌표 마커 배치 함수
  const placeMarkers = () => {
    if (!mapRef.current) return;

    // 기존 마커 제거
    markerRefs.current.forEach((marker) => marker.setMap(null));
    polylineRefs.current.forEach((polyline) => polyline.setMap(null));
    markerRefs.current = [];
    polylineRefs.current = [];

    // 정답 좌표 마커 배치
    if (answerCoordinate) {
      const answerMarker = new google.maps.Marker({
        position: answerCoordinate,
        map: mapRef.current!,
        icon: {
          url: AnswerMarker.src,
          scaledSize: new google.maps.Size(50, 53), // TODO: 사이즈 조절
        },
      });
      markerRefs.current.push(answerMarker);
    }

    // 유저 좌표 마커 배치
    if (userCoordinates && answerCoordinate) {
      userCoordinates.forEach((user) => {
        const userMarker = new google.maps.Marker({
          position: { lat: user.lat, lng: user.lng },
          map: mapRef.current!,
          icon: {
            url: UserMarker.src,
            scaledSize: new google.maps.Size(50, 53), // TODO: 사이즈 조절
          },
        });
        markerRefs.current.push(userMarker);
        // 정답 좌표와 유저 좌표를 연결하는 선 추가
        const line = new google.maps.Polyline({
          path: [answerCoordinate, { lat: user.lat, lng: user.lng }],
          geodesic: true,
          strokeColor: colors.gray[60],
          strokeOpacity: 0, // 선의 투명도(0~1)
          strokeWeight: 0, // 선의 두께
          icons: [
            {
              icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 2.5 },
              offset: '0',
              repeat: '20px',
            },
          ],
          map: mapRef.current,
        });
        polylineRefs.current.push(line);
      });
    }
  };

  useEffect(() => {
    initializeMap();
  }, [center, zoom, mode]);

  useEffect(() => {
    placeMarkers();
  }, [answerCoordinate, userCoordinates]);

  return <MapContainer ref={mapElementRef} mode={mode} />;
};

export default MapComponent;
