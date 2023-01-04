import {StyleSheet} from 'react-native';
import colors from '../../assets/theme/colors';

export default StyleSheet.create({
  wrapper: {
    paddingHorizontal: 18,
    flex: 1,
  },
  card: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 4,
    marginHorizontal: 16,
    position: 'relative',
    top: -40,
    marginBottom: -35,
  },
  cardTitle: {
    fontSize: 12,
    color: '#FFFFFFCC',
    // fontWeight: '500',
    fontFamily: 'Poppins-Regular',
  },
  cardDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  cardDetailDivider: {width: 0.5, backgroundColor: colors.white},
  title: {
    fontSize: 13,
    marginTop: 5,
    // fontWeight: '600',
    // borderWidth:1,
    color: '#909090',
    fontFamily: 'Poppins-Bold',
  },
  apptDateTimeWrapper: {flexDirection: 'row', alignItems: 'center'},
  apptDateTimeIcon: {
    position: 'absolute',
    alignSelf: 'center',
  },
  apptDateTimeValue: {
    fontSize: 13,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.grey,
    paddingBottom: 5,
    width: '100%',
    paddingStart: 20,
    paddingTop: 5,
    // fontWeight: '600',
    fontFamily: 'Poppins-Regular',
  },
  stylistWrapper: {
    // borderWidth: 1,
    borderColor: colors.grey20,
    // paddingHorizontal: 14,
    // marginTop: 8,
    flexDirection:'row'
  },
  stylistName: {
    borderColor: colors.grey20,
    // paddingVertical: 8,
    fontSize: 11,
    color: colors.black,
    // fontWeight: '500',
    fontFamily: 'Poppins-Regular',
    flexDirection:'row'
  },
  stylistWork: {
    color: colors.black,
    // fontWeight: '400',
    fontFamily: 'Poppins-Regular',
  },
  description: {
    fontSize: 11,
    color: colors.black,
    marginTop: 5,
    textAlign: 'justify',
    // marginBottom: 0,
    // fontWeight: '500',
    fontFamily: 'Poppins-Regular',
  },
});
