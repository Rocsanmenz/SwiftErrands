// Importación de los módulos necesarios
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD_WzDxzb6uAfGrENYkNyTBBClBs1tm09Q",
  authDomain: "swifterrandsmovil.firebaseapp.com",
  projectId: "swifterrandsmovil",
  storageBucket: "swifterrandsmovil.firebasestorage.app",
  messagingSenderId: "286520854603",
  appId: "1:286520854603:web:fd8fd5238727ea708ae5ce"
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);

// Inicialización de Firestore
const db = getFirestore(app);

const storage = getStorage(app);

// Exportación de Firestore
export default db;


export { db, storage};
