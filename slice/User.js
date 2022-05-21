import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as Google from "expo-google-app-auth"
import { auth ,db} from '../firebase';
import firebase from 'firebase';

const config = {
  androidClientId:
    "498531436216-shle2v40mgqj33ctnk5cj7dpi7e4v3rh.apps.googleusercontent.com",
  iosClientId:
    "498531436216-cduiepp53ltirqlg3rohsoupkn1ojh4q.apps.googleusercontent.com",
  scopes: ["profile", "email"],
  permissions: ["public_profile", "emial", "gender", "location"],
};


export const googleAuth = createAsyncThunk(
  "users/getUsers",
  async ({},dispatch, getState) => {
    await Google.logInAsync(config)
    .then(async (logInResult) => {
      if (logInResult.type === "success") {
        const { idToken, accessToken } = logInResult;
        const credential = firebase.auth.GoogleAuthProvider.credential(
          idToken,
          accessToken
        );
       const res = await firebase.auth().signInWithCredential(credential);
       console.log(res.user.email)
       console.log(res.user.displayName)
        //navigation.navigate("Home")
        // Add a new document with a generated id.
        db.collection("users").where("email","==",res.user.email)
  .onSnapshot((querySnapshot) => {
    //console.log(querySnapshot.docs.map(doc=>({ ...doc.data(), id: doc.id })))
    if(querySnapshot.docs.map(doc=>({ ...doc.data(), id: doc.id })).length>0){
      console.log("user already in db")
    }else{
      if(res){
          db.collection('users').add({
             
              email:res.user.email,
              name:res.user.displayName,
              
            })
            console.log("user added successfully")
            
             return res.user.email;
            
        }
      }
    })
      
         
      }
      return Promise.reject();
    })
    .catch((error) => console.log(error))
    .finally((res) => {
        return res;
        
     
  });
  }
);




const slice = createSlice({
  name: 'User',
  initialState: {
    user: false,
    email:'',
    loading:false,
    error:false
  },
  reducers: {
    registerSuccess: (state, action) => {
        state.loading = false;
      state.user = action.payload;
      state.email = action.payload.email;
     // AsyncStorage.setItem('user', JSON.stringify(action.payload))
    },
    loginSuccess: (state, action) => {
        state.loading = false;
      state.user = true;
     //AsyncStorage.setItem('user', JSON.stringify(action.payload.email))
    },
    logoutSuccess: (state, action) =>  {
      state.user = null;
      //AsyncStorage.removeItem('user')
      firebase.auth().signOut()
    },
  },
  extraReducers: {
    [googleAuth.pending]: (state, action) => {
      state.status = "loading";
    },
    [googleAuth.fulfilled]: (state, action) => {
      
      state.status = "success";
      state.users = action.payload;
      console.log("payload",action.payload)
     
  },
    [googleAuth.rejected]: (state, action) => {
      state.status = "failed";
    }
  },
});

export default slice.reducer

// Actions

const {registerSuccess,loginSuccess,registerLoading,registerFailed, logoutSuccess } = slice.actions


export const register = ({username,email,password}) => async dispatch => {
  if(username){
  try {
    dispatch(registerLoading())
    auth
    .createUserWithEmailAndPassword(email,password)
    .then((auth )=>{
     
         db.collection('users').add({
            timestamp:firebase.firestore.FieldValue.serverTimestamp(),
            email:email,
            username:username,
            image:'https://png.pngtree.com/png-clipart/20190705/original/pngtree-cartoon-european-and-american-character-avatar-design-png-image_4366075.jpg',
           })
          
        
            dispatch(registerSuccess(auth.user))
    })
    .catch(e=> alert(e.message))
    dispatch(registerFailed())
    
  } catch (e) {
    return console.error(e.message);
  }
}else{
  alert("please fill out all fields")
}
}

export const login = ({email,password}) => async dispatch => {
    auth
    .signInWithEmailAndPassword(email,password)
    .then((auth)=>{
        // logged in, redirect to home
        dispatch(loginSuccess(auth.user))
    }).catch(e => alert(e.message))
   
}

  

export const logout = () => async dispatch => {
  try {
    // await api.post('/api/auth/logout/')
    return dispatch(logoutSuccess())
  } catch (e) {
    return console.error(e.message);
  }
}