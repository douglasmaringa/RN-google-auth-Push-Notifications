// In App.js in a new project

import * as React from 'react';
import { View, Text,Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux'
import { googleAuth} from '../slice/User';



function Login({navigation}) {
    const dispatch = useDispatch()
  const { user,loading,status } = useSelector(state => state.user)

  console.log("user",user)
  console.log("status",status)
  
  React.useEffect(()=>{
     if(status == "success"){
         navigation.navigate("Home")
     }else{
         console.log("not yet logged in")
     }
  },[status])
    const signInWithGoogle = ()=>{
        
        dispatch(googleAuth({}))
   
     }
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Login Screen</Text>
      <Button title='login' onPress={signInWithGoogle}/>
    </View>
  );
}




export default Login;