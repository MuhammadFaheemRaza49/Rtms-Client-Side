import {
  Alert,
  LayoutAnimation,
  Linking,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {check, checkNotifications, PERMISSIONS, request, requestNotifications, RESULTS} from "react-native-permissions";
import messaging from "@react-native-firebase/messaging";
import DeviceInfo from "react-native-device-info";
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import notifee, {EventType} from '@notifee/react-native';
import {toast} from '../../../../../Omni';
import FileViewer from "react-native-file-viewer";
import moment from 'moment';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import store from '../../../../../store/configureStore';
import {openDialog} from '../../../../../redux/app/actions';
import i18n from 'i18next';
import axios from 'axios';
import {Constants} from "../../../../../common";
/**
 * Check and request location permission without external libs.
 * @returns {Promise<boolean>}
 */

export const checkLocationPermission = async () => {
    try {
        const permission = Platform.select({
            ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
            android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        });

        const result = await check(permission);
        return result === RESULTS.GRANTED || result === RESULTS.LIMITED;
    } catch (err) {
        console.error('Location check error', err);
        return false;
    }
};
export const openAppSettings = async () => {
    if (Platform.OS === 'ios') {
        Linking.openURL('app-settings:')
            .catch(() => {
                console.warn('Unable to open settings');
            });
    } else {
        try {
            await Linking.openSettings();
        } catch (err) {
            console.warn('Unable to open settings', err);
        }
    }
};
export const requestLocationPermission = async () => {
    try {
        const permission = Platform.select({
            ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
            android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        });


        const result = await request(permission);
        if (result==='blocked'){
            openAppSettings();
            return
        }

        return result === RESULTS.GRANTED || result === RESULTS.LIMITED;
    } catch (err) {
        console.error('Location request error', err);
        return false;
    }
};

export const LayoutAnimate = (time = 500) => {
  LayoutAnimation.configureNext({
    duration: time,
    create: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
    update: {type: LayoutAnimation.Types.easeInEaseOut},
  });
};

export const requestFCMPermission = async () => {

    try {
        const osVersion = parseInt(DeviceInfo.getSystemVersion(), 10);

        if (Platform.OS === 'ios') {
            const authStatus = await messaging().requestPermission();
            return (
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL
            );
        } else {
            if (osVersion > 12) {
                const result = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
                );
                return result === PermissionsAndroid.RESULTS.GRANTED;
            }
            return true;
        }
    } catch (error) {
        console.error('[FCM] Permission request error:', error);
        return false;
    }

};


const displayNotificationFunction = async (filePath,folder) => {
  // Create the notification using Notifee
  // Create a channel (required for Android)

  await notifee.requestPermission();
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });


 await notifee.displayNotification({
    title: 'Download Complete',
    body: 'Your file has been downloaded successfully.',
    data: {
      filePath,
      folder// Pass the file path to open later when clicked
    },
    android: {
      channelId,
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',
      },
    },
  });




  // Handle the press action (when user taps the notification)
  notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS) {
      // Open the downloaded file
      if (Platform.OS === 'ios') {
        Share.open({
          url: `file://${filePath}`,
          type: 'application/pdf',
        });
      } else {
        // Open the file on Android (you can use a custom file viewer or a package to open PDF files)
        openFolderInAndroid(filePath); // Open the file with Android's default PDF viewer
      }
    }
  });
};

