import React from "react";
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'; 
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AntDesign from '@expo/vector-icons/AntDesign';

import FormularioSolicitud from "./src/FormularioSolicitud";
import ListaSolicitudes from "./src/ListaSolicitudes";
import GraficoMandados from "./src/Grafico";
import GaleriaProductos from "./src/galeria";
import AcercaDeMandaditos from "./src/Bienvenida";

const Tab = createBottomTabNavigator();


const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#ffcccb', 
    primary: '#1e3264',    
  },
};

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#ff4d6d',     
        tabBarInactiveTintColor: '#b56a6a',  
        tabBarStyle: {
          backgroundColor: '#ffffff',         
          borderTopWidth: 0,                
          height: 60,
          paddingBottom: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'serif',              
        },
        headerStyle: {
          backgroundColor: '#ffffff',         
        },
        headerTitleStyle: {
          color: '#1e3264',                 
          fontFamily: 'serif',
          fontSize: 20,
        },
      }}
    >
      <Tab.Screen 
        name="Inicio" 
        component={AcercaDeMandaditos}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" size={size} color={color} />
          ),
        }}
      />
          <Tab.Screen 
        name="Nuevo" 
        component={FormularioSolicitud}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="pluscircleo" size={size} color={color} />
          ),
        }}
      />
       <Tab.Screen 
        name="Galería" 
        component={GaleriaProductos}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Gráficos" 
        component={GraficoMandados} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="barchart" size={size} color={color} />

          ),
        }}
      />
      <Tab.Screen 
        name="Solicitudes" 
        component={ListaSolicitudes} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="profile" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function Naveg() {
  return (
    <NavigationContainer theme={MyTheme}>
      <MyTabs />
    </NavigationContainer>
  );
}