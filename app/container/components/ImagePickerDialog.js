import React, {useContext} from 'react'
import {
    Modal,
    Text,
    TouchableOpacity,
    StyleSheet,
    View,
    Platform,
    PermissionsAndroid,
    TouchableWithoutFeedback
} from 'react-native'
import { AntDesign  } from "@react-native-vector-icons/ant-design";
import Constants from '../../common/Constants'
import {scale} from '../../ScalingUtils'
import Color from '../../common/Color'

import {toast} from '../../Omni'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker'
import Block from './Block'
import TextElement from './text/Text'
import {Context} from '../../config/LanguageProvider'

const options = {
    mediaType: 'photo',
    maxWidth: 500,
    maxHeight: 500,
    quality: 0.5,
    cameraType: 'back',
    includeBase64: true,
    saveToPhotos: false,
    // selectionLimit:5

}
const ImagePickerDialog = ({onRemove,isRemovable=false,isModalVisible, setModalVisibility, onImagePic,multipleImageSelection=false}) => {
    const {value: {t, themeColor: {colors}}} = useContext(Context)
    const [enable, setDisable] = React.useState(true)


    const requestCameraPermission = async () => {
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    return true
                } else {
                    toast(t('imagePickerDialog:cameraPermissionDenied'));
                    return false
                }
            } else {
                return true
            }

        } catch (err) {
            console.warn(err);
        }
    };

    const pickImageFromCamera = async () => {
        if (await requestCameraPermission()) {
            setDisable(false)
            await launchCamera(options, (response) => {
                setDisable(true)
                if (response.didCancel) {
                    console.log('User cancelled image picker')
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error)
                } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton)
                } else {
                    if (response.assets && response.assets.length > 0) {
                        const value = response.assets[0]
                        if (value) {
                            value.uri = Platform.OS == 'ios' ? value.uri.replace('file://', '/private') : value.uri
                            value.name = value.fileName
                            if (multipleImageSelection){
                                onImagePic([value])

                            }else{
                                onImagePic(value)

                            }
                        } else {
                            toast(t('imagePickerDialog:somethingWentWrong'))
                        }
                        setModalVisibility(false)
                    } else {
                        if (response.errorMessage) {
                            toast(response.errorMessage)
                        } else {
                            toast(t('imagePickerDialog:somethingWentWrong'))
                        }
                    }

                }
            })
        }


    }

    const pickImageFromGallery = () => {
        setDisable(false)
        launchImageLibrary(options, (response) => {
            // setTimeout(()=>{setDisable(true)},1000)
            setDisable(true)
            if (response.didCancel) {
                console.log('User cancelled image picker')
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error)
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton)
            } else {
                if (response.assets && response.assets.length > 0) {
                    const value = response.assets[0]
                    if (value) {

                        value.uri = Platform.OS == 'ios' ? value.uri : value.uri
                        value.name = value.fileName,
                        value.type = value.type,
                        onImagePic(value)
                    } else {
                        toast(t('imagePickerDialog:somethingWentWrong'))
                    }
                    setModalVisibility(false)
                } else {
                    toast(t('imagePickerDialog:somethingWentWrong'))
                }

            }
        }).then(res => {
            console.log(res)
        })
    }
    const pickImageMultipleFromGallery = () => {
        setDisable(false)
        launchImageLibrary({...options,selectionLimit:5}, (response) => {
            // setTimeout(()=>{setDisable(true)},1000)
            setDisable(true)
            if (response.didCancel) {
                console.log('User cancelled image picker')
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error)
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton)
            } else {
                const imageArray=[]
                if (response.assets && response.assets.length > 0) {
                    for (const image of response.assets){
                        if (image){
                            const value={
                                uri: Platform.OS == 'ios' ? image.uri : image.uri,
                                name :image.fileName,
                                type :image.type
                            }
                            imageArray.push(value)
                        }
                    }
                    onImagePic(imageArray)
                } else {
                    toast(t('imagePickerDialog:somethingWentWrong'))
                }
                setModalVisibility(false)

            }
        }).then(res => {
            console.log(res)
        })
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => {
                setModalVisibility(false)
            }}>
            <TouchableWithoutFeedback style={{backgroundColor:'red'}} activeOpacity={0.9} onPress={() => {
                setModalVisibility(isModalVisible)
            }}>
            <View style={{
                flex: 1,
                flexGrow: 1,
                flexDirection: 'row',
                backgroundColor: 'rgba(0,0,0,0.5)',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 40
            }}>



                <Block isForground={true} style={{
                    padding: 20,
                    width: 0,
                    flexGrow: 1,
                    flex: 1,
                    borderRadius: 20
                }}>


                        <>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <AntDesign name="close-circle" size={20} color={colors.white} style={{margin: 2, marginRight: 20}}
                               onPress={() => {
                                   setModalVisibility(isModalVisible)
                               }}/>
                        <TextElement style={styles.heading}>{t('imagePickerDialog:selectImage')}</TextElement>
                    </View>
                    <TouchableOpacity onPress={() => pickImageFromCamera()}>
                        <TextElement style={styles.title}>{t('imagePickerDialog:takePhoto')}</TextElement>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        if (enable){
                            if (multipleImageSelection){
                                pickImageMultipleFromGallery()
                            }else{
                                pickImageFromGallery()
                            }
                        }

                    }}>
                        <TextElement style={styles.title}>{t('imagePickerDialog:chooseFromLibrary')}</TextElement>
                    </TouchableOpacity>
                    {isRemovable&&
                    <TouchableOpacity onPress={onRemove}>
                        <TextElement style={styles.title}>{t('imagePickerDialog:removePicture')}</TextElement>
                    </TouchableOpacity>}
                        </>

                </Block>

            </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

export default ImagePickerDialog

const styles = StyleSheet.create({
    heading: {
        fontFamily: Constants.fontFamilyMedium,
        fontSize: scale(18),
        includeFontPadding: false
    },
    title: {
        fontFamily: Constants.fontFamilyMedium,
        fontSize: scale(13),
        marginTop: 15,
        includeFontPadding: false
    }
})