const openFolderInAndroid = async (folderPath) => {
  try {
    const folderExists = await RNFS.exists(folderPath); // Check if the folder exists

    if (folderExists) {
      // For Android, create content URI using FileProvider
      try {

        await FileViewer.open(folderPath)
      } catch (error) {
        console.error('Failed to open file:', error);
        // Handle error, e.g., show an alert to the user
      }
    } else {
      console.log('Folder does not exist.');
    }
  } catch (err) {
    console.log("Error:", err);
    // Add any additional error handling as needed
  }
};
export const checkNotificationPermission =  () => {
    try {
       return checkNotifications().then(({status, settings}) => {
            console.log("CALLED",status)
            return status==='granted';
        }).catch((error)=>{
            console.log("TEST",error)
        });

    } catch (err) {
        console.error('Location request error', err);
        return false;
    }
};
export const requestNotificationPermission = async () => {
    try {
        const {status} = await requestNotifications(['alert', 'sound']);

        if (status === 'blocked') {
            openAppSettings();
            return false;
        }

        return status === RESULTS.GRANTED;
    } catch (err) {
        console.error('Notification request error', err);
        return false;
    }
};
const ensureDirectoryExists = async (path) => {
  try {
    const isDir = await RNFS.exists(path);
    if (!isDir) {
      await RNFS.mkdir(path);
      console.log('✅ Directory created successfully at', path);
    } else {
      console.log('✅ Directory already exists at', path);
    }
  } catch (error) {
    console.error('❌ Failed to create directory, using Documents directory instead:', error);
    return false; // Indicate directory creation failed
  }
  return true; // Return true if directory exists or was created
};


export const downloadPDF = async (pdfUrl, fileName, folderName) => {
  try {
    const fileExt = '.pdf';
    const nameWithExt = `${fileName}_${moment().unix()}${fileExt}`;




    const downloadPathAvailable = RNFS.DownloadDirectoryPath;

    let pathToWrite = ''
    if (Platform.OS === 'ios') {
      pathToWrite = `${RNFS.DocumentDirectoryPath}/${folderName}`;
    } else {
      // Fallback to DocumentDirectoryPath if DownloadDirectoryPath is unavailable
      pathToWrite = downloadPathAvailable
        ? `${RNFS.DownloadDirectoryPath}/${folderName}`
        : `${RNFS.DocumentDirectoryPath}/${folderName}`;
    }
    const isDirCreated = await ensureDirectoryExists(pathToWrite);
    if (!isDirCreated) {
      console.log('Using fallback Documents directory');
      pathToWrite = `${RNFS.DocumentDirectoryPath}`;
    }
    const filePath = `${pathToWrite}/${nameWithExt}`;


    const downloadResult = await RNFS.downloadFile({
      fromUrl: pdfUrl,
      toFile: filePath,
    }).promise;



    if (downloadResult.statusCode === 200) {
      displayNotificationFunction(filePath, pathToWrite);
      toast(`File Saved to ${filePath}`);
      console.log('✅ File downloaded successfully to', filePath);
      return filePath;

    } else {
      console.error('❌ Download failed with status:', downloadResult.statusCode);
      return false;
    }
  } catch (error) {
    console.error('❌ Error downloading file:', error);
    toast("Could not able to download right now")
    return false;
  }
};
export const getUtilizedPromoCredits = ({
  isEnabled,
  totalAmount = 0,
  availableCredits = 0,
}) => {
  if (!isEnabled) return 0;
  return Math.min(totalAmount, availableCredits);
};

export const getUtilizedWalletBalance = ({
  isEnabled,
  amountAfterPromo = 0,
  availableBalance = 0,
}) => {
  if (!isEnabled) return 0;
  return Math.min(amountAfterPromo, availableBalance);
};

/**
 * Ask for the minimum media permission needed to save/show an image in the gallery.
 * Returns a boolean.
 */
