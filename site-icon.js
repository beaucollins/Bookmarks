import React, {View, TouchableHighlight, Text, Image} from 'react-native'
import styles from './styles'

export default React.createClass({
  render: function() {
    const {icon} = this.props.site;
    var iconSource = {}
    if (icon && icon !== "") {
      iconSource = { uri: icon };
    }
    return (
      <View style={styles.bookmark}>
        <TouchableHighlight style={styles.siteButton} onPress={this.props.onPress} activeOpacity={0.4} underlayColor="transparent">
          <View>
            <Image style={styles.siteIcon} source={iconSource} />
            <Text numberOfLines={1} style={styles.textLabel}>{this.props.site.host}</Text>
          </View>
        </TouchableHighlight>
        <View style={styles.indicator} />
      </View>
    )
  }
});
