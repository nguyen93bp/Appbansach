import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, Image, TouchableWithoutFeedback } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const AddNewService = ({ navigation }) => {
  const [serviceName, setServiceName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [serviceNew, setServiceNew] = useState('');

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  const addNewService = async () => {
    if (!serviceName || !serviceDescription || !imageUrl) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin sản phẩm và chọn hình ảnh.');
      return;
    }

    try {
      const currentDate = new Date();
      const docRef = await firestore().collection('services').add({
        name: serviceName,
        money: serviceDescription,
        imageUrl: imageUrl,
        createdAt: currentDate,
        description:serviceNew ,
        createdBy: currentUser ? currentUser.uid : null,
      });

      console.log('Sản phẩm đã được thêm thành công vào Firestore');
      alert('Sản phẩm đã được thêm thành công vào Firestore');

      navigation.navigate('Admin');
    } catch (error) {
      console.error('Lỗi khi thêm Sản phẩm vào Firestore:', error);
      alert('Lỗi khi thêm Sản phẩm vào Firestore');
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
        setImageUrl(response.assets[0].uri);
      }
    });
  };

  const onCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm mới Sản phẩm</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên Sản phẩm"
        value={serviceName}
        onChangeText={(text) => setServiceName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Giá Sản phẩm"
        value={serviceDescription}
        onChangeText={(text) => setServiceDescription(text)}
      />
            <TextInput
        style={styles.input}
        placeholder="Mô tả sản phẩm"
        value={serviceNew}
        onChangeText={(text) => setServiceNew(text)}
      />


      <TouchableWithoutFeedback onPress={launchNativeImageLibrary}>
        <View style={styles.imageContainer}>
          {/* Hiển thị hình ảnh đã chọn */}
          {imageUrl !== '' && <Image source={{ uri: imageUrl }} style={styles.image} />}
          <Text style={styles.chooseImageText}>Chọn hình ảnh</Text>
        </View>
      </TouchableWithoutFeedback>

      <Button title="Thêm Sản phẩm" onPress={addNewService} color="blue" />
      <Button title="Hủy" onPress={onCancel} color="red" />
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
    marginBottom: 16,
  },
});

export default AddNewService;