export async function requestMediaPermission() {
  // iOS: CameraRoll will handle Photos permission if needed
  if (Platform.OS !== 'android') return true;

  const sdk = Number(Platform.Version) || 0;

  // Android 10+ (API 29+): scoped storage / MediaStore -> no storage permission needed
  if (sdk >= 29) return true;

  const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

  try {
    const alreadyGranted = await PermissionsAndroid.check(permission);
    if (alreadyGranted) return true;

    const result = await PermissionsAndroid.request(permission);

    if (result === PermissionsAndroid.RESULTS.GRANTED) return true;

    if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      Alert.alert(
        'Storage permission needed',
        'To save files to your device, please allow storage permission in Settings.',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Open Settings', onPress: () => Linking.openSettings()},
        ],
      );
    }

    return false;
  } catch (err) {
    console.warn('Android permission error:', err);
    return false;
  }
}
export async function saveBase64ToGallery(base64, filename = 'image', album = 'Bookme') {
  try {
    // Ask for permission
    const hasPermission = await requestMediaPermission();
    if (!hasPermission) {
      console.warn('Permission denied');
      return false;
    }

    // Remove data URL prefix if present
    const cleanBase64 = base64.replace(/^data:image\/png;base64,/, '');

    // Create a file path
    const filePath = `${RNFS.CachesDirectoryPath}/${filename}_${Date.now()}.png`;

    // Write the file
    await RNFS.writeFile(filePath, cleanBase64, 'base64');

    // Save to gallery (CameraRoll handles MediaStore)
    const savedAsset = await CameraRoll.saveAsset(`file://${filePath}`, {
      type: 'photo',
      album: album,
    });

    // Optionally remove the temp file
    RNFS.unlink(filePath).catch(() => {});

    console.log('✅ Image saved to gallery:', savedAsset);
    return true;
  } catch (err) {
    console.error('❌ Failed to save image:', err);
    return false;
  }
}

export const openWhatsAppChat = async phoneE164 => {
    const url = `whatsapp://send?phone=${phoneE164}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
        await Linking.openURL(url);
        return;
    }

    const webUrl = `https://wa.me/${phoneE164}`;
    await Linking.openURL(webUrl);
};

export function getFontFaceCSS() {
    const fonts = [
        { family: Constants.fontFamilyRegular,       file: 'Inter-Regular',              style: 'normal' },
        { family: Constants.fontFamilyMedium,        file: 'Inter-Medium',               style: 'normal' },
        { family: Constants.fontFamilyBold,          file: 'Inter-SemiBold',             style: 'normal' },
        { family: Constants.fontFamilyBoldItalic,    file: 'Inter-SemiBoldItalic',       style: 'italic' },
        { family: Constants.fontFamilyRegularArabic, file: 'IBMPlexSansArabic-Regular',  style: 'normal' },
        { family: Constants.fontFamilyMediumArabic,  file: 'IBMPlexSansArabic-Medium',   style: 'normal' },
        { family: Constants.fontFamilyBoldArabic,    file: 'IBMPlexSansArabic-SemiBold', style: 'normal' },
    ];

    return fonts.map(({ family, file, style }) => `
    @font-face {
      font-family: '${family}';
      src: url('file:///android_asset/fonts/${file}.ttf') format('truetype'),
           url('../fonts/${file}.ttf') format('truetype');
      font-weight: normal;
      font-style: ${style};
    }
  `).join('');
}

