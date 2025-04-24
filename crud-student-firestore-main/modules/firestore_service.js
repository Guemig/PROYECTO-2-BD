import { db } from './firebase_init.js';
import { collection, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

async function populatePerformanceRecords(courseId, studentId) {
  const comments = ["Excellent", "Needs improvement", "Satisfactory", "Outstanding", "Could be better"];
  
  for (let i = 0; i < 5; i++) {
    const score = (Math.random() * 4 + 1).toFixed(1); // entre 1.0 y 5.0
    const timestamp = new Date().toISOString();
    const comment = comments[Math.floor(Math.random() * comments.length)];

    const performanceId = `record${i + 1}`;
    const performanceRef = doc(db, `Courses/${courseId}/Students/${studentId}/Performance/${performanceId}`);

    const performanceData = {
      score: parseFloat(score),
      timestamp: timestamp,
      comment: comment
    };

    try {
      await setDoc(performanceRef, performanceData);
      console.log(`Registro ${performanceId} agregado exitosamente.`);
    } catch (error) {
      console.error(`Error agregando ${performanceId}:`, error);
    }
  }
}
