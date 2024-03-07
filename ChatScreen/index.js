/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import Images from '@assets/images';
import CustomModal from '@components/common/CustomModal';
import CustomText from '@components/common/CustomText';
import COLOR from '@constants/colors';
import strings from '@constants/string';
import {
  handlePlayback,
  handleStartPlaying,
  handleStartRecording,
  handleStopPlaying,
  handleStopRecording,
} from '@helpers/AudioService';
import {checkAndRequestPermissions} from '@helpers/Permissions';
import {horizontalScale, verticalScale} from '@helpers/ResponsiveFonts';
import React, {useCallback, useEffect, useState} from 'react';
import {Image, TextInput, TouchableOpacity, View} from 'react-native';
import {Bubble, GiftedChat, InputToolbar} from 'react-native-gifted-chat';
import ImagePicker from 'react-native-image-crop-picker';
import Video from 'react-native-video';
import styles from './styles';
const ChatScreen = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [openPhoto, setOpenPhoto] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioVariation, setAudioVariation] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [audioState, setAudioState] = useState({});

  const openCameraForPhoto = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      const newMediaItem = {
        type: 'photo',
        name: image?.mime ?? '',
        url: image.path,
        id: mediaItems.length + 1, // Generate a unique ID
      };
      setMediaItems([...mediaItems, newMediaItem]);

      // Sending the captured photo to the chat
      onSend([
        {
          _id: Math.random().toString(),
          image: image.path, // Assuming you're sending the image path here
          user: {
            _id: 1,
            name: 'React Native',
          },
          createdAt: new Date(),
        },
      ]);
    });
  };

  const openCameraForVideo = () => {
    ImagePicker.openCamera({
      mediaType: 'video',
    })
      .then(video => {
        const newMediaItem = {
          type: 'video',
          name: video?.mime ?? '',
          url: video.path,
          id: mediaItems.length + 1, // Generate a unique ID
        };
        setMediaItems([...mediaItems, newMediaItem]);

        // Sending the captured video to the chat
        onSend([
          {
            _id: Math.random().toString(),
            video: video.path, // Assuming you're sending the video path here
            user: {
              _id: 1,
              name: 'React Native',
            },
            createdAt: new Date(),
          },
        ]);

        // saveVideoToStorage(video.path);
      })
      .catch(err => console.log(err, 'error in video capture'));
  };

  const askforPermission = async type => {
    const isPermit = await checkAndRequestPermissions();
    if (isPermit) {
      if (type === 'camera') {
        openCameraForPhoto();
      } else if (type === 'video') {
        openCameraForVideo();
      }
      // Close the modal after uploading
      setOpenPhoto(false);
    }
  };

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello, how are you?',
        user: {
          _id: 2,
          name: 'Friend',
          
        },
      },
      {
        _id: 2,
        text: 'I am doing fine, thanks!',
        user: {
          _id: 1,
          name: 'Me',
        },
        
      },
      {
        _id: 3,
        text: 'what are you doing !',
        user: {
          _id: 1,
          name: 'Me',
        },
      }
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
    messages.forEach(message => {
      if (message.video) {
      } else if (message.base64Audio) {
        // playAudio(message.base64Audio); // Play audio when it's sent
      }
    });
  }, []);

  const renderBubble = props => {
    const isRightBubble = props.position === 'right';
    const audioId = props.audioId;

    const isCurrentlyPlaying = audioState[audioId]?.playing || false;

    // Function to toggle play/pause
    const toggleAudio = async audio => {
      if (isCurrentlyPlaying) {
        await handleStopPlaying();
        setIsPlaying(false);
      } else {
        await handleStartPlaying(audio);
        setIsPlaying(true);
      }
    };

    return (
      <>
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              // Styles for messages sent by the current user
              padding: verticalScale(10),
              backgroundColor: COLOR.PRIMARY_BLUE,
              borderRadius: 20,
            },
            left: {
              // Styles for messages sent by other users
              paddingVertical: verticalScale(10),
              backgroundColor: COLOR.CHAT_GREY,
              borderRadius: 20,
            },
          }}
        />
        {props.audio && (
          <TouchableOpacity onPress={() => toggleAudio(props.audio)}>
            <Image
              source={isCurrentlyPlaying ? Images.pause : Images.play}
              style={{height: 20, width: 20}}
            />
          </TouchableOpacity>
        )}
        {isRightBubble ? (
          <Image
            source={Images.blueTail}
            style={{
              width: 20,
              height: 14,
              position: 'absolute',
            }}
          />
        ) : (
          <Image
            source={Images.greyTail}
            style={{
              width: 20,
              height: 14,
              position: 'absolute',
              left: 40,
            }}
          />
        )}
      </>
    );
  };

  useEffect(() => {
    let intervalId;
    if (isRecording) {
      intervalId = setInterval(() => {
        setAudioVariation(prev => !prev); // Toggle the state to show/hide the recording icon
      }, 500); // Adjust the interval duration as needed
    } else {
      clearInterval(intervalId);
      setAudioVariation(false); // Ensure the icon is hidden when recording stops
    }

    return () => clearInterval(intervalId);
  }, [isRecording]);

  const handleMicPress = () => {
    console.log('mic pressed===>>>>');
    setIsRecording(true);
    setIsPressed(true);
    handleStartRecording();
    if (isRecording) {
      sendAudioMessage();
    }
  };

  // Function to send audio message
  const sendAudioMessage = async () => {
    setIsPressed(false);
    try {
      console.log('mic released====>>>>>');
      const filePath = await handleStopRecording(); // Stop recording and get file path
      onSend([{audio: filePath, user: {_id: 1}, createdAt: new Date()}]); // Send audio message
      setIsRecording(false);
    } catch (error) {
      console.error('Failed to send audio message', error);
    }
  };

  const handleStopBack = async () => {
    await handleStopPlaying();
    setIsPlaying(false);
  };

  const CustomInputToolbar = ({onSend}) => {
    const [inputText, setInputText] = useState('');

    const handleSend = () => {
      if (inputText.trim().length > 0) {
        onSend([{text: inputText, user: {_id: 1}, createdAt: new Date()}]);
        setInputText('');
      }
    };

    return (
      <>
        <View style={[styles.inputBox]}>
          {audioVariation && (
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                marginLeft: horizontalScale(10),
              }}>
              <Image
                source={Images.recordingMic}
                resizeMode="contain"
                style={{width: horizontalScale(20), height: verticalScale(20)}}
              />
              <CustomText title={'Recording...'} />
            </View>
          )}
          <TextInput
            style={styles.textInput}
            placeholder={isRecording ? '' : 'Message...'}
            multiline={true}
            value={inputText}
            onChangeText={setInputText}
          />

          {/* {inputText.trim().length <= 0 && (
            <TouchableOpacity
              onPress={() => onSend(props.text ? [{text: props.text}] : null)}
              style={{marginHorizontal: 10}}>
              <Image source={Images.mic} style={styles.micImage} />
            </TouchableOpacity>
          )} */}

          {inputText.trim().length > 0 && (
            <TouchableOpacity onPress={handleSend}>
              <Image source={Images.send} style={styles.sendbutton} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.buttonConatiner}>
          <TouchableOpacity
            style={{marginLeft: horizontalScale(10)}}
            onPress={() => setOpenPhoto(true)}>
            <Image
              source={Images.ChatIconCamare}
              style={styles.cameraImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{marginLeft: horizontalScale(10)}}
            onPressIn={() => {
              console.log('Press In');
              handleMicPress();
            }}
            onPressOut={() => {
              console.log('Press Out');
              sendAudioMessage();
            }}>
            <Image
              source={Images.mic}
              style={styles.recorderImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </>
    );
  };

  const renderMessageVideo = ({currentMessage}) => {
    return (
      <View style={{padding: 10}}>
        <Video
          source={{uri: currentMessage.video}}
          style={styles.VideoBox}
          controls={true}
        />
      </View>
    );
  };
  const renderMessageAudio = ({currentMessage}) => {
    // Assuming currentMessage.audio contains the audio file path
    console.log('currentMessage===>>>', currentMessage);
    return (
      <View style={{padding: 10}}>
        <TouchableOpacity
          key={currentMessage.audioId}
          onPress={() =>
            isPlaying
              ? handleStopBack(currentMessage.audio)
              : handlePlayback(currentMessage.audio, setIsPlaying)
          }>
          <Image
            source={isPlaying ? Images.pause : Images.play}
            style={{height: 20, width: 20}}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.GiftedChatCantiner}>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
          name: 'React Native',


        }}
        renderBubble={renderBubble}
        bottomOffset={0}
        renderInputToolbar={props => (
          <InputToolbar {...props} containerStyle={{borderTopWidth: 0}} />
        )}
        renderComposer={props => <CustomInputToolbar onSend={props.onSend} />}
        renderMessageVideo={renderMessageVideo}
        renderMessageAudio={renderMessageAudio}
      />

      {openPhoto && (
        <CustomModal
          customModalContainer={{width: '90%'}}
          isVisible={openPhoto}
          btn1Title={strings.ok}
          modalTitle={strings.capturePhotoAndVideo}
          isAnyImage={true}
          isSecondImage={true}
          imageA={Images.imageUpload}
          onImageAPress={() => askforPermission('camera')}
          imageB={Images.videoUpload}
          onImageBPress={() => askforPermission('video')}
          customBtn1Style={styles.modalBtn}
          isBtn={true}
          onBtn1Press={() => setOpenPhoto(!openPhoto)}
        />
      )}
    </View>
  );
};

export default ChatScreen;
