import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root'})

export class BluetoothInstructions {

	//-----------------------------------
	//COMMAND LIST GEN
	//-----------------------------------
	public CMD_GEN_TEST:number = 0; 	// check the bluetooth connection.
	public CMD_GEN_SET_PASS:number = 1; 	// set new bluetooth password.
	public CMD_GEN_SET_NAME:number = 2; 	// set new name.
	public CMD_GEN_STOP:number = 3; 	// stop the bluetooth device.
	public CMD_GEN_RESET:number = 4; 	// reset parameters.
	public CMD_GEN_VERSION:number = 5; 	// get version of the current software.
	public CMD_GEN_BATTERY:number = 6; 	// get the current level of battery (or -1 if battery can't be read).

	//-----------------------------------
	//COMMAND LIST SRV
	//-----------------------------------
	public CMD_SRV_MOVE:number = 7; 	// move motor to the given position.
	public CMD_SRV_MOVE_UP:number = 8; 	// rotation of servomotors clockwise.
	public CMD_SRV_MOVE_DOWN:number = 9; 	// rotation of servomotors reverse clockwise.
	public CMD_SRV_SAVE_MAX:number = 10; 	// save current position as max limit.
	public CMD_SRV_SAVE_MIN:number = 11; 	// save current position as min limit.
	public CMD_SRV_LOAD_MAX:number = 12; 	// load max limit value.
	public CMD_SRV_LOAD_MIN:number = 13; 	// load min limit value.
	public CMD_SRV_SET_HAND:number = 14; 	// set type of hand.
	public CMD_SRV_GET_HAND:number = 15; 	// get current type of hand.
	public CMD_SRV_CALIB:number = 16; 	// launch servomotor calibration.
	public CMD_SRV_CALIB_UP:number = 17; 	// move up the servomotor (calibration only).
	public CMD_SRV_CALIB_DOWN:number = 18; 	// move down the servomotor (calibration only).
	public CMD_SRV_CALIB_OK:number = 19; 	// validate the position of servomotor (calibration only).
	public CMD_SRV_SET_SPEED:number = 20; 	// Set the motors speed.
	public CMD_SRV_GET_SPEED:number = 21; 	// Get the motors speed.
	public CMD_SRV_TEST:number = 22; 	// Launch the test procedure for motors.

	//-----------------------------------
	//COMMAND LIST SENS
	//-----------------------------------
	public CMD_SENS_GET_VALUE:number = 23; 	// get current sensor value.
	public CMD_SENS_SET_TYPE:number = 24; 	// set type of sensor used (IR,EMG,etc…).
	public CMD_SENS_GET_TYPE:number = 25; 	// get type of sensor used (IR,EMG,etc…).
	public CMD_SENS_CALIB:number = 26; 	// launch sensor calibration.

	constructor() { }
}