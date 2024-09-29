import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Cat} from '../data';
import {Vote} from './Vote';
import {Favourite} from './Favourite';
import {DARK_GRAY, LIGHT_GRAY} from '../theme/colors';

export const CatImage = ({
  cat,
  initialVotes,
}: {
  cat: Cat;
  initialVotes: number;
}) => {
  return (
    <View style={styles.itemParent}>
      <View style={styles.imageParent}>
        <Image
          source={{uri: cat.url}}
          style={[
            styles.image,
            {
              aspectRatio: cat.height && cat.width ? cat.width / cat.height : 1,
            },
          ]}
        />
      </View>
      <View style={styles.bottomItemParent}>
        <View style={styles.bottomAction}>
          <Vote cat={cat} initialVotes={initialVotes} />
          <Favourite cat={cat} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemParent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  image: {
    width: '100%',
    resizeMode: 'contain',
  },
  imageParent: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: LIGHT_GRAY,
  },
  bottomItemParent: {
    backgroundColor: DARK_GRAY,
    height: 73,
    width: '100%',
  },
  bottomAction: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});
