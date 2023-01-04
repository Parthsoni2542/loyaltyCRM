import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  TouchableWithoutFeedback,
  Platform,
  KeyboardAvoidingView,
  Button
} from 'react-native';
import { build, version } from '../../../package.json';
import colors from '../../assets/theme/colors';
import { USER } from '../../constants/prefrenceKeys';
import {
  CHANGE_PASSWORD,
  EDIT_PROFILE,
  PROFILE,
} from '../../constants/routeName';
import Container from '../common/Container';
import Toolbar from '../common/Toolbar';
import styles from './styles';
import Barcode from "react-native-barcode-builder";
import { GlobalContext } from '../../context/Provider';
import { useContext } from 'react';
import moment from 'moment';
import CustomButton from '../common/CustomButton';
import { CANCEL, CONFIRM } from '../../constants/strings';
import BottomSheet from '../common/BottomSheet';
import { gettabviewdata } from '../../context/actions/common';
import { DefaultTheme } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
const ProfileComponent = ({ logoutClick, DeactiveAccounts, profiledata }) => {
  const textInputTheme = {
    ...DefaultTheme,
    colors: {
      text: colors.black,
      primary: colors.primary,
      placeholder: colors.grey,
      background: colors.transparent,
    },
  };

  const { navigate } = useNavigation();

  const [user, setUser] = useState("");
  const { getItem } = useAsyncStorage(USER);
  const [bsVVisible, setBSVVisible] = useState(false);
  const { systemConfigState } = useContext(GlobalContext);
  const { bsDispatch } = useContext(GlobalContext);
  const [deletetext, setdeletetext] = useState('');
  console.log("systemConfigState", systemConfigState)
  useEffect(async () => {
    let isCancelled = false;
    const usr = JSON.parse(await getItem());

    if (!isCancelled) {
      setUser(usr);
    }
    return () => {
      isCancelled = true;
    };
  }, []);


  const createTwoButtonAlert = () =>
    Alert.alert(
      "Delete Account",
      "Are you sure delete your account?",
      [{ text: "OK", onPress: () => setBSVVisible(true) },
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: 'default',
      },

      ]
    );
  const RedeemVoucherBS = ({ onPositiveClick, onNegativeClick }) => {
    const { dashboardState } = useContext(GlobalContext);
      const [text, setText] = useState('');
      const [error, seterror] = useState();


    return (
      <KeyboardAwareScrollView>
        <View style={{
          padding: 15,
          flex: 1,
          // justifyContent: 'space-around',
        }}>
          <Text style={styles.bsTitle}>Are you sure you want to delete your account?</Text>
          <Text style={styles.bsSubTitle}>This cannot be undone </Text>
          <Text style={styles.bsTitle1}>To confirm deletion, Please write word DELETE and proceed</Text>
          {/* <TextInput placeholder="Username" style={styles.textInput} /> */}
          <View style={{
            backgroundColor: 'white',
            marginTop: 12,
          }}>
            <TextInput
             placeholder="Delete" 
             style={{
              height: 40,
              borderColor: colors.grey,
              borderBottomWidth: 1,
              marginBottom: 10,
              fontWeight:'bold'
            }}
            onChangeText={newText => setText(newText)}
            />
          <Text style={{color:'red'}}>{error}</Text>
            {/* <Button title="Submit" onPress={() => null} /> */}
          </View>
          <View style={styles.bsBtnWrapper}>
            <CustomButton
              style={styles.bsBtn}
              primaryLight
              title={CANCEL}
              onPress={onNegativeClick}
            />
            <CustomButton
              style={styles.bsBtn}
              primary
              title={CONFIRM}
              onPress={() => {
                if(text==""){
                  seterror("please enter text")
                }else if(text.trim()=="delete" ||text.trim()=="Delete"){
                  // seterror("complate text")
                  // onPositiveClick({
                    DeactiveAccounts()
                    gettabviewdata(bsDispatch, true)
                  
                  // });
                }else{
                  seterror("Invalid text provided")
                }
               
              }}
            />
          </View>
        </View>
        <View style={{padding:30}}></View>
      </KeyboardAwareScrollView>
    );
  };
  return (
    <Container>

      {
        systemConfigState.data.customer_info_allow_customer_to_edit_profile == 1 ? <Toolbar
          title={PROFILE}
          hideBackBtn
          rightOptionMenu={
            <TouchableOpacity
              onPress={() => {
                navigate(EDIT_PROFILE);
              }}>
              <Image source={require('../../assets/images/ic_edit.png')} />
            </TouchableOpacity>
          }
        /> : <Toolbar
          title={PROFILE}
          hideBackBtn

        />
      }

      <ScrollView>
        {
          profiledata.data.length == 0 ? <View></View> :
            <View style={styles.topWrapper}>
              <View style={styles.proflieWrapper}>
                <Image
                  style={{ height: 180, width: 180, borderRadius: 90 }}
                  source={
                    profiledata.data?.image?.length > 0
                      ? { uri: profiledata.data.image }
                      : require('../../assets/images/img_profile_big.png')
                  }
                  PlaceholderContent={<ActivityIndicator />}
                />
                <Text style={styles.profileName}>
                  {profiledata.data.first_name == null ? "" : profiledata.data.first_name} {profiledata.data.last_name == null ? " " : profiledata.data.last_name}
                  {/* {profiledata.data.first_name + ' ' + profiledata.data.last_name} */}
                </Text>
              </View>
              <View style={styles.detailWrapper}>

                <Text style={styles.lable}>Email</Text>
                <TextInput
                  style={styles.value}
                  value={profiledata.data.email}
                  editable={false}
                />
                <Text style={styles.lable}>Phone Number</Text>
                <TextInput
                  style={styles.value}
                  value={profiledata.data.phone_number}
                  editable={false}
                />
                {
                  profiledata.data.birthdate == null || profiledata.data.birthdate == "0000-00-00" ? <View></View> :
                    <View>
                      <Text style={styles.lable}>Birth Date</Text>
                      <TextInput
                        style={styles.value}
                        value={moment(profiledata.data.birthdate).format('DD-MM-YYYY')}
                        editable={false}

                      />
                    </View>
                }
                <TouchableOpacity
                  style={{ borderBottomWidth: 0.2, borderColor: colors.grey }}
                  onPress={() => {
                    navigate(CHANGE_PASSWORD);
                  }}>
                  <Text style={styles.changePassword}>Change Password</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ borderBottomWidth: 0.2, borderColor: colors.grey }} onPress={() => { logoutClick() }}>
                  <Text style={styles.changePassword}>Logout</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    gettabviewdata(bsDispatch, false)
                    setBSVVisible(true)
                  }}>
                  <Text style={styles.changePassword1}>Delete Account</Text>
                </TouchableOpacity>
                <Text
                  style={{ fontSize: 12, color: colors.grey, alignSelf: 'flex-end' }}>
                  Version:{version}.{build} (151222)
                </Text>

                <Barcode value={profiledata.data == "" ? "0" : profiledata.data.membership_code} format="CODE128" width={2} height={50} text={profiledata.data == "" ? "0" : profiledata.data.membership_code} />
              </View>
            </View>
        }

      </ScrollView>
      <BottomSheet
        visible={bsVVisible}
        setVisibility={setBSVVisible}
        canceledOnTouchOutside={false}
        
        body={
          <RedeemVoucherBS
            // item={item}
            onNegativeClick={() => {
              setBSVVisible(false);
              gettabviewdata(bsDispatch, true)
            }}

            onPositiveClick={(updateObj) => {
              setBSVVisible(false);
              gettabviewdata(bsDispatch, true)
              // buyVoucher(updateObj);
            }}
          />
        }
      />

    </Container>
  );
};

export default ProfileComponent;
