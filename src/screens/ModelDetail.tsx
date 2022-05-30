import React, { useEffect, useState } from "react";
import { Dimensions, Image } from "react-native";
import styled from "styled-components/native";
import { AntDesign } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/core";
import { useAppSelector } from "../hooks/redux";
import { useImage } from "../hooks/useImage";
import { useAxios } from "../hooks/useAxios";
import { useFile } from "../hooks/useFile";
import { useAnimations } from "../hooks/useAnimations";
import { LoadingScreen } from "./LoadingScreen";

const windowWidth = Dimensions.get("window").width;
global.Buffer = global.Buffer || require("buffer").Buffer;

interface I_AnimationProps {
  animation: {
    animationname: string;
    animationtext: string;
    animationid: number;
  };
  modelId: string;
  modelUrl: string;
  animationList: any;
}

const AnimationTile = ({
  animation,
  animationList,
  modelId,
  modelUrl,
}: I_AnimationProps) => {
  const { animationname, animationtext, animationid } = animation;
  const { navigate } = useNavigation();

  return (
    <Tile>
      <TileTitle>{animationname}</TileTitle>
      <TileBottom>
        <TileDescription>
          {animationtext?.length ? animationtext : "no description"}
        </TileDescription>
        <Play
          onPress={() =>
            navigate("Scene", {
              animationid,
              animationList: animationList,
              modelId,
              modelUrl,
            })
          }
        >
          <AntDesign name="play" size={40} color="#51e3b6" />
        </Play>
      </TileBottom>
    </Tile>
  );
};

const Play = styled.TouchableOpacity`
  height: 40px;
  width: 40px;
  border-radius: 20px;
`;

const TileDescription = styled.Text`
  font-size: 12px;
  flex: 1;
`;

const TileBottom = styled.View`
  margin-top: 5px;
  display: flex;
  flex-direction: row;
`;

const TileTitle = styled.Text`
  font-size: 15px;
`;

const Tile = styled.View`
  height: 100px;
  margin-vertical: 8px;
  background-color: white;
  margin-horizontal: 18px;
  padding: 8px;
`;

interface I_Props {
  route: {
    params: {
      modelId: number;
    };
  };
}

const ModelDetail = ({ route }: I_Props) => {
  const { modelId } = route.params;
  const [detail, setDetail] = useState({
    modelename: "",
    modeletext: "",
  });
  const [animations, setAnimations] = useState([]);
  const state = useAppSelector((state) => state);
  const companyId = useAppSelector((state) => state.auth.companyid);
  const { image } = useImage(
    `/modeles/${modelId}/image/companies/${companyId}`
  );
  const { response, error, loading } = useAxios(`/modeles/${modelId}`, "get");
  const { file } = useFile(
    response?.data.Modele.modelefileurl,
    modelId.toString()
  );
  const { navigate } = useNavigation();
  const resp = useAnimations(animations);

  // console.log("File", file);

  // console.log("MODELDETAIL", response);

  // console.log("Animations", animations);
  // console.log("Animations RESP", resp);
  // console.log("response.data.animations", response?.data?.animations);
  // console.log("FETCH ALL ANIMATIONS DETAILs", resp);

  useEffect(() => {
    if (response) {
      setDetail(response.data.Modele);
      setAnimations(response.data.animations);
    }
  }, [response]);

  if (resp.loading || !file)
    return <LoadingScreen subtitle="loading modele"></LoadingScreen>;

  return (
    <ScrollView>
      <ImageContainer>
        <Image
          source={{ uri: image }}
          style={{ width: "100%", height: "100%" }}
        ></Image>
      </ImageContainer>
      <DescriptionContainer>
        <DescriptionTopContainer>
          <ModelTitle numberOfLines={1}>{detail?.modelename}</ModelTitle>
          <GreenButton
            onPress={() =>
              navigate("Scene", {
                modelUrl: response?.data.Modele.modelefileurl,
                modelId: modelId.toString(),
              })
            }
          >
            <InnerButton>{file ? "OUVRIR" : "LOADING"}</InnerButton>
          </GreenButton>
        </DescriptionTopContainer>
        <Description>{detail?.modeletext}</Description>
      </DescriptionContainer>
      {animations.map((animation, key) => (
        <AnimationTile
          key={key}
          animation={animation}
          animationList={resp?.response}
          modelId={modelId.toString()}
          modelUrl={response?.data.Modele.modelefileurl}
        />
      ))}
    </ScrollView>
  );
};

export default ModelDetail;

const Description = styled.Text`
  font-size: 17px;
  margin-top: 5px;
`;

const ModelTitle = styled.Text`
  margin-top: 8px;
  font-size: 26px;
  width: 60%;
`;

const DescriptionTopContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  max-width: 100%;
`;

const DescriptionContainer = styled.View`
  padding-horizontal: 21px;
  margin-top: -20px;
  background-color: white;
  width: 100%;
  height: 150px;
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;
  margin-bottom: 16px;
`;

const ImageContainer = styled.View`
  height: ${windowWidth}px;
  width: ${windowWidth}px;
  border: 1px solid grey;
  background-color: grey;
`;

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
`;
