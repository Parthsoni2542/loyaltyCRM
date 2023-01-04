import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState} from 'react';
import ProfileComponent from '../components/ProfileComponent';
import { ACCESS_TOKEN } from '../constants/prefrenceKeys';
import deactivateAccount from '../context/actions/auth/deactivateAccount';
import logout from '../context/actions/auth/logout';
import logoutSession from '../context/actions/auth/logoutSession';
import { getabindex, getPointndex, getServicetabIndex } from '../context/actions/common';
import getProfile from '../context/actions/dashboardOps/getProfile';
import { GlobalContext } from '../context/Provider';

const ProfileScreen = () => {
  const { loaderDispatch } = useContext(GlobalContext);
  const { bottomMessageDispatch } = useContext(GlobalContext);
  const { bsDispatch,authDispatch } = useContext(GlobalContext);
  const { profileDispatch } = useContext(GlobalContext);
  const { profileState } = useContext(GlobalContext);
  const [acessToken,setAcessToken] = useState("")
  const logoutbtnClick = () => {
    logoutSession()(loaderDispatch, bottomMessageDispatch, authDispatch);
  };
 
  const navigate = useNavigation();
  const profileDetails = () => {
    getProfile(
      loaderDispatch,
      bottomMessageDispatch,
      profileDispatch,
    )(response => {
      console.log("response",response)
      if(response.data.message == "You already logged in with another device. Please try again." ||response.data.message =="Authentication failure"){
             logoutbtnClick()
      }
     });

  };

console.log("acessToken",acessToken)
 
  React.useEffect(() => {
    getAceessToken()
    
    const unsubscribe = navigate.addListener('focus', () => {
      getabindex(bsDispatch,0)
      getServicetabIndex(bsDispatch,0)
      getPointndex(bsDispatch,0)
      profileDetails();
    });

    return unsubscribe;
  }, []);


  const getAceessToken = async() =>{
    let aceessToken = await AsyncStorage.getItem(ACCESS_TOKEN);
    setAcessToken(aceessToken) 
  }


  const logoutClick = () => {
    logout()(loaderDispatch, bottomMessageDispatch, authDispatch,acessToken);
  };

  const DeactiveAccounts = ()=>{
    deactivateAccount()(loaderDispatch, bottomMessageDispatch, authDispatch,acessToken);
    // logout()(loaderDispatch, bottomMessageDispatch, authDispatch,acessToken);
  }

  return (
    <ProfileComponent
      logoutClick={logoutClick}
      profiledata={profileState}
      DeactiveAccounts={DeactiveAccounts}
    />);
};

export default ProfileScreen;
