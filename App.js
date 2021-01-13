import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {RNCamera, FaceDetector} from 'react-native-camera';

const App = () => {
  const [detected, setDetected] = useState(false);
  const [faces, setFaces] = useState([]);
  const [count, setCount] = useState(0);

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
    }, 100);
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
    <View style={styles.facesContainer} pointerEvents="none">
      {faces.map(renderFace)}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{detected ? 'Detected' : 'Not Detected'}</Text>
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
    paddingVertical: 10,
    color: '#fff',
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
});

export default App;
