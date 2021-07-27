import React from "react";

import { NavigationContainer } from "@react-navigation/native";

import { createStackNavigator } from "@react-navigation/stack";

import { Login } from "./pages/Login";
import { Main } from "./pages/Main";

const { Navigator, Screen } = createStackNavigator();

export function Routes() {
  return (
    <NavigationContainer>
      <Navigator>
        <Screen name="Login" component={Login} />
        <Screen name="Main" component={Main} />
      </Navigator>
    </NavigationContainer>
  );
}