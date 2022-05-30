import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import SignInScreen from "../SignIn";
import SignUpScreen from "../SignUp";
import UserProfil from "../UserProfil";
import Profil from "../Profil";
import MyModels from "../MyModels/MyModels";
import { LoadingScreen } from "../LoadingScreen";
import { QrCodeReader } from "../QrCodeReader";
import ModelDetail from "../ModelDetail";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppSelector } from "../../hooks/redux";
import { Conditions } from "../Information/Conditions";
import { APropos } from "../Information/APropos";
import { Protection } from "../Information/Protection";
import { Parameters } from "../Parameters";
import { Notifications } from "../Notifications";
import { SceneI } from "../ThreeJS/test/sceneCopy";
import { SceneAR } from '../ThreeJS/test/SceneAR'

const Stack = createStackNavigator();
const ModelStack = createStackNavigator();
const UserProfileStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const NavOptions = { headerShown: false, tabBarShowLabel: false };

const Blank = () => {
  return <></>;
};

const UserProfileNavigator = () => {
  return (
    <UserProfileStack.Navigator>
      <ModelStack.Screen
        name="UserProfil"
        component={UserProfil}
        options={{ headerShown: false }}
      />

      <ModelStack.Screen
        name="Parameters"
        component={Parameters}
        options={{ headerShown: false }}
      />

      <ModelStack.Screen
        name="Conditions"
        component={Conditions}
        options={{ headerShown: false }}
      />
      <ModelStack.Screen
        name="APropos"
        component={APropos}
        options={{ headerShown: false }}
      />
      <ModelStack.Screen
        name="Protection"
        component={Protection}
        options={{ headerShown: false }}
      />
      <ModelStack.Screen
        name="Notifications"
        component={Notifications}
        options={{ headerShown: false }}
      />
    </UserProfileStack.Navigator>
  );
};

const ModelNavigator = () => {
  return (
    <ModelStack.Navigator initialRouteName="Models">
      <ModelStack.Screen
        name="Models"
        component={MyModels}
        options={{ headerShown: false }}
      />
      <ModelStack.Screen
        name="ModelDetails"
        component={ModelDetail}
        options={{ headerShown: false }}
      />
      <ModelStack.Screen
        name="QrCodeReader"
        component={QrCodeReader}
        options={{ headerShown: false }}
      />

      <ModelStack.Screen
        name="Loader"
        component={LoadingScreen}
        options={{ headerShown: false }}
      />
      <ModelStack.Screen
        name="Scene"
        component={SceneI}
        options={{ headerShown: false }}
      />
      <ModelStack.Screen
        name='SceneAR'
        component={SceneAR}
        options={{headerShown: false}}
      />
    </ModelStack.Navigator>
  );
};

const Navigator = () => {
  const { access_token } = useAppSelector((state) => state.auth);
  console.log("Acces token", access_token);
  return (
    <>
      {access_token === null ? (
        <Stack.Navigator initialRouteName="SignIn">
          <Stack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{ title: "CONNEXION", headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{ title: "INSCRIPTION", headerShown: false }}
          />
          <Stack.Screen
            name="Profil"
            component={Profil}
            options={{ title: "PROFIL" }}
          />
        </Stack.Navigator>
      ) : (
        <Tab.Navigator initialRouteName="ModelNavigator">
          <Tab.Screen
            name="QrCodeReader"
            component={QrCodeReader}
            options={{
              ...NavOptions,
              tabBarIcon: ({ focused, color, size }) => (
                <MaterialCommunityIcons
                  name="barcode-scan"
                  style={{
                    borderTopWidth: focused ? 3 : 0,
                    borderTopColor: "#434B56",
                    paddingTop: focused ? 13 : 10,
                    marginTop: -10,
                    width: 40,
                    textAlign: "center",
                  }}
                  color={color}
                  size={size}
                />
              ),
            }}
          />

          <Tab.Screen
            name="ModelNavigator"
            component={ModelNavigator}
            options={{
              ...NavOptions,
              tabBarIcon: ({ focused, color, size }) => (
                <AntDesign
                  style={{
                    borderTopWidth: focused ? 3 : 0,
                    borderTopColor: "#434B56",
                    paddingTop: focused ? 13 : 10,
                    marginTop: -10,
                    width: 40,
                    textAlign: "center",
                  }}
                  name="appstore-o"
                  color={color}
                  size={size}
                />
              ),
            }}
          />

          <Tab.Screen
            name="Home3"
            component={SceneI}
            options={{
              ...NavOptions,
              tabBarIcon: ({ focused, color, size }) => (
                <AntDesign
                  style={{
                    borderTopWidth: focused ? 3 : 0,
                    borderTopColor: "#434B56",
                    paddingTop: focused ? 13 : 10,
                    marginTop: -10,
                    width: 40,
                    textAlign: "center",
                  }}
                  name="CodeSandbox"
                  color={color}
                  size={size}
                />
              ),
            }}
          />

          <Tab.Screen
            name="TabUserProfil"
            component={UserProfileNavigator}
            options={{
              ...NavOptions,
              tabBarIcon: ({ focused, color, size }) => (
                <AntDesign
                  style={{
                    borderTopWidth: focused ? 3 : 0,
                    borderTopColor: "#434B56",
                    paddingTop: focused ? 13 : 10,
                    marginTop: -10,
                    width: 40,
                    textAlign: "center",
                  }}
                  name="user"
                  color={color}
                  size={size}
                />
              ),
            }}
          />
        </Tab.Navigator>
      )}
    </>
  );
};

export default Navigator;
