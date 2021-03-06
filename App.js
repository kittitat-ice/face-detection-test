import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Linking} from 'react-native';
import {RNCamera} from 'react-native-camera';

const App = () => {
  const [detected, setDetected] = useState(false);
  const [faces, setFaces] = useState([]);
  const [count, setCount] = useState(0);
  const [url, setUrl] = useState('none');
  const [topHeight, setTopHeight] = useState(0);

  const onFacesDetected = (faceObj) => {
    console.log(detected);
    setDetected(true);
    setCount((val) => val + 1);
    setFaces(faceObj.faces);
  };

  useEffect(() => {
    let _count = count;
    console.log(count);
    var timer = setTimeout(() => {
      if (count === _count) {
        setDetected(false);
        setFaces([]);
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [count]);

  const renderFace = ({bounds, faceID, rollAngle, yawAngle}) => (
    <View
      key={faceID}
      transform={[
        {perspective: 600},
        {rotateZ: `${rollAngle.toFixed(0)}deg`},
        {rotateY: `${yawAngle.toFixed(0)}deg`},
      ]}
      style={[
        styles.face,
        {
          ...bounds.size,
          left: bounds.origin.x,
          top: bounds.origin.y,
        },
      ]}>
      <Text style={styles.faceText}>ID: {faceID}</Text>
      <Text style={styles.faceText}>rollAngle: {rollAngle.toFixed(0)}</Text>
      <Text style={styles.faceText}>yawAngle: {yawAngle.toFixed(0)}</Text>
    </View>
  );

  const renderFaces = () => (
    <View
      style={[styles.facesContainer, {top: topHeight}]}
      pointerEvents="none">
      {faces.map(renderFace)}
    </View>
  );

  useEffect(() => {
    const getUrlAsync = async () => {
      const link = await Linking.getInitialURL();
      if (link) {
        setUrl(link);
      }
    };
    getUrlAsync();
  }, []);

  return (
    <View style={styles.container}>
      <View
        onLayout={({nativeEvent}) =>
          setTopHeight(nativeEvent.layout.y + nativeEvent.layout.height)
        }>
        <Text style={styles.text}>
          {detected ? 'Detected' : 'Not Detected'}
        </Text>
        <Text style={styles.text}>{'initialURL: ' + url}</Text>
        <TouchableOpacity
          onPress={() => {
            let q = encodeURIComponent('hello world');
            const testurl = 'https://google.com/search?q=' + q;
            console.log(testurl);
            Linking.openURL(testurl);
          }}
          style={styles.button}>
          <Text>{'Link test'}</Text>
        </TouchableOpacity>
      </View>
      <RNCamera
        style={styles.preview}
        type={RNCamera.Constants.Type.front}
        onFacesDetected={onFacesDetected}
        faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.fast}
        onFaceDetectionError={(e) => console.log('ERROR', e)}
      />
      {renderFaces()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#555',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    color: '#fff',
    marginTop: 5,
  },
  facesContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
  },
  face: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    borderColor: '#FFD700',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  faceText: {
    color: '#FFD700',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    backgroundColor: 'transparent',
  },
  button: {
    backgroundColor: 'tomato',
    alignSelf: 'center',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
});

export default App;
