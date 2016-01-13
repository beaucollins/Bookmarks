module.exports = function(u){
  var slashes = "//";
  var protocol = u.slice(0, u.indexOf(':'));
  var absoluteURI = u.slice(u.indexOf('//'));
  var hostWithPath = absoluteURI.slice(2);
  var pathIndicator = hostWithPath.indexOf('/');
  var hostWithPort, host, path, port;
  if (pathIndicator === -1) {
    hostWithPort = hostWithPath;
    path = '/';
  } else {
    hostWithPort = hostWithPath.slice(0, pathIndicator);
    path = hostWithPath.slice(pathIndicator);
  }  

  var portIndicator = hostWithPort.indexOf(':');
  if (portIndicator === -1) {
    host = hostWithPort;
    port = host === 'https' ? 443 : 80;
  } else {
    host = hostWithPort.slice(0, portIndicator);
    port = parseInt(hostWithPort.slice(portIndicator + 1));
  }

  return {
    protocol: protocol,
    scheme: protocol,
    host: host,
    path: path,
    pathname: path,
    port: port,
    url: u
  }
}