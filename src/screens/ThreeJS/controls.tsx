import React, { useEffect, useRef, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import styled from "styled-components/native";
// import { animationStore } from "./store";
import { Animation, Action, actionType } from "./type";
import { LoadingScreen } from "../LoadingScreen";
import { applyMiddleware } from "@reduxjs/toolkit";
import { useObservable } from "micro-observables";
import store from "../../store/store";
import { setPlay } from "../../store/slices/playerSlices";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Text } from "react-native";
import { Camera } from "expo-camera";

// interface I_Controls {
//   animationList: Animation[];
// }

export const Controls = ({ AP, camera, orbitRef }) => {
  const scrollViewRef = useRef(null);
  const dispatch = useDispatch();
  const text = useObservable(AP.text);
  console.log("AP TEXT", AP?.text?.get(), text);
  // const play = useSelector((state) => state.player.play);
  const [play, setPlay] = useState(false);

  // const controlManagement = async () => {
  //   const state = store.getState();
  //   console.log("stae", state);
  //   while (1) {
  //     console.log("CONTROLEMANAGEMENT play : ", play);
  //     if (play) {
  //       await AP.playStep(AP, step, step + 1, false);
  //       step++;
  //     }
  //     await new Promise((r) => setTimeout(r, 50));
  //   }
  // };

  useEffect(() => {
    if (play) {
      AP.play.set(true);
      AP.playStep(AP, AP.nextToPlay, AP.animList.length - 1, false);
    } else {
      AP.play.set(false);
      AP.resetAnimation(false);
    }
  }, [play]);

  if (!AP) return null;

  return (
    <>
      <InstructionContainer>
        <Instruction>{text}</Instruction>
      </InstructionContainer>
      <ControlsConainer>
        <ButtonContainer>
          {/* GO TO START */}
          <PressableIcon
            onPress={() => {
              // const controls = orbitRef?.current.getControls();
              // controls?.reset();
              // console.log("reset Animation");
              // AP.play.set(false);
              camera.position.set(0, 0, 1);
              camera.lookAt(0, 0, 0);
              setPlay(false);
              AP.play.set(false);
              AP.nextToPlay = 0;
              AP.resetAnimation(true);
              // AP.playStep(AP, 0, AP.animList.length - 1, false);
              // initAnimation(animationList[0]["animation"]["actionList"]);
            }}
          >
            <AntDesign
              name="stepbackward"
              size={24}
              color="black"
              style={{ textAlign: "center" }}
            />
          </PressableIcon>
          {/* GO BACK ONCE */}
          <PressableIcon
            onPress={async () => {
              const position = AP.nextToPlay;
              console.log("position", position);
              if (position === 1) {
                AP.nextToPlay = 0;
                await AP.resetAnimation(true);
                return;
              }
              AP.play.set(false);
              await AP.resetAnimation(true);
              AP.play.set(true);
              await AP.playStep(AP, 0, position - 2, true);
              if (!play) {
                AP.play.set(false);
              } else {
                await AP.playStep(
                  AP,
                  AP.nextToPlay - 2,
                  AP.animList.length - 1,
                  false
                );
              }
            }}
          >
            <AntDesign
              name="left"
              size={24}
              color="black"
              style={{ textAlign: "center" }}
            />
          </PressableIcon>
          <PressableIcon
            onPress={() => {
              setPlay((state) => !state);
            }}
          >
            <AntDesign
              name={!play ? "play" : "pause"}
              size={24}
              color="black"
              style={{ textAlign: "center" }}
            />
          </PressableIcon>
          <PressableIcon
            onPress={() => {
              AP.play.set(true);
              AP.resetAnimation(false);
              AP.playStep(AP, AP.nextToPlay, AP.nextToPlay, true);
              if (play) {
                AP.playStep(AP, AP.nextToPlay, AP.animList.length - 1, false);
              } else AP.play.set(false);
            }}
          >
            <AntDesign
              name="right"
              size={24}
              color="black"
              style={{ textAlign: "center" }}
            />
          </PressableIcon>
          <PressableIcon
            onPress={() => {
              AP.play.set(true);
              setPlay(false);
              AP.resetAnimation(false);
              AP.playStep(AP, AP.nextToPlay + 1, AP.animList.length - 1, true);
            }}
          >
            <AntDesign
              name="stepforward"
              size={24}
              color="black"
              style={{ textAlign: "center" }}
            />
          </PressableIcon>
        </ButtonContainer>
      </ControlsConainer>
    </>
  );
};

const Instruction = styled.Text``;
const InstructionContainer = styled.View`
  position: absolute;
  top: 60px;
  left: 10px;
`;

const ButtonContainer = styled.View`
  display: flex;
  flex-direction: row;
  margin-top: 10px;
  justify-content: center;
`;

const ControlsConainer = styled.View`
  /* border: 1px solid white; */
  position: absolute;
  right: 2.5%;
  bottom: 10px;
  width: 95%;
  /* height: 600px; */
  justify-content: center;
`;

const PressableIcon = styled.TouchableOpacity`
  background-color: white;
  height: 40px;
  width: 40px;
  border-radius: 20px;
  justify-content: center;
  margin-horizontal: 5px;
`;
