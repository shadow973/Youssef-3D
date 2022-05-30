import React from "react";
import { StatusHeader } from "../components/StatusHeader";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/core";
import { AntDesign } from "@expo/vector-icons";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const Parameters = () => {
  const { navigate } = useNavigation();
  return (
    <>
      <StatusHeader>PARAMETRES</StatusHeader>
      <TitleContainer>
        <Title>Recommended Settings </Title>
        <SubTitle>These are the most important settings</SubTitle>
      </TitleContainer>
      <ParamContainer onPress={() => navigate("Notifications")}>
        <InnerParam>Notifications</InnerParam>
        <StyledIcon name="right" size={24} color="black"></StyledIcon>
      </ParamContainer>
      <TitleContainer>
        <Title>Paramètres Personnels</Title>
        <SubTitle>Third most important settings</SubTitle>
      </TitleContainer>
      <ParamContainer onPress={() => navigate("Conditions")}>
        <InnerParam>Conditions D’utilisation</InnerParam>
        <StyledIcon name="right" size={24} color="black"></StyledIcon>
      </ParamContainer>
      <ParamContainer onPress={() => navigate("Protection")}>
        <InnerParam>Protection des données</InnerParam>
        <StyledIcon name="right" size={24} color="black"></StyledIcon>
      </ParamContainer>
      <ParamContainer onPress={() => navigate("APropos")}>
        <InnerParam>A propos</InnerParam>
        <StyledIcon name="right" size={24} color="black"></StyledIcon>
      </ParamContainer>
    </>
  );
};

const InnerParam = styled.Text`
  line-height: 48px;
  font-size: 15px;
`;

const StyledIcon = styled(AntDesign)`
  height: 48px;
  line-height: 48px;
  text-align: center;
`;

const ParamContainer = styled.TouchableOpacity`
  height: 48px;
  margin-horizontal: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Container = styled.View`
  background-color: white;
  flex: 1;
`;

const Content = styled.View``;

const TitleContainer = styled.View`
  margin-top: 31px;
`;

const Title = styled.Text`
  font-weight: bold;
  font-size: 17px;
  line-height: 20px;
  text-align: center;
`;

const SubTitle = styled.Text`
  font-weight: normal;
  font-size: 13px;
  line-height: 15px;
  text-align: center;
  color: #5a5a5a;
  margin-top: 5px;
`;
