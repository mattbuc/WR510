import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image, Pressable } from 'react-native';
import React, { useEffect, useState } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
    const [userProfile, setUserProfile] = useState([]);
    const greetingMessage = () => {
        const currentTime = new Date().getHours();
        if (currentTime < 12) {
            return "Bonjour";
        }
        else if (currentTime < 18) {
            return "Bonne Après Midi";
        }
        else {
            return "Bonsoir";
        }
    }
    const message = greetingMessage();
    const getProfile = async () => {
        try {
            const accessToken = await AsyncStorage.getItem("token");
            console.log("Access Token:", accessToken);

            if (accessToken) {
                const response = await fetch("https://api.spotify.com/v1/me", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                const data = await response.json();
                setUserProfile(data);
                return data;
            } else {
                console.log("Access Token not found");
            }
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        getProfile();
    }, []);
    console.log(userProfile)
    return (
        <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
            <ScrollView style={styles.topView}>
                <View style={{ padding: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        {<Image style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            resizeMode: "cover",
                        }} source={{ uri: userProfile?.images[0].url }} />}
                        <Text style={{ marginLeft: 10, fontSize: 20, fontWeight: "bold", color: "white" }}>{message}</Text>
                    </View>
                    <MaterialCommunityIcons name="lightning-bolt-outline" size={24} color="white" />
                </View>
                <View style={{
                    marginHorizontal: 12,
                    marginVertical: 5,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                }}>
                    <Pressable style={{
                        backgroundColor: "#282828",
                        padding: 10,
                        borderRadius: 30,
                    }}>
                        <Text style={{ fontSize: 15, color: "white" }}>Musique</Text>
                    </Pressable>

                    <Pressable style={{
                        backgroundColor: "#282828",
                        padding: 10,
                        borderRadius: 30,
                    }}>
                        <Text style={{ fontSize: 15, color: "white" }}>Podcast</Text>
                    </Pressable>
                </View>

                <View>
                    <Pressable onPress={() => navigation.navigate("Liked")}
                        style={{
                            marginBottom: 10,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                            flex: 1,
                            marginHorizontal: 10,
                            marginVertical: 8,
                            backgroundColor: "#202020",
                            borderRadius: 4,
                            elevation: 3,
                        }}>
                        <LinearGradient colors={["#33006F", "#FFFFFF"]}>
                            <Pressable style={{
                                width: 55,
                                height: 55,
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                                <AntDesign name="heart" size={24} color="white" />
                            </Pressable>
                        </LinearGradient>
                        <Text style={{ color: "white", fontSize: 13, fontWeight: "bold" }}>
                            Titre aimé
                        </Text>
                    </Pressable>
                </View>

            </ScrollView>
        </LinearGradient>

    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    topView: {
        marginTop: 50,
    }
})