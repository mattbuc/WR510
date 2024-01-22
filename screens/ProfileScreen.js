import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import React from 'react';

const ProfileScreen = () => {
    return (
        <SafeAreaView style={styles.topView}>
            <Text>ProfileScreen</Text>
        </SafeAreaView>
    )
}

export default ProfileScreen;

const styles = StyleSheet.create({
    topView: {
        marginTop: 50,
    }
})