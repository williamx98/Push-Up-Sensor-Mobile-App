import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  TouchableWithoutFeedback
} from 'react-native';

var width = Dimensions.get('window').width;
var globalHeight = Dimensions.get('window').height;
var graphArray = [];
var graph;
export default class Pyramid extends Component<Props> {
  constructor(props) {
    super(props);
    for (var count = 1; count <= 10; count++) {
      graphArray.push(this.getColumns(count, 0));
    }
    for (var count = 9; count >= 1; count--) {
      graphArray.push(this.getColumns(count, 0));
    }
    graph = this.getGraph(0);
  }

  getCircle(fill) {
    var bgColor = fill ? 'black' : '#00000000';

    return ({
      marginTop: globalHeight/450,
      marginBottom: globalHeight/450,
      height: globalHeight/80,
      width: globalHeight/80,
      borderWidth: 1,
      borderColor: 'black',
      borderRadius: globalHeight/80,
      backgroundColor: bgColor
    });
  }

  getGraph(fill) {
    return (
      <View style={styles.graph}>
        {graphArray}
      </View>
      );
    }

  getColumns(height, fill) {
    var circles = [];

    for (var counter = 0; counter < height - fill; counter++) {
      circles.push(<View style={this.getCircle(false)} />);
    }
    for (var counter = 0; counter < fill; counter++) {
      circles.push(<View style={this.getCircle(true)}/>);
    }

    return (
      <View style={styles.column}>
        {circles}
      </View>
    );
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return graph;
  }
}

const styles = StyleSheet.create({
  column: {
    justifyContent: 'flex-end',
    marginTop: globalHeight/80,
    marginBottom: globalHeight/80,
    marginLeft: 3,
    marginRight: 3
  },
  graph: {
    flexDirection: 'row'
  },
});