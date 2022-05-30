import React, { useState } from "react";
import {
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Alert,
  Platform,
  View,
} from "react-native";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Block, Button, Input, Text, theme } from "galio-framework";
import { materialTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import { useNavigation } from "@react-navigation/native";
import http from "../axios";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useAppSelector } from "../hooks/redux";

const { width } = Dimensions.get("window");

interface I_ProfilProps {
  route: {
    params: {
      email: string;
      password: string;
    };
  };
}

const Profil = ({ route }: I_ProfilProps) => {
  const user = useAppSelector((state) => state.user);
  const { email, password } = route.params;
  const [firstName, setFirstName] = useState(user.firstname);
  const [lastName, setLastName] = useState(user.lastname);
  const [loading, setLoading] = useState(false);

  console.log("Email  password", email, password);

  const { navigate } = useNavigation();

  console.log("USER", user);

  const createAccount = async () => {
    setLoading(true);
    try {
      const account = await http.post("/users", {
        firstname: firstName,
        lastname: lastName,
        email,
        password,
      });
      Toast.show({
        type: "success",
        text1: "Info",
        text2: account.data.messages,
      });

      console.log("account ", account);
      navigate("SignIn");
    } catch (err) {
      console.log("CREATE ACC ERR", err.response.data.messages);
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: err.response.data.messages,
      });
      setLoading(false);
    }
  };

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
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
                  placeholder="Adresse"
                  bgColor="transparent"
                  placeholderTextColor={materialTheme.COLORS.LIGHTGREY}
                  style={styles.input}
                />
                <Input
                  color={materialTheme.COLORS.PRIMARY}
                  placeholder="Ville"
                  bgColor="transparent"
                  placeholderTextColor={materialTheme.COLORS.LIGHTGREY}
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
                    createAccount();
                  }}
                >
                  ENREGISTRER
                </Button>
              </Block>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Block>
    </View>
  );
};

export default Profil;

const styles = StyleSheet.create({
  signin: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
  },
  input: {
    width: width * 0.9,
    borderRadius: 3,
    borderBottomWidth: 1,
    borderColor: materialTheme.COLORS.LIGHTGREY,
    // borderBottomColor: materialTheme.COLORS.PRIMARY,
  },
});
