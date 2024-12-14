import { DeviceEventEmitter } from "react-native";
import BackgroundService from 'react-native-background-actions';

interface taskData {
    delay: number;
}

const options = {
    taskName: 'PanicService',
    taskTitle:'Boton de panico Activo',
    taskDesc: 'Escuchando el botón de encendido...',
    taskIcon: {
        name: 'ic_notification',
        type: 'drawable'
    },
    color: '#ff0000',
    parameters: {
        delay: 1000
    },
};

const panicService = async (taskData?: taskData | undefined) => {
    const delay  = taskData?.delay || 2000;

    let pressCount = 0;
    let lastPressTime = 0;

    const checkPowerButton = () => {
        DeviceEventEmitter.addListener('powerEvent',() => {
            const currentTime = Date.now();
            if(currentTime - lastPressTime < 1000) {
                pressCount++;
            }else {
                pressCount = 1;
            }

            lastPressTime = currentTime;
            if(pressCount === 3) {
                console.log("Pulsaciones")
                triggerPanicAlert();
            }
        });
    };

    const triggerPanicAlert = () => {
        console.log('Alerta de panico generada!');
    };

    checkPowerButton();

    while(BackgroundService.isRunning()) {
        await new Promise(resolve => setTimeout(resolve, delay));
    }
};

export const startPanicService = async () => {
    console.log("Boton encendido")
    await BackgroundService.start(panicService, options);
};
  
export const stopPanicService = async () => {
    console.log("Boton apagado")
    await BackgroundService.stop();
};