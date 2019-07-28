#!bin/bash


# 1 - générer la release build
echo "==========================="
echo "Step 1 - Debug Build"
echo "==========================="
cd ..
ionic cordova build android


# 3 - Utiliser zipalign pour optimiser l'APK
echo "==========================="
echo "Step 3 - Generate Output"
echo "==========================="
#./tools/zipalign -v 4 platforms/android/app/build/outputs/apk/release/app-release.apk outputs/HackberryApp.apk
mv platforms/android/app/build/outputs/apk/debug/app-debug.apk outputs/HackberryAppDebug.apk

echo "HackberryAppDebug.apk is now available in HackberryApp/outputs/ folder"
