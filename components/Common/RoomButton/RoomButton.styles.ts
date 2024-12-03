import styled from 'styled-components';
import CardBackground from '@/styles/Icon/CardBackGround.svg';

export const RoomButtonWrapper = styled.div`
  width: 163px;
  height: 139px;
  border-radius: 12px;
  background-image: url(${CardBackground.src});
`;

export const RoomButtonLayout = styled.div`
  height: calc(100% - 0.2rem);
  padding: 1rem 1rem 1.2rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const RoomTitle = styled.div`
  margin-bottom: 2px;
  color: #fdf8ff;
  font-size: 14px;
  font-weight: 700;
  line-height: 150%;
  padding-bottom: 2px;
`;

export const RoomPerson = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2px;
  color: #fdf8ff;
  font-size: 12px;
  font-weight: 400;
`;

export const RoomTopContainer = styled.div``;

export const RoomBottomContainer = styled.div`
  color: #fdf8ff;
  font-size: 12px;
  font-weight: 700;
`;

export const PersonBox = styled.div``;
