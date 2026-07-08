export function parseJwt(token){
    try{
        const base64Payload = token.split('.')[1]
        const json = atob(base64Payload.replace(/-/g,'+').replace(/ _/g,'/'))
        const payload = JSON.parse(json)

        const userId = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
        const username = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
        const fullName = payload['FullName']
        const roleRaw = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
        const roles = Array.isArray(roleRaw) ? roleRaw : roleRaw ? [roleRaw] : []

        return { userId, username, fullName, roles}

    }catch{
        return null
    }
}