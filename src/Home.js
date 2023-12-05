import {StyleSheet, Text, View, TouchableOpacity, Alert, FlatList} from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {openDatabase} from 'react-native-sqlite-storage';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {useAuth} from './AuthContext';


let db = openDatabase({name:'NotesDatabase.db'})
const Home = () => {
  const {
    isDarkMode,
    titleSize,
    textHeader,
    fontSize,
    iconSize
  } = useAuth();

  const isFocused = useIsFocused()
  const navigation = useNavigation()
  const [noteList, setNoteList] = useState([])
    
  useEffect(()=>{
    getData()
  },[isFocused])

  const getData = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM table_note',
        [],
        (tx, results) => {
          let temp = [];
          for (let i = 0; i< results.rows.length; ++i) {
            console.log(results.rows.item(i))
            temp.push(results.rows.item(i))
          }
          setNoteList(temp);
        }
      )
    })
  }

  let deleteNote = (id) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM table_note WHERE note_id=?',
        [id],
        (tx, results) => {
          console.log('Results', results.rowsAffected)
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'Note delete successfully',
              [
                {
                  text: 'Ok',
                  onPress: () => {
                    getData()
                  }
                }
              ],
              {
                cancelable: false
              }
            )
          } else {
            Alert.alert('Note delete failed!')
          }
        }
      )
    })
  }

  const AddPressHandler = () => {
      navigation.navigate('AddNote')
  }

  return (
    <View 
      style={[
        styles.container,
        isDarkMode ? {backgroundColor: '#000'} : {backgroundColor: '#f2f2f2'},
      ]}
    >
      <View style={styles.main}>
        <Text 
          style={[
            styles.text_header,
            isDarkMode ? {color: '#078ee6'} : {color: '#f65809'},
            {fontSize: textHeader},
          ]}
        >
          Note App
        </Text>
        <View style={styles.body}>
            <Text 
              style={[
                styles.text,
                isDarkMode ? {color: '#fff'} : {color: '#999'},
                {fontSize: textHeader},
              ]}
            >
              All notes
            </Text>
            <TouchableOpacity
                style={[
                  styles.icon,
                  isDarkMode ? {backgroundColor: '#078ee6'} : {backgroundColor: '#f65809'},
                ]}
                onPress={() => AddPressHandler()}
            >
                <Icon 
                  style={[
                    {fontSize: iconSize}
                  ]}
                  name="plus" 
                  color={isDarkMode ? '#000' : '#fff'}
                />
            </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={noteList}
        // keyExtractor={(index)}
        renderItem={({item, index})=> {
          return (
            <TouchableOpacity
              style={[
                styles.render,
                {
                  borderColor: isDarkMode ? '#fff' : '#999',
                }
              ]}
              onPress={() => {
                navigation.navigate('EditNote', {
                  data: {
                    title: item.title,
                    note: item.note,
                    id: item.note_id,
                  },
                });
              }}>
              <View style={styles.info}>
                <Text
                  style={[
                    styles.title,
                    isDarkMode ? {color: '#fff'} : {color: '#8d8d8d'},
                    {fontSize: titleSize},
                  ]}>
                  {item.title}
                </Text>
                <Text
                  style={[
                    styles.note,
                    isDarkMode ? {color: '#fff'} : {color: '#8d8d8d'},
                    {fontSize: fontSize},
                  ]}>
                  {item.note}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.trash}
                onPress={() => deleteNote(item.note_id)}>
                <Icon
                  style={
                    {fontSize: iconSize}
                  }
                  name="trash"
                  color={isDarkMode ? '#fff' : '#8d8d8d'}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
      /> 
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  text_header: {
    color: '#f65809',
    fontSize: 24,
    fontWeight: '900',
    alignSelf: 'center',
  },
  body: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 30,
    marginHorizontal: 30,
  },
  text: {
    fontSize: 24,
    color: '#b9b9b9',
    fontWeight: '900',
  },
  icon: {
    backgroundColor: '#f65809',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  info: {
    marginLeft: 10,
    width: 280,
  },
  title: {
    fontSize: 18,
    marginTop: 10,
    fontWeight: '800',
  },
  note: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  trash: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  render:{
    marginTop: 20,
    borderWidth: 0.9,
    borderRadius: 10,
    borderColor: '#999',
    width: '90%',
    height: 'auto',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

});
