import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { db } from '../firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export default function FormularioSolicitud() {
    const [nombreProducto, setNombreProducto] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [precioEstimado, setPrecioEstimado] = useState('');
    const [direccion, setDireccion] = useState('');
    const [imagenProducto, setImagenProducto] = useState(null);

    const seleccionarImagen = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permiso requerido", "Se necesita permiso para acceder a la galería");
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
            setImagenProducto(pickerResult.assets[0].uri);
            console.log("Imagen seleccionada URI:", pickerResult.assets[0].uri);
        } else {
            Alert.alert("Error", "No se seleccionó ninguna imagen.");
        }
    };

    const handleGuardar = async () => {
        if (!nombreProducto || !cantidad || !precioEstimado || !direccion || !imagenProducto) {
            Alert.alert("Error", "Por favor, complete todos los campos.");
            return;
        }

        try {
            await addDoc(collection(db, "solicitudes"), {
                nombreProducto,
                cantidad: parseInt(cantidad),
                precioEstimado: parseFloat(precioEstimado),
                direccion,
                imagenProducto,
                fechaSolicitud: Timestamp.now(),
            });
            Alert.alert("Éxito", "Solicitud guardada con éxito");

            setNombreProducto('');
            setCantidad('');
            setPrecioEstimado('');
            setDireccion('');
            setImagenProducto(null);
        } catch (error) {
            console.error("Error al guardar solicitud: ", error);
            Alert.alert("Error", "Error al guardar solicitud");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Agregar Nueva Solicitud</Text>
            
            <TouchableOpacity onPress={seleccionarImagen} style={styles.imageContainer}>
                <Text style={styles.imageText}>Seleccionar Imagen</Text>
            </TouchableOpacity>

            {imagenProducto && <Image source={{ uri: imagenProducto }} style={styles.imagePreview} />}

            <Text style={styles.label}>Nombre del Producto:</Text>
            <TextInput 
                style={styles.input}
                value={nombreProducto} 
                onChangeText={setNombreProducto} 
                placeholder="Nombre del producto" 
            />

            <Text style={styles.label}>Cantidad:</Text>
            <TextInput 
                style={styles.input}
                value={cantidad} 
                onChangeText={setCantidad} 
                placeholder="Cantidad" 
                keyboardType="numeric" 
            />

            <Text style={styles.label}>Tipo de Servicio:</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={precioEstimado}
                    onValueChange={(itemValue) => setPrecioEstimado(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Selecciona un tipo de servicio" value="" />
                    <Picker.Item label="Mandado Normal - 20" value="20" />
                    <Picker.Item label="Depósito - 30" value="30" />
                    <Picker.Item label="Viaje a Juigalpa - 400" value="400" />
                </Picker>
            </View>

            <Text style={styles.label}>Dirección de Entrega:</Text>
            <TextInput 
                style={styles.input}
                value={direccion} 
                onChangeText={setDireccion} 
                placeholder="Ingresa la dirección de entrega" 
            />

           
            <TouchableOpacity style={styles.customButton} onPress={handleGuardar}>
                <Text style={styles.customButtonText}>Guardar Solicitud</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#1e3264', 
        flexGrow: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffcccb', 
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: 'serif',
    },
    imageContainer: {
        width: 120,
        height: 120,
        alignSelf: 'center',
        marginBottom: 20,
        backgroundColor: '#d1e7dd',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderColor: '#ff9e9e',
        borderWidth: 1,
    },
    imageText: {
        color: '#1e3264', 
        fontFamily: 'serif',
        fontWeight: 'bold',
    },
    imagePreview: {
        width: '100%',
        height: 200,
        marginBottom: 15,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#ffcccb', 
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#ffcccb', 
        fontFamily: 'serif',
    },
    input: {
        height: 45,
        borderColor: '#ff9e9e', 
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#fffaf0', 
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ff9e9e',
        borderRadius: 8,
        marginBottom: 15,
        overflow: 'hidden',
    },
    picker: {
        height: 45,
        color: '#333333',
        backgroundColor: '#fffaf0', 
    },
    customButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: "#457b9d", 
         color: '#fff',
        fontWeight: 'bold'
    },
    customButtonText: {
        color: '#ffff', 
        fontSize: 18,
        fontWeight: 'bold',
    },
});
