import PushNotificationIOS from '@react-native-community/push-notification-ios';
import React, { useContext, useEffect, useState } from 'react';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import PushNotification from "react-native-push-notification";
import getUpcomingAppts from '../context/actions/dashboardOps/getUpcomingAppts';
import { GlobalContext } from '../context/Provider';
import getHistoryAppts from '../context/actions/dashboardOps/getHistoryAppts';
import getServices from '../context/actions/dashboardOps/getServices';
import getDashboard from '../context/actions/dashboardOps/getDashboard';
import getServiceHistory from '../context/actions/dashboardOps/getServiceHistory';


const ForegroundHandler = () => {

    const { loaderDispatch } = useContext(GlobalContext);
    const { bottomMessageDispatch } = useContext(GlobalContext);
    const { apptsUpcomingDispatch } = useContext(GlobalContext);
    const { apptsHistoryDispatch } = useContext(GlobalContext);
    const { ServieceHistoryDispatch } = useContext(GlobalContext);
    const { servicesDispatch } = useContext(GlobalContext);
    const [internetCheck, setInternetCheck] = useState(0);
    
    
    const {
        dashRefreshState: { needRefresh },
        dashRefreshDispatch,
    } = useContext(GlobalContext);
    const { dashBoardDispatch } = useContext(GlobalContext);


    useEffect(() => {
        const unsubscribe = messaging().onMessage((remoteMessage) => {
            const { notification, messageId } = remoteMessage

            if (remoteMessage) {
                getDashboard(
                    loaderDispatch,
                    bottomMessageDispatch,
                    dashBoardDispatch,
                )(() => {
    
                });
                console.log("remoteMessage",remoteMessage)
                // const focus = navigation.addListener('focus', () => {
                getUpcomingAppts(
                    loaderDispatch,
                    bottomMessageDispatch,
                    apptsUpcomingDispatch,
                )(() => { });

                getHistoryAppts(
                    loaderDispatch,
                    bottomMessageDispatch,
                    apptsHistoryDispatch,
                )(() => { });

            }
            getServices(
                loaderDispatch,
                bottomMessageDispatch,
                servicesDispatch,
            )(() => {

            });
            getServiceHistory(
                loaderDispatch,
                bottomMessageDispatch,
                ServieceHistoryDispatch,
              )(() => {
               
              });


         


            if (Platform.OS == 'ios') {
                PushNotificationIOS.addNotificationRequest({
                    id: messageId,
                    body: notification.body,
                    title: notification.title,
                    sound: 'default'
                });
            } else {
                PushNotification.localNotification({
                    channelId: "sg.co.gosolution.lcrm.eyebrow",
                    id: messageId,
                    body: 'android body',
                    title: 'android notif title',
                    soundName: 'default',
                    vibrate: true,
                    playSound: true
                })
            }

        })

        return unsubscribe
    }, [internetCheck])
    return null
}

export default ForegroundHandler