import { StyleSheet, Text, View, Image, ScrollView, Pressable, TextInput, FlatList } from 'react-native';
import React, { useEffect, useState, useContext, useRef } from "react";
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
import { Audio } from 'expo-av';


const LikedSongsScreen = ({ }) => {
    const navigation = useNavigation();
    const { currentTrack, setCurrentTrack } = useContext(Player);
    const [modalVisible, setModalVisible] = useState(false);
    const [input, setInput] = useState("");
    const [savedTracks, setSavedTracks] = useState([]);
    const value = useRef(0);
    const [currentSound, setCurrentSound] = useState(null);
    const [progress, setProgress] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    async function getSavedTracks() {
        try {
            const accessToken = await AsyncStorage.getItem("token");
            console.log("Access token:", accessToken);
            if (!accessToken) {
                throw new Error("Access token is missing");
            }

            const response = await fetch("https://api.spotify.com/v1/me/tracks?offset=0&limit=50", {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                params: {
                    limit: 50,
                }
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
    const play = async (nextTrack) => {
        console.log(nextTrack);
        const preview_url = nextTrack?.track?.preview_url;
        try {
            if (currentSound) {
                await currentSound.stopAsync();
            }
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                staysActiveInBackground: false,
                shouldDuckAndroid: false,
            })
            const { sound, status } = await Audio.Sound.createAsync(
                { uri: preview_url },
                { shouldPlay: true, isLooping: false },
                onPlaybackStatusUpdate,
            )
            console.log("Sound object:", status)
            onPlaybackStatusUpdate(status);
            setCurrentSound(sound);
            setIsPlaying(status.isLoaded)
            await sound.playAsync();
        } catch (err) {
            console.log(err.message);
        }
    }
    const onPlaybackStatusUpdate = async (status) => {
        console.log(status);
        if (status.isLoaded && status.isPlaying) {
            const progress = status.positionMillis / status.durationMillis;
            console.log("progress:", progress);
            setProgress(progress);
            setCurrentTime(status.positionMillis);
            setTotalDuration(status.durationMillis);
        }

        if (status.didJustFinish === true) {
            setCurrentSound(null);
            playNextTrack();
        }
    }
    const circleSize = 12;
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60000);
        const seconds = Math.floor((time % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }

    const handlePlayPause = async () => {
        if (!currentSound) {
            return;
        }
        if (isPlaying) {
            await currentSound.pauseAsync();
        } else {
            await currentSound.playAsync();
        }
        setIsPlaying(!isPlaying);
    }

    const playNextTrack = async () => {
        if (currentSound) {
            await currentSound.stopAsync();
            setCurrentSound(null);
        }
        value.current += 1;
        if (value.current < savedTracks.length) {
            const nextTrack = savedTracks[value.current];
            setCurrentTrack(nextTrack);

            await play(nextTrack);
        } else {
            console.log("No more tracks");
        }
    }

    const playPreviousTrack = async () => {
        if (currentSound) {
            await currentSound.stopAsync();
            setCurrentSound(null);
        }
        value.current -= 1;
        if (value.current >= 0) {
            const previousTrack = savedTracks[value.current];
            setCurrentTrack(previousTrack);

            await play(previousTrack);
        } else {
            console.log("No more tracks");
        }
    }

    return (
        <>
        <LinearGradient colors={["#614385", "#516395"]} style={{ flex: 1 }} >
                <View style={{ flex: 1, marginTop: 40 }} />
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


                <FlatList
                        showsVerticalScrollIndicator={false}
                        data={savedTracks}
                        renderItem={({ item }) => (
                            <SongItem
                                item={item}
                                onPress={play}
                                isPlaying={item === currentTrack} />
                    )} />
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
                            <AntDesign onPress={() => setModalVisible(!modalVisible)} name="down" size={24} color="white" />

                            <Text style={{ fontSize: 13, fontWeight: "bold", color: "white" }}>{currentTrack?.track?.name}</Text>
                            <Entypo name="dots-three-vertical" size={24} color="white" />
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
                            <View style={{
                                width: "100%",
                                marginTop: 10,
                                height: 3,
                                backgroundColor: "#D3D3D3",
                                borderRadius: 5
                            }}>
                                <View style={[styles.progressbar, { width: `${progress * 100}` }]} />
                                <View styles={[{
                                    position: "absolute",
                                    top: -5,
                                    width: circleSize,
                                    borderRadius: circleSize / 2,
                                    height: circleSize,
                                    bavckgroundColor: "white",
                                },
                                {
                                    left: `${progress * 100}%`,
                                    marginLeft: -circleSize / 2,
                                }
                                ]} />
                            </View>

                            <View style={{ marginTop: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                <Text style={{ color: "#D3D3D3", fontSize: 15 }}>{formatTime(currentTime)}</Text>
                                <Text style={{ color: "#D3D3D3", fontSize: 15 }}>{formatTime(totalDuration)}</Text>
                            </View>
                        </View>
                        <View style={{ marginTop: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <Pressable onPress={playPreviousTrack}>
                                <AntDesign name="banckward" size={24} color="white" marginLeft={40} />
                            </Pressable>
                            <Pressable onPress={handlePlayPause}>
                                {isPlaying ? (
                                    <AntDesign name="pausecircle" size={50} color="white" />
                                ) : (
                                    <AntDesign name="play" size={50} color="white" />
                                )}
                            </Pressable>
                            <Pressable onPress={playNextTrack}>
                                <AntDesign name="forward" size={24} color="white" marginRight={40} />
                            </Pressable>
                        </View>
                    </View>
                </ModalContent>
            </BottomModal>
        </>
    );
}

export default LikedSongsScreen

const styles = StyleSheet.create({
    progressbar: {
        height: '100%',
        borderRadius: 5,
        backgroundColor: 'white',
    },
})