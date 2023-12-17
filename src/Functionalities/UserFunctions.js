import Cookies from 'js-cookie';

// export function login(loginRequest) {
//     return request({
//         url: "http://localhost:8080" + "/auth/login",
//         method: 'POST',
//         body: JSON.stringify(loginRequest)
//     });
// }

export function logout(){
    Cookies.remove('JSESSIONID');
}