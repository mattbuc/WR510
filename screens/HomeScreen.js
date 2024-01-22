import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image } from 'react-native';
import React, { useEffect, useState } from "react";
import { LinearGradient } from 'expo-linear-gradient';
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
                <View>
                    <View>
                        <Image style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            resizeMode: "cover",
                        }} source={{ uri: userProfile?.images[0].url }} />
                        <Text style={{ color: "white" }}>{userProfile?.display_name}</Text>
                    </View>
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