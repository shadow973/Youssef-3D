import React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";

export interface I_Props {
  children: React.ReactNode;
}

export const StatusHeader = ({ children }: I_Props) => {
  const { goBack, canGoBack } = useNavigation();

  const _goBack = () => {
    if (canGoBack()) goBack();
  };

  return (
    <Background>
      <Container>
        <GoBack onPress={() => _goBack()}>
          {canGoBack() && <AntDesign name="left" size={24} color="black" />}
        </GoBack>
        <Title>{children}</Title>
      </Container>
    </Background>
  );
};

const GoBack = styled.TouchableOpacity`
  margin-horizontal: 21px;
`;

const Background = styled.View`
  background-color: white;
`;

const Container = styled.View`
  margin-top: 48px;
  width: 100%;
  height: 42px;
  background-color: white;
  display: flex;
  flex-direction: row;
`;

const Title = styled.Text`
  font-size: 16px;
  justify-content: center;
  font-weight: bold;
`;
