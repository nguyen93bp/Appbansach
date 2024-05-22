import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';

const YourCheckoutScreen = ({ route }) => {
  const { selectedServices } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách mặt hàng đã đặt</Text>
      <View style={styles.itemContainer}>
        {selectedServices.map((service) => (
          <ServiceItem key={service.id} service={service} />
        ))}
      </View>
    </View>
  );
};

const ServiceItem = ({ service }) => {
  const [loading, setLoading] = useState(true);

  return (
    <View style={styles.item}>
      <View style={styles.imageContainer}>
        {loading && (
          <ActivityIndicator style={styles.activityIndicator} size="small" color="#0000ff" />
        )}
        <Image
          source={{ uri: service.imageUrl }}
          style={styles.image}
          onLoadEnd={() => setLoading(false)}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.serviceName}>{service.name}</Text>
        <Text style={styles.servicePrice}>{service.money} VND</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemContainer: {
    marginTop: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#f8f8f8',
    padding: 8,
    borderRadius: 8,
  },
  imageContainer: {
    width: 60,
    height: 60,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  activityIndicator: {
    position: 'absolute',
  },
  textContainer: {
    flex: 1,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  servicePrice: {
    fontSize: 14,
    color: '#333',
  },
});

export default YourCheckoutScreen;
