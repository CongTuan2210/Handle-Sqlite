import React from 'react'
import Home from './Home'
import AddNote from './AddNote'
import EditNote from './EditNote'
import {useAuth} from './AuthContext';
import { createStackNavigator } from '@react-navigation/stack'


const Stack = createStackNavigator()

const AuthStack = () => {

  const {isDarkMode} = useAuth();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeStack"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AddNote"
        component={AddNote}
        options={{
          headerStyle: {
            backgroundColor: isDarkMode ? '#333' : '#fff',
          },
          headerTintColor: isDarkMode ? '#fff' : '#000',
        }}
      />
      <Stack.Screen
        name="EditNote"
        component={EditNote}
        options={{
          headerStyle: {
            backgroundColor: isDarkMode ? '#333' : '#fff',
          },
          headerTintColor: isDarkMode ? '#fff' : '#000',
        }}
      />
    </Stack.Navigator>
  );
}

export default AuthStack
