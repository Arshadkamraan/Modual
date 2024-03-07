import {Platform, StyleSheet} from 'react-native';
import {
  horizontalScale,
  verticalScale,
  moderateScale,
} from '@helpers/ResponsiveFonts';
import GLOBALS from '@constants/index';
const {COLOR, FONTS, FONTSIZE} = GLOBALS;
const styles = StyleSheet.create({
  GiftedChatCantiner: {
    flex: 1,
    marginBottom: verticalScale(20),
  },
  buttonConatiner: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    right: 10,
    flexDirection: 'row',
  },

  inputBox: {
    width: '75%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: moderateScale(40),
    backgroundColor: COLOR.BACKGROUND_GREY,
    marginHorizontal: horizontalScale(10),
  },
  textInput: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: FONTSIZE.SEMI_MEDIUM2,
    paddingVertical: Platform.OS === 'ios' ? verticalScale(20) : null,
    marginLeft: horizontalScale(20),
  },
  cameraImage: {
    marginVertical: verticalScale(10),
    height: verticalScale(30),
    width: horizontalScale(30),
    tintColor: '#666',
  },
  recorderImage: {
    marginVertical: verticalScale(10),
    height: verticalScale(30),
    width: horizontalScale(30),
    tintColor: '#666',
  },
  recordingMic: {
    marginVertical: verticalScale(10),
    height: verticalScale(60),
    width: horizontalScale(60),
    tintColor: '#666',
  },
  sendbutton: {
    height: verticalScale(25),
    width: horizontalScale(25),
    tintColor: '#666',
    marginRight: horizontalScale(10),
  },
  modalBtn: {
    marginTop: verticalScale(30),
    width: '40%',
    alignSelf: 'center',
  },
  VideoBox: {
    width: horizontalScale(200),
    height: verticalScale(200),
  },
  scrollStyle: {
    flexGrow: 1,
  },
});
export default styles;
