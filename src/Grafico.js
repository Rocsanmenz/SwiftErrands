import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, ActivityIndicator } from 'react-native';
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
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>
                Cantidad de Mandados por Día de la Semana
            </Text>
            {loading ? (
                <ActivityIndicator size="large" color="#841584" />
            ) : (
                <BarChart
                    data={mandadosData}
                    width={Dimensions.get('window').width - 40}
                    height={220}
                    fromZero={true}
                    chartConfig={{
                        backgroundGradientFrom: "#ffffff",
                        backgroundGradientTo: "#ffffff",
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(131, 90, 241, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    style={{ borderRadius: 10 }}
                />
            )}
        </View>
    );
}
