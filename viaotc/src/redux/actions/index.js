import { ActionType } from './actionType';

export function trustPartner(bool){
	return {
		type: ActionType.TRUST_PARTNER,
		bool
	}
}

export function shieldedPartner(bool){
	return {
		type: ActionType.SHIELDED_PARTNER,
		bool
	}	
}

export function updateAvatar(avatar){
	return {
		type: ActionType.UPDATE_AVATAR,
		avatar
	}
}

export function changeUserName(username){
	return {
		type: ActionType.CHANGE_USER_NAME,
		username
	}
}

export function userLogout(){
	return {
		type: ActionType.USER_LOGOUT
	}
}

export function userLogin(){
	return {
		type: ActionType.USER_LOGIN
	}
}

export function updateGaStatus(ga_status){
	return {
		type: ActionType.UPDATE_GA_STATSUS,
		ga_status
	}
}

export function updateFundPassword(funds_password_status){
	return {
		type: ActionType.UPDATE_FUND_PASSWORD,
		funds_password_status
	}	
}