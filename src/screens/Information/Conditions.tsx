import { StatusHeader } from "../../components/StatusHeader";
import React from "react";
import { ScrollView } from "react-native";
import { HeaderHeight } from "../../constants/utils";
import { useNavigation } from "@react-navigation/native";
import { useAxios } from "../../hooks/useAxios";
import styled from "styled-components/native";

export const Conditions = () => {
  const { response, loading, error } = useAxios("/legal/cgu", "get");
  console.log("response", response);
  return (
    <>
      <WhiteBG>
        <StatusHeader>Conditions d'utilisation</StatusHeader>
      </WhiteBG>
      <Content>
        <Light>{response?.data?.cgu}</Light>
      </Content>
    </>
  );
};

const WhiteBG = styled.View`
  background-color: white;
`;

const Content = styled.ScrollView`
  margin: 18px;
`;

const Bold = styled.Text`
  font-size: 17px;
  line-height: 20px;
  font-weight: bold;
  margin-bottom: 18px;
`;

const Light = styled.Text`
  font-size: 17px;
  line-height: 20px;
  margin-bottom: 18px;
`;
