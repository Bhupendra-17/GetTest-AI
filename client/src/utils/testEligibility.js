// utils/testEligibility.js
import axios from 'axios';

export const checkTestEligibility = async (token) => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/can-take-test`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data; // { allowed: true/false, remaining_tests, reason }
  } catch (error) {
    throw new Error(error?.response?.data?.detail || "Something went wrong");
  }
};
