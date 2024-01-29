import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import React, { useContext } from "react";
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Player } from '../PlayerContext';

const SongItem = ({ item, onPress, isPlaying }) => {
    const { currentTrack, setCurrentTrack } = useContext(Player);
    const handlePress = () => {
        setCurrentTrack(item);
        onPress(item);
    }
    return (
        <Pressable
            onPress={handlePress}
            style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 10
            }}>
            <Image source={{ uri: item?.track?.album?.images[0].url }} style={{ width: 50, height: 50, marginRight: 10 }} />
            <View style={{ justifyContent: "space-between", flex: 1 }}>
                <Text
                    style={isPlaying ? {
                        color: "#3FFF00",
                        fontWeight: "bold",
                        fontSize: 14
                    } : {
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 14
                    }}
                    numberOfLines={1}>
                    {item?.track?.name}
                </Text>
                <Text
                    style={{
                        color: "#989898",
                        marginTop: 4
                    }}>
                    {item?.track?.artists[0].name}
                </Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 7, marginHorizontal: 10 }}>
                <AntDesign name="heart" size={24} color="#1DB954" />
                <Entypo name="dots-three-vertical" size={24} color="#C0C0C0" />
            </View>
        </Pressable>
    )
}

export default SongItem

const styles = StyleSheet.create({})