import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Vibration,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
  ScrollView,
  Alert
} from 'react-native';
import Proximity from 'react-native-proximity';
import Icon from 'react-native-fa-icons';
import HelpInfo from './HelpInfo';
import Pyramid from './Pyramid';

var levels = [1,3,6,10,15,21,28,36,45,55,64,72,79,85,90,94,97,99];
var globalWidth = Dimensions.get('window').width;
var globalHeight = Dimensions.get('window').height;
var green = '#2CC14C';
var red = '#C44855';
// var Sound = require('react-native-sound');
// var whoosh = new Sound('light.mp3', Sound.MAIN_BUNDLE, (error) => {});
// var finish = new Sound('finish.mp3', Sound.MAIN_BUNDLE, (error) => {});

export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      distance: 0,
      counter: 0,
      currState: 'up',
      prevState:'up',
      mode: 'infinite',
      vibrate: true,
      backgroundC: green,
      countdowncounter: 20,
      scroll: true
    };

    this.proximityListener = this.proximityListener.bind(this);
    this.updateCounter = this.updateCounter.bind(this);
    this.flipRecordState = this.flipRecordState.bind(this);
    this.checkCountdown = this.checkCountdown.bind(this);
    this.resetCounter = this.resetCounter.bind(this);
    Proximity.addListener(this.proximityListener);
  }

  updateCounter() {
    switch(this.state.mode) {
      case 'infinite':
          this.setState({counter: this.state.counter + 1});
        break;
      case 'countdown':
          var current = this.state.countdowncounter;
          if (current === 0) {
            current = 1;
          } else if (current === 1) {
            Vibration.vibrate(200);
            // whoosh.play();
            this.flipRecordState();
          }
          this.setState({countdowncounter: current - 1});
        break;
      case 'pyramid':
          this.setState({counter: this.state.counter + 1});
          if (levels.includes(this.state.counter)) {
            Vibration.vibrate(200);
            // whoosh.play();            
          }

          if (this.state.counter === 100) {
          	// finish.play();
          	Vibration.vibrate(600);
          	this.flipRecordState();
          	this.resetCounter();   	
          }
        break;
    }
  }

  resetCounter() {
    if (this.state.scroll) {
      this.setState({counter: 0});
    }
  }

  proximityListener(data) {
    var current = 'down';

    if (data.distance >= 5 || data.proximity === false) {
      current = 'up';
    }
    this.setState({ currState: current });

    if (this.state.currState == 'up' && this.state.prevState == 'down' && this.state.scroll === false) {
      this.updateCounter();
    }

    this.setState({ prevState: current});
  }

  flipRecordState() {
    if (this.state.mode === 'countdown' && (this.state.countdowncounter === 0 || this.state.countdowncounter === '')) {
        Alert.alert('Enter a number to countdown from', 'Choose an integer greater than 0',
          [ {text: 'OK'} ],
          { cancelable: false } );
        this.setState({ countdowncounter: 20});
        return;  
    }
    var color = this.state.backgroundC === green ? red : green;
    var scrolling = this.state.scroll ? false : true;
    this.setState({
      backgroundC: color,
      scroll: scrolling,
    });
  }

  checkCountdown(num) {
    console.log(this.state.countdowncounter);
    if (!Number.isInteger(Number.parseInt(num))) {
      num = '';
    }
    if (num !== '') {
      var cleanNum = (num + '').replace(/[^0-9]/g, '');
      num = Number.parseInt(cleanNum);
    }
    this.setState({ countdowncounter: num });
  }

  updateMode(index) {
    var localMode = '';
    switch(index) {
      case 0:
        localMode = 'infinite';
        this.resetCounter();
        break;
      case 1:
        localMode = 'countdown';
        this.setState({ countdowncounter: 20 })
        this.resetCounter();
        break;
      case 2:
        localMode = 'pyramid';
        this.resetCounter();
        break;
    }
    this.setState({ mode: localMode});
  }

  render() {
    console.log("here");
    return (
      <View style={{backgroundColor: this.state.backgroundC}}>
        <ScrollView
          horizontal={true}
          pagingEnabled={true}
          scrollEnabled={this.state.scroll}
          showsHorizontalScrollIndicator={true}
          indicatorStyle={ 'white'}
          onScroll={
            event=> {
              this.updateMode(event.nativeEvent.contentOffset.x/globalWidth)
          }}
          scrollEventThrottle={16} >

          <TouchableWithoutFeedback onPress={this.flipRecordState}>
            <View style={styles.background}>
              <Text style={styles.instruct}>go-to-failure</Text>
              <TouchableWithoutFeedback onPress={this.resetCounter}>
                <View style={styles.mainDisplay}>
                  <Text style={styles.counter}>{this.state.counter}</Text>
                </View>
              </TouchableWithoutFeedback>
              <HelpInfo
                title={'How to use go-to-failure'}
                alert={'Put phone, face up, under chest.\nTap screen to start counter.\nDo pushups to failure.\nTap again to stop.\nTap counter to reset.\nDon\'t count the reps.\nLet the app count.\nSwipe for other modes.'}
              />
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={this.flipRecordState}>
            <View style={styles.background}>
              <Text style={styles.instruct}>countdown</Text>
              <View style={styles.mainDisplay}>
                  <TextInput underlineColorAndroid={ 'transparent'} style={styles.counter} textAlign={'center'} value={'' + this.state.countdowncounter} keyboardType={ 'numeric'} onFocus={()=> this.setState({ countdowncounter: ''})} onChangeText={(text) => this.checkCountdown(text)} editable={this.state.scroll} maxLength={4}/>
              </View>
              <HelpInfo
                title={'How to use countdown'}
                alert={'Put phone, face up, under chest.\nTap counter to edit.\nTap screen to start countdown.\nDo pushups until sound plays.\nDon\'t count the reps.\nLet the app count.\nSwipe for other modes.'}
              />
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={this.flipRecordState}>
            <View style={styles.background}>
              <Text style={styles.instruct}>100 challenge</Text>
              <TouchableWithoutFeedback onPress={this.resetCounter}>
                <View style={styles.mainDisplay}>
                  <Pyramid count={this.state.counter}/>
                </View>
              </TouchableWithoutFeedback>
              <HelpInfo
                title={'How to do 100 challenge'}
                alert={'Put phone, face up, under chest.\nTap screen to start challenge.\nTap to stop.\nTap dots to resetCounter.\nDo reps until the sound, rest.\nRepeat until 100 are done.\nDon\'t count the reps.\nLet the app count.\nSwipe for other modes.'}
              />
            </View>
          </TouchableWithoutFeedback>

        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  counter: {
    textAlign: 'center',
    fontSize: 115,
    fontFamily: 'System',
    fontWeight: '100',
    minWidth: globalHeight * .25,
  },
  instruct: {
    fontSize: 20,
    fontFamily: 'System',
    fontWeight: '100',
  },
  mainDisplay: {
    justifyContent: 'center',
    alignItems: 'center',
    height: globalHeight * .3,
  },
  background: {
    height: globalHeight,
    width: globalWidth,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
