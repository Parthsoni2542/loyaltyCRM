import React, { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import colors from '../../assets/theme/colors';
import {
  APPOINTMENT,
  HISTORY_TAB,
  ACTIVE_TAB,
  MY_SERVICE,
  MY_SERVICE_DETAIL,
} from '../../constants/routeName';
import getHistoryAppts from '../../context/actions/dashboardOps/getHistoryAppts';
import getMoreHistoryAppts from '../../context/actions/dashboardOps/getMoreHistoryAppts';
import getmoreUpcommingAppts from '../../context/actions/dashboardOps/getmoreUpcommingAppts';
import getUpcomingAppts from '../../context/actions/dashboardOps/getUpcomingAppts';
getServices
import getServices from '../../context/actions/dashboardOps/getServices';
import { GlobalContext } from '../../context/Provider';
import AppointmentCard from '../common/AppointmentCard';
import Container from '../common/Container';
import Toolbar from '../common/Toolbar';
import ServiceCard from '../common/ServiceCard';

import { StackActions, useNavigation, useRoute } from '@react-navigation/native';
import getServiceHistory from '../../context/actions/dashboardOps/getServiceHistory';
import ServiceHistoryCard from '../common/ServiceHistoryCard';
import getMoreServices from '../../context/actions/dashboardOps/getMoreServices';
import getMoreHistoryServices from '../../context/actions/dashboardOps/getMoreHistoryServices';
import logoutSession from '../../context/actions/auth/logoutSession';
import { getabindex, getPointndex, getServicetabIndex } from '../../context/actions/common';
const ServiceComponent = ({ ActiveItemClick,historyItemClick}) => {
  const layout = useWindowDimensions()
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: ACTIVE_TAB, title: ACTIVE_TAB },
    { key: HISTORY_TAB, title: HISTORY_TAB },
  ]);
  const { loaderDispatch } = useContext(GlobalContext);
  const { bottomMessageDispatch } = useContext(GlobalContext);
  const { servicesDispatch } = useContext(GlobalContext);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const { servicesState } = useContext(GlobalContext);
  const [isMoreLoading, setMoreLoading] = useState(false);
  const navigate = useNavigation();
  const {bsState,bsDispatch} = useContext(GlobalContext);
  const { ServieceHistoryDispatch } = useContext(GlobalContext);
  const { ServieceHistoryState } = useContext(GlobalContext);



  React.useEffect(() => {
    const unsubscribe = navigate.addListener('focus', () => {
        getabindex(bsDispatch,0)
        getPointndex(bsDispatch,0)
   
        getServices(
            loaderDispatch,
            bottomMessageDispatch,
            servicesDispatch,
          )(() => {
            setLoading(false);
          });
      
        getServiceHistory(
          loaderDispatch,
          bottomMessageDispatch,
          ServieceHistoryDispatch,
        )(() => {
          setLoading(false);
         
        });
      
     
    //   // The screen is focused
    //   // Call any action
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [index]);

  const renderScene = ({ route }) => {

    switch (route.key) {
      case ACTIVE_TAB:
        return (
          <AppoinmentsListView
            routeKey={route.key}
            data={servicesState.data.list}
            itemClick={ActiveItemClick}
            
          />
        );
      case HISTORY_TAB:
        return (
          <AppoinmentsListView
            routeKey={route.key}
            data={ServieceHistoryState.data.list}
            itemClick={historyItemClick}

            
          />
        );
      default:
        return null;
    }
  };


  console.log("vvvvvvv",bsState)

  const idex = (data) =>{
    // setIndex(data)
    getServicetabIndex(bsDispatch,data)
    // (data)

  }

  return (
    <Container>
      <Toolbar title={MY_SERVICE} hideBackBtn />
      <TabView
        navigationState={{ index:bsState.sindex, routes }}
        renderScene={renderScene}
        onIndexChange={idex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
        lazy={true}
      />


    </Container>
  );
};

const renderTabBar = props => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: colors.primary }}
    style={{ backgroundColor: colors.white }}
    renderLabel={({ route, focused, color }) => (
      <Text
        style={{
          color: focused ? colors.black : colors.grey,
          fontWeight: '600',
          fontFamily: 'Poppins-Regular',
        }}>
        {route.title}
      </Text>
    )}
  />
);

