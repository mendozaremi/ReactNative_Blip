import React,{ useState, useEffect, Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button, Image} from 'react-native';
import MapView from 'react-native-maps'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
// import Camera from 'react-native-camera'
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

class HomeScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.blipStyle}>B L I P.</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={()=> {
            this.props.navigation.navigate('Blips')
          }}
          ><Text>E N T E R</Text>
        </TouchableOpacity>
      </View>
    );
  }
}


class cameraRoll extends React.Component {
  state = {
    image: null,
  };

  render() {
    let { image } = this.state;

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          title="Pick an image from camera roll"
          onPress={this._pickImage}
        />
        {image &&
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      </View>
    );
  }

  componentDidMount() {
    this.getPermissionAsync();
    console.log('hi');
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };
}

// =====================MAP=============================
class Map extends Component {
  render() {
    return (
      <MapView
      style={styles.MapView}
        region={{latitude: 40.706005,
        longitude: -74.008827,
        latitudeDelta: 0.2322,
        longitudeDelta: 0.0421
        }}
        showsUserLocation={true}
        >
        <MapView.Marker

        coordinate={{latitude: 40.706205,
            longitude: -74.008827,}}
        title={"Pop-up Art Installation"}
        description={"Art"}
        ><Image
        source={require('./bluePin.png')}
        />
        </MapView.Marker>
        <MapView.Marker
        coordinate={{latitude: 40.806005,
            longitude: -74.008827,}}
        title={"Hidden Alleyway"}
        description={"StreetPhotography"}
        ><Image
        source={require('./bluePin.png')}
        />
        </MapView.Marker>
        <MapView.Marker
        coordinate={{latitude: 40.736005,
            longitude: -74.028827,}}
        title={"Cool Rooftop"}
        description={"LandscapePhotography"}
        ><Image
        source={require('./bluePin.png')}
        />
        </MapView.Marker>
        <MapView.Marker
        coordinate={{latitude: 40.739005,
            longitude: -74.00000,}}
        title={"Beautiful Scenery"}
        description={"WeddingPhotography"}
        ><Image
        source={require('./bluePin.png')}
        />
        </MapView.Marker>
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={()=> {
            this.props.navigation.navigate('BlipCamera')
          }}
          ><Image source={require('./cameraLogo.png')}/>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={()=> {
            this.props.navigation.navigate('cameraRoll')
          }}
          ><Text>Upload Photo</Text>
        </TouchableOpacity>

        </MapView>
      );
  }
}

// =====================CAMERA============================
const BlipCamera = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={type}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            style={{
              flex: 0.1,
              alignSelf: 'flex-end',
              alignItems: 'center',
            }}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
            <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Flip </Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

// ===================BLIP FEED=============================
// class BlipFeed extends Component {
//   render() {
//     return (

//     )
//   }
// }
  // ==================ROOT STACK=========================

  const RootStack = createStackNavigator(
    {
      Home: HomeScreen,
      Blips: Map,
      BlipCamera: BlipCamera,
      cameraRoll: cameraRoll,
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

  //===================BOTTOM TAB NAVIAGTOR================

  // createBottomTabNavigator(RouteConfigs, TabNavigatorConfig);

// ++++=================STYLING===========================
const styles = StyleSheet.create({
  MapView: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center'
  },
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
  cameraButton: {
    position: 'absolute',
    bottom:30,
    left:160,
  }
})

