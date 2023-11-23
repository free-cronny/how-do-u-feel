import React, { useState, useEffect } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import catIcon from "./assets/cat-svg.png";
import trashIcon from "./assets/trash.png";

export default function App() {
  const initialData = [
    { id: "1", title: "Ei você...", description: "Como você está?" },
  ];

  const [data, setData] = useState(initialData);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", description: "" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("data");
      if (storedData !== null) {
        setData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Erro ao carregar dados do AsyncStorage:", error);
    }
  };

  const saveData = async (newData) => {
    try {
      await AsyncStorage.setItem("data", JSON.stringify(newData));
    } catch (error) {
      console.error("Erro ao salvar dados no AsyncStorage:", error);
    }
  };

  const deleteItem = (itemId) => {
    const newData = data.filter((item) => item.id !== itemId);
    setData(newData);
    saveData(newData);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.itemContainer}>
        <Image source={catIcon} style={styles.image} />
        <Text style={styles.title}>{item.title}</Text>
        <TouchableOpacity onPress={() => deleteItem(item.id)}>
          <Image source={trashIcon} style={styles.image} />
        </TouchableOpacity>
      </View>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  const handleAddPost = () => {
    const newPostData = {
      id: String(Date.now()),
      title: newPost.title,
      description: newPost.description,
    };

    const newData = [...data, newPostData];
    setData(newData);
    saveData(newData);

    setNewPost({ title: "", description: "" });
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Diario da Nana</Text>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
      <StatusBar style="auto" />

      {/* Modal para adicionar novo post */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Novo Mood</Text>
          <TextInput
            style={styles.input}
            placeholder="Título"
            value={newPost.title}
            onChangeText={(text) => setNewPost({ ...newPost, title: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Descrição"
            value={newPost.description}
            onChangeText={(text) =>
              setNewPost({ ...newPost, description: text })
            }
          />
          <View style={styles.btnContainer}>
            <Button
              style={styles.btnInteract}
              title="Adicionar"
              onPress={handleAddPost}
            />
            <Button
              style={styles.btnInteract}
              title="Fechar"
              onPress={() => setModalVisible(!modalVisible)}
            />
          </View>
        </View>
      </Modal>

      {/* Botão para abrir o modal */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAE3E1",
    fontSize: "1rem",
    fontStyle: "normal",
    fontWeight: "bold",
    lineHeight: "normal",
  },
  header: {
    backgroundColor: "#EA9088",
    padding: 15,
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  list: {
    paddingHorizontal: 32,
    paddingVertical: 32,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 5,
    marginBottom: 16,
    elevation: 3,
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    color: "#EA9088",
    width: "60%",
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    color: "#FAE3E1",
    fontWeight: "bold",
    backgroundColor: "#EFACA6",
    padding: 20,
    borderRadius: 15,
  },
  modalView: {
    margin: 10,
    marginTop: 200,
    backgroundColor: "#EA9088",
    color: "#fae3e1",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    color: "#fae3e1",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#fae3e1",
    color: "#fae3e1",
    backgroundColor: "#fae3e1",
    color: "#000",
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
    width: 300,
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#EA9088",
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
  },
  addButtonText: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
  btnContainer: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  btnInteract: {
    backgroundColor: "#EA9088",
  },
});
