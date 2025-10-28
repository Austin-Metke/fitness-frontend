
import axios from 'axios';

//function for grabbing exercises
export const getExercises = async (exerciseSearch: string) => {
  try {
    const response = await axios.get(`http://10.0.2.2:8080/api/exercises/exercise`, {
      params: { name: exerciseSearch },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching exercises:", error);
    throw error;
  }
};


//function for grabbing exercise details
export const getExerciseDetail = async (params = {}) => {
    const options = {
        method: 'GET',
        url: 'https://exercises-by-api-ninjas.p.rapidapi.com/v1/exercises',
        params: { name: 'curl', ...params },
        headers: {
            'x-rapidapi-key': '54ec59fd7amsh724c1940bbcd393p111f66jsnd567f0225d39',
            'x-rapidapi-host': 'exercises-by-api-ninjas.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        return response.data[0];
    } catch (error) {
        console.error(error);
        throw error;
    }
};


