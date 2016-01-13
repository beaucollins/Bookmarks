import React, { View, TouchableHighlight, Image } from 'react-native'
import styles from './styles'

export default React.createClass({
  render: function() {
    return (
      <View>
        <TouchableHighlight onPress={this.props.onPress} underlayColor={'transparent'} activeOpacity={0.5} style={[styles.siteButton, {justifyContent: 'space-around'}]}>
          <Image style={[{alignSelf: 'center'}]} source={require('./images/plus.png')}/>
        </TouchableHighlight>
      </View>
    )
  }
})