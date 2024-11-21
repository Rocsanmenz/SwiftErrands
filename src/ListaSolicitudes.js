import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, TextInput, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function ListaSolicitudes() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nombreProducto, setNombreProducto] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [precioEstimado, setPrecioEstimado] = useState('');
    const [direccion, setDireccion] = useState('');
    const [imagenProducto, setImagenProducto] = useState(null);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "solicitudes"), (snapshot) => {
            const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setSolicitudes(data);
            setLoading(false);
        });

        return () => unsubscribe(); // Desuscribirse al desmontar el componente
    }, []);

    const handleGuardar = async () => {
        if (!nombreProducto || !cantidad || !precioEstimado || !direccion) {
            Alert.alert("Error", "Por favor, complete todos los campos.");
            return;
        }

        try {
            if (editingId) {
                const solicitudRef = doc(db, "solicitudes", editingId);
                const updatedData = {
                    nombreProducto,
                    cantidad: parseInt(cantidad),
                    precioEstimado: parseFloat(precioEstimado),
                    direccion,
                    imagenProducto: imagenProducto || "",
                };
                await updateDoc(solicitudRef, updatedData);
                Alert.alert("Éxito", "Solicitud actualizada con éxito");
            } else {
                await addDoc(collection(db, "solicitudes"), {
                    nombreProducto,
                    cantidad: parseInt(cantidad),
                    precioEstimado: parseFloat(precioEstimado),
                    direccion,
                    imagenProducto: imagenProducto || "",
                    fechaSolicitud: Timestamp.now(),
                });
                Alert.alert("Éxito", "Solicitud guardada con éxito");
            }
            limpiarFormulario();
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
        setDireccion(item.direccion || '');
        setImagenProducto(item.imagenProducto || null);
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
                    },
                },
            ]
        );
    };

    const limpiarFormulario = () => {
        setNombreProducto('');
        setCantidad('');
        setPrecioEstimado('');
        setDireccion('');
        setImagenProducto(null);
        setEditingId(null);
    };

    const seleccionarImagen = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImagenProducto(result.assets[0].uri);
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

            <TextInput
                style={styles.input}
                placeholder="Dirección"
                value={direccion}
                onChangeText={setDireccion}
            />

            <TouchableOpacity onPress={seleccionarImagen} style={styles.imageButton}>
                <Text style={styles.imageButtonText}>Seleccionar Imagen</Text>
            </TouchableOpacity>
            {imagenProducto ? (
                <Image source={{ uri: imagenProducto }} style={styles.imagePreview} />
            ) : (
                <Text style={styles.noImageText}>Sin imagen seleccionada</Text>
            )}

            <TouchableOpacity style={styles.saveButton} onPress={handleGuardar}>
                <Text style={styles.saveButtonText}>{editingId ? "Actualizar Solicitud" : "Guardar Solicitud"}</Text>
            </TouchableOpacity>
            {editingId && (
                <TouchableOpacity style={styles.cancelButton} onPress={limpiarFormulario}>
                    <Text style={styles.cancelButtonText}>Cancelar Edición</Text>
                </TouchableOpacity>
            )}

            <Text style={styles.listHeader}>Solicitudes Guardadas</Text>
            <FlatList
                data={solicitudes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        {item.imagenProducto ? (
                            <Image source={{ uri: item.imagenProducto }} style={styles.imageInList} />
                        ) : (
                            <Text style={styles.noImageText}>Sin imagen</Text>
                        )}
                        <View style={styles.itemTextContainer}>
                            <Text style={styles.itemText}>{item.nombreProducto || 'Sin nombre'}</Text>
                            <Text style={styles.itemSubtitle}>
                                Cantidad: {item.cantidad || 'N/A'} | Precio: C${item.precioEstimado || 'N/A'}
                            </Text>
                            <Text style={styles.itemSubtitle}>Dirección: {item.direccion || 'Sin dirección'}</Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={() => handleEditar(item)}>
                                <AntDesign name="edit" size={24} color="#4CAF50" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleEliminar(item.id)}>
                                <AntDesign name="delete" size={24} color="#f44336" />
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
        backgroundColor: '#1e3264',
        flex: 1,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#ffcccb',
        textAlign: 'center',
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
    },
    imageButton: {
        backgroundColor: '#ff9e9e',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    imageButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    imagePreview: {
        width: 100,
        height: 100,
        marginVertical: 10,
        borderRadius: 10,
        alignSelf: 'center',
    },
    noImageText: {
        fontSize: 14,
        color: '#999',
        fontStyle: 'italic',
        alignSelf: 'center',
    },
    saveButton: {
        backgroundColor: '#457b9d',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#d9534f',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    cancelButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    listHeader: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffcccb',
        marginTop: 20,
        textAlign: 'center',
        fontFamily: 'serif',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fffaf0',
        borderRadius: 10,
        marginVertical: 8,
        shadowColor: '#000',
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
        color: '#3c3c3c',
        fontWeight: 'bold',
        fontFamily: 'serif',
    },
    itemSubtitle: {
        fontSize: 16,
        color: '#646464',
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
        justifyContent: 'flex-end',
    },
    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
