/**
* Sample React Native App
* https://github.com/facebook/react-native
*
* @format
* @flow strict-local
*/

import React from 'react';
import {
SafeAreaView,
ScrollView,
StatusBar,
StyleSheet,
Text,
useColorScheme,
View,
} from 'react-native';

import {
Colors,
DebugInstructions,
Header,
LearnMoreLinks,
ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import IssueList from './IssueList.js';




const styles = StyleSheet.create({
  appTitle: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    marginVertical: 15,
    color: '#4DA8DA',           // Light blue text
    textShadowColor: '#D6F0FF', // Pale blue shadow
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
});


export default class App extends React.Component {
  render() {
    return (
      <>
        <Text style={styles.appTitle}>Issue Tracker</Text>
        <IssueList />
      </>
    );
  }
}