const AppoinmentsListView = ({ routeKey, data, itemClick }) => {
  const layout = useWindowDimensions();
  const { loaderDispatch } = useContext(GlobalContext);
  const { bottomMessageDispatch } = useContext(GlobalContext);
  const { apptsUpcomingDispatch } = useContext(GlobalContext);
  const { apptsHistoryDispatch } = useContext(GlobalContext);
  const [isMoreLoading, setMoreLoading] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const {navigate} = useNavigation();
  const { servicesDispatch } = useContext(GlobalContext);
  const { servicesState } = useContext(GlobalContext);
  const { ServieceHistoryDispatch } = useContext(GlobalContext);
  const { ServieceHistoryState } = useContext(GlobalContext);
  const { authDispatch } = useContext(GlobalContext);

  const logoutClick = () => {
    logoutSession()(loaderDispatch, bottomMessageDispatch, authDispatch);
  };

  useEffect(() => {
    onRefresh();
  }, []);
  const onRefresh = () => {
    setLoading(true);
    switch (routeKey) {
      case ACTIVE_TAB:
        getServices(
          loaderDispatch,
          bottomMessageDispatch,
          servicesDispatch,
        )((response) => {
          if(response.data.message == "Something went wrong." ||response.data.message == "Authentication failure"){
            logoutClick()
          }
          setLoading(false);
        });
        break;
      case HISTORY_TAB:
        getServiceHistory(
          loaderDispatch,
          bottomMessageDispatch,
          ServieceHistoryDispatch,
        )((response) => {
          if(response.data.message == "Something went wrong." ||response.data.message == "Authentication failure"){
            logoutClick()
          }
          setLoading(false);
        });
        break;
      default:
        return null;
    }


    
  };




 
  


  const GetmoreServicesData = () => {
    setMoreLoading(true)
    getMoreServices(servicesState.data.pageNo)(
      bottomMessageDispatch,
      servicesDispatch,
    )(() => {
      setMoreLoading(false);
    });
  }

  const GetmoreServiceHistoryData = () => {
    setMoreLoading(true)
    getMoreHistoryServices(ServieceHistoryState.data.pageNo)(
      bottomMessageDispatch,
      ServieceHistoryDispatch,
    )(() => {
      setMoreLoading(false);
    });
  }


  const handleLoadMore = () => {
    return routeKey == HISTORY_TAB ? (
      ServieceHistoryState.data?.hasMore ?? 0 === 1 ? (
        isMoreLoading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          
          GetmoreServiceHistoryData()
        )
      ) : null
    ) : servicesState.data?.hasMore ?? 0 === 1 ? (
      isMoreLoading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : GetmoreServicesData()) : null
  }
  



  


  const footer = () => {
    return routeKey == HISTORY_TAB ? (
      ServieceHistoryState.data?.hasMore ?? 0 === 1 ? (
        isMoreLoading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <View></View>
        )
      ) : null
    ) :servicesState.data?.hasMore ?? 0 === 1 ? (
      isMoreLoading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (<View></View>
      )) : null
  };


  const dataList =
    routeKey === ACTIVE_TAB
      ? servicesState.data.list ?? []
      : ServieceHistoryState.data.list ?? [];
  return isLoading ? (
    <View style={{ backgroundColor: 'white', flex: 1 }} />
  ) : (
    <View style={{ paddingHorizontal: 10, flex: 1 }}>
      <FlatList
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        data={dataList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <ServiceCard
            key={item.id}
            item={item}
            itemClick={itemClick}
           
          />
        )}
        contentContainerStyle={[
          {
            marginVertical: 16,
            paddingVertical:14
          },
          dataList.length > 0
            ? {}
            : { justifyContent: 'center', alignItems: 'center', height: '100%' },
        ]}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginVertical: 10 }}>
            <Image
              style={{
                width: layout.width * (153 / 360),
                height: layout.height * (114 / 640),
              }}
              resizeMode="contain"
              source={require('../../assets/images/calander.png')}
            />
            <Text
              style={{
                color: colors.black,
                fontSize: 15,
                fontWeight: '500',
                fontFamily: 'Poppins-Regular',
              }}>
              You Dont Have Any Services!
            </Text>
          </View>
        }
        onEndReached={()=>{handleLoadMore()}}
        onEndReachedThreshold={5}
        initialNumToRender={10}
        ListFooterComponent={footer}
      />
    </View>
  );
};

export default ServiceComponent;
