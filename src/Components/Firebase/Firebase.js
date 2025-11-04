
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider } from "firebase/auth"; 
import {getStorage} from 'firebase/storage'
import { collection, getDocs, getFirestore } from "firebase/firestore"; 


const firebaseConfig = {
  apiKey: "AIzaSyCvR2iHjEqluhcCXkOKoYExPu8nZd-QVzE",
  authDomain: "olx-clone-cabb7.firebaseapp.com",
  projectId: "olx-clone-cabb7",
  storageBucket: "olx-clone-cabb7.firebasestorage.app",
  messagingSenderId: "413604950753",
  appId: "1:413604950753:web:214204bf5b5f597fa4fda0"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);
const fireStore = getFirestore(app);


const fetchFromFirestore = async () => {
    try {
      const productsCollection = collection(fireStore, 'products');
      const productSnapshot = await getDocs(productsCollection);
      const productList = productSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) 
      console.log("Fetched products from Firestore:", productList);
      return productList;
    } catch (error) {
      console.error("Error fetching products from Firestore:", error);
      return [];
    }
  };
  

  export {
    auth,
    provider,
    storage,
    fireStore,
    fetchFromFirestore
  }

