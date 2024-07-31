import axiosInstance from "../axiosInstance";

export const updateProfile = async (name, profileImage, feature) => {
    const token = localStorage.getItem('');
    if (!token) {
        throw new Error("로그인 하세요.")
    }

    const updateData = {
        name,
        profileImage,
        feature
    }

    try {
        const res = await axiosInstance.put('/api/v1/member', updateData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch(e) {
        console.log("업데이트 오류", e);
        throw e;
    }
}