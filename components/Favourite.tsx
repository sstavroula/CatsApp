import React, {useState} from 'react';
import {IconButton} from 'react-native-paper';
import {Cat} from '../data';
import {addToFavorites, removeFromFavorites} from '../requests';
import {notReached} from '../utils';
import {useUserId} from '../providers/UserProvider';

type FavouriteState =
  | {type: 'hearted'; favouriteId: number}
  | {type: 'notHearted'}
  | {type: 'updating'; favourite: boolean};

export const Favourite = ({cat}: {cat: Cat}) => {
  const userId = useUserId();

  const [state, setState] = useState<FavouriteState>(
    cat.favourite
      ? {type: 'hearted', favouriteId: cat.favourite.id}
      : {type: 'notHearted'},
  );

  const addFavourite = async () => {
    setState({type: 'updating', favourite: true});
    try {
      const {id: favouriteId} = await addToFavorites(cat.id, userId);
      setState({type: 'hearted', favouriteId});
    } catch (e) {
      setState({type: 'notHearted'});
    }
  };

  const removeFavourite = async (favouriteId: number) => {
    setState({type: 'updating', favourite: false});
    try {
      await removeFromFavorites(favouriteId);
      setState({type: 'notHearted'});
    } catch (e) {
      setState({type: 'hearted', favouriteId});
    }
  };

  switch (state.type) {
    case 'notHearted':
      return (
        <IconButton icon="heart-outline" onPress={addFavourite} size={18} />
      );
    case 'hearted':
      const {favouriteId} = state;
      return (
        <IconButton
          icon={'heart'}
          onPress={() => removeFavourite(favouriteId)}
          size={18}
        />
      );

    case 'updating':
      return (
        <IconButton
          icon={state.favourite ? 'heart' : 'heart-outline'}
          size={18}
        />
      );
    default:
      return notReached(state);
  }
};
