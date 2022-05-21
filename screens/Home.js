import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState, useRef} from 'react';
import { StyleSheet, Text, View, TouchableOpacity,ScrollView } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import storage from "@react-native-async-storage/async-storage";
import {db} from "../firebase"
//1. import the library
//2. get permission
//3. do push notifications on button click
//4. schedule push notifications

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true
  })
});

export default function Home() {
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const[data,setData]=useState([])

  useEffect(() => {
    const getPermission = async () => {
      if (Constants.isDevice) {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            alert('Enable push notifications to use the app!');
            await storage.setItem('expopushtoken', "");
            return;
          }
          const token = (await Notifications.getExpoPushTokenAsync()).data;
          await storage.setItem('expopushtoken', token);
      } else {
        alert('Must use physical device for Push Notifications');
      }

        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
    }

    getPermission();

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {});

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const onClick = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Nofication",
        body: "notification that is sent imediately",
        data: { data: "notification that is sent imediately" }
      },
      trigger: {
        seconds: 1,
       
      }
    });
  }

  const onClick2 = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Nofication",
        body: "notification that is sent every day at 2pm",
        data: { data: "notification that is sent every day at 2pm" }
      },
      trigger: {
        hour: 2,
        minute: 0,
        repeats: true
      }

    });
  }

  //get all users
  useEffect(()=>{
    db.collection("users")
        .onSnapshot((querySnapshot) => {
           
          setData(querySnapshot.docs.map(doc=>({ ...doc.data(), id: doc.id })))
          
    })
  },[])
  console.log(data)
  return (
    <View style={styles.container}>
        <ScrollView style={{marginTop:10}}>
        {
            data.map((e)=>(
                <View style={{padding:10,borderColor:'gray',borderWidth:2,marginBottom:2,alignItems:'center'}}>
                <View >
                <Text>{e.name}</Text>
                <Text>{e.email}</Text>
            </View>
            </View>
            ))
        }
       </ScrollView>
      <TouchableOpacity onPress={onClick}>
        <Text style={{backgroundColor: 'red', padding: 10, color: 'white'}}>Click me to send a push notification</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onClick2}>
        <Text style={{backgroundColor: 'gray', padding: 10, color: 'white',marginTop:10,marginBottom:10}}>Set notification that will repeat everyday at 2pm</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
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
});

