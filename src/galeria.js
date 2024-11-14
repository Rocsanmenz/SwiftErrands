import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const GaleriaProductos = () => {
    const [productos, setProductos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProducto, setSelectedProducto] = useState(null);

    // Función para cargar los productos desde Firestore
    const cargarProductos = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'solicitudes'));
            const listaProductos = [];
            querySnapshot.forEach((doc) => {
                listaProductos.push({ id: doc.id, ...doc.data() });
            });
            setProductos(listaProductos);
            console.log("Datos cargados desde Firestore:", listaProductos);
        } catch (error) {
            console.error("Error al cargar los productos:", error);
        }
    };

    useEffect(() => {
        cargarProductos();
    }, []);

    const openModal = (producto) => {
        setSelectedProducto(producto);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedProducto(null);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mandaditos</Text>
            <FlatList
                data={productos}
                keyExtractor={(item) => item.id}
                numColumns={2} // Número de columnas para ver las tarjetas en cuadrícula
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => openModal(item)} style={styles.card}>
                        <Image source={{ uri: item.imagenProducto }} style={styles.image} />
                        <Text style={styles.name}>{item.nombreProducto}</Text>
                        <Text style={styles.info}>Cantidad: {item.cantidad}</Text>
                        <Text style={styles.info}>Precio Estimado: C${item.precioEstimado}</Text>
                        <Text style={styles.info}>Dirección: {item.direccion}</Text>
                    </TouchableOpacity>
                )}
            />

            {/* Modal para ver los detalles del producto en grande */}
            {selectedProducto && (
                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalContainer}>
                        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                            <Text style={styles.closeButtonText}>Cerrar</Text>
                        </TouchableOpacity>
                        <Image source={{ uri: selectedProducto.imagenProducto }} style={styles.fullImage} />
                        <Text style={styles.modalName}>{selectedProducto.nombreProducto}</Text>
                        <Text style={styles.modalInfo}>Cantidad: {selectedProducto.cantidad}</Text>
                        <Text style={styles.modalInfo}>Precio Estimado: C${selectedProducto.precioEstimado}</Text>
                        <Text style={styles.modalInfo}>Dirección: {selectedProducto.direccion}</Text>
                    </View>
                </Modal>
            )}
        </View>
    );
};

export default GaleriaProductos;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e3264', // Azul oscuro de fondo
        paddingTop: 20,
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#ffcccb', // Rosa inspirado en Kiki's Delivery Service
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: 'serif',
    },
    card: {
        flex: 1,
        margin: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 10,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#FF6B6B', // Color rojo predominante para Mandaditos
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    image: {
        width: 90,
        height: 90,
        borderRadius: 8,
        marginBottom: 10,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        textAlign: 'center',
        marginBottom: 6,
    },
    info: {
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
        marginVertical: 2, // Espacio entre líneas de información
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        padding: 10,
        backgroundColor: '#FF6B6B',
        borderRadius: 8,
    },
    closeButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    fullImage: {
        width: '80%',
        height: '50%',
        resizeMode: 'contain',
        borderRadius: 10,
        marginBottom: 15,
    },
    modalName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffcccb',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalInfo: {
        fontSize: 18,
        color: '#FFFFFF',
        marginTop: 5,
        textAlign: 'center',
    },
});
