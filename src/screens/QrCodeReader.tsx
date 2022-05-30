import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import styled from "styled-components/native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import { useNavigation } from "@react-navigation/core";
import { useIsFocused } from "@react-navigation/core";

interface CodeBar {
  type: string;
  data: string;
}

export const QrCodeReader = () => {
  const [scan, setScan] = useState<boolean>(true);
  const { goBack } = useNavigation();
  const focus = useIsFocused();

  useEffect(() => {
    console.log("focused");
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }: CodeBar) => {
    setScan(false);
    console.log(
      `ADDSTORE Bar code with type ${type} and data ${data} has been scanned!`
    );
    goBack();
  };
  if (!focus) return null;
  return (
    <>
      <GoBackContainer onPress={() => goBack()}>
        <GoBack name="left" size={30} color="black" />
      </GoBackContainer>
      <Camera
        onBarCodeScanned={!scan ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      <ScanContainer>
        <ScanIcon name="scan-outline" size={300} color="black" />
      </ScanContainer>
    </>
  );
};

const GoBackContainer = styled.TouchableOpacity`
  height: 40px;
  width: 40px;
  background-color: white;
  position: absolute;
  top: 48px;
  left: 24px;
  z-index: 10;
  justify-content: center;
  border-radius: 20px;
`;

const GoBack = styled(AntDesign)`
  margin-left: 3px;
`;

const ScanContainer = styled.View`
  width: 100%;
  height: 100%;
  position: absolute;
  justify-content: center;
  text-align: center;
`;

const ScanIcon = styled(Ionicons)`
  position: absolute;
  flex: 1;
  margin: auto;
  width: 100%;
  text-align: center;
`;
