import React from "react";
import styled from "styled-components/native";
import logoImage from "../assets/images/ARVEESIO_logo.png";
import loaderImage from "../assets/images/light-loader.gif";
// import { StatusHeader } from "../components/StatusHeader";

interface I_LoadingScreen {
  subtitle: string;
}

export const LoadingScreen = ({ subtitle }: I_LoadingScreen) => {
  return (
    <>
      {/* <StatusHeader>Loading ...</StatusHeader> */}
      <Container>
        <SubContainer>
          <Logo resizeMode="contain" source={logoImage}></Logo>
          <SubTitle>Modèle en cours de Chargement....</SubTitle>
          <Loader resizeMode="contain" source={loaderImage}></Loader>
        </SubContainer>
      </Container>
    </>
  );
};

const Loader = styled.Image`
  margin: auto;
  height: 100px;
  overflow: hidden;
`;

const SubContainer = styled.View``;

const Container = styled.View`
  flex: 1;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const SubTitle = styled.Text`
  font-size: 18px;
  color: #979797;
  margin: auto;
  margin-top: 30px;
  margin-bottom: 22px;
`;

const Logo = styled.Image`
  margin: auto;
  height: 40px;
`;
