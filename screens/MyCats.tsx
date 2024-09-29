import React, {useCallback, useEffect} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {getMyCats} from '../requests';
import {Cat} from '../data';
import {CatImage} from '../components/CatImage';
import {ActivityIndicator, Button, Text} from 'react-native-paper';
import {useUserId} from '../providers/UserProvider';
import {notReached} from '../utils';
import {getAllImageVotesDict} from '../helper';
import {RootStackParamList} from '../AppNavigation';
import {StackNavigationProp} from '@react-navigation/stack';
import {useFocusEffect} from '@react-navigation/native';
import {ORANGE} from '../theme/colors';

const ERROR_GETTING_IMAGES = ' Oops, something went wrong...';
const NO_IMAGES_TEXT =
  "You have no images, why don't you start by uploading some!";
const NO_IMAGES_BUTTON_TEXT = ' Upload your first image';
const ENTRIES_PER_PAGE = 10;

type UploadScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Upload'
>;

interface Props {
  navigation: UploadScreenNavigationProp;
}

type State =
  | {type: 'loading'}
  | {type: 'error'}
  | {
      type: 'list';
      cats: Cat[];
      lastPage: number;
      votesDict: Record<string, number>;
    }
  | {
      type: 'loadingMore';
      cats: Cat[];
      lastPage: number;
      votesDict: Record<string, number>;
    };

export const MyCats = ({navigation}: Props) => {
  const [state, setState] = React.useState<State>({type: 'loading'});
  const userId = useUserId();

  const load = useCallback(async () => {
    setState({type: 'loading'});
    try {
      const cats = await getMyCats(0, ENTRIES_PER_PAGE, userId);
      const votesDict = await getAllImageVotesDict();
      setState({type: 'list', cats, lastPage: 0, votesDict});
    } catch (e) {
      setState({type: 'error'});
    }
  }, [userId, setState]);

  const loadMore = async () => {
    switch (state.type) {
      case 'loading':
      case 'error':
      case 'loadingMore':
        break;
      case 'list':
        const nextPage = state.lastPage + 1;

        if (state.cats.length < nextPage * ENTRIES_PER_PAGE) {
          return;
        }

        setState({
          type: 'loadingMore',
          cats: state.cats,
          lastPage: state.lastPage,
          votesDict: state.votesDict,
        });

        try {
          const cats = await getMyCats(nextPage, ENTRIES_PER_PAGE, userId);
          setState(s => {
            switch (s.type) {
              case 'loading':
              case 'error':
                return s;
              case 'loadingMore':
              case 'list':
                return {
                  type: 'list',
                  cats: [...s.cats, ...cats],
                  lastPage: nextPage,
                  votesDict: s.votesDict,
                };
              default:
                return notReached(s);
            }
          });
        } catch (e) {}
        break;
      default:
        notReached(state);
    }
  };

  useEffect(() => {
    load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      load();
      return () => {};
    }, [load]),
  );

  const getLoader = () => {
    return <ActivityIndicator animating={true} color={ORANGE} />;
  };
  switch (state.type) {
    case 'loading':
      return (
        <View style={[styles.parent, styles.centerAligned]}>{getLoader()}</View>
      );
    case 'error':
      return (
        <View style={[styles.parent, styles.centerAligned]}>
          <Text variant="labelMedium">{ERROR_GETTING_IMAGES}</Text>
        </View>
      );
    case 'loadingMore':
    case 'list':
      return state.cats.length > 0 ? (
        <View style={styles.parent}>
          <FlatList
            data={state.cats}
            keyExtractor={item => item.id}
            numColumns={2}
            contentContainerStyle={styles.flatListContainer}
            renderItem={({item}) => (
              <CatImage
                cat={item}
                initialVotes={state.votesDict[item.id] || 0}
              />
            )}
            onEndReached={loadMore}
            onEndReachedThreshold={0.2}
            ListFooterComponent={() =>
              state.type === 'loadingMore' ? getLoader() : null
            }
          />
        </View>
      ) : (
        <View style={[styles.parent, styles.centerAligned]}>
          <Text variant="labelMedium" style={styles.noImagesText}>
            {NO_IMAGES_TEXT}
          </Text>
          <Button
            icon="camera"
            onPress={() => navigation.navigate('Upload')}
            mode={'outlined'}
            children={
              <Text variant="labelMedium">{NO_IMAGES_BUTTON_TEXT}</Text>
            }
          />
        </View>
      );
    default:
      return notReached(state);
  }
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    padding: 10,
  },
  flatListContainer: {
    gap: 10,
    borderRadius: 20,
  },
  centerAligned: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImagesText: {
    textAlign: 'center',
    padding: 10,
  },
});
