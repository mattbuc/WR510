import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={[styles.box, { backgroundColor: 'blue' }]}>Je suis blue</Text>
      <Text style={[styles.box, { backgroundColor: 'yellow' }]}>Je suis yellow</Text>
      <Text style={[styles.box, { backgroundColor: 'red' }]}>Je suis green</Text>
      <StatusBar style="auto" />
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    color: 'white',
    borderRadius: 10,
    width: 200,
    height: 100,
    textAlign: 'center',
    margin: 20,
  },
});
