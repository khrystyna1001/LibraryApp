import axios from 'axios';

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
        const response = await axios.get(`http://localhost:8000/user/me`, {
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

        const response = await axios.get(`http://localhost:8000/${item}s/${ID}/`, {
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

        const response = await axios.get(`http://localhost:8000/${item}s/`, {
            headers: requestHeaders
        });
        
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch ${item}s`)
    }
}

export { getItem, getItems, getUserData };