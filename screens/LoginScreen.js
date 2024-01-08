import { StyleSheet, Text, View, SafeAreaView, Pressable } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

const LoginScreen = () => {
    const authenticate = () => {

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