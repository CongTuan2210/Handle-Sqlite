import { StyleSheet, View, Switch, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from './AuthContext';
import {openDatabase} from 'react-native-sqlite-storage';
import Slider from '@react-native-community/slider';

let db = openDatabase({name: 'Settings.db'})

const Setting = () => {

  useEffect(()=>{
    createTable()
  },[])

  const createTable = () => {
    db.transaction(txn => {
      txn.executeSql(
        "SELECT NAME FROM sqlite_master WHERE type='table' AND name='table_setting'",
        [],
        (tx, res) => {
          console.log('item', res.rows.length)
          if (res.rows.length ==0) {
            txn.executeSql('DROP TABLE IF EXISTS table_setting', [])
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_setting(id INTEGER PRIMARY KEY AUTOINCREMENT, dark_mode BOOLEAN, font_size INTEGER, title_size INTEGER, text_header INTEGER, icon_size INTEGER)',
              []
            );
          }
        },
        error => {
          console.log(error)
        }
      )
    })
  }

  const {
    isDarkMode,
    toggleSwitch,
    fontSize,
    handleSliderChange,
  } = useAuth();

  return (
    <View
      style={[
        styles.container,
        isDarkMode ? {backgroundColor: '#000'} : {backgroundColor: '#f2f2f2'},
      ]}>
      <View style={styles.switch}>
        <Text
          style={[
            styles.text_switch,
            isDarkMode ? {color: '#fff'} : {color: '#000'},
            {fontSize: fontSize},
          ]}>
          Dark Mode
        </Text>
        <Switch
          trackColor={{false: '#a9a9a9', true: '#04d4c1'}}
          thumbColor={isDarkMode ? '#aceae5' : '#ececec'}
          value={isDarkMode}
          onValueChange={toggleSwitch}
        />
      </View>
      <View style={styles.slider}>
        <View style={styles.setting_text}>
          <Text
            style={[
              styles.text_slider,
              isDarkMode ? {color: '#fff'} : {color: '#000'},
              {fontSize: fontSize},
            ]}>
            Font Size
          </Text>
          <Text
            style={[
              styles.text_fontsize,
              isDarkMode ? {color: '#fff'} : {color: '#000'},
              {fontSize: fontSize},
            ]}>
            {fontSize}
          </Text>
        </View>
        <Slider
          style={styles.slider_icon}
          minimumValue={14}
          maximumValue={30}
          step={2}
          minimumTrackTintColor="#137386"
          maximumTrackTintColor="#999"
          value={fontSize}
          onValueChange={handleSliderChange}
        />
      </View>
    </View>
  );
}

export default Setting

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  switch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  text_switch: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  slider: {
    marginTop: 10,
  },
  setting_text: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 32,
  },
  text_slider: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  text_fontsize: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  slider_icon: {
    width: 300,
    height: 40,
    alignSelf: 'center',
  }
})