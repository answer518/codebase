// 登录状态
const initialState = {
	username: 'guotingjie',
    avatar: 'https://avatars0.githubusercontent.com/u/17827860?s=40&v=4',
    is_logged: false
}

// const initGlobal = {
//     avatar: getAvatar(window.OTC.avatar),
//     is_trusted: false,
//     is_shielded: false,
//     username: window.OTC.username || '',
//     ga_status: window.OTC.ga_status || '0',
//     funds_password_status: window.OTC.funds_password_status || '',
//     phone: window.OTC.phone || '',
//     is_logged: window.OTC.is_logged
// };

function login(state = initialState, action) {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return Object.assign({}, state, {
                loginData: action.user
            })
        case 'LOGIN_FAILED':
        	return state;
        default:
            return state
    }
}

export default login;