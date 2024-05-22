//Router.js
import 'react-native-gesture-handler';
import React from "react"
import { StyleSheet,Text,View } from "react-native" 
import { useMyContextController } from '../context';
import { createStackNavigator } from '@react-navigation/stack';
import Admin from './Admin';
import Login from './Login';
import Customer from './Customer';
import Services from "./Services";
import ServiceDetail from "./ServiceDetail";
import AddNewService from "./AddNewService";
import EditService from "./EditService";
import UserProfile from './UserProfile';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Setting from './Setting';
import UserDetailScreen from './UserDetailScreen';
import EditUser from './EditUser';
import CartScreen from './CartScreen';
import FavoritesScreen from './FavoritesScreen';
import AdminChatScreen from './AdminChatScreen';
import SignupScreen from './SignupScreen';
import YourCheckoutScreen from './YourCheckoutScreen';
import ForgotPassword from './ForgotPassword';
import EditProfile from './EditProfile';

const Stack = createStackNavigator();
 export default Router =()=>{
    const [controller, dispatch]= useMyContextController();
    const {userlogin}=controller;
    return (
        <Stack.Navigator initialRouteName='Login'
        screenOptions={{
            headerShown:false
        }}
        >
            <Stack.Screen name='Admin' component={Admin}/>
            <Stack.Screen name='Customer' component={Customer}/>
            <Stack.Screen name='Login' component={Login}/>
            <Stack.Screen name='Setting' component={Setting}/>
            <Stack.Screen name="Services" component={Services}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen name="AddNewService" component={AddNewService}
                options={{
                    headerStyle: {backgroundColor:"pink"},
                }}
            />
            <Stack.Screen name="EditService" component={EditService}
                options={{
                    headerStyle: {backgroundColor:"pink"},
                }}
            />
            <Stack.Screen name="ServiceDetail"component={ServiceDetail}
                options={{
                    headerStyle: {backgroundColor: "pink"},
            }}
            />
            <Stack.Screen
                name='UserProfile'
                component={UserProfile}
                options={{
                    title: 'Danh sách dịch vụ',
                    headerRight: () => (
                    <TouchableOpacity
                        style={{ marginRight: 16 }}
                        onPress={() => navigation.navigate('UserProfile')}
                    >
                        <Ionicons name="person" size={24} color="black" />
                    </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen name='UserDetailScreen' component={UserDetailScreen}/>
            <Stack.Screen name='EditUser' component={EditUser}/>
            <Stack.Screen name='CartScreen' component={CartScreen}/>
            <Stack.Screen name='FavoritesScreen' component={FavoritesScreen}/>
            <Stack.Screen name='AdminChatScreen' component={AdminChatScreen}/>
            <Stack.Screen name='YourCheckoutScreen' component={YourCheckoutScreen}/>
            <Stack.Screen name='ForgotPassword' component={ForgotPassword}/>
            <Stack.Screen name='EditProfile' component={EditProfile}/>
            <Stack.Screen name='SignupScreen' component={SignupScreen}/>
            
        </Stack.Navigator>
    )
 }