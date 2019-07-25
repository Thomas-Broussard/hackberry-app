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
	public CMD_GEN_BOARD:number = 7; 	// get the name of the main hackberry board.

	//-----------------------------------
	//COMMAND LIST SRV
	//-----------------------------------
	public CMD_SRV_MOVE:number = 8; 	// move motor to the given position.
	public CMD_SRV_MOVE_UP:number = 9; 	// rotation of servomotors clockwise.
	public CMD_SRV_MOVE_DOWN:number = 10; 	// rotation of servomotors reverse clockwise.
	public CMD_SRV_SAVE_MAX:number = 11; 	// save current position as max limit.
	public CMD_SRV_SAVE_MIN:number = 12; 	// save current position as min limit.
	public CMD_SRV_LOAD_MAX:number = 13; 	// load max limit value.
	public CMD_SRV_LOAD_MIN:number = 14; 	// load min limit value.
	public CMD_SRV_SET_HAND:number = 15; 	// set type of hand.
	public CMD_SRV_GET_HAND:number = 16; 	// get current type of hand.
	public CMD_SRV_CALIB:number = 17; 	// launch servomotor calibration.
	public CMD_SRV_CALIB_UP:number = 18; 	// move up the servomotor (calibration only).
	public CMD_SRV_CALIB_DOWN:number = 19; 	// move down the servomotor (calibration only).
	public CMD_SRV_CALIB_OK:number = 20; 	// validate the position of servomotor (calibration only).
	public CMD_SRV_SET_SPEED:number = 21; 	// Set the motors speed.
	public CMD_SRV_GET_SPEED:number = 22; 	// Get the motors speed.
	public CMD_SRV_TEST:number = 23; 	// Launch the test procedure for motors.

	//-----------------------------------
	//COMMAND LIST SENS
	//-----------------------------------
	public CMD_SENS_GET_VALUE:number = 24; 	// get current sensor value.
	public CMD_SENS_SET_TYPE:number = 25; 	// set type of sensor used (IR,EMG,etc…).
	public CMD_SENS_GET_TYPE:number = 26; 	// get type of sensor used (IR,EMG,etc…).
	public CMD_SENS_CALIB:number = 27; 	// launch sensor calibration.

	constructor() { }
}