import React from 'react';
import styled from '@emotion/styled';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from '../components/Header';
import SlideMenu from '../components/SlideMenu';
import GlobalStyle from '../styled/global';

const Container = styled.div`
  display: flex;
`;

const Main = styled.main`
  min-height: 90vh;
  position: relative;
  padding: 114px 30px 30px;
  max-width: 1410px;
  width: 100%;
  @media (max-width: 760px) {
    padding: 95px 15px;
  }
`;

const AppLayout = (props) => (
  <div>
    <GlobalStyle />
    <Header />
    <Container>
      <SlideMenu />
      <Main>
        {props.children}
      </Main>
    </Container>
    <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />
  </div>
);

export default AppLayout;
