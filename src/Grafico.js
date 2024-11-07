import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { BarChart } from 'react-native-chart-kit';

export default function GraficoMandados() {
    const [mandadosData, setMandadosData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'solicitudes'));
                const dias = { 'Lunes': 0, 'Martes': 0, 'Miércoles': 0, 'Jueves': 0, 'Viernes': 0, 'Sábado': 0, 'Domingo': 0 };

                snapshot.forEach((doc) => {
                    const fecha = doc.data().fechaSolicitud.toDate();
                    const diaSemana = fecha.toLocaleDateString('es-ES', { weekday: 'long' });
                    dias[diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)] += 1;
                });

                setMandadosData({
                    labels: Object.keys(dias),
                    datasets: [{ data: Object.values(dias) }]
                });
            } catch (error) {
                console.error("Error al obtener datos de mandados: ", error);
            } finally {
                setLoading(false);
            }
        };

        obtenerDatos();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.container}>
                <Text style={styles.title}>Cantidad de Mandados por Día de la Semana</Text>
                {loading ? (
                    <ActivityIndicator size="large" color="#FF6B6B" />
                ) : (
                    <BarChart
                        data={mandadosData}
                        width={Dimensions.get('window').width - 40}
                        height={550}
                        fromZero={true}
                        showBarTops={true}
                        chartConfig={{
                            backgroundGradientFrom: "#ffffff",
                            backgroundGradientTo: "#ffffff",
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(255, 87, 51, ${opacity})`, // Rojo anaranjado
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            propsForLabels: {
                                fontSize: 10,
                                fontWeight: 'bold',
                                rotation: 60 // Rotar etiquetas para mejor visibilidad
                            },
                            style: {
                                borderRadius: 9
                            },
                            propsForBackgroundLines: {
                                color: "#E0E0E0" // Gris claro para líneas de fondo
                            }
                        }}
                        style={styles.chart}
                    />
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 1,
        backgroundColor: '#FFFFFF', // Fondo blanco
        paddingBottom: 10, // Espacio al final para permitir scroll completo
    },
    container: {
        flex: 1,
        padding: 9,
        backgroundColor: '#FFFFFF', // Fondo blanco para el contenedor
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FF6B6B',
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'serif',
    },
    chart: {
        borderRadius: 10,
        padding: 12,
        marginVertical: 20,
        backgroundColor: '#FFFFFF', // Fondo blanco en el gráfico
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 6,
    },
});
