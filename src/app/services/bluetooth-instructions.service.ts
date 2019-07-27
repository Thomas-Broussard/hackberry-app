import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root'})

export class BluetoothInstructions {

	public CMD_ERROR: number = -1; // error received
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
	public CMD_SRV_SAVE_MAX:number = 9; 	// save current position as max limit.
	public CMD_SRV_SAVE_MIN:number = 10; 	// save current position as min limit.
	public CMD_SRV_LOAD_MAX:number = 11; 	// load max limit value.
	public CMD_SRV_LOAD_MIN:number = 12; 	// load min limit value.
	public CMD_SRV_SET_HAND:number = 13; 	// set type of hand.
	public CMD_SRV_GET_HAND:number = 14; 	// get current type of hand.
	public CMD_SRV_SET_SPEED:number = 15; 	// Set the motors speed.
	public CMD_SRV_GET_SPEED:number = 16; 	// Get the motors speed.
	public CMD_SRV_TEST:number = 17; 	// Launch the test procedure for motors.
	public CMD_SRV_ENABLE:number = 18; 	// enable move drived by sensor.
	public CMD_SRV_DISABLE:number = 19; 	// disable move drived by sensor.

	//-----------------------------------
	//COMMAND LIST SENS
	//-----------------------------------
	public CMD_SENS_GET_VALUE:number = 20; 	// get current sensor value.
	public CMD_SENS_SET_TYPE:number = 21; 	// set type of sensor used (IR,EMG,etc…).
	public CMD_SENS_GET_TYPE:number = 22; 	// get type of sensor used (IR,EMG,etc…).
	public CMD_SENS_CALIB:number = 23; 	// launch sensor calibration.

	constructor() { }
}