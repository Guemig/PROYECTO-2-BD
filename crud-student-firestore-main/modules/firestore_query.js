import { db } from './firebase_init.js';
import { 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    getDocs, 
    query, 
    orderBy, 
    limit, 
    where
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

export class FirestoreQuery {
    constructor(collectionPath) {
        this.collectionRef = collection(db, collectionPath);
        this.topStudentsRef = collection(db, 'TopStudents'); // Referencia a la colección TopStudents
    }

    // Método para agregar o actualizar el puntaje en la colección TopStudents
    async addOrUpdateTopScore(courseId, studentId, score, timestamp, comment) {
        const topStudentDocRef = doc(this.topStudentsRef, `${courseId}_${studentId}`);

        const docSnapshot = await getDoc(topStudentDocRef);

        if (docSnapshot.exists()) {
            // Si el documento ya existe, actualiza si la nueva puntuación es mayor
            const existingScore = docSnapshot.data().score;
            if (score > existingScore) {
                await setDoc(topStudentDocRef, { courseId, studentId, score, timestamp, comment });
            }
        } else {
            // Si el documento no existe, agrega uno nuevo
            await setDoc(topStudentDocRef, { courseId, studentId, score, timestamp, comment });
        }
    }

    // Método para obtener los mejores estudiantes ordenados por puntaje
    async getTopStudents(limitResults = 10) {
        const q = query(this.topStudentsRef, orderBy("score", "desc"), limit(limitResults));
        return this.runQuery(q);
    }

    // Método para obtener puntuaciones altas de un estudiante específico
    async getHighScoresOrdered() {
        const q = query(
            this.collectionRef,
            where("score", ">", 4.0),
            orderBy("score", "desc"),
            orderBy("timestamp", "desc")
        );
        return this.runQuery(q);
    }

    // Método común para ejecutar una consulta
    async runQuery(q) {
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log('No matching documents.');
            return [];
        }

        const results = [];
        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            results.push({ id: doc.id, ...doc.data() });
        });
        return results;
    }

    // Método para obtener el promedio de un estudiante específico
    async getAverageScore() {
        const snapshot = await getDocs(this.collectionRef);

        if (snapshot.empty) {
            console.log("No performance records found.");
            return 0;
        }

        let total = 0;
        let count = 0;

        snapshot.forEach(doc => {
            const data = doc.data();
            if (typeof data.score === "number") {
                total += data.score;
                count++;
            }
        });

        const average = total / count;
        console.log(`Average score: ${average.toFixed(2)}`);
        return average;
    }

    // Método para agregar puntajes a la colección de Performance y actualizar TopStudents si es necesario
    async addPerformanceAndUpdateTop(courseId, studentId, score, timestamp, comment) {
        // Primero, agrega el puntaje a la colección de Performance
        const performanceRef = collection(db, `Courses/${courseId}/Students/${studentId}/Performance`);
        const newPerformanceDoc = doc(performanceRef);
        await setDoc(newPerformanceDoc, { score, timestamp, comment });

        // Luego, verifica y actualiza TopStudents si el puntaje es alto
        if (score > 4.0) {
            await this.addOrUpdateTopScore(courseId, studentId, score, timestamp, comment);
        }
    }
}