export function buildRootCSS(theme) {
    const isLight = theme.key === 'light';
    const c = theme.colors;

    const vars = {
        // ── Backgrounds ──────────────────────────────────
        '--bg':            c.bgColorWhite,
        '--bg-secondary':  c.bgColor,
        '--card':          c.bgColorWhite,
        '--surface':       c.bgSecondaryColor,
        '--surface-warm':  isLight ? '#fffbf0' : '#1f1b10',

        // ── Text ─────────────────────────────────────────
        '--text':          c.headingText,
        '--text-strong':   c.headingText,
        '--text-muted':    c.greyText,

        // ── Borders ───────────────────────────────────────
        '--border':        c.borderColor,
        '--border-warm':   c.borderColor,

        // ── Umrah Accent (primary brand color) ───────────
        '--accent':        c.umrahPrimary,
        '--accent-bg':     c.umrahChipBg,
        '--accent-text':   c.umrahTextChip,
        '--accent-dark':   isLight ? '#0f3d26' : '#12413B',

        // ── Chips / Badges ────────────────────────────────
        '--chip-success-bg':   c.bgChipSuccess,
        '--chip-success-text': c.textChipSuccess,
        '--chip-error-bg':     c.bgChipError,
        '--chip-error-text':   c.textChipError,
        '--chip-warn-bg':      c.bgChipProcess,
        '--chip-warn-text':    c.textChipProcess,
        '--chip-info-bg':      c.bgInfoChip,
        '--chip-info-text':    c.textInfoChip,

        // ── Dua Box ───────────────────────────────────────
        '--dua-bg':        c.umrahChipBg,
        '--dua-border':    c.umrahPrimary,
        '--dua-label':     c.umrahPrimary,

        // ── Steps ─────────────────────────────────────────
        '--step-bg':       c.umrahPrimary,
        '--step-text':     '#ffffff',

        // ── Details/Accordion ─────────────────────────────
        '--detail-open-border': c.umrahPrimary,
        '--detail-shadow':      isLight
            ? 'rgba(0,0,0,0.08)'
            : 'rgba(0,0,0,0.3)',

        // ── CTA Section ───────────────────────────────────
        '--cta-bg':        isLight
            ? `linear-gradient(135deg, ${c.umrahPrimary} 0%, #0f3d26 100%)`
            : `linear-gradient(135deg, #12413B 0%, #0a2920 100%)`,
        '--cta-text':      '#ffffff',
        '--cta-eyebrow':   'rgba(255,255,255,0.7)',
        '--cta-btn-bg':    c.bgColorWhite,
        '--cta-btn-text':  c.umrahPrimary,

        // ── Soft Section ──────────────────────────────────
        '--soft-bg':       c.umrahChipBg,

        // ── Urdu Card ─────────────────────────────────────
        '--urdu-bg':       isLight ? '#fffbf0' : c.bgChipProcess,
        '--urdu-border':   isLight ? '#f0d98a' : c.borderColor,

        // ── Overlay / Shimmer ─────────────────────────────
        '--shimmer':       c.shimmerColor,
        '--overlay':       c.overlay,

        // ── Fonts ─────────────────────────────────────────
        '--font-regular': `'${Constants.fontFamilyRegular}', '${Constants.fontFamilyRegularArabic}', sans-serif`,
        '--font-medium':  `'${Constants.fontFamilyMedium}', '${Constants.fontFamilyMediumArabic}', sans-serif`,
        '--font-bold':    `'${Constants.fontFamilyBold}', '${Constants.fontFamilyBoldArabic}', sans-serif`,
        '--font-italic':  `'${Constants.fontFamilyBoldItalic}', sans-serif`,
        '--font-arabic':  `'${Constants.fontFamilyRegularArabic}', serif`,
    };

    const css = Object.entries(vars)
        .map(([k, v]) => `  ${k}: ${v};`)
        .join('\n');

    return `:root {\n${css}\n}`;
}

export const apiError = (response,isShow=true) => {
  const status = response?.response?.status;
  const responseData = response?.response?.data?.errors??response?.response?.data?.message??response?.response?.data;
  const netInfoConnected =  store.getState().app.netInfoConnected

  if (netInfoConnected&&isShow) {
    switch (status) {
      case 403: {
        const obj = {blockUser: true};
        store.dispatch(openDialog(obj));
        break;
      }

      case 401: {
        toast(i18n.t("error:authenticationFailed"));
        break;
      }
      case 404: {
        toast(i18n.t("error:noRecord"));
        break;
      }
      case 422: {
        if (isShow) {
          let errorString = '';
          for (let obj of Object.keys(responseData)) {
            errorString += responseData[obj];
          }
          toast(errorString, 3000);
        }
        break;
      }
      case 409: {
        if (typeof responseData === 'string') {
          toast(responseData)
        }

        break;
      }
      default: {
        if (axios.isAxiosError(response)) {

          if (response.code === 'ECONNABORTED') {
            // Timeout error
            toast(i18n.t("error:takingLongerThanExpected"));
          }else {
            if (status >= 500 && isShow) {
              toast(i18n.t("error:serviceNotAvailable"));
            } else if (responseData && typeof responseData === 'string' && isShow) {
              toast(responseData);
            } else if (response?.message && typeof response?.message === 'string' && isShow) {
              toast(response?.message);
            } else {
              if (isShow) {
                toast(i18n.t("error:somethingWentWrong"));
              }
            }
            break;
          }


        }


      }
    }
  }
}
