import { StyleSheet, Text, View, SafeAreaView, Pressable } from 'react-native';
import React, { useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { encode as base64encode } from 'base-64';



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
                }
                else {
                    // ici si le token n'est pas valide
                    AsyncStorage.removeItem("token");
                    AsyncStorage.removeItem("expirationDate");
                }
            }
        }

        checkTokenValidity();
    }, [])

    const discovery = {
        authorizationEndpoint: 'https://accounts.spotify.com/authorize',
        tokenEndpoint: 'https://accounts.spotify.com/api/token',
    };


    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: "8a867a11dbeb41f4ab9199dcff1688ff",
            scopes: [
                "user-read-email",
                "user-library-read",
                "user-read-recently-played",
                "user-top-read",
                "playlist-read-private",
                "playlist-read-collaborative",
                "playlist-modify-public",
            ],
            usePKCE: false,
            redirectUri: makeRedirectUri({ scheme: 'wr510app' }),
        },
        discovery
    );

    useEffect(() => {
        if (response?.type === 'success') {
            const { code } = response.params;
            console.log("Code d'authorisation: ", code);
            console.log("Response: ", response);
            handleAuthentication(code);
        }
    }, [response]);

    const handleAuthentication = async (authorizationCode) => {
        const credentials = {
            clientId: "8a867a11dbeb41f4ab9199dcff1688ff",
            clientSecret: "018b8ca6630a4e8b98be2efe41d96526",
            redirectUri: makeRedirectUri({ scheme: 'wr510app' })
        };

        const credsB64 = base64encode(`${credentials.clientId}:${credentials.clientSecret}`);
        const tokenExchangeUrl = 'https://accounts.spotify.com/api/token';

        const tokenExchangeResponse = await fetch(tokenExchangeUrl, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${credsB64}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `grant_type=authorization_code&code=${authorizationCode}&redirect_uri=${credentials.redirectUri}`,
        });

        const tokenExchangeJson = await tokenExchangeResponse.json();
        console.log("Token Exchange Response: ", tokenExchangeJson);
        const {
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: expiresIn,
        } = tokenExchangeJson;

        if (accessToken && refreshToken && expiresIn) {
            // Perform actions with the obtained tokens
            console.log('Access Token:', accessToken);
            console.log('Refresh Token:', refreshToken);
            console.log('Expires In:', expiresIn);

            // Save tokens to AsyncStorage or perform other actions as needed
            await AsyncStorage.setItem("token", accessToken);
            await AsyncStorage.setItem("expirationDate", new Date(Date.now() + expiresIn * 1000).getTime().toString());

            navigation.navigate("Main");
        } else {
            console.error("One or more tokens are undefined");
        }
    };

    const authenticate = () => {
        if (request) {
            promptAsync();
            console.log("Request: ", request);
        }
    };


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

const styles = StyleSheet.create({});