import { useState } from "react";
import { Button, TextInput, View, Text, Image } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { handlePickImage } from "../../../utils/imageSelector";

interface ValidationErrors {
  fecha_registro?: string;
  contacto_emergencia?: string;
  tipo_sangre?: string;
  foto_perfil?: string | null;
}

interface Props {
  formData: { fecha_registro: string; contacto_emergencia: string; tipo_sangre: string; foto_perfil: string | null };
  setFormData: React.Dispatch<React.SetStateAction<{ fecha_registro: string; contacto_emergencia: string; tipo_sangre: string; foto_perfil: string | null}>>;
  errors: ValidationErrors;
}

const RegisterStepThree = ({ formData, setFormData, errors }: Props) => {
  const handleImageSelection = async () => {
    const selectedImage = await handlePickImage(); 
    if (selectedImage) {
      setFormData({ ...formData, foto_perfil: selectedImage }); 
    }
  };

  return (
    <View>
    <TextInput
      style={{
        backgroundColor: '#FFF',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: errors.contacto_emergencia ? '#D8000C' : '#ccc',
        marginBottom: 8,
      }}
      placeholder="Contacto de emergencia"
      keyboardType="numeric"
      maxLength={10}
      value={formData.contacto_emergencia}
      onChangeText={text =>
        setFormData({ ...formData, contacto_emergencia: text.replace(/[^0-9]/g, '') })
      }
    />
    {errors.contacto_emergencia && <Text style={{ color: 'red' }}>{errors.contacto_emergencia}</Text>}

    <Picker
      selectedValue={formData.tipo_sangre}
      onValueChange={(itemValue: any) => setFormData({ ...formData, tipo_sangre: itemValue })}
      style={{ height: 50, width: '100%', backgroundColor: '#FFF', borderRadius: 8, marginBottom: 8 }}
    >
      <Picker.Item label="Seleccione el tipo de sangre" value="" />
      <Picker.Item label="A+" value="A+" />
      <Picker.Item label="A-" value="A-" />
      <Picker.Item label="B+" value="B+" />
      <Picker.Item label="B-" value="B-" />
      <Picker.Item label="AB+" value="AB+" />
      <Picker.Item label="AB-" value="AB-" />
      <Picker.Item label="O+" value="O+" />
      <Picker.Item label="O-" value="O-" />
    </Picker>
    {errors.tipo_sangre && <Text style={{ color: 'red' }}>{errors.tipo_sangre}</Text>}

    <View style={{ alignItems: 'center', marginBottom: 8 }}>
      <Button title="Tomar o subir foto" onPress={handleImageSelection} />
      {formData.foto_perfil && (
        <Image
          source={{ uri: `data:image/jpeg;base64,${formData.foto_perfil}` }}
          style={{ width: 96, height: 96, borderRadius: 48, marginTop: 8 }}
        />
      )}
      {errors.foto_perfil && <Text style={{ color: 'red' }}>{errors.foto_perfil}</Text>}
    </View>
  </View>
  )
}

export default RegisterStepThree