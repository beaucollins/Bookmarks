import parseUrl from './parse-url'
import { NativeModules } from 'react-native'

const { SiteDetailLoader } = NativeModules

export default function Site(url) {
  this.url = parseUrl(url);
  this.host = this.url.host;
  this.load();
  this.posts = [];
}


Site.prototype.load = function() {

  // load site details via the native module
  SiteDetailLoader.requestSiteDetails(this.url.url, (e, siteDetails) => {
    console.log("Details: ", siteDetails);
    this.title = siteDetails.title;
    this.posts = siteDetails.posts;
    this.icon = siteDetails.icon;
  })

}

Site.prototype.getTitle = function() {
  return this.title || this.url.host;
}
