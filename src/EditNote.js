import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native'
import {openDatabase} from 'react-native-sqlite-storage';
import {useAuth} from './AuthContext';

let db = openDatabase({name: 'NotesDatabase.db'})
const EditNote = () => {

  const {
    isDarkMode,
    fontSize,
    iconSize
  } = useAuth();

  const route = useRoute();

  const [title, setTitle] = useState(route.params.data.title);
  const [note, setNote] = useState(route.params.data.note);
  const navigation = useNavigation()

  const updateNote = () => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE table_note SET title=?, note=? WHERE note_id=?',
        [title, note, route.params.data.id],
        (tx, results) => {
          console.log('Results', results.rowsAffected)
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'Note update successfully',
              [
                {
                  text: 'OK',
                  onPress: () => navigation.navigate('HomeStack')
                }
              ],
              {
                cancelable: false
              }
            )
          } else {
            Alert.alert('Update note failed!')
          }
        }
      )
    })
  }

  const closePressHandler = () => {
    navigation.goBack()
  };

  useEffect(() => {
    setTitle(route.params.data.title)
    setNote(route.params.data.note)
  }, [])

  return (
    <View
      style={[
        styles.container,
        isDarkMode ? {backgroundColor: '#000'} : {backgroundColor: '#fff'},
      ]}>
      <TextInput
        style={[
          styles.input,
          {
            fontSize: fontSize,
            color: isDarkMode ? '#fff' : '#000',
            borderColor: isDarkMode ? '#fff' : '#999',
          },
        ]}
        placeholder="Enter your title"
        placeholderTextColor={isDarkMode ? '#fff' : '#000'}
        onChangeText={value => setTitle(value)}
        value={title}
      />
      <TextInput
        style={[
          styles.input,
          {
            fontSize: fontSize,
            color: isDarkMode ? '#fff' : '#000',
            borderColor: isDarkMode ? '#fff' : '#999',
          },
        ]}
        numberOfLines={5}
        multiline={true}
        placeholder="Enter your note"
        placeholderTextColor={isDarkMode ? '#fff' : '#000'}
        onChangeText={value => setNote(value)}
        value={note}
      />
      <View style={styles.icon_container}>
        <TouchableOpacity
          style={styles.icon_close}
          onPress={() => closePressHandler()}>
          <Icon
            style={[
              {fontSize: iconSize}
            ]}
            name="close"
            color={isDarkMode ? '#000' : '#fff'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.icon_check}
          onPress={() => updateNote()}>
          <Icon 
            style={[
              {fontSize: iconSize}
            ]} 
            name="check" 
            color={isDarkMode ? '#000' : '#fff'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditNote;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  input: {
    width: '90%',
    marginTop: 20,
    borderWidth: 0.5,
    alignSelf: 'center',
    borderRadius: 5,
  },
  icon_container: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 10,
  },
  icon_close: {
    width: 50,
    height: 50,
    backgroundColor: '#fa0000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    marginRight: 5,
  },

  icon_check: {
    width: 50,
    height: 50,
    backgroundColor: '#03fd02',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    marginLeft: 5,
  },
});
