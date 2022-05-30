import { StatusHeader } from "../components/StatusHeader";
import React, { useState } from "react";
import styled from "styled-components/native";
import { Switch, Platform, View, StyleSheet } from "react-native";

export const Notifications = () => {
  const [activated, setActivated] = useState(false);
  const [activated2, setActivated2] = useState(false);
  return (
    <>
      <StatusHeader>Notifications</StatusHeader>
      <Content>
        <Bold>Paramètres de notifications</Bold>
        <TextAndSwitchContainer>
          <StyledText>Mon entreprise peut me notifier</StyledText>
          <Switch
            thumbColor="white"
            trackColor={{ true: "#171749", false: "#D4D9DD" }}
            onValueChange={setActivated}
            value={activated}
            style={
              Platform.OS === "android"
                ? styles.androidSwitch
                : styles.iosSwitch
            }
          ></Switch>
        </TextAndSwitchContainer>
        <TextAndSwitchContainer>
          <StyledText>ARveesio peut me notifier</StyledText>
          <Switch
            thumbColor="white"
            trackColor={{ true: "#171749", false: "#D4D9DD" }}
            onValueChange={setActivated2}
            value={activated2}
            style={
              Platform.OS === "android"
                ? styles.androidSwitch
                : styles.iosSwitch
            }
          ></Switch>
        </TextAndSwitchContainer>
      </Content>
    </>
  );
};
// Platform.OS === "android" ?

const styles = StyleSheet.create({
  iosSwitch: {
    overflow: "visible",
  },
  androidSwitch: {
    overflow: "visible",
    transform: [{ scale: 1.5 }],
  },
});

const Content = styled.ScrollView`
  background-color: #eeeeee;
`;

const Bold = styled.Text`
  font-weight: bold;
  font-size: 17px;
  line-height: 20px;
  text-align: center;
  margin-vertical: 30px;
`;

const TextAndSwitchContainer = styled.View`
  margin-horizontal: 20px;
  height: 35px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  overflow: visible;
  margin-vertical: 2px;
`;

const StyledText = styled.Text`
  font-size: 15px;
  line-height: 15px;
  padding: 10px;
`;
