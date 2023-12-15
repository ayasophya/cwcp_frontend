export function login(loginRequest) {
    return request({
        url: "http://localhost:8080" + "/auth/login",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}