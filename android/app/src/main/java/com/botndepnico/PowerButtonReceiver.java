package com.tuapp;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.SystemClock;

public class PowerButtonReceiver extends BroadcastReceiver {
    private static int pressCount = 0;
    private static long lastPressTime = 0;

    @Override
    public void onReceive(Context context, Intent intent) {
        if (Intent.ACTION_SCREEN_OFF.equals(intent.getAction()) ||
            Intent.ACTION_SCREEN_ON.equals(intent.getAction())) {

            long currentTime = SystemClock.elapsedRealtime();
            if (currentTime - lastPressTime < 1000) {
                pressCount++;
            } else {
                pressCount = 1;
            }
            lastPressTime = currentTime;

            if (pressCount == 3) {
                // Aquí puedes generar un evento de pánico
                System.out.println("¡Alerta de pánico!");
            }
        }
    }
}
