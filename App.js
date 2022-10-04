import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, FlatList, Button  } from 'react-native';
import React, { useEffect, useState } from 'react'
import * as SQLite from'expo-sqlite';

export default function App() {

  const [credit, setCredit] = useState('')
  const [title, setTitle] = useState('')
  const [courses, setCourses] = useState([])
 
  const db = SQLite.openDatabase('courselist.db')

  useEffect(() => {  
    db.transaction(tx => { 
         tx.executeSql('create table if not exists course (id integer primary key    not null, credits int, title text);');
          }, null, updateList);}, []);
  
    const saveItem = () => {
      db.transaction(tx => {
          tx.executeSql('insert into course (credits, title) values (?, ?);', 
          [parseInt(credit), title]);    },
           null, updateList)}

    const updateList = () => {
      db.transaction(tx => {
          tx.executeSql('select * from course;', [], (_, { rows }) =>
          setCourses(rows._array)    );
          }, null, null);}
          
    const deleteItem = (id) => {
          db.transaction( tx => {
          tx.executeSql(`delete from course where id = ?;`, [id]);
          }, null, updateList
          )    
          }
  
    const listSeparator = () => {
          return (
           <View
            style={{
            height: 5,
            width: "80%",
            backgroundColor: "#fff",
            marginLeft: "10%"
                  }}
                  />
                );
              };
   return (
  <View style={styles.container}>
       <TextInput style={{marginTop: 30, fontSize: 18, width: 200, borderColor: 'gray', borderWidth: 1}}
          placeholder='Title'
          onChangeText={title => setTitle(title)}  value={title}/>
      <TextInput style={{ marginTop: 5, marginBottom: 5,  fontSize:18, width: 200, borderColor: 'gray', borderWidth: 1}}
          placeholder='Credits'
          keyboardType='numeric'
          onChangeText={credit => setCredit(credit)}  value={credit}/>
      <Button onPress={saveItem}title="Save" />
      <FlatList
          style={{marginLeft : "5%"}}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) =>
        <View style={styles.listcontainer}>
          <Text>{item.title},{item.credits}</Text>
          <Text style={{color: '#0000ff'}} onPress={() => deleteItem(item.id)}>done</Text></View>}
          data={courses} 
          ItemSeparatorComponent={listSeparator} /> 
          
  </View>
  );
}



const styles = StyleSheet.create({
  container: {
   flex: 1,
   backgroundColor: '#fff',
   alignItems: 'center',
   justifyContent: 'center',
  },
  listcontainer: {
   flexDirection: 'row',
   backgroundColor: '#fff',
   alignItems: 'center'
  },
 });