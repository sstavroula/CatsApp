import React, {useEffect, useState} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {ErrorCode, launchImageLibrary} from 'react-native-image-picker';
import {Button, Text} from 'react-native-paper';
import {MyAsset, MyAssetSchema} from '../data';
import {uploadCatPhoto} from '../requests';
import {notReached} from '../utils';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../AppNavigation';
import {useUserId} from '../providers/UserProvider';

const CHOOSE_IMAGE = 'Choose image';
const UPLOAD_IMAGE = 'Upload image';
const UPLOADING = 'Uploading';
const TRY_AGAIN = 'Try again';
const CAMERA_PROBLEM = 'There is a problem with your camera';
const PERMISSION_PROBLEM = "You didn't allow use of camera";
const GENERAL_PROBLEM = 'Oops something went wrong...';

type UploadScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Upload'
>;

interface Props {
  navigation: UploadScreenNavigationProp;
}

type State =
  | {type: 'initial'}
  | {type: 'imageSelected'; asset: MyAsset}
  | {type: 'uploading'; asset: MyAsset}
  | {type: 'uploaded'}
  | {type: 'errorUploading'; asset: MyAsset}
  | {type: 'errorSelectingImage'; errorCode: ErrorCode};

export const Upload = ({navigation}: Props) => {
  const [state, setState] = useState<State>({type: 'initial'});
  const userId = useUserId();

  const onUploadPhoto = async (asset: MyAsset) => {
    setState({type: 'uploading', asset});
    try {
      await uploadCatPhoto(asset, userId);
      setState({type: 'uploaded'});
    } catch (e) {
      setState({type: 'errorUploading', asset});
    }
  };
  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
    } as const;

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        setState({type: 'initial'});
      } else if (response.errorCode) {
        setState({type: 'errorSelectingImage', errorCode: response.errorCode});
      } else if (response.assets && response.assets.length > 0) {
        const parsedAsset = MyAssetSchema.safeParse(response.assets[0]);
        if (parsedAsset.success) {
          setState({type: 'imageSelected', asset: parsedAsset.data});
        }
      }
    });
  };

  useEffect(() => {
    switch (state.type) {
      case 'initial':
      case 'imageSelected':
      case 'uploading':
      case 'errorUploading':
      case 'errorSelectingImage':
        break;
      case 'uploaded':
        navigation.goBack();
        break;
      default:
        notReached(state);
    }
  }, [state, navigation]);

  switch (state.type) {
    case 'initial':
      return (
        <View style={styles.parent}>
          <Image
            source={require('../assets/images/no_image.jpg')}
            style={styles.image}
          />
          <View style={styles.spaceTop}>
            <Button
              icon="camera"
              onPress={selectImage}
              mode={'outlined'}
              children={<Text variant="labelMedium">{CHOOSE_IMAGE}</Text>}
            />
          </View>
        </View>
      );
    case 'imageSelected':
      return (
        <View style={styles.parent}>
          <Image source={{uri: state.asset.uri}} style={styles.image} />
          <View style={styles.spaceTop}>
            <Button
              icon="camera"
              onPress={selectImage}
              mode={'outlined'}
              children={<Text variant="labelMedium">{CHOOSE_IMAGE}</Text>}
            />
            <Button
              icon="upload"
              onPress={() => onUploadPhoto(state.asset)}
              mode={'outlined'}
              style={styles.button}
              children={<Text variant="labelMedium">{UPLOAD_IMAGE}</Text>}
            />
          </View>
        </View>
      );
    case 'uploading':
      return (
        <View style={styles.parent}>
          <Image source={{uri: state.asset.uri}} style={styles.image} />
          <View style={styles.spaceTop}>
            <Button
              icon="upload"
              disabled
              loading
              mode={'outlined'}
              children={<Text variant="labelMedium">{UPLOADING}</Text>}
              style={styles.button}
            />
          </View>
        </View>
      );
    case 'uploaded':
      return null;
    case 'errorUploading':
      return (
        <View style={styles.parent}>
          <Image source={{uri: state.asset.uri}} style={styles.image} />
          <View style={styles.spaceTop}>
            <Button
              icon="camera"
              onPress={selectImage}
              mode={'outlined'}
              children={<Text variant="labelMedium">{CHOOSE_IMAGE}</Text>}
            />
            <Button
              icon="upload"
              onPress={() => onUploadPhoto(state.asset)}
              mode={'outlined'}
              children={<Text variant="labelMedium">{TRY_AGAIN}</Text>}
              style={styles.button}
            />
          </View>
          <Text variant="labelMedium">Oops something went wrong...</Text>
        </View>
      );
    case 'errorSelectingImage':
      return (
        <View style={styles.parent}>
          <Image
            source={require('../assets/images/no_image.jpg')}
            style={styles.image}
          />
          <View style={styles.spaceTop}>
            <Button
              icon="camera"
              onPress={selectImage}
              mode={'outlined'}
              children={<Text variant="labelMedium">{CHOOSE_IMAGE}</Text>}
            />
          </View>
          <Text variant="labelMedium" style={styles.spaceTop}>
            {(() => {
              switch (state.errorCode) {
                case 'camera_unavailable':
                  return CAMERA_PROBLEM;
                case 'permission':
                  return PERMISSION_PROBLEM;
                case 'others':
                  return GENERAL_PROBLEM;
                default:
                  notReached(state.errorCode);
              }
            })()}
          </Text>
        </View>
      );
    default:
      return notReached(state);
  }
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    alignItems: 'center',
    marginTop: '20%',
  },
  image: {
    width: 200,
    height: 200,
  },
  spaceTop: {
    marginTop: 20,
  },
  button: {
    marginVertical: 20,
  },
});
