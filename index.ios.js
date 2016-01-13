/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
  AppRegistry,
  Text,
  View,
  TouchableHighlight,
  Animated,
  ScrollView,
  LinkingIOS,
  Image,
  AlertIOS
} from 'react-native'

import Site from './site'
import SiteIcon from './site-icon'
import SiteDrawer from './site-drawer'
import AddSiteButton from './add-site-button'
import styles, {ITEM_SPACING, ITEMS_PER_ROW, ICON_SIZE} from './styles'

var SITES = ["http://toni.org", "http://digitalize.ca", "http://ma.tt", "http://noscope.com", "http://127.0.0.1:8000", "http://danroundhill.com", "http://beaucollins.wordpress.com"];

var Bookmarks = React.createClass({
  getInitialState: function() {
    return {
      sites: [],
      drawerWidth: 0,
      drawerOpenHeight: 0,
      columns: 0,
      itemMargin: ITEM_SPACING
    }
  },

  calculateItemMargin: function(width) {
    var availableWidth = width - (ITEM_SPACING * 2);
    var minSpacing = ITEM_SPACING;
    var columns = Math.floor(availableWidth / (ICON_SIZE + ITEM_SPACING));
    var spacePerColumn = availableWidth/columns;
    var itemSpacing = (spacePerColumn - ICON_SIZE) * 0.5;
    return { columns, itemSpacing }
  },

  onLayout: function(event) {
    this.setState(Object.assign({}, {
      drawerWidth: event.nativeEvent.layout.width,
      drawerHeight: 0,
      drawerOpenHeight: event.nativeEvent.layout.height - ICON_SIZE - ITEM_SPACING * 8,
      drawerOpen: false
    }, this.calculateItemMargin(event.nativeEvent.layout.width)))
  },

  addSite: function(url) {
    // TODO: // search for existing site by url
    if (!url) return;
    if (!url.match(/^https?:\/\//)) {
      url = 'http://' + url
    }
    this.setState({sites: [new Site(url)].concat(this.state.sites)})
  },

  componentDidMount: function() {
    // simulate adding each bookmark
    SITES.forEach(site => this.addSite(site))
    SITES.forEach((site, i) => setTimeout(() => this.addSite(site), 0))
  },

  onPress: function(site, index, e) {
    if (this.state.selectedSiteIndex === index && this.state.drawerOpen) {
      this.setState({drawerOpen: false, drawerHeight: 0})
    } else {
      const { drawerRow } = this.state;
      const nextDrawerRow = Math.floor((index+1)/this.state.columns) + 1;
      this.setState({selectedSiteIndex: index, drawerRow: nextDrawerRow, drawerOpen:true, drawerHeight: this.state.drawerOpenHeight})
    }
  },

  withSelectedSite: function(fn) {
    const { sites, selectedSiteIndex } = this.state;
    const site = this.state.sites[selectedSiteIndex];
    if (!site) return
    return fn.call(this, site)
  },

  addNewSite: function(e) {
    // alert view?
    AlertIOS.alert(
      'Add Site',
      '',
      [
        {text: 'Cancel', onPress: () => console.log('cancel'), style: 'cancel'},
        {text: 'Ok', onPress: (value) => this.addSite(value)}
      ],
      'plain-text'
    )
  },

  renderBookmarks: function() {
    var add = (<View key={"add-site"} style={[styles.bookmark, {margin: this.state.itemSpacing}]}><AddSiteButton onPress={this.addNewSite} key={"add-site"} /></View>)
    return [add].concat(this.state.sites.map((site, i) => {
      return (
        <View key={i} style={[styles.bookmark, {margin: this.state.itemSpacing}]}>
          <SiteIcon site={site} onPress={this.onPress.bind(this, site, i)} />
        </View>
      )
    }))
  },

  onReloadSites: function(endRefreshing) {
    // loop through each site and refresh them
    setTimeout(endRefreshing, 1000);
  },

  onRefreshSite: function(site, endRefreshing) {
    setTimeout(endRefreshing, 1000)
  },

  renderDrawer: function(bookmarks) {
    var drawer = this.withSelectedSite((site) => {
      return (
        <SiteDrawer key="drawer" site={site} drawerWidth={this.state.drawerWidth} drawerHeight={this.state.drawerHeight} animate={this.state.animateDrawer}>
          <View style={{padding: 8}}>
            <Text numberOfLines={1} style={{textAlign: 'center' }}>{site.getTitle()}</Text>
            <Text numberOfLines={1} style={{textAlign: 'center', fontSize: 12, fontStyle: 'italic'}}>{site.host}</Text>
          </View>
          <ScrollView onRefreshStart={this.onRefreshSite.bind(this, site)} alwaysBounceVertical={true}>
            {site.posts.map((post, index) => {
              return (
                <View key={index}>
                  <TouchableHighlight underlayColor={"transparent"} activeOpacity={0.4} onPress={LinkingIOS.openURL.bind(null, post.guid)}>
                    <Text numberOfLines={1} style={{padding: 8, fontSize: 14}}>{post.title}</Text>
                  </TouchableHighlight>
                </View>
              )
            })}
          </ScrollView>
        </SiteDrawer>
      )
    })

    if (!drawer) {
      return bookmarks;
    }

    const { drawerRow } = this.state;
    var drawerIndex = drawerRow * this.state.columns;

    return bookmarks.slice(0, drawerIndex).concat(drawer).concat(bookmarks.slice(drawerIndex));

  },

  render: function() {
    return (
      <View style={{flexDirection:'column', justifyContent:'flex-end', alignItems:'stretch', backgroundColor: 'green', alignSelf: 'stretch', flex: 1}}>
        <ScrollView
          contentInset={{top: ITEM_SPACING * 3}}
          contentOffset={{y: -ITEM_SPACING * 3}}
          scrollEnabled={!this.state.drawerOpen}
          onRefreshStart={this.onReloadSites} style={styles.root}
          contentContainerStyle={styles.container}
          onLayout={this.onLayout}>
          { this.renderDrawer(this.renderBookmarks()) }
        </ScrollView>
      </View>
    )
  }
});

AppRegistry.registerComponent('Bookmarks', () => Bookmarks);
AppRegistry.registerComponent('SiteIcon', () => Site);

var NavigationBarRouteMapper = { 
  LeftButton: function( route, navigator, index, navState ){
    return(
      <Text>{ route.leftButton }</Text>
    )
  },

  Title: function( route, navigator, index, navState ){
    return(
      <Text>{ route.title }</Text>
    )
  },

  RightButton: function( route, navigator, index, navState ){
    return(
      <Text>{ route.rightButton }</Text>
    )
  }
}
