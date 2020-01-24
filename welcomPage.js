import React, { Component, useState} from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { AppLoading } from 'expo';

export default function HelloWorldApp() {

    return (
      <View style={styles.container}>
        <Text style={styles.blipStyle}>B L I P.</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={styles.button}
          ><Text> E N T E R </Text>
        </TouchableOpacity>
      </View>
    );
}

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

