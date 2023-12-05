import Icon from 'react-native-vector-icons/FontAwesome'
import React from 'react'
import AuthStack from './AuthStack'
import Setting from './Setting'
import {useAuth} from './AuthContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'

const Tab = createBottomTabNavigator()

const MainBottom = () => {

    const {isDarkMode} = useAuth();

    return (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, size, color}) => {
              let iconName;
              if (route.name === 'Home') {
                iconName = 'home';
                size = focused ? 30 : 25;
                color = focused ? '#4190f4' : isDarkMode ? '#fff' : '#000';
              } else if (route.name === 'Settings') {
                iconName = 'gear';
                size = focused ? 30 : 25;
                color = focused ? '#4190f4' : isDarkMode ? '#fff' : '#000';
              }
              return <Icon name={iconName} color={color} size={size} />;
            },
            tabBarLabelStyle: {fontSize: 15, fontWeight: '700'},
            tabBarInactiveBackgroundColor: isDarkMode ? '#000' : '#fff',
            tabBarActiveBackgroundColor: isDarkMode ? '#000' : '#fff',
            tabBarActiveTintColor: '#4190f4',
            tabBarInactiveTintColor: isDarkMode ? '#fff' : '#000',
          })}>
          <Tab.Screen
            name="Home"
            component={AuthStack}
            options={{headerShown: false}}
          />
          <Tab.Screen
            name="Settings"
            component={Setting}
            options={{
                headerStyle: {
                    backgroundColor: isDarkMode ? '#333' : '#fff',
                },
                headerTintColor: isDarkMode ? '#fff' : '#000',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
}

export default MainBottom