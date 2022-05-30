import React, { useState } from "react";
import { Platform, StatusBar } from "react-native";
import AppLoading from "expo-app-loading";
import { Block, GalioProvider } from "galio-framework";
import { NavigationContainer } from "@react-navigation/native";
import store from "./store/store";
import { Provider } from "react-redux";
import Toast from "react-native-toast-message";
import Navigator from "./screens/navigation/navigator";
import { materialTheme } from "./constants";

console.disableYellowBox = true;

// Before rendering any navigation stack
import { enableScreens } from "react-native-screens";
enableScreens();

const App = () => {
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  if (!isLoadingComplete) {
    return (
      <AppLoading
        startAsync={true}
        onError={(err) => console.warn(err)}
        onFinish={() => setIsLoadingComplete(true)}
      />
    );
  } else {
    return (
      <>
        <Provider store={store}>
          <NavigationContainer>
            <GalioProvider theme={materialTheme}>
              <Block flex>
                {Platform.OS === "ios" && <StatusBar barStyle="default" />}
                <Navigator />
              </Block>
            </GalioProvider>
          </NavigationContainer>
        </Provider>
        <Toast />
      </>
    );
  }
};

export default App;
