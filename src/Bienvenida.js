import React from 'react';
import { View, Image,Text, StyleSheet } from 'react-native';

const AcercaDeMandaditos = () => {
    return (
        <View style={styles.container}>
            <Image 
                source={require('../assets/kiki3.jpg')} 
                style={styles.image}
            />
            <Text style={styles.title}>¿Quiénes Somos?</Text>
            <Text style={styles.description}>
                Bienvenidos a Mandaditos Kiki, tu servicio de entrega a domicilio confiable y rápido.
                Nos inspiramos en la dedicación de Kiki para hacer tus mandados con puntualidad y cariño.
        
            
            </Text>
            <Text style={styles.description}>
                Trabajamos todos los días de <Text style={styles.highlight}>8:00 AM a 8:00 PM</Text>, asegurándonos de que tus productos lleguen 
                justo a tiempo.
            </Text>
    
        </View>
    );
};

export default AcercaDeMandaditos;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1e3264',
        padding: 20,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffcccb',
        textAlign: 'center',
        fontFamily: 'serif',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#FFFFFF',
        textAlign: 'center',
        marginHorizontal: 20,
        lineHeight: 24,
        fontFamily: 'serif',
    },
});
