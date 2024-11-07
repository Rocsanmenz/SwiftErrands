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

// Definimos un tema personalizado con colores rosas para el fondo y elementos activos.
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#ffcccb', // Fondo rosa suave inspirado en el lazo de Kiki
    primary: '#1e3264',    // Azul oscuro para resaltar elementos
    
  },
};

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#ff4d6d',     // Rosa fuerte para el ícono activo
        tabBarInactiveTintColor: '#b56a6a',   // Rosa más suave para íconos inactivos
        tabBarStyle: {
          backgroundColor: '#ffcccb',         // Fondo de la barra de pestañas en rosa suave
          borderTopWidth: 0,                  // Sin borde superior para un estilo limpio
          height: 60,
          paddingBottom: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'serif',               // Tipografía serif para un toque clásico
        },
        headerStyle: {
          backgroundColor: '#ffcccb',         // Fondo del encabezado en rosa suave
        },
        headerTitleStyle: {
          color: '#1e3264',                  // Color del texto del encabezado en azul oscuro
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
