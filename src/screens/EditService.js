import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, Button, StyleSheet, Alert, Image, TouchableWithoutFeedback } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const EditService = ({ route }) => {
  const { service } = route.params;
  const navigation = useNavigation();

  const [editedServiceName, setEditedServiceName] = useState(service.name);
  const [editedServiceDescription, setEditedServiceDescription] = useState(service.description);
  const [editedServiceNew, setEditedServiceNew] = useState(service.money);
  const [editedImageUrl, setEditedImageUrl] = useState(service.imageUrl);

  const updateService = async () => {
    try {
      await firestore().collection('services').doc(service.id).update({
        name: editedServiceName,
        description: editedServiceDescription,
        imageUrl: editedImageUrl,
        money: editedServiceNew,
      });

      console.log('Sản phẩm đã được cập nhật thành công trong Firestore');
      Alert.alert('Success', 'Sản phẩm đã được cập nhật thành công trong Firestore');
      navigation.navigate('Admin');
    } catch (error) {
      console.error('Lỗi khi cập nhật sản phẩm trong Firestore:', error);
      Alert.alert('Error', 'Lỗi khi cập nhật sản phẩm trong Firestore');
    }
  };

  const launchNativeImageLibrary = () => {
    let options = {
      includeBase64: true,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setEditedImageUrl(response.assets[0].uri);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chi tiết Sản phẩm</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên sản phẩm"
        value={editedServiceName}
        onChangeText={(text) => setEditedServiceName(text)}
        
      />
      <TextInput
        style={styles.input}
        placeholder="Gía sản phẩm"
        value={editedServiceNew}
        onChangeText={(money) => setEditedServiceNew(money)}
      />
      <TextInput
        style={styles.input}
        placeholder="Mô tả sản phẩm"
        value={editedServiceDescription}
        onChangeText={(text) => setEditedServiceDescription(text)}
      />
      

      <TouchableWithoutFeedback onPress={launchNativeImageLibrary}>
        <View style={styles.imageContainer}>
          {editedImageUrl !== '' && <Image source={{ uri: editedImageUrl }} style={styles.image} />}
          <Text style={styles.chooseImageText}>Chọn hình ảnh</Text>
        </View>
      </TouchableWithoutFeedback>

      <Button title="Cập nhật Sản phẩm" onPress={updateService} color="blue" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 8,
  },
  chooseImageText: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default EditService;
