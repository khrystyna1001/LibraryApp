import axios from 'axios';

const API_URL = "http://localhost:8000"

async function getUserData(token) {

      if (!token) {
            console.error("No token provided to getUserData");
            throw new Error("No token provided");
      }

      const trimmedToken = token.trim();

      const requestHeaders = {
          "Content-Type": "application/json",
          "Authorization": `Token ${trimmedToken}`,
      }
      
      try {
        const response = await axios.get(`${API_URL}/user/me`, {
          headers: requestHeaders
        });
        
        if (response.status === 200) { 
            return response.data;
        } else {
          console.warn("Unexpected response status:", response.status);
          alert("Login failed. Please check your token.");
        }
      } catch (err) {
          console.error("Failed to fetch user data API call to /user/me");
          throw err;
      }
  }

async function getItem(item, ID, token) {
    try {

        const requestHeaders = {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`
        }

        const response = await axios.get(`${API_URL}/${item}/${ID}/`, {
            headers: requestHeaders
        });
        return response.data;

    } catch (error) {
        console.error(`Failed to fetch ${item}:`, error);
    }
}

async function getItems(item, token) {
    try {
        const requestHeaders = {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`
        }

        const response = await axios.get(`${API_URL}/${item}/`, {
            headers: requestHeaders
        });
        
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch ${item}s`)
    }
}

async function updateItem(item, ID, token, user_name, user_role, user_password) {
    try {

        const requestHeaders = {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`
        }

        const data = {
            "username": user_name,
            "groups": [user_role]
        };

        if (user_password && user_password.trim() !== "") {
            data.password = user_password;
        }

        const response = await axios.patch(`${API_URL}/${item}/${ID}/`, 
        data,
        {
            headers: requestHeaders
        });
        return response.data;

    } catch (error) {
        console.error(`Failed to fetch ${item}:`, error);
        throw error;
    }
}

async function deleteItem(item, ID, token) {
    try {

        const requestHeaders = {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`
        }

        const response = await axios.delete(`${API_URL}/${item}/${ID}/`)
        return response.data;
    } catch (error) {
        console.error(`Failed to delete ${item} with ID of ${ID}:`, error);
        throw error;
    }
}

export { getItem, getItems, getUserData, updateItem, deleteItem };