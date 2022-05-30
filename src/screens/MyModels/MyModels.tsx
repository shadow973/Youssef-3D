import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import styled from "styled-components/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Model } from "./Model";
import http from "../../axios";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/core";
import { useDispatch } from "react-redux";
import { updateModels } from "../../store/slices/modelsSlices";
import { useAppSelector } from "../../hooks/redux";
import { useAxios } from "../../hooks/useAxios";
import { I_Model } from "../../Interfaces/I_Model";

const MyModels = () => {
  const { navigate } = useNavigation();
  const dispatch = useDispatch();

  const modeles = useAppSelector((state) => state.models.allModels);
  const [search, setSearch] = useState("");
  const [searchedModel, setSearchedModel] = useState([]);
  const userId = useAppSelector((state) => state.auth.userid);

  const { response, error, loading } = useAxios("/modeles", "get");

  const searchInModels = () => {
    setSearchedModel(
      modeles.filter((model: I_Model) => {
        return (
          model.modelename.toLowerCase().includes(search.toLowerCase()) ||
          model.modeletext.toLowerCase().includes(search.toLowerCase())
        );
      })
    );
  };

  useEffect(() => {
    if (response) {
      console.log("USER MODELS HOOKS", response);
      dispatch(updateModels(response.data.modeles));
    }
  }, [response, loading]);

  console.log("USER ID", userId);

  useEffect(() => {
    if (response) {
      if (search.length === 0) setSearchedModel(response.data.modeles);
      else {
        searchInModels();
      }
    }
  }, [search, response]);

  return (
    <ScrollView>
      <TopContainer>
        <Title>MES MODELS</Title>
        <SearchContainer>
          <SearchInput onChangeText={setSearch} value={search}></SearchInput>
          <TouchableOpacity
            onPress={() => {
              navigate("QrCodeReader");
            }}
          >
            <IconContainer>
              <MaterialCommunityIcons
                name="barcode-scan"
                size={28}
                color="black"
              />
            </IconContainer>
          </TouchableOpacity>
        </SearchContainer>
      </TopContainer>

      <ButtonContainer>
        <GreyButton>
          <InnerButton>TRIER</InnerButton>
        </GreyButton>
        <GreyButton>
          <InnerButton>FILTRER</InnerButton>
        </GreyButton>
      </ButtonContainer>
      <Modeles modeles={searchedModel}></Modeles>
    </ScrollView>
  );
};

interface I_Modeles {
  companyid: number;
  companyname: string;
  favourite: number;
  modeledate: Date;
  modelehash: string;
  modeleid: number;
  modeleimageurl: string;
  modelename: string;
  modelesize: number;
  modeletext: string;
}

interface I_ModelesProps {
  modeles: I_Modeles[] | null;
}

const Modeles = ({ modeles }: I_ModelesProps) => {
  if (!modeles) return null;
  // console.log("DISPLAY ALL FUCKING MODELES ", modeles);

  return (
    <>
      {modeles.map((model, key) => (
        <Model model={model} key={key}></Model>
      ))}
    </>
  );
};

export default MyModels;

const Title = styled.Text`
  font-size: 16px;
  line-height: 19px;
  font-weight: bold;
  margin-left: 62px;
`;

const TopContainer = styled.View`
  padding-top: 48px;
  background-color: white;
  height: 160px;
`;

const SearchInput = styled.TextInput`
  font-size: 15px;
  padding-vertical: 10px;
  height: 46px;
  padding-left: 16px;
  flex: 1;
`;

const SearchContainer = styled.View`
  border: 1px solid #9fa5aa;
  border-radius: 3px;
  height: 47px;
  margin: 16px;
  display: flex;
  flex-direction: row;
`;

const IconContainer = styled.View`
  height: 47px;
  width: 47px;
  justify-content: center;
  padding-left: 8px;
`;

const ButtonContainer = styled.View`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  padding-vertical: 10px;
  padding-horizontal: 22px;
`;

const GreyButton = styled.TouchableOpacity`
  background: #dcdcdc;
  border-radius: 3px;
  width: 150px;
  height: 43px;
  justify-content: center;
`;

const InnerButton = styled.Text`
  margin: auto;
`;
