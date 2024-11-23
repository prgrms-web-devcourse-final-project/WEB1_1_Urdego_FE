import styled from 'styled-components';

export const PageWrapper = styled.div`
  background-color: #FFFFFF;
  padding: 120px 8px 50px 8px;
`;

export const SubTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;  
`;

export const ListTitle = styled.h2`
  font-size: 18px;
`;

export const RoomButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); 
  gap: 16px; 
  width: 100%;
`;