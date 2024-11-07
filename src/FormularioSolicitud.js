import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { db } from '../firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export default function FormularioSolicitud() {
    const [nombreProducto, setNombreProducto] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [precioEstimado, setPrecioEstimado] = useState('');
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
            setImagenProducto(pickerResult.assets[0].uri); // Almacena la URI de la imagen seleccionada
            console.log("Imagen seleccionada URI:", pickerResult.assets[0].uri);
        } else {
            Alert.alert("Error", "No se seleccionó ninguna imagen.");
        }
    };

    const handleGuardar = async () => {
        if (!nombreProducto || !cantidad || !precioEstimado || !imagenProducto) {
            Alert.alert("Error", "Por favor, complete todos los campos.");
            return;
        }

        try {
            await addDoc(collection(db, "solicitudes"), {
                nombreProducto,
                cantidad: parseInt(cantidad),
                precioEstimado: parseFloat(precioEstimado),
                imagenProducto, // Guardar la URI de la imagen
                fechaSolicitud: Timestamp.now(),
            });
            Alert.alert("Éxito", "Solicitud guardada con éxito");

            // Limpiar los campos después de guardar
            setNombreProducto('');
            setCantidad('');
            setPrecioEstimado('');
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
            
            {/* Vista previa de la imagen seleccionada */}
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

            <Text style={styles.label}>Precio Estimado:</Text>
            <TextInput 
                style={styles.input}
                value={precioEstimado} 
                onChangeText={setPrecioEstimado} 
                placeholder="Precio estimado" 
                keyboardType="numeric" 
            />

            <View style={styles.buttonContainer}>
                <Button title="Guardar Solicitud" onPress={handleGuardar} color="#457b9d" />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#1e3264', // Azul oscuro de fondo para una apariencia nocturna
        flexGrow: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffcccb', // Rosa suave inspirado en el lazo de Kiki
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
        borderColor: '#ff9e9e', // Rosa claro alrededor de la imagen
        borderWidth: 1,
    },
    imageText: {
        color: '#1e3264', // Azul oscuro para el texto del botón de imagen
        fontFamily: 'serif',
        fontWeight: 'bold',
    },
    imagePreview: {
        width: '100%',
        height: 200,
        marginBottom: 15,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#ffcccb', // Borde rosa suave
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#ffcccb', // Rosa suave para las etiquetas
        fontFamily: 'serif',
    },
    input: {
        height: 45,
        borderColor: '#ff9e9e', // Rosa claro para el borde de los inputs
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#fffaf0', // Fondo cálido
    },
    buttonContainer: {
        marginTop: 20,
    },
});
