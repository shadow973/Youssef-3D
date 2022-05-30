import React, { useState } from "react";
import {
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Alert,
  Platform,
  View,
} from "react-native";
// @ts-ignore
import { Block, Button, Input, Text, theme } from "galio-framework";
import { materialTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import { useNavigation } from "@react-navigation/native";
import { StatusHeader } from "../components/StatusHeader";

const { width } = Dimensions.get("window");

const SignUp = () => {
  const [email, setEmail] = useState("youssef.oubihi@altodia.com");
  const [password, setPassword] = useState("-");
  const { navigate } = useNavigation();

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <StatusHeader>INSCRIPTION</StatusHeader>
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
                  style={styles.input}
                />
              </Block>
              <Block center flex style={{ marginTop: 20 }}>
                <Button
                  size="large"
                  shadowless
                  color={materialTheme.COLORS.PRIMARY}
                  style={{ height: 48 }}
                  onPress={() => {
                    navigate("Profil", { email, password });
                  }}
                >
                  INSCRIPTION
                </Button>
                <Text
                  color={materialTheme.COLORS.PRIMARY}
                  size={theme.SIZES.FONT * 0.75}
                  onPress={() => navigate("SignIn")}
                  style={{
                    alignSelf: "center",
                    lineHeight: theme.SIZES.FONT * 2,
                  }}
                >
                  Vous avez déjà un compte ? Connexion
                </Text>
              </Block>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Block>
    </View>
  );
};

export default SignUp;

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
