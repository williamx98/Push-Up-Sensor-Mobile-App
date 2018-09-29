import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import Icon from 'react-native-fa-icons';

const HelpInfo = (props) => (
  <TouchableWithoutFeedback
    onPress={()=> {
      Alert.alert(props.title, props.alert,
    [ {text: 'OK', onPress: () => console.log('OK Pressed')}, ],
    { cancelable: false } )
  }}>
    <View>
      <Icon name='question-circle' style={{ fontSize: 35, color: 'black', opacity:.5}} />
    </View>
  </TouchableWithoutFeedback>
);

export default HelpInfo;