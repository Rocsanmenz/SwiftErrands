import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Modal } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';

const GaleriaProductos = () => {
    const [productos, setProductos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProducto, setSelectedProducto] = useState(null);

    // Escuchar los cambios en tiempo real
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'solicitudes'), (snapshot) => {
            const listaProductos = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setProductos(listaProductos);
            console.log("Datos actualizados desde Firestore:", listaProductos);
        });

        // Desuscribirse para evitar fugas de memoria
        return () => unsubscribe();
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
                numColumns={2}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => openModal(item)} style={styles.card}>
                        {item.imagenProducto ? (
                            <Image source={{ uri: item.imagenProducto }} style={styles.image} />
                        ) : (
                            <Text style={styles.noImageText}>Sin imagen</Text>
                        )}
                        <Text style={styles.name}>{item.nombreProducto}</Text>
                        <Text style={styles.info}>Cantidad: {item.cantidad}</Text>
                        <Text style={styles.info}>Precio Estimado: C${item.precioEstimado}</Text>
                        <Text style={styles.info}>Dirección: {item.direccion}</Text>
                    </TouchableOpacity>
                )}
            />

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
                        {selectedProducto.imagenProducto ? (
                            <Image
                                source={{ uri: selectedProducto.imagenProducto }}
                                style={styles.fullImage}
                            />
                        ) : (
                            <Text style={styles.modalNoImageText}>Sin imagen disponible</Text>
                        )}
                        <Text style={styles.modalName}>{selectedProducto.nombreProducto}</Text>
                        <Text style={styles.modalInfo}>Cantidad: {selectedProducto.cantidad}</Text>
                        <Text style={styles.modalInfo}>
                            Precio Estimado: C${selectedProducto.precioEstimado}
                        </Text>
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
        backgroundColor: '#1e3264',
        paddingTop: 20,
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#ffcccb',
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
        borderColor: '#FF6B6B',
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
    noImageText: {
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
        marginVertical: 10,
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
        marginVertical: 2,
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
    modalNoImageText: {
        fontSize: 18,
        color: '#FFFFFF',
        marginBottom: 10,
        textAlign: 'center',
    },
});
