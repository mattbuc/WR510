import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Navigation from './StackNavigator';

export default function App() {
  return (

    <Navigation />


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
