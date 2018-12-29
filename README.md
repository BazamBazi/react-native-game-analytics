
# react-native-game-analytics
[![npm](https://img.shields.io/npm/v/gameanalytics.svg)](https://www.npmjs.com/package/gameanalytics)
[![npm](https://img.shields.io/npm/dt/gameanalytics.svg?label=npm%20downloads)](https://www.npmjs.com/package/gameanalytics)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)


Unofficial repository for GameAnalytics react-native SDK based on GA-SDK-JAVASCRIPT v3.0.3

GA-SDK-JAVASCRIPT Documentation can be found [here](https://gameanalytics.com/docs/javascript-sdk).

## Getting started

`$ npm install react-native-game-analytics --save`

### Mostly automatic installation

`$ react-native link react-native-game-analytics`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-game-analytics` and add `RNGameAnalytics.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNGameAnalytics.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.bazambazi.gameanalytics.RNGameAnalyticsPackage;` to the imports at the top of the file
  - Add `new RNGameAnalyticsPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-game-analytics'
  	project(':react-native-game-analytics').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-game-analytics/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-game-analytics')
  	```


## Usage
```javascript
import RNGameAnalytics from 'react-native-game-analytics';

// TODO: What to do with the module?
RNGameAnalytics;
```
  