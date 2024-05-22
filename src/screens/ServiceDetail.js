//ServiceDetail.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'react-native';
import { useMyContextController } from '../context';

const ServiceDetail = ({ route }) => {
  const { service } = route.params;
  const navigation = useNavigation();
  const [createdBy, setCreatedBy] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [serviceNew, setServiceNew] = useState('');
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;
  useEffect(() => {
    const fetchCreatedBy = async () => {
      try {
        const userDoc = await firestore().collection('USERS').doc(service.createdBy).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          setCreatedBy(userData.name);
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người tạo:', error);
      }
    };
  
    fetchCreatedBy();
  
    // Kiểm tra xem service.createdAt và service.createdBy có tồn tại không trước khi sử dụng toDate()
    if (service.createdAt && service.createdBy) {
      setCreatedAt(service.createdAt.toDate().toLocaleString());
    }
  }, [service.createdAt, service.createdBy]);

  const deleteService = async () => {
    try {
      await firestore().collection('services').doc(service.id).delete();
      console.log('Sản phẩm đã được xóa thành công khỏi Firestore');
      navigation.navigate('Admin');
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm khỏi Firestore:', error);
      Alert.alert('Error', 'Lỗi khi xóa sản phẩm khỏi Firestore');
    }
  };

  const editService = () => {
    navigation.navigate('EditService', { service });
  };

  const confirmDeleteService = () => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc muốn xóa sản phẩm này?',
      [
        { text: 'Hủy bỏ', style: 'cancel' },
        { text: 'Xóa', onPress: deleteService, style: 'destructive' },
      ],
      { cancelable: true }
    );
  };
 console.log(service);
  return (
    <View style={styles.container}>
      {userLogin.role === "admin"?(
      <View style={styles.header}>
        <Text style={styles.title}>Chi tiết Sản phẩm</Text>
        <Menu style={styles.menu}>
          <MenuTrigger text="&#8942;" />
          <MenuOptions>
            <MenuOption onSelect={editService} text="Sửa sản phẩm" />
            <MenuOption onSelect={confirmDeleteService} text="Xóa sản phẩm" />
          </MenuOptions>
        </Menu>
      </View>):null}
      <Text>Tên Sản phẩm: {service.name}</Text>
      <Text>Giá Sản phẩm: {service.money} VND</Text>
      <Text>Mô tả sản phẩm: {service.description}</Text>
      <Text>Ngày Tạo: {createdAt}</Text>
      <Text>Người tạo: {service.createdBy}</Text>


      {/* Hiển thị hình ảnh */}
      {service.imageUrl && (
        <Image source={{ uri: service.imageUrl }} style={styles.image} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  menu: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
  },
  image: {
    width: 380,
    height: 545,
    marginTop: 30,
  },
});

export default ServiceDetail;
