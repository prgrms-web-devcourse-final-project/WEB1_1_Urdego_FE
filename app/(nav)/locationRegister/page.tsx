'use client';

import Button from '@/components/Common/Button/Button';
import TopBar from '@/components/Common/TopBar/TopBar';
import {
  ButtonLayout,
  LocationRegisterWrapper,
} from './locationRegister.styles';
import { useState } from 'react';
import GoogleMap from '@/components/Layout/LocationRegister/GoogleMap';
import { useRouter } from 'next/navigation';

const LocationRegister = () => {
  const [isLocationSelected, setIsLocationSelected] = useState(false);
  const router = useRouter();
  return (
    <>
      <TopBar NavType="default" label="위치 추가하기" />
      <LocationRegisterWrapper>
        <GoogleMap
          isLocationSelected={isLocationSelected}
          setIsLocationSelected={setIsLocationSelected}
        />
        <ButtonLayout>
          <Button
            buttonType={isLocationSelected ? 'purple' : 'gray'}
            styleType="whiteBackground"
            label="취소하기"
            onClick={() => setIsLocationSelected(false)}
          />
          <Button
            buttonType={isLocationSelected ? 'purple' : 'gray'}
            label="선택하기"
            onClick={() => isLocationSelected && router.push('/placeRegister')}
          />
        </ButtonLayout>
      </LocationRegisterWrapper>
    </>
  );
};

export default LocationRegister;
