import React, {useState} from 'react';
import {Text, StyleSheet} from 'react-native';

const TextInANest = () => {
  const [titleText, setTitleText] = useState("Decision Tree");
  const bodyText = 'asdgsdga sdgasdg asd gasd gasdgasdgasdgasdg dsag';


  return (
    <Text style={styles.baseText}>
      <Text style={styles.titleText}numberOfLines={5}>{titleText}
      </Text>
      <Text numberOfLines={5}>{bodyText}</Text>
    </Text>
  );
};

const styles = StyleSheet.create({
  baseText: {
    fontFamily: 'Cochin',
    textAlign: 'center',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    
  },
});

export default TextInANest;