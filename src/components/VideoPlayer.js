import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

const VideoPlayer = ({ videoURL }) => {

    const video = React.useRef(null);

    const [status, setStatus] = React.useState({});

  return (
    <View style={styles.container}>
        <Video
            ref={video}
            source={{ uri:  videoURL }}
            style={styles.video}
            resizeMode={ResizeMode.COVER}
            onPlaybackStatusUpdate={status => setStatus(() => status)}
            useNativeControls
        />
        <View style={styles.buttons}>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 8, 
    marginRight:8
  },
  video: {
    borderRadius: 10,
    width: 200,
    height: 200,
  },
});

export default VideoPlayer;
