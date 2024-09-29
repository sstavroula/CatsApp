import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {MyCats} from './screens/MyCats';
import {Upload} from './screens/Upload';
import {IconButton} from 'react-native-paper';
import {ORANGE} from './theme/colors';

const Stack = createStackNavigator();

export type RootStackParamList = {
  MyCats: undefined;
  Upload: undefined;
};

const getHeaderRightButton = (navigation: {
  navigate: (arg0: string) => void;
}) => {
  return (
    <IconButton
      icon={'plus'}
      onPress={() => navigation.navigate('Upload')}
      size={24}
      iconColor="black"
    />
  );
};

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="MyCats">
      <Stack.Screen
        name="MyCats"
        component={MyCats}
        options={({navigation}) => ({
          title: 'My Cats',
          headerStyle: {
            backgroundColor: ORANGE,
          },
          headerTitleStyle: {
            color: 'black',
          },
          headerRight: () => getHeaderRightButton(navigation),
        })}
      />
      <Stack.Screen
        name="Upload"
        component={Upload}
        options={{
          title: 'Upload Image',
          headerStyle: {
            backgroundColor: ORANGE,
          },
          headerTitleStyle: {
            color: 'black',
          },
          headerTintColor: 'black',
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
