
const AccessTokenKey = 'ACCESS_TOKEN'

// ========== Token 相关 ==========

export function getAccessToken() {
  return localStorage.getItem(AccessTokenKey)
}

// token存储在本地数据库中
export function setToken(token) {
  localStorage.setItem(AccessTokenKey, token)
}

export function removeToken() {
  localStorage.removeItem(AccessTokenKey)
}