import React from 'react';
import {PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './AppNavigation';
import {UserProvider} from './providers/UserProvider';

function App(): React.JSX.Element {
  return (
    <PaperProvider>
      <UserProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </UserProvider>
    </PaperProvider>
  );
}

export default App;
