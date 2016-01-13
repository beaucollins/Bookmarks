import React, { Animated } from 'react-native'
import styles from './styles'


export default React.createClass({
  getDefaultProps: function() {
    return {
      drawerWidth: 0,
      drawerHeight: 0,
      animate: false
    }
  },

  getInitialState: function() {
    return {
      drawerHeight: this.props.drawerHeight,
      drawerAnim: new Animated.Value(0)
    }
  },

  componentDidUpdate: function(prevProps, prevState) {
    console.log('Time to animate', this.props.drawerHeight);
    Animated.timing(
      this.state.drawerAnim,
      {toValue: this.props.drawerHeight, duration: 200}
    ).start()
  },

  componentDidMount: function() {

    Animated.timing(
      this.state.drawerAnim,
      {toValue: this.props.drawerHeight, duration: 200}
    ).start()

  },

  render: function() {
    return (
      <Animated.View style={[styles.drawer, {width: this.props.drawerWidth, height: this.state.drawerAnim}]}>
        {this.props.children}
      </Animated.View>
    )
  }
})
