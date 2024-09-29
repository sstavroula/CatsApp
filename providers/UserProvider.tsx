import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import uuid from 'react-native-uuid';
import {notReached} from '../utils';

type State = {type: 'loading'} | {type: 'loaded'; userId: string};

const UserContext = createContext<State>({type: 'loading'});

export const UserProvider = ({children}: {children: ReactNode}) => {
  const [state, setState] = useState<State>({type: 'loading'});

  const loadOrCreateUserId = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('user_id');

      if (storedUserId) {
        // If userId exists in AsyncStorage, set it to state
        setState({type: 'loaded', userId: storedUserId});
        return;
      }

      // If no userId exists, create one, store it, and set to state
      const newUserId = uuid.v4();
      if (typeof newUserId !== 'string') {
        throw new Error('Unexpected: v4 did not return a string');
      }

      await AsyncStorage.setItem('user_id', newUserId);
      setState({type: 'loaded', userId: newUserId});
    } catch (error) {
      console.error('Error loading/creating user ID:', error);
    }
  };

  useEffect(() => {
    loadOrCreateUserId();
  }, []);

  switch (state.type) {
    case 'loading':
      return null;
    case 'loaded':
      return (
        <UserContext.Provider value={state}>{children}</UserContext.Provider>
      );
    default:
      return notReached(state);
  }
};

export const useUserId = () => {
  const context = useContext(UserContext);

  switch (context.type) {
    case 'loading':
      throw new Error('User data not loaded');
    case 'loaded':
      return context.userId;
    default:
      return notReached(context);
  }
};
