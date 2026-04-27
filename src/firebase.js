import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const db = getDatabase(app);

/**
 * Saves a recipe to the database and sets the status to true
 * to trigger the ESP32 robot.
 * @param {number} glassId - The ID of the glass (1-5)
 * @param {Object} recipe - { pump1, pump2, pump3, pump4 }
 */
export const saveRecipe = async (glassId, recipe) => {
  const recipeRef = ref(db, `robot/${glassId}/recipe`);
  const statusRef = ref(db, `robot/${glassId}/status`);

  try {
    // 1. Spochatku zapysuyemo ves' retsept (First write the entire recipe)
    await set(recipeRef, recipe);
    
    // 2. V samomu kintsi (koly retsept tochno zberezheno) zapysuyemo status: true
    await set(statusRef, true);
    
    console.log(`Successfully sent recipe to glass ${glassId}`);
    return true;
  } catch (error) {
    console.error("Error saving recipe:", error);
    throw error;
  }
};

/**
 * Subscribes to the status of all glasses.
 * @param {function} callback - Called with an object { 1: boolean, 2: boolean, ... }
 * @returns {function} unsubscribe function
 */
export const subscribeToRobotStatus = (callback) => {
  const robotRef = ref(db, 'robot');
  return onValue(robotRef, (snapshot) => {
    const data = snapshot.val();
    const statuses = {};
    if (data) {
      for (let i = 1; i <= 5; i++) {
        statuses[i] = data[i]?.status || false;
      }
    } else {
      for (let i = 1; i <= 5; i++) {
        statuses[i] = false;
      }
    }
    callback(statuses);
  });
};
