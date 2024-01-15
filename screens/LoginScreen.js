import { StyleSheet, Text, View, SafeAreaView, Pressable } from 'react-native';
import React, { useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import * as AppAuth from "expo-app-auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


const LoginScreen = () => {
    const navigation = useNavigation();
    useEffect(() => {
        const checkTokenValidity = async () => {
            const accessToken = await AsyncStorage.getItem("token");
            const expirationDate = await AsyncStorage.getItem("expirationDate");
            console.log("access token", accessToken);
            console.log("expiration date", expirationDate);

            if (accessToken && expirationDate) {
                const currentTime = Date.now();
                if (currentTime < parseInt(expirationDate)) {
                    // ici si le token est valide
                    navigation.replace("Main");
                } else {
                    // ici si le token n'est pas valide
                    AsyncStorage.removeItem("token");
                    AsyncStorage.removeItem("expirationDate");
                }
            }
        }

        checkTokenValidity();
    }, [])
    async function authenticate() {
        const config = {
            issuer: "https://accounts.spotify.com",
            clientId: "8a867a11dbeb41f4ab9199dcff1688ff",
            scoped: [
                "user-read-email",
                "user-library-read",
                "user-read-recently-played",
                "user-top-read",
                "playlist-read-private",
                "playlist-read-collaborative",
                "playlist-modify-public" // ou playlist-modify-private
            ],
            redirectUrl: "exp://192.168.228.47:8081"
        }
        const result = await AppAuth.authAsync(config);
        console.log(result);
        if (result.accessToken) {
            const expirationDate = new Date(accessTokenExpirationDate).getTime();
            AsyncStorage.setItem("token", result.accessToken);
            AsyncStorage.setItem("expirationDate", expirationDate.toString());
            navigation.navigate("Main")
        }
    }
    return (
        <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
            <SafeAreaView>
                <View>
                    <Entypo style={{ textAlign: "center", top: 50 }} name="spotify" size={80} color="white" />
                    <Text style={{ color: "white", fontSize: 40, fontWeight: "bold", textAlign: "center", top: 60, marginLeft: 40, marginRight: 40 }}>Des Millions de titres sur Spotify!</Text>
                </View>
                <View>
                    <Pressable
                        onPress={authenticate}
                        style={{
                            backgroundColor: "#1DB954",
                            padding: 10,
                            marginVertical: 10,
                            marginLeft: "auto",
                            marginRight: "auto",
                            width: 300,
                            borderRadius: 25,
                            alignItems: "center",
                            justifyContent: "center",
                            top: 125
                        }}>
                        <Text>Se connecter avec Spotify</Text>
                    </Pressable>
                    <Pressable
                        style={{
                            backgroundColor: "#131624",
                            padding: 10,
                            marginVertical: 10,
                            marginLeft: "auto",
                            marginRight: "auto",
                            width: 300,
                            borderRadius: 25,
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "row",
                            top: 125,
                            borderColor: "#C0C0C0",
                            borderWidth: 0.8
                        }}
                    >
                        <MaterialIcons name="phone-android" size={24} color="white" />
                        <Text style={{ color: "white", textAlign: "center", flex: 1 }}>Continuer avec son numéro de téléphone</Text>
                    </Pressable>
                    <Pressable
                        style={{
                            backgroundColor: "#131624",
                            padding: 10,
                            marginVertical: 10,
                            marginLeft: "auto",
                            marginRight: "auto",
                            width: 300,
                            borderRadius: 25,
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "row",
                            top: 125,
                            borderColor: "#C0C0C0",
                            borderWidth: 0.8
                        }}
                    >
                        <AntDesign name="google" size={24} color="red" />
                        <Text style={{ color: "white", textAlign: "center", flex: 1 }}>Continuer avec son compte Google</Text>
                    </Pressable>
                    <Pressable
                        style={{
                            backgroundColor: "#131624",
                            padding: 10,
                            marginVertical: 10,
                            marginLeft: "auto",
                            marginRight: "auto",
                            width: 300,
                            borderRadius: 25,
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "row",
                            top: 125,
                            borderColor: "#C0C0C0",
                            borderWidth: 0.8
                        }}
                    >
                        <FontAwesome5 name="facebook" size={24} color="lightblue" />
                        <Text style={{ color: "white", textAlign: "center", flex: 1 }}>Se connecter avec Facebook</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </LinearGradient >

    )
}

export default LoginScreen;

const styles = StyleSheet.create({})