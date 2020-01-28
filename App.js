import React,{ useState, useEffect, Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button, Image, ScrollView, AppRegistry, Animated, Dimensions} from 'react-native';
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
          ><Text>U P L O A D</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={()=> {
            this.props.navigation.navigate('NewYork')
          }}
          ><Text>N E W  Y O R K</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={()=> {
            this.props.navigation.navigate('Cuba')
          }}
          ><Text>C U B A</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={()=> {
            this.props.navigation.navigate('Greece')
          }}
          ><Text>G R E E C E</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
// ===============================================================================

const Images = [
  { uri: "https://i.imgur.com/zT9SwJJ.jpg" },
  { uri: "https://i.imgur.com/7efQhZd.jpg" },
  { uri: "https://i.imgur.com/PyOjjhf.jpg" },
  { uri: "https://i.imgur.com/FiD0aBN.jpg" }
]

const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;

class NewYork extends Component {
  state = {
    markers: [
      {
        coordinate: {
          latitude: 40.706205,
          longitude: -74.008827,
        },
        title: "Hanover",
        description: "Street Photography Blip",
        image: Images[0],
      },
      {
        coordinate: {
          latitude: 40.707698,
          longitude: -74.008807,
        },
        title: "Art Monument",
        description: "Street Photography Blip",
        image: Images[1],
      },
      {
        coordinate: {
          latitude: 40.712600,
          longitude: -74.009900,
        },
        title: "Oculus",
        description: "Famous Blip",
        image: Images[2],
      },
      {
        coordinate: {
          latitude: 40.715800,
          longitude: -73.997000,
        },
        title: "ChinaTown Graffiti",
        description: "Street Photography Blip",
        image: Images[3],
      },
    ],
    region: {
      latitude: 40.706005,
      longitude: -74.008827,
      latitudeDelta: 0.2322,
      longitudeDelta: 0.0421
    },
  };

  componentWillMount() {
    this.index = 0;
    this.animation = new Animated.Value(0);
  }
  componentDidMount() {
    // We should detect when scrolling has stopped then animate
    // We should just debounce the event listener here
    this.animation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
      if (index >= this.state.markers.length) {
        index = this.state.markers.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      clearTimeout(this.regionTimeout);
      this.regionTimeout = setTimeout(() => {
        if (this.index !== index) {
          this.index = index;
          const { coordinate } = this.state.markers[index];
          this.map.animateToRegion(
            {
              ...coordinate,
              latitudeDelta: this.state.region.latitudeDelta,
              longitudeDelta: this.state.region.longitudeDelta,
            },
            350
          );
        }
      }, 10);
    });
  }

  render() {
    const interpolations = this.state.markers.map((marker, index) => {
      const inputRange = [
        (index - 1) * CARD_WIDTH,
        index * CARD_WIDTH,
        ((index + 1) * CARD_WIDTH),
      ];
      const scale = this.animation.interpolate({
        inputRange,
        outputRange: [1, 2.5, 1],
        extrapolate: "clamp",
      });
      const opacity = this.animation.interpolate({
        inputRange,
        outputRange: [0.35, 1, 0.35],
        extrapolate: "clamp",
      });
      return { scale, opacity };
    });

    return (
      <View style={styles2.container}>
        <MapView
          ref={map => this.map = map}
          initialRegion={this.state.region}
          style={styles2.container}
        >
          {this.state.markers.map((marker, index) => {
            const scaleStyle = {
              transform: [
                {
                  scale: interpolations[index].scale,
                },
              ],
            };
            const opacityStyle = {
              opacity: interpolations[index].opacity,
            };
            return (
              <MapView.Marker key={index} coordinate={marker.coordinate}>
                <Animated.View style={[styles2.markerWrap, opacityStyle]}>
                  <Animated.View style={[styles2.ring, scaleStyle]} />
                  <View style={styles2.marker} />
                </Animated.View>
              </MapView.Marker>
            );
          })}
        </MapView>
        <Animated.ScrollView
          horizontal
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: this.animation,
                  },
                },
              },
            ],
            { useNativeDriver: true }
          )}
          style={styles2.scrollView}
          contentContainerStyle={styles2.endPadding}
        >
          {this.state.markers.map((marker, index) => (
            <View style={styles2.card} key={index}>
              <Image
                source={marker.image}
                style={styles2.cardImage}
                resizeMode="cover"
              />
              <View style={styles2.textContent}>
                <Text numberOfLines={1} style={styles2.cardtitle}>{marker.title}</Text>
                <Text numberOfLines={1} style={styles2.cardDescription}>
                  {marker.description}
                </Text>
              </View>
            </View>
          ))}
        </Animated.ScrollView>

      </View>
    );
  }
}

