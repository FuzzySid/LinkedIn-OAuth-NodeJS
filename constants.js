const CONSTANTS={
    PORT:8000,
    Domain: 'http://127.0.0.1',
    callbackUrl:'/auth/linkedin/callback',
    authUrl:'/auth/linkedin',
    successUrl:'/',
    failureUrl:'/login',
    linkedInScopes: ["r_emailaddress", "r_liteprofile"],
    strategy:'linkedin'
}

module.exports=CONSTANTS;