import Cookies from "js-cookie"

export const logout = (router, onRemoveProfile) => {
    router.push("/signin")
    Cookies.remove("token")
    onRemoveProfile()
}