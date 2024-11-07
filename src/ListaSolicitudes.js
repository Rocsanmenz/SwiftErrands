import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, TextInput, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { db } from '../firebaseConfig';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';

export default function ListaSolicitudes() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nombreProducto, setNombreProducto] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [precioEstimado, setPrecioEstimado] = useState('');
    const [imagenProducto, setImagenProducto] = useState(null);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        cargarSolicitudes();
    }, []);

    const cargarSolicitudes = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "solicitudes"));
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log("Datos cargados desde Firestore:", data); // Verifica los datos recibidos
            setSolicitudes(data);
        } catch (error) {
            console.error("Error al cargar las solicitudes: ", error);
        }
        setLoading(false);
    };

    const handleGuardar = async () => {
        if (nombreProducto === '' || cantidad === '' || precioEstimado === '') {
            Alert.alert("Error", "Por favor, complete todos los campos.");
            return;
        }

        try {
            if (editingId) {
                const solicitudRef = doc(db, "solicitudes", editingId);
                await updateDoc(solicitudRef, {
                    nombreProducto: nombreProducto,
                    cantidad: parseInt(cantidad),
                    precioEstimado: parseFloat(precioEstimado),
                    imagenProducto: imagenProducto
                });
                Alert.alert("Éxito", "Solicitud actualizada con éxito");
            } else {
                await addDoc(collection(db, "solicitudes"), {
                    nombreProducto: nombreProducto,
                    cantidad: parseInt(cantidad),
                    precioEstimado: parseFloat(precioEstimado),
                    imagenProducto: imagenProducto,
                    fechaSolicitud: Timestamp.now()
                });
                Alert.alert("Éxito", "Solicitud guardada con éxito");
            }
            limpiarFormulario();
            cargarSolicitudes();
        } catch (error) {
            console.error("Error al guardar solicitud: ", error);
            Alert.alert("Error", "Error al guardar solicitud");
        }
    };

    const handleEditar = (item) => {
        setEditingId(item.id);
        setNombreProducto(item.nombreProducto || '');
        setCantidad(item.cantidad ? item.cantidad.toString() : '');
        setPrecioEstimado(item.precioEstimado ? item.precioEstimado.toString() : '');
        setImagenProducto(item.imagenProducto);
    };

    const handleEliminar = async (id) => {
        Alert.alert(
            "Confirmación",
            "¿Estás seguro de que deseas eliminar esta solicitud?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    onPress: async () => {
                        await deleteDoc(doc(db, "solicitudes", id));
                        Alert.alert("Eliminado", "Solicitud eliminada con éxito");
                        cargarSolicitudes();
                    }
                }
            ]
        );
    };

    const limpiarFormulario = () => {
        setNombreProducto('');
        setCantidad('');
        setPrecioEstimado('');
        setImagenProducto(null);
        setEditingId(null);
    };

    const seleccionarImagen = async () => {
        let result = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (result.status !== 'granted') {
            Alert.alert("Permiso requerido", "Se necesita permiso para acceder a la galería");
            return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!pickerResult.canceled) {
            setImagenProducto(pickerResult.uri);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{editingId ? "Editar Solicitud" : "Nueva Solicitud"}</Text>

            <TextInput
                style={styles.input}
                placeholder="Nombre del producto"
                value={nombreProducto}
                onChangeText={setNombreProducto}
            />
            <TextInput
                style={styles.input}
                placeholder="Cantidad"
                keyboardType="numeric"
                value={cantidad}
                onChangeText={setCantidad}
            />
            <TextInput
                style={styles.input}
                placeholder="Precio estimado"
                keyboardType="numeric"
                value={precioEstimado}
                onChangeText={setPrecioEstimado}
            />

            <Button title="Seleccionar Imagen" onPress={seleccionarImagen} color="#841584" />
            {imagenProducto && (
                <Image source={{ uri: imagenProducto }} style={styles.imagePreview} />
            )}

            <Button title={editingId ? "Actualizar Solicitud" : "Guardar Solicitud"} onPress={handleGuardar} color="#841584" />
            {editingId && <Button title="Cancelar Edición" onPress={limpiarFormulario} color="#d9534f" />}

            <Text style={styles.listHeader}>Solicitudes Guardadas</Text>
            <FlatList
                data={solicitudes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        {item.imagenProducto && (
                            <Image source={{ uri: item.imagenProducto }} style={styles.imageInList} />
                        )}
                        <View style={styles.itemTextContainer}>
                            <Text style={styles.itemText}>{item.nombreProducto || 'Sin nombre'}</Text>
                            <Text style={styles.itemSubtitle}>
                                Cantidad: {item.cantidad || 'N/A'} | Precio: ${item.precioEstimado || 'N/A'}
                            </Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.editButton} onPress={() => handleEditar(item)}>
                                <Text style={styles.buttonText}>Editar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.deleteButton} onPress={() => handleEliminar(item.id)}>
                                <Text style={styles.buttonText}>Eliminar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#1e3264', // Azul oscuro como el cielo nocturno en el fondo
        flex: 1,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#ffcccb', // Rosa suave inspirado en el lazo rojo de Kiki
        textAlign: 'center',
        fontFamily: 'serif', // Familia de fuentes para darle un toque más clásico y cálido
    },
    input: {
        height: 45,
        borderColor: '#ff9e9e', // Rosa claro para el borde de los inputs
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#fffaf0', // Blanco cálido que imita un estilo acogedor
    },
    imagePreview: {
        width: 100,
        height: 100,
        marginVertical: 10,
        borderRadius: 10,
        alignSelf: 'center',
        borderColor: '#ffcccb', // Rosa claro alrededor de la imagen
        borderWidth: 2,
    },
    listHeader: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffcccb', // Misma tonalidad que el header
        marginTop: 20,
        textAlign: 'center',
        fontFamily: 'serif',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fffaf0', // Fondo cálido de la tarjeta, evocando un estilo hogareño
        borderRadius: 10,
        marginVertical: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    itemTextContainer: {
        flex: 1,
        marginLeft: 10,
    },
    itemText: {
        fontSize: 18,
        color: '#3c3c3c', // Color oscuro para el texto, similar a la simplicidad de los colores en el anime
        fontWeight: 'bold',
        fontFamily: 'serif',
    },
    itemSubtitle: {
        fontSize: 16,
        color: '#646464', // Gris para el subtítulo
        fontFamily: 'serif',
    },
    imageInList: {
        width: 50,
        height: 50,
        borderRadius: 8,
        borderColor: '#ffcccb',
        borderWidth: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    deleteButton: {
        backgroundColor: '#e63946', // Rojo oscuro para el botón de eliminar
        padding: 10,
        borderRadius: 8,
        marginLeft: 5,
    },
    editButton: {
        backgroundColor: '#457b9d', // Azul pastel inspirado en los tonos de Ghibli
        padding: 10,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontFamily: 'serif',
    },
    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
