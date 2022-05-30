import React, { useState } from "react";
import {
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Alert,
  Platform,
  View,
} from "react-native";
import { StatusHeader } from "../components/StatusHeader";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Block, Button, Input, Text, theme } from "galio-framework";
import { materialTheme } from "../constants";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlices";
import { flush } from "../store/slices/userSlices";
import { flushCompanies } from "../store/slices/companiesSlices";
import { flushModels } from "../store/slices/modelsSlices";
import http from "../axios";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { update } from "../store/slices/userSlices";
import { useAppSelector } from "../hooks/redux";
import styled from "styled-components/native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import { ScrollView } from "react-native-gesture-handler";
import { useAxios } from "../hooks/useAxios";

const { width } = Dimensions.get("window");

const UserProfil = () => {
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const user = useAppSelector((state) => state.user);
  const userId = useAppSelector((state) => state.auth.userid);

  const [firstName, setFirstName] = useState(user.firstname);
  const [email, setEmail] = useState(user.email);
  const [lastName, setLastName] = useState(user.lastname);
  const [loading, setLoading] = useState(false);
  // const {response, error, loading} = useAxios();

  const updateUser = async () => {
    setLoading(true);
    try {
      const userInfo = await http.put(`/users/${userId}`, {
        firstname: firstName,
        lastname: lastName,
      });
      console.log("user", userInfo.data.data.appuser);
      Toast.show({
        type: "success",
        text1: "Info",
        text2: userInfo.data.messages,
      });
      dispatch(update(userInfo));
      setLoading(false);
    } catch (err) {
      console.log("Error");
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: err.response.data.messages,
      });
      setLoading(false);
    }
  };

  const logOut = async () => {
    dispatch(logout());
    dispatch(flush());
    dispatch(flushCompanies());
    dispatch(flushModels());
  };

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <StatusHeader>MON PROFIL</StatusHeader>
      <View style={{ flex: 1, height: "100%" }}>
        <InputContainer>
          <Input
            color={materialTheme.COLORS.PRIMARY}
            placeholder="Prénom"
            type="email-address"
            autoCapitalize="none"
            bgColor="transparent"
            placeholderTextColor={materialTheme.COLORS.LIGHTGREY}
            onChangeText={setFirstName}
            value={firstName}
            style={styles.input}
          />
          <Input
            color={materialTheme.COLORS.PRIMARY}
            placeholder="Nom"
            bgColor="transparent"
            placeholderTextColor={materialTheme.COLORS.LIGHTGREY}
            onChangeText={setLastName}
            value={lastName}
            style={styles.input}
          />
          <Input
            color={materialTheme.COLORS.PRIMARY}
            placeholder="Email"
            type="email-address"
            autoCapitalize="none"
            bgColor="transparent"
            placeholderTextColor={materialTheme.COLORS.LIGHTGREY}
            onChangeText={setEmail}
            value={email}
            style={styles.input}
            editable={false}
          />
        </InputContainer>
        <BottomContainer>
          <Block center>
            <Button
              size="large"
              shadowless
              color={materialTheme.COLORS.PRIMARY}
              style={{ height: 48 }}
              onPress={() => {
                updateUser();
              }}
            >
              METTRE A JOUR
            </Button>
            <ParamContainer onPress={() => navigate("Parameters")}>
              <InnerParam>Mes Parametres</InnerParam>
              <StyledIcon name="right" size={24} color="black"></StyledIcon>
            </ParamContainer>
            <Button
              loading={loading}
              shadowless
              color={materialTheme.COLORS.ERROR}
              size="large"
              style={{ height: 48, marginHorizontal: 0.05 * width }}
              onPress={() => {
                logOut();
              }}
            >
              DECONNEXION
            </Button>
          </Block>
        </BottomContainer>
      </View>
    </View>
  );
};

export default UserProfil;

const BottomContainer = styled.View`
  margin-bottom: 30px;
`;

const InputContainer = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
`;

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
  width: ${0.9 * width}px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-vertical: 10px;
`;

const styles = StyleSheet.create({
  input: {
    borderRadius: 3,
    borderBottomWidth: 1,
    borderColor: materialTheme.COLORS.LIGHTGREY,
    width: 0.9 * width,
    marginHorizontal: 0.05 * width,
  },
});
