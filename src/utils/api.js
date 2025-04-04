import axios from "axios"

const jwtToken = localStorage.getItem('token');

export const fetchDataFromApi = async (url) => {
    try {
        const { data } = await axios.get(process.env.REACT_APP_BASE_URL + url)
        return data;
    } catch (error) {
        console.log(error)
        return error
    }
}

// export const postData = async (url, formFields) => {
//     try {
//         const response = await axios.post(process.env.REACT_APP_BASE_URL + url, formFields, {
//             headers: {
//                 'Authorization': `Bearer ${jwtToken}`,
//             }
//         });

//         return response.data; // Axios already parses JSON for you
//     } catch (error) {
//         // Check if the error has a response from the server
//         if (error.response) {
//             return error.response.data; // Return the error response from the server
//         } else {
//             return { error: true, msg: "Network error or server not reachable" };
//         }
//     }
// };

export const editData = async (url, updatedData) => {
    const { data } = await axios.put(process.env.REACT_APP_BASE_URL + url, updatedData, {
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
        }
    })
    return data
}

export const deleteData = async (url) => {
    const { data } = await axios.delete(process.env.REACT_APP_BASE_URL + url, {
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
        }
    })
    return data
}


export const deleteImages = async (url) => {
    try {
        const response = await axios.delete(process.env.REACT_APP_BASE_URL + url, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
            },
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.data; // Return the error response from the server
        } else {
            return { success: false, msg: "Network error or server not reachable" };
        }
    }
};


export const postData = async (url, formData) => {
    try {
        const response = await axios.post(process.env.REACT_APP_BASE_URL + url, formData, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.data;
        } else {
            return { error: true, msg: "Network error or server not reachable" };
        }
    }
};