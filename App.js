import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button} from 'react-native';
import MapView from 'react-native-maps'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';


class HomeScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.blipStyle}>B L I P.</Text>
        <Button
          title="E N T E R"
          style={styles.button}
          onPress={()=> {
            console.log('pressed')
            this.props.navigation.navigate('Map')
          }}
          >
        </Button>
      </View>
    );
  }
}

// =====================MAP=============================
const Map = () => {
  return (
    <MapView style={{flex: 1}}
      region={{latitude: 42.882004,
      longitude: 74.582748,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
      }}
      showsUserLocation={true}
      />
    );
  }

  // ==================ROOT STACK=========================

  const RootStack = createStackNavigator(
    {
      Home: HomeScreen,
      Map: Map,
    },
    {
      initialRouteName: 'Home',
    }
  );

  // ===================APP CONTAINER======================

  const AppContainer = createAppContainer(RootStack)

  export default class App extends React.Component {
    render() {
      return <AppContainer />
    }
  }

// ++++=================STYLING===========================
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2D5471',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    alignItems: 'center'
  },
  blipStyle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 30,
    fontFamily: 'Futura',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    marginTop: 10,
    padding: 1,
  },
})

