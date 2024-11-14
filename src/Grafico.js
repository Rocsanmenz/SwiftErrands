import React, { useEffect, useState, useRef } from 'react';
import { View, Alert, Text, Dimensions, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Importación actualizada
import { collection, getDocs } from 'firebase/firestore';
import { jsPDF } from 'jspdf';
import { captureRef } from 'react-native-view-shot';
import { db } from '../firebaseConfig';
import { BarChart } from 'react-native-chart-kit';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function GraficoMandados() {
    const [mandadosData, setMandadosData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState("todos"); // Estado para la opción de filtro seleccionada
    const chartRef = useRef(null);

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

                // Aplicar el filtro seleccionado
                let diasFiltrados;
                if (filtro === "masMandados") {
                    const maxMandados = Math.max(...Object.values(dias));
                    diasFiltrados = Object.keys(dias).reduce((result, dia) => {
                        if (dias[dia] === maxMandados) result[dia] = dias[dia];
                        return result;
                    }, {});
                } else if (filtro === "menosMandados") {
                    const minMandados = Math.min(...Object.values(dias));
                    diasFiltrados = Object.keys(dias).reduce((result, dia) => {
                        if (dias[dia] === minMandados) result[dia] = dias[dia];
                        return result;
                    }, {});
                } else {
                    diasFiltrados = dias;
                }

                setMandadosData({
                    labels: Object.keys(diasFiltrados),
                    datasets: [{ data: Object.values(diasFiltrados) }]
                });
            } catch (error) {
                console.error("Error al obtener datos de mandados: ", error);
            } finally {
                setLoading(false);
            }
        };

        obtenerDatos();
    }, [filtro]); // El efecto se ejecuta nuevamente cuando cambia el filtro

    const generarPDF = async () => {
        try {
            const uri = await captureRef(chartRef, {
                format: "png",
                quality: 1,
                width: 800,
                height: 600,
                scale: 3,
            });

            const doc = new jsPDF();
            doc.setFontSize(14);
            doc.text("Reporte De Mandados Por Día", 105, 10, { align: "center" });

            const chartImage = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            doc.addImage(`data:image/png;base64,${chartImage}`, "PNG", 15, 20, 180, 135);

            mandadosData.labels.forEach((label, index) => {
                const cantidad = mandadosData.datasets[0].data[index];
                doc.text(`${label}: ${cantidad} mandados`, 15, 160 + index * 10);
            });

            const pdfBase64 = doc.output('datauristring').split(',')[1];
            const fileUri = `${FileSystem.documentDirectory}reporte_mandados.pdf`;

            await FileSystem.writeAsStringAsync(fileUri, pdfBase64, {
                encoding: FileSystem.EncodingType.Base64,
            });
            await Sharing.shareAsync(fileUri);
        } catch (error) {
            console.error("Error al generar o compartir el PDF: ", error);
            Alert.alert('Error', 'No se pudo generar o compartir el PDF.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.container}>
                <Text style={styles.title}>Cantidad de Mandados por Día de la Semana</Text>

                {/* Menú desplegable para seleccionar el filtro */}
                <Picker
                    selectedValue={filtro}
                    style={styles.picker}
                    onValueChange={(itemValue) => setFiltro(itemValue)}
                >
                    <Picker.Item label="Todos los días" value="todos" />
                    <Picker.Item label="Días con más mandados" value="masMandados" />
                    <Picker.Item label="Días con menos mandados" value="menosMandados" />
                </Picker>

                {loading ? (
                    <ActivityIndicator size="large" color="#4A90E2" />
                ) : (
                    <BarChart
                        ref={chartRef}
                        data={mandadosData}
                        width={Dimensions.get('window').width - 20}
                        height={350}
                        fromZero={true}
                        showBarTops={true}
                        withInnerLines={false}
                        chartConfig={{
                            backgroundGradientFrom: "#ffffff",
                            backgroundGradientTo: "#ffffff",
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            barPercentage: 0.7,
                            style: {
                                paddingRight: 0,
                                paddingLeft: 0,
                                borderRadius: 10,
                            },
                            propsForBackgroundLines: {
                                color: "#B0B0B0"
                            },
                            propsForLabels: {
                                fontSize: 12,
                                fontWeight: 'bold',
                                rotation: 45,
                            },
                        }}
                        style={styles.chart}
                    />
                )}
            </View>
            <TouchableOpacity style={styles.pdfButton} onPress={generarPDF}>
                <Text style={styles.pdfButtonText}>Generar PDF</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 1,
        backgroundColor: '#FFFFFF',
        paddingBottom: 10,
    },
    container: {
        flex: 1,
        padding: 4,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#4A90E2',
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'serif',
    },
    picker: {
        height: 50,
        width: 250,
        marginBottom: 20,
    },
    chart: {
        borderRadius: 10,
        marginVertical: 10,
        backgroundColor: '#FFFFFF',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 6,
    },
    pdfButton: {
        backgroundColor: '#4A90E2',
        paddingVertical: 15,
        paddingHorizontal: 35,
        borderRadius: 25,
        alignItems: 'center',
        marginVertical: 20,
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    pdfButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});
