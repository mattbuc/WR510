import { StyleSheet, Text, View, Image, ScrollView, Pressable, TextInput, FlatList } from 'react-native';
import React, { useEffect, useState, useContext } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SongItem from '../Components/SongItem';
import { Player } from '../PlayerContext';
import { BottomModal } from 'react-native-modals';
import { ModalContent } from 'react-native-modals';


const LikedSongsScreen = ({ }) => {
    const navigation = useNavigation();
    const { currentTrack, setCurrentTrack } = useContext(Player);
    const [modalVisible, setModalVisible] = useState(false);
    const [input, setInput] = useState("");
    const [savedTracks, setSavedTracks] = useState([]);
    async function getSavedTracks() {
        try {
            const accessToken = await AsyncStorage.getItem("token");
            console.log("Access token:", accessToken);
            if (!accessToken) {
                throw new Error("Access token is missing");
            }

            const response = await fetch("https://api.spotify.com/v1/me/tracks", {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                params: {
                    limit: 50,
                },
            });

            if (!response.ok) {
                console.error("Failed to fetch tracks. Status:", response.status);
                throw new Error("Failed to fetch tracks");
            }

            const data = await response.json();
            setSavedTracks(data.items);
        } catch (error) {
            console.error("Error fetching tracks :", error.message);
        }
    }

    useEffect(() => {
        getSavedTracks().catch(error => {
            console.error("Error during component initialization:", error.message);
        });
        console.log("Musique sauvegardée :", savedTracks);
    }, []);
    const playTrack = async () => {
        if (savedTracks.length > 0) {
            setCurrentTrack(savedTracks[0]);
        }
        await play(savedTracks[0]);
    }
    const play = async () => { }
    console.log(currentTrack);
    return (
        <>
        <LinearGradient colors={["#614385", "#516395"]} style={{ flex: 1 }} >
            <ScrollView style={{ flex: 1, marginTop: 40 }}>
                <Pressable onPress={() => navigation.goBack()}
                    style={{ marginHorizontal: 10 }}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </Pressable>

                <Pressable style={{
                    marginHorizontal: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 9
                }}>
                    <Pressable style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                        backgroundColor: "#42275a",
                        padding: 9,
                        flex: 1,
                        borderRadius: 3,
                        height: 38,
                        marginLeft: 10
                    }}>
                        <AntDesign name="search1" size={20} color="white" />
                        <TextInput
                            value={input} onChangeText={(text) => setInput(text)}
                            placeholder="Trouver dans les sons aimées"
                            placeholderTextColor={"white"}
                            style={{ fontWeight: "400" }} />
                    </Pressable>
                    <Pressable style={{
                        marginHorizontal: 10,
                        backgroundColor: "#42275a",
                        padding: 10,
                        borderRadius: 3,
                        height: 38,
                    }}>
                        <Text style={{ color: "white" }}>Trier</Text>
                    </Pressable>
                </Pressable>
                <View style={{ height: 50 }} />
                <View style={{ marginHorizontale: 10, marginLeft: 10 }}>
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: "bold",
                            color: "white"
                        }}>
                        Sons aimées
                    </Text>
                    <Text
                        style={{
                            fontSize: 13,
                            color: "white",
                            marginTop: 5
                        }}>
                        100 Musiques
                    </Text>
                </View>

                <Pressable
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginHorizontal: 10
                    }}>
                    <Pressable
                        style={{
                            width: 30,
                            height: 30,
                            borderRadius: 15,
                            backgroundColor: "#1D8954",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                        <AntDesign name="arrowdown" size={24} color="white" />
                    </Pressable>

                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                        <FontAwesome name="random" size={24} color="#1D8954" />
                        <Pressable
                                onPress={playTrack}
                            style={{
                                width: 60,
                                height: 60,
                                borderRadius: 35,
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "#1D8954",

                            }}>
                            <Entypo name="controller-play" size={24} color="white" />
                        </Pressable>
                    </View>
                </Pressable>
                <FlatList showsVerticalScrollIndicator={false} data={savedTracks} renderItem={({ item }) => (
                    <SongItem item={item} />
                )} />
                </ScrollView>
        </LinearGradient >

            {currentTrack && (
                <Pressable
                    onPress={() => setModalVisible(true)}
                    style={{
                        backgroundColor: "#5072A7", width: "90%",
                        padding: 10, marginLeft: "auto", marginRight: "auto",
                        marginBottom: 15, position: "absolute", borderRadius: 6,
                        left: 20, bottom: 10, justifyContent: "space-between", flexDirection: "row", alignItems: "center", gap: 10
                    }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                        <Image style={{ width: 40, height: 40 }} source={{ uri: currentTrack?.track?.album.images[0].url }} />
                        <Text numberOfLines={1} style={{ fontSize: 13, width: 220, color: "white", fontWeight: "bold" }}>
                            {currentTrack?.track?.name} .{" "}
                            {currentTrack?.track?.artists[0].name}
                        </Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <AntDesign name="heart" size={24} color="#1DB954" />
                        <Pressable>
                            <AntDesign name="pausecircle" size={24} color="white" />
                        </Pressable>
                    </View>
                </Pressable>
            )}

            <BottomModal
                visible={modalVisible}
                onHardwareBackPress={() => setModalVisible(false)}
                swipeDirection={["up", "down"]}
                swipeThreshold={200}
            >
                <ModalContent style={{ height: "100%", width: "100%", backgroundColor: "#5072A7" }}>
                    <View style={{ height: "100%", width: "100%", marginTop: 40 }}>
                        <Pressable style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <AntDesign name="down" size={24} color="white" />

                            <Text style={{ fontSize: 13, fontWeight: "bold", color: "white" }}>{currentTrack?.track?.name}</Text>
                            <Entypo name="dots-three-vertical" size={24} color="black" />
                        </Pressable>

                        <View style={{ height: 80 }} />

                        <View style={{ padding: 10 }} />

                        <Image style={{ width: "100%", height: 330, borderRadius: 4 }} source={{ uri: currentTrack?.track?.album?.images[0].url }} />
                        <View style={{ marginTop: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <View>
                                <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>{currentTrack?.track?.name}</Text>
                                <Text style={{ marginTop: 4, color: "#D3D3D3" }}>{currentTrack?.track?.artists[0].name}</Text>
                            </View>
                            <AntDesign name="heart" size={24} color="#1DB954" />
                        </View>
                        <View style={{ marginTop: 12 }}>
                            <Text>Bar de Progrés</Text>

                            <View style={{ marginTop: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                <Text style={{ color: "white", fontSize: 15 }}>0:00</Text>
                                <Text style={{ color: "white", fontSize: 15 }}>3:00</Text>
                            </View>
                        </View>
                    </View>
                </ModalContent>
            </BottomModal>
        </>
    );
}

export default LikedSongsScreen

const styles = StyleSheet.create({})