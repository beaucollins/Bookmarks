import { StyleSheet } from 'react-native'

export const ITEM_SPACING = 8;
export const ICON_SIZE = 64;
export const ITEMS_PER_ROW = 5;

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'hsla(0,0%,90%,1)',
    alignSelf: 'stretch',
    flex: 1,
  },
  container: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingLeft: ITEM_SPACING,
    paddingBottom: ITEM_SPACING
  },
  bookmark: {
    width: ICON_SIZE,
    height: ICON_SIZE + 12,
  },
  siteButton: {
    height: ICON_SIZE,
    width: ICON_SIZE
  },
  siteIcon: {
    height: ICON_SIZE,
    width: ICON_SIZE,
    marginBottom: 4,
    borderRadius: 8,
    backgroundColor: 'hsla(0,0%,50%,1.0)',
    overflow: 'hidden'
  },
  addSiteButton: {
    height: ICON_SIZE,
    width: ICON_SIZE
  },
  indicator: {
    width: 16,
    height: 16,
    position: 'absolute',
    top: ICON_SIZE-12,
    right: -4,
    borderRadius: 8,
    backgroundColor: '#F00'
  },
  drawer: {
    backgroundColor: 'hsla(0,0%,80%,1.0)',
    marginLeft: -ITEM_SPACING,
    overflow: 'hidden'
  },
  textLabel: {
    fontSize: 10,
    textAlign: 'center'
  }
});

export default styles