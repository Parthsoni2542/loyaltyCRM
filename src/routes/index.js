import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Text,View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import BottomMessage from '../components/common/BottomMessage';
import BottomSheet from '../components/common/BottomSheet';
import Loader from '../components/common/Loader';
import { ACCESS_TOKEN, USER } from '../constants/prefrenceKeys';
import banner from '../context/actions/auth/banner';
import getsytemconfig from '../context/actions/auth/getsytemconfig';
import { alreadyLoggedIn, getSystemConfig, showBS, hideBS, getbannerData } from '../context/actions/common';
import { GlobalContext } from '../context/Provider';
import AuthRoute from './AuthRoute';
import DashboardRoute from './DashboardRoute';
import OnboardingScreen from '../screens/OnboardingScreen';
import DashboardScreen from '../screens/DashboardScreen';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
import firebase from '@react-native-firebase/app';
import getDashboard from '../context/actions/dashboardOps/getDashboard';
import AppSlider from '../screens/AppSlider';
import SliderBottomSheet from '../components/common/SliderBottomSheet';
export const AppNavContainer = () => {
  const {
    loaderState: { counter },
  } = useContext(GlobalContext);
  const {
    bottomMessageState: { messages },
  } = useContext(GlobalContext);
  const {
    bsState: { body, canceledOnTouchOutside, visible },
    bsDispatch,
  } = useContext(GlobalContext);
  const {
    authState: { isLoggedIn },
    authDispatch,
  } = useContext(GlobalContext);
  const { loaderDispatch } = useContext(GlobalContext);
  const { bottomMessageDispatch } = useContext(GlobalContext);
  const { systemConfigDispatch } = useContext(GlobalContext);
  const { bannerDispatch } = useContext(GlobalContext);
  const { dashBoardDispatch } = useContext(GlobalContext);
  const { bannerState } = useContext(GlobalContext);
  const [isAuthenticated, setIsAuthenticated] = useState(isLoggedIn);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [systemConfig, setSystemconfig] = useState(false);
  

  const getUser = async () => {
    try {
      authLoaded && setAuthLoaded(false);
      const user = await AsyncStorage.getItem(USER);
      const accesstoken = await AsyncStorage.getItem(ACCESS_TOKEN);
      console.log("AccesstokenData",accesstoken)
      if (user) {
        setIsAuthenticated(true);
        setAuthLoaded(true);
        !isLoggedIn && alreadyLoggedIn(authDispatch);
        

      } else {
        console.log("AccesstokenDataelse",accesstoken)
        setIsAuthenticated(false);
        setAuthLoaded(true);


      }
    } catch (error) { }
  };

  const systemConfigure = async () => {
    try {
      // systemConfig && setSystemconfig(false);
      // const systemData = await AsyncStorage.getItem('systemConfigUsername');
      // if (systemData) {
      //   setSystemconfig(true);
      //   getSystemConfig(systemConfigDispatch, systemData)

      // } else {
      //   setSystemconfig(true);
        getsytemconfig(
          loaderDispatch,
          bottomMessageDispatch,
          systemConfigDispatch,
        )(() => { });
      // }
    } catch (error) { }
  };

  const bannerdata = async () => {
      banner(
        loaderDispatch,
        bottomMessageDispatch,
        bannerDispatch,
        bsDispatch
      )(() => { })
  
  };



  useEffect(() => {
    systemConfigure();
  }, []);

  useEffect(() => {
      bannerdata();
  }, []);

  
  
  useEffect(() => {
    getUser();
  }, [isLoggedIn]);

  useEffect(() => {
    if (authLoaded) {
      setTimeout(() => {
        SplashScreen.hide();
      }, 100);
    }
  }, [authLoaded]);

  const bottomMessages = () => {
    let bms = [];
    Object.values(messages).forEach(msg => {
      bms.push(
        <BottomMessage
          key={msg.key}
          type={msg.type}
          message={msg.message}
          long={msg.long}
        />,
      );
    });
    return bms;
  };

  const routD = useMemo(() => {
    return (
      <NavigationContainer>
        {isAuthenticated == false ? <AuthRoute /> : <DashboardRoute />}
      </NavigationContainer>
    );
  }, [isAuthenticated]);
  {console.log("bannerState.data",bannerState.data)}
  return (
    <>
     
      {authLoaded==true ? routD : null}
      {counter > 0 && <Loader isVisible={counter} />}
      {bottomMessages()}
      <SliderBottomSheet
        visible={visible}
        borderhide ={"hideborder"}
        setVisibility={() => {
          hideBS(bsDispatch);
        }}
        canceledOnTouchOutside={false}
        body={bannerState.data==""||bannerState.data.lengh ==0?routD:<AppSlider /> }/>
    </>
  );
};
