import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Modal } from 'react-native';
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
        marginTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffcccb', // Rosa inspirado en Kiki's Delivery Service
        marginBottom: 15,
        textAlign: 'center',
        fontFamily: 'serif',
    },
    card: {
        flex: 1,
        margin: 10,
        backgroundColor: '#F8F8F8',
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FF0000', // Color rojo predominante para Mandaditos
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginBottom: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
    },
    info: {
        fontSize: 14,
        color: '#666666',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#FF0000',
        fontWeight: 'bold',
    },
    fullImage: {
        width: '80%',
        height: '50%',
        resizeMode: 'contain',
        borderRadius: 10,
    },
    modalName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffcccb', // Rosa suave
        marginTop: 20,
    },
    modalInfo: {
        fontSize: 18,
        color: '#FFFFFF',
        marginTop: 5,
    },
});
