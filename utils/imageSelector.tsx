import { Alert } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

export const handlePickImage = async (): Promise<string | null> => {
  const options = ['Tomar foto', 'Seleccionar desde galería', 'Cancelar'];
  return new Promise((resolve) => {
    Alert.alert(
      'Seleccionar imagen',
      '¿Cómo deseas añadir la imagen?',
      [
        {
          text: options[0], // Tomar foto
          onPress: async () => {
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            if (!permissionResult.granted) {
              alert('Se requiere permiso para acceder a la cámara.');
              resolve(null);
              return;
            }
            const pickerResult = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [4, 3],
              quality: 0.5,
            });

            if (!pickerResult.canceled && pickerResult.assets.length > 0) {
              const resizedImage = await ImageManipulator.manipulateAsync(
                pickerResult.assets[0].uri,
                [{ resize: { width: 600 } }],
                { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
              );
              const base64Image = await convertImageToBase64(resizedImage.uri);
              resolve(base64Image);
            } else {
              resolve(null);
            }
          },
        },
        {
          text: options[1], // Seleccionar desde galería
          onPress: async () => {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
              alert('Se requiere permiso para acceder a la galería.');
              resolve(null);
              return;
            }
            const pickerResult = await ImagePicker.launchImageLibraryAsync({
              allowsEditing: true,
              aspect: [4, 3],
              quality: 0.5,
            });

            if (!pickerResult.canceled && pickerResult.assets.length > 0) {
              const resizedImage = await ImageManipulator.manipulateAsync(
                pickerResult.assets[0].uri,
                [{ resize: { width: 600 } }],
                { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
              );
              const base64Image = await convertImageToBase64(resizedImage.uri);
              resolve(base64Image);
            } else {
              resolve(null);
            }
          },
        },
        { text: options[2], style: 'cancel', onPress: () => resolve(null) }, // Cancelar
      ]
    );
  });
};

const convertImageToBase64 = async (uri: string): Promise<string> => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error('Error al convertir la imagen a Base64:', error);
    throw new Error('No se pudo procesar la imagen seleccionada.');
  }
};
