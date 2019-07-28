#!bin/bash


# 1 - générer la release build
echo "==========================="
echo "Step 1 - Release Build"
echo "==========================="
cd ..
ionic cordova build --release android

# 2 - Signer l'APK
echo "==========================="
echo "Step 2 - APK Signature"
echo "==========================="
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore tools/HackberryApp.keystore platforms/android/app/build/outputs/apk/release/app-release.apk HackberryApp 

# 3 - Utiliser zipalign pour optimiser l'APK
echo "==========================="
echo "Step 3 - Generate Output"
echo "==========================="
./tools/zipalign -v 4 platforms/android/app/build/outputs/apk/release/app-release.apk outputs/HackberryApp.apk


echo "HackberryApp.apk is now available in HackberryApp/outputs/ folder"
