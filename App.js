import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    loadNotes();
  }, []);

  const saveNotes = async (newNotes) => {
    setNotes(newNotes);
    await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
  };

  const loadNotes = async () => {
    const saved = await AsyncStorage.getItem('notes');
    if (saved) setNotes(JSON.parse(saved));
  };

  const addNote = () => {
    if (title && desc && category) {
      const newNote = { id: Date.now(), title, desc, category };
      const updated = [newNote, ...notes];
      saveNotes(updated);
      setTitle('');
      setDesc('');
      setCategory('');
    }
  };

  const filteredNotes = filter === 'All' ? notes : notes.filter(n => n.category === filter);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📝 maddy App</Text>

      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput placeholder="Description" value={desc} onChangeText={setDesc} style={styles.input} />
      <TextInput placeholder="Category (e.g. Work, Personal)" value={category} onChangeText={setCategory} style={styles.input} />
      <Button title="Add Note" onPress={addNote} />

      <View style={styles.filters}>
        {['All', 'Work', 'Personal'].map(cat => (
          <TouchableOpacity key={cat} onPress={() => setFilter(cat)} style={[styles.filterBtn, filter === cat && styles.active]}>
            <Text>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredNotes}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.note}>
            <Text style={styles.noteTitle}>{item.title}</Text>
            <Text>{item.desc}</Text>
            <Text style={styles.category}>📂 {item.category}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 40 },
  heading: { fontSize: 26, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 10, borderRadius: 6 },
  note: { padding: 15, borderWidth: 1, borderColor: '#ddd', marginBottom: 10, borderRadius: 6 },
  noteTitle: { fontWeight: 'bold', fontSize: 18 },
  category: { marginTop: 5, fontStyle: 'italic', color: 'gray' },
  filters: { flexDirection: 'row', marginVertical: 10, gap: 10 },
  filterBtn: { borderWidth: 1, borderColor: '#000', borderRadius: 5, padding: 6, paddingHorizontal: 12 },
  active: { backgroundColor: '#d1e7dd' },
});
