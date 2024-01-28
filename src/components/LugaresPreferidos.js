import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native";
import { doc } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDoc } from "firebase/firestore";
import { firebaseConfig } from "../../firebaseConfig";
import { Avatar } from "@rneui/themed";

const LugaresPreferidos = (props) =>{
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const lugares = props.lugaresPreferidos;
    const [objetosLugares, setObjetosLugares] = useState([]);

    useEffect(() => {
        if (lugares) {
          
            const pegaLugar = async () =>{
                const lugaresData = await Promise.all(
                    lugares.map(async (lugar) => {
                      const documentRef = doc(db, 'lugares', lugar);
                      const documentSnapshot = await getDoc(documentRef);
                      const data = documentSnapshot.data();
                      return data;
                    })
                );
                    
                setObjetosLugares(lugaresData);    
            }
    
            pegaLugar();

        }
    }, [lugares]);

    return(
        <View style={styles.container}>
            {
                objetosLugares.map((lugar, index) =>
                    <View style={styles.role}>
                        <Avatar
                            size="large"
                            rounded
                            source={{ uri: lugar.imagens[0]}}
                            containerStyle={styles.avatarContainer}
                        />
                            <View style={styles.info} >
                                <Text style={styles.infoText}>Nome: {lugar.nome}</Text>
                            </View>
                    </View>
                )
            }  
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'orange',
    },
    info: {
        paddingHorizontal: 20,
    },
    infoText: {
        marginBottom: 10,
    },
    role:{
        flex: 1,
        flexDirection: 'row',
        marginTop: 20,
        backgroundColor: 'orange',
    },
})

export default LugaresPreferidos;