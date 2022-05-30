import React, { useState } from "react";
import {
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Alert,
  Platform,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { StatusHeader } from "../components/StatusHeader";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Block, Button, Input, Text, theme } from "galio-framework";
import { materialTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/slices/authSlices";
import http from "../axios";
import { update } from "../store/slices/userSlices";
import { updateCompanies } from "../store/slices/companiesSlices";

const { width } = Dimensions.get("window");

const SignIn = () => {
  const [email, setEmail] = useState("youssef.oubihi@altodia.com"); // youssef.oubihi@altodia.com // youbihi@gmail.com
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const { navigate } = useNavigation();
  const dispatch = useDispatch();

  const getUserCompanies = async (userId: number) => {
    try {
      const userCompanies = await http.get(`/users/${userId}/companies`);
      console.log("COMPANIES", userCompanies.data.data);
      dispatch(updateCompanies(userCompanies.data.data.companies));
      return userCompanies.data.data;
    } catch (error) {
      console.log("GetUserCompanies Error", error);
      return null;
    }
  };

  const signIn = async () => {
    setLoading(true);

    try {
      const loginData = await http.post("/sessions/login", { email, password });
      // console.log("Login success", response.data);
      await dispatch(login(loginData.data.data));
      const userData = await http.get(`/users/${loginData.data.data.userid}`);
      console.log("UserData", userData.data.data);
      await dispatch(update(userData.data.data));
      await getUserCompanies(loginData.data.data.userid);
    } catch (e) {
      setLoading(false);
      console.log("login error", e);
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: "une erreur est survenue",
      });
    }
  };

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <StatusHeader>CONNEXION</StatusHeader>
      <Block flex middle>
        <KeyboardAvoidingView behavior="padding" enabled>
          <View
            style={{
              height: "80%",
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <View>
              <Block center>
                <Input
                  borderless
                  color={materialTheme.COLORS.PRIMARY}
                  placeholder="Email"
                  type="email-address"
                  autoCapitalize="none"
                  bgColor="transparent"
                  placeholderTextColor={materialTheme.COLORS.PRIMARY}
                  onChangeText={setEmail}
                  value={email}
                  style={styles.input}
                />
                <Input
                  password
                  viewPass
                  borderless
                  color={materialTheme.COLORS.PRIMARY}
                  iconColor={materialTheme.COLORS.PRIMARY}
                  placeholder="Mot de passe"
                  bgColor="transparent"
                  placeholderTextColor={materialTheme.COLORS.PRIMARY}
                  onChangeText={setPassword}
                  value={password}
                  style={styles.input}
                />
              </Block>
              <Block center flex style={{ marginTop: 20 }}>
                <Button
                  loading={loading}
                  size="large"
                  shadowless
                  color={materialTheme.COLORS.PRIMARY}
                  style={{ height: 48 }}
                  onPress={() => {
                    signIn();
                  }}
                >
                  CONNEXION
                </Button>
                <Text
                  color={materialTheme.COLORS.PRIMARY}
                  size={theme.SIZES.FONT * 0.75}
                  onPress={() => {
                    navigate("SignUp");
                  }}
                  style={{
                    alignSelf: "center",
                    marginTop: 0,
                    lineHeight: theme.SIZES.FONT * 2,
                  }}
                >
                  Vous n’avez pas encore de compte? Inscription
                </Text>
              </Block>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Block>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  signin: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
  },
  input: {
    width: width * 0.9,
    borderRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: materialTheme.COLORS.PRIMARY,
  },
});
