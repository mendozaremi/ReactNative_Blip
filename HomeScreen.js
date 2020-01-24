import React, { Component } from 'react';
import { Button, StyleSheet, Text, View, TouchableWithoutFeedback, Alert } from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome',
  };
  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style={{ backgroundColor: '#2D5471', flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={styles.blipStyle}>B L I P.</Text>
        <Button title="Enter" onPress={()=> Alert.alert("Simple Button pressed")} />
      <Button
        title="Go to Jane's profile"
        onPress={() => navigate('Profile', {name: 'Jane'})}
      />
      </View>
    );
  }
}
