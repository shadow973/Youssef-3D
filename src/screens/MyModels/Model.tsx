import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import styled from "styled-components/native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import { useDispatch } from "react-redux";
import { refreshCompanyId } from "../../store/slices/authSlices";
import http from "../../axios";
import { I_Model } from "../../Interfaces/I_Model";
import { useImage } from "../../hooks/useImage";
import { useAxios } from "../../hooks/useAxios";

interface I_Props {
  model: I_Model;
}

export const Model: React.FC<I_Props> = ({ model }) => {
  const { navigate } = useNavigation();
  const dispatch = useDispatch();
  const { image, error, loading } = useImage(model.modeleimageurl);
  // console.log("Model", model);

  return (
    <Container>
      {image && (
        <Image
          style={{
            width: 125,
            height: 130,
          }}
          resizeMode="cover"
          source={{ uri: image }}
        ></Image>
      )}
      <RightContainer>
        <TopContainer>
          <Title numberOfLines={2}>{model.modelename}</Title>
          <FontAwesome name="star" size={20} color="orange" />
        </TopContainer>
        <Description numberOfLines={2}>
          {model?.modeletext?.length
            ? model.modeletext
            : "pas de description pas de description pas de description pas de description pas de description"}
        </Description>
        <GreenButton
          onPress={() => {
            dispatch(refreshCompanyId(model.companyid));
            navigate("ModelDetails", { modelId: model.modeleid });
          }}
        >
          <InnerButton>DETAILS</InnerButton>
        </GreenButton>
      </RightContainer>
    </Container>
  );
};
const InnerButton = styled.Text`
  margin: auto;
  color: white;
  font-size: 12px;
  line-height: 14px;
`;
const GreenButton = styled.TouchableOpacity`
  background: #51e3b6;
  border-radius: 3px;
  width: 127px;
  height: 33px;
  justify-content: center;
  align-self: flex-end;
  position: absolute;
  bottom: 0px;
`;

const Description = styled.Text`
  font-size: 12px;
  line-height: 14px;
  padding-bottom: 10px;
`;

const TopContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 6px;
  width: 100%;
`;

const Title = styled.Text`
  width: 90%;
`;

const RightContainer = styled.View`
  flex: 1;
  padding-left: 10px;
`;

const Container = styled.View`
  height: 130px;
  margin: 8px;
  padding: 7px;
  background-color: white;
  display: flex;
  flex-direction: row;
`;

const ImageShadow = styled.View`
  width: 125px;
  height: 100px;
  shadow-color: #000;
  shadow-offset: 0 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
  background-color: white;
`;
