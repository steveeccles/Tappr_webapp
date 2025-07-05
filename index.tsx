import 'react-native-gesture-handler';      // if you use React Navigation
import {AppRegistry} from 'react-native';
import firebase from '@react-native-firebase/app';  // ensures native modules are bootstrapped

import AppNavigator from './src/navigation/AppNavigator';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => AppNavigator);
 