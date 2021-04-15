export function checkImgUrl(str) {
  if (!RegExp(/http/).test(str)) {
    return 'http://bbcm2020070700000006.xytest.qjclouds.com' + str
    // return str
  } else {
    return str
  }
}