const styles2 = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  card: {
    padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  textContent: {
    flex: 1,
  },
  cardtitle: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(130,4,150, 0.9)",
  },
  ring: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(130,4,150, 0.3)",
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(130,4,150, 0.5)",
  },
});

// ==================================C U B A=============================================
const cubaImages = [
  { uri: "https://i.imgur.com/VMwRLyB.jpg" },
  { uri: "https://i.imgur.com/mgTZeVX.jpg" },
  { uri: "https://i.imgur.com/9F5gac3.jpg" },
  { uri: "https://i.imgur.com/ILsFZYc.jpg" }
]

class Cuba extends Component {
  state = {
    markers: [
      {
        coordinate: {
          latitude: 21.521800,
          longitude: -77.781200,
        },
        title: "Cuba Building",
        description: "Street Photography Blip",
        image: cubaImages[0],
      },
      {
        coordinate: {
          latitude: 21.922000,
          longitude: -78.081400,
        },
        title: "Fast & Furious Scene",
        description: "Famous Blip",
        image: cubaImages[1],
      },
      {
        coordinate: {
          latitude: 21.00000,
          longitude: -77.781100,
        },
        title: "Barrio De Arte",
        description: "Street Photography Blip",
        image: cubaImages[2],
      },
      {
        coordinate: {
          latitude: 21.525000,
          longitude: -79.81400,
        },
        title: "Cuba Car Rows",
        description: "Street Photography Blip",
        image: cubaImages[3],
      },
    ],
    region: {
      latitude: 21.522700,
      longitude: -77.791400,
      latitudeDelta: 1.3322,
      longitudeDelta: 0.9721
    },
  };

  componentWillMount() {
    this.index = 0;
    this.animation = new Animated.Value(0);
  }
  componentDidMount() {
    // We should detect when scrolling has stopped then animate
    // We should just debounce the event listener here
    this.animation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
      if (index >= this.state.markers.length) {
        index = this.state.markers.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      clearTimeout(this.regionTimeout);
      this.regionTimeout = setTimeout(() => {
        if (this.index !== index) {
          this.index = index;
          const { coordinate } = this.state.markers[index];
          this.map.animateToRegion(
            {
              ...coordinate,
              latitudeDelta: this.state.region.latitudeDelta,
              longitudeDelta: this.state.region.longitudeDelta,
            },
            350
          );
        }
      }, 10);
    });
  }

  render() {
    const interpolations = this.state.markers.map((marker, index) => {
      const inputRange = [
        (index - 1) * CARD_WIDTH,
        index * CARD_WIDTH,
        ((index + 1) * CARD_WIDTH),
      ];
      const scale = this.animation.interpolate({
        inputRange,
        outputRange: [1, 2.5, 1],
        extrapolate: "clamp",
      });
      const opacity = this.animation.interpolate({
        inputRange,
        outputRange: [0.35, 1, 0.35],
        extrapolate: "clamp",
      });
      return { scale, opacity };
    });

    return (
      <View style={styles3.container}>
        <MapView
          ref={map => this.map = map}
          initialRegion={this.state.region}
          style={styles3.container}
        >
          {this.state.markers.map((marker, index) => {
            const scaleStyle = {
              transform: [
                {
                  scale: interpolations[index].scale,
                },
              ],
            };
            const opacityStyle = {
              opacity: interpolations[index].opacity,
            };
            return (
              <MapView.Marker key={index} coordinate={marker.coordinate}>
                <Animated.View style={[styles3.markerWrap, opacityStyle]}>
                  <Animated.View style={[styles3.ring, scaleStyle]} />
                  <View style={styles3.marker} />
                </Animated.View>
              </MapView.Marker>
            );
          })}
        </MapView>
        <Animated.ScrollView
          horizontal
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: this.animation,
                  },
                },
              },
            ],
            { useNativeDriver: true }
          )}
          style={styles3.scrollView}
          contentContainerStyle={styles3.endPadding}
        >
          {this.state.markers.map((marker, index) => (
            <View style={styles3.card} key={index}>
              <Image
                source={marker.image}
                style={styles3.cardImage}
                resizeMode="cover"
              />
              <View style={styles3.textContent}>
                <Text numberOfLines={1} style={styles3.cardtitle}>{marker.title}</Text>
                <Text numberOfLines={1} style={styles3.cardDescription}>
                  {marker.description}
                </Text>
              </View>
            </View>
          ))}
        </Animated.ScrollView>

      </View>
    );
  }
}

const styles3 = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  card: {
    padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  textContent: {
    flex: 1,
  },
  cardtitle: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(130,4,150, 0.9)",
  },
  ring: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(130,4,150, 0.3)",
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(130,4,150, 0.5)",
  },
});

// ===========================================================================================
// ================================== G R E E C E=============================================
const GreeceImages = [
  { uri: "https://i.imgur.com/o1TaN3e.jpg" },
  { uri: "https://i.imgur.com/5xzW9gV.jpg" },
  { uri: "https://i.imgur.com/Abcleun.jpg" },
  { uri: "https://i.imgur.com/vALHz0f.jpg" }
]

class Greece extends Component {
  state = {
    markers: [
      {
        coordinate: {
          latitude: 37.103600,
          longitude: 25.377700,
        },
        title: "Mykonos Steps",
        description: "Vacation Blip",
        image: GreeceImages[0],
      },
      {
        coordinate: {
          latitude: 37.9838,
          longitude: 23.7275,
        },
        title: "Santaroni Alley",
        description: "Vacation Blip",
        image: GreeceImages[1],
      },
      {
        coordinate: {
          latitude: 36.393200,
          longitude: 25.461500,
        },
        title: "Greece shore",
        description: "Vacation Blip",
        image: GreeceImages[2],
      },
      {
        coordinate: {
          latitude: 37.446700,
          longitude: 25.328900,
        },
        title: "Greece Neighborhood",
        description: "Vacation Blip",
        image: GreeceImages[3],
      },
    ],
    region: {
      latitude: 37.446700,
      longitude: 25.328900,
      latitudeDelta: 1.3322,
      longitudeDelta: 0.9721
    },
  };

  componentWillMount() {
    this.index = 0;
    this.animation = new Animated.Value(0);
  }
  componentDidMount() {
    // We should detect when scrolling has stopped then animate
    // We should just debounce the event listener here
    this.animation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
      if (index >= this.state.markers.length) {
        index = this.state.markers.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      clearTimeout(this.regionTimeout);
      this.regionTimeout = setTimeout(() => {
        if (this.index !== index) {
          this.index = index;
          const { coordinate } = this.state.markers[index];
          this.map.animateToRegion(
            {
              ...coordinate,
              latitudeDelta: this.state.region.latitudeDelta,
              longitudeDelta: this.state.region.longitudeDelta,
            },
            350
          );
        }
      }, 10);
    });
  }

  render() {
    const interpolations = this.state.markers.map((marker, index) => {
      const inputRange = [
        (index - 1) * CARD_WIDTH,
        index * CARD_WIDTH,
        ((index + 1) * CARD_WIDTH),
      ];
      const scale = this.animation.interpolate({
        inputRange,
        outputRange: [1, 2.5, 1],
        extrapolate: "clamp",
      });
      const opacity = this.animation.interpolate({
        inputRange,
        outputRange: [0.35, 1, 0.35],
        extrapolate: "clamp",
      });
      return { scale, opacity };
    });

    return (
      <View style={styles4.container}>
        <MapView
          ref={map => this.map = map}
          initialRegion={this.state.region}
          style={styles4.container}
        >
          {this.state.markers.map((marker, index) => {
            const scaleStyle = {
              transform: [
                {
                  scale: interpolations[index].scale,
                },
              ],
            };
            const opacityStyle = {
              opacity: interpolations[index].opacity,
            };
            return (
              <MapView.Marker key={index} coordinate={marker.coordinate}>
                <Animated.View style={[styles4.markerWrap, opacityStyle]}>
                  <Animated.View style={[styles4.ring, scaleStyle]} />
                  <View style={styles4.marker} />
                </Animated.View>
              </MapView.Marker>
            );
          })}
        </MapView>
        <Animated.ScrollView
          horizontal
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: this.animation,
                  },
                },
              },
            ],
            { useNativeDriver: true }
          )}
          style={styles4.scrollView}
          contentContainerStyle={styles4.endPadding}
        >
          {this.state.markers.map((marker, index) => (
            <View style={styles4.card} key={index}>
              <Image
                source={marker.image}
                style={styles4.cardImage}
                resizeMode="cover"
              />
              <View style={styles4.textContent}>
                <Text numberOfLines={1} style={styles4.cardtitle}>{marker.title}</Text>
                <Text numberOfLines={1} style={styles4.cardDescription}>
                  {marker.description}
                </Text>
              </View>
            </View>
          ))}
        </Animated.ScrollView>

      </View>
    );
  }
}

const styles4 = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  card: {
    padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  textContent: {
    flex: 1,
  },
  cardtitle: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(130,4,150, 0.9)",
  },
  ring: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(130,4,150, 0.3)",
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(130,4,150, 0.5)",
  },
});

// ====================================================================================

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
          ><Text>UPLOAD</Text>
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

  // ==================ROOT STACK=========================

  const RootStack = createStackNavigator(
    {
      Home: HomeScreen,
      Blips: Map,
      BlipCamera: BlipCamera,
      cameraRoll: cameraRoll,
      NewYork: NewYork,
      Cuba: Cuba,
      Greece: Greece
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
    left: 150
  }
})

