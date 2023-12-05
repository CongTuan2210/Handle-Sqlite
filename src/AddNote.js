import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {openDatabase} from 'react-native-sqlite-storage';
import {useAuth} from './AuthContext';

let db = openDatabase({name: 'NotesDatabase.db'});

const AddNote = () => {
  const {isDarkMode, fontSize, iconSize} = useAuth();

  useEffect(() => {
    createTable();
  }, []);

  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const navigation = useNavigation();

  const saveNote = () => {
    console.log(title, note);
    if (title.trim() === '' || note.trim() === '') {
      Alert.alert(
        'Warning',
        'Please enter a title!',
        [
          {
            text: 'Ok',
          },
        ],
        {
          cancelable: false,
        },
      );
    } else {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO table_note (title, note) VALUES (?, ?)',
          [title, note],
          (tx, results) => {
            console.log('Result', results.rowsAffected);
            if (results.rowsAffected > 0) {
              navigation.navigate('HomeStack');
            }
          },
          error => {
            console.log(error);
          },
        );
      });
    }
  };

  const createTable = () => {
    db.transaction(txn => {
      txn.executeSql(
        "SELECT NAME FROM sqlite_master WHERE type='table' AND name='table_note'",
        [],
        (tx, res) => {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_note', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_note(note_id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, note TEXT)',
              [],
            );
          }
        },
        error => {
          console.log(error);
        },
      );
    });
  };

  const closePressHandler = () => {
    navigation.goBack();
  };

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
            style={[{fontSize: iconSize}]}
            name="close"
            color={isDarkMode ? '#000' : '#fff'}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.icon_check} onPress={() => saveNote()}>
          <Icon
            style={[{fontSize: iconSize}]}
            name="check"
            color={isDarkMode ? '#000' : '#fff'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddNote;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  input: {
    width: '90%',
    marginTop: 20,
    borderWidth: 0.9,
    alignSelf: 'center',
    borderRadius: 5,
    borderColor: '#999',
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
