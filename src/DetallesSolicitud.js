import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function DetallesSolicitud({ route, navigation }) {
    // Verificamos que `route.params` exista y que `solicitudId` esté presente
    const { solicitudId } = route.params || {};
    const [solicitud, setSolicitud] = useState(null);

    useEffect(() => {
        if (solicitudId) {
            const cargarSolicitud = async () => {
                try {
                    const docRef = doc(db, "solicitudes", solicitudId);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        setSolicitud({ id: docSnap.id, ...docSnap.data() });
                    } else {
                        alert("No se encontró la solicitud");
                        navigation.goBack();
                    }
                } catch (error) {
                    console.error("Error al cargar la solicitud:", error);
                    alert("Error al cargar la solicitud");
                    navigation.goBack();
                }
            };

            cargarSolicitud();
        } else {
            alert("No se proporcionó un ID de solicitud válido");
            navigation.goBack();
        }
    }, [solicitudId]);

    const handleActualizar = async () => {
        try {
            const docRef = doc(db, "solicitudes", solicitudId);
            await updateDoc(docRef, solicitud);
            alert("Solicitud actualizada");
        } catch (error) {
            console.error("Error al actualizar la solicitud:", error);
            alert("Error al actualizar la solicitud");
        }
    };

    const handleEliminar = async () => {
        try {
            const docRef = doc(db, "solicitudes", solicitudId);
            await deleteDoc(docRef);
            alert("Solicitud eliminada");
            navigation.goBack();
        } catch (error) {
            console.error("Error al eliminar la solicitud:", error);
            alert("Error al eliminar la solicitud");
        }
    };

    if (!solicitud) {
        return <Text>Cargando...</Text>;
    }

    return (
        <View>
            <Text>Nombre del Producto:</Text>
            <TextInput 
                value={solicitud.nombreProducto} 
                onChangeText={(text) => setSolicitud({ ...solicitud, nombreProducto: text })} 
            />

            <Text>Cantidad:</Text>
            <TextInput 
                value={solicitud.cantidad.toString()} 
                onChangeText={(text) => setSolicitud({ ...solicitud, cantidad: parseInt(text) })} 
                keyboardType="numeric" 
            />

            <Text>Precio Estimado:</Text>
            <TextInput 
                value={solicitud.precioEstimado.toString()} 
                onChangeText={(text) => setSolicitud({ ...solicitud, precioEstimado: parseFloat(text) })} 
                keyboardType="numeric" 
            />

            <Text>URL Imagen del Producto:</Text>
            <TextInput 
                value={solicitud.imagenProducto} 
                onChangeText={(text) => setSolicitud({ ...solicitud, imagenProducto: text })} 
            />

            <Button title="Actualizar Solicitud" onPress={handleActualizar} />
            <Button title="Eliminar Solicitud" onPress={handleEliminar} />
        </View>
    );
}
