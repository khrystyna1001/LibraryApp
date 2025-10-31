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

        if (response.status === 200) {
            return response.data;
        }

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
        
        if (response.status === 200) {
            return response.data;
        }

    } catch (error) {
        console.error(`Failed to fetch ${item}s`)
    }
}

async function createItem(item, token, itemData) {
    try {

        const requestHeaders = {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`
        }

        const response = await axios.post(`${API_URL}/${item}/`,
            itemData,
        {
            headers: requestHeaders
        });

        if (response) {
            return response.data;
        }

    } catch (error) {
        console.error(`Failed to fetch ${item}:`, error);
        throw error;
    }
}

async function updateItem(item, ID, token, itemData) {
    try {

        const requestHeaders = {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`
        }

        const response = await axios.patch(`${API_URL}/${item}/${ID}/`, 
        itemData,
        {
            headers: requestHeaders
        });

        if (response) {
            return response.data;
        }

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

        const response = await axios.delete(`${API_URL}/${item}/${ID}/`, {headers: requestHeaders})
        
        if (response) {
            return response.data;
        }
    } catch (error) {
        console.error(`Failed to delete ${item} with ID of ${ID}:`, error);
        throw error;
    }
}

async function searchItems(value, item, token) {
    try {
        const requestHeaders = {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`
        }

        const response = await axios.get(`${API_URL}/${item}/?search=${value}`, {headers: requestHeaders});

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error(`Failed to find item:`, error);
        throw error;
    }
}

async function issueBook(itemID, item, itemData, token) {
    try {
        const requestHeaders = {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`
        }

        const response = await axios.post(`${API_URL}/${item}/${itemID}/issue/`, 
            itemData, 
            {headers: requestHeaders});

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error(`Failed to issue item:`, error);
        throw error;
    }
}

export { getItem, getItems, createItem, getUserData, updateItem, deleteItem, searchItems, issueBook };