import { db } from './firebase-config.js';
import {
    collection,
    doc,
    getDoc,
    setDoc,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const COLLECTIONS = {
    SETTINGS: 'settings',
    MONTHLY_PLANNERS: 'monthly_planners',
    WEEKLY_PLANNERS: 'weekly_planners',
    STUDENT_TRACKING: 'student_tracking',
    MEETINGS: 'meetings',
    MONTHLY_REVIEWS: 'monthly_reviews',
    APPOINTMENTS: 'appointments',
    COMMENTS: 'comments',
    USERS: 'users'
};

export const FirebaseService = {
    // --- Dados Pessoais ---
    async getDadosPessoais() {
        try {
            const docRef = doc(db, COLLECTIONS.SETTINGS, 'dadosPessoais');
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? docSnap.data() : {};
        } catch (error) {
            console.error("Erro ao buscar dados pessoais:", error);
            return {};
        }
    },

    async saveDadosPessoais(dados) {
        try {
            await setDoc(doc(db, COLLECTIONS.SETTINGS, 'dadosPessoais'), dados);
            return true;
        } catch (error) {
            console.error("Erro ao salvar dados pessoais:", error);
            return false;
        }
    },

    // --- Datas Comemorativas ---
    async getDatasComemorativas() {
        try {
            const docRef = doc(db, COLLECTIONS.SETTINGS, 'datasComemorativas');
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? docSnap.data().data : null;
        } catch (error) {
            console.error("Erro ao buscar datas comemorativas:", error);
            return null;
        }
    },

    async saveDatasComemorativas(datas) {
        try {
            await setDoc(doc(db, COLLECTIONS.SETTINGS, 'datasComemorativas'), { data: datas });
            return true;
        } catch (error) {
            console.error("Erro ao salvar datas comemorativas:", error);
            return false;
        }
    },

    // --- Aniversários ---
    async getAniversarios() {
        try {
            const docRef = doc(db, COLLECTIONS.SETTINGS, 'aniversarios');
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? docSnap.data().data : null;
        } catch (error) {
            console.error("Erro ao buscar aniversários:", error);
            return null;
        }
    },

    async saveAniversarios(aniversarios) {
        try {
            await setDoc(doc(db, COLLECTIONS.SETTINGS, 'aniversarios'), { data: aniversarios });
            return true;
        } catch (error) {
            console.error("Erro ao salvar aniversários:", error);
            return false;
        }
    },

    // --- Planner Mensal ---
    async getPlannerMensal(mesIndex) {
        try {
            const docRef = doc(db, COLLECTIONS.MONTHLY_PLANNERS, String(mesIndex));
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? docSnap.data() : {};
        } catch (error) {
            console.error("Erro ao buscar planner mensal:", error);
            return {};
        }
    },

    async savePlannerMensal(mesIndex, dados) {
        try {
            await setDoc(doc(db, COLLECTIONS.MONTHLY_PLANNERS, String(mesIndex)), dados);
            return true;
        } catch (error) {
            console.error("Erro ao salvar planner mensal:", error);
            return false;
        }
    },

    // --- Planner Semanal ---
    async getPlanejamentoSemanal(ano, seman) {
        try {
            const docId = `${ano}_${seman}`;
            const docRef = doc(db, COLLECTIONS.WEEKLY_PLANNERS, docId);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? docSnap.data() : {};
        } catch (error) {
            console.error("Erro ao buscar planejamento semanal:", error);
            return {};
        }
    },

    async savePlanejamentoSemanal(ano, seman, dados) {
        try {
            const docId = `${ano}_${seman}`;
            // Also update the registry of weeks
            const registryRef = doc(db, COLLECTIONS.SETTINGS, 'semanas_registro');
            const registrySnap = await getDoc(registryRef);
            let registry = registrySnap.exists() ? registrySnap.data().semanas : [];
            const semanaStr = `${ano}-W${String(seman).padStart(2, '0')}`;

            if (!registry.includes(semanaStr)) {
                registry.push(semanaStr);
                await setDoc(registryRef, { semanas: registry });
            }

            await setDoc(doc(db, COLLECTIONS.WEEKLY_PLANNERS, docId), dados);
            return true;
        } catch (error) {
            console.error("Erro ao salvar planejamento semanal:", error);
            return false;
        }
    },

    async getSemanasRegistradas() {
        try {
            const docRef = doc(db, COLLECTIONS.SETTINGS, 'semanas_registro');
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? docSnap.data().semanas : [];
        } catch (error) {
            console.error("Erro ao buscar semanas registradas:", error);
            return [];
        }
    },

    // --- Acompanhamento Alunos (Collection) ---
    async getAcompanhamentosAlunos() {
        try {
            const q = query(collection(db, COLLECTIONS.STUDENT_TRACKING), orderBy('timestamp', 'desc'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Erro ao buscar acompanhamentos:", error);
            return [];
        }
    },

    async addAcompanhamentoAluno(acompanhamento) {
        try {
            await addDoc(collection(db, COLLECTIONS.STUDENT_TRACKING), acompanhamento);
            return true;
        } catch (error) {
            console.error("Erro ao adicionar acompanhamento:", error);
            return false;
        }
    },

    async deleteAcompanhamentoAluno(id) {
        try {
            await deleteDoc(doc(db, COLLECTIONS.STUDENT_TRACKING, id));
            return true;
        } catch (error) {
            console.error("Erro ao remover acompanhamento:", error);
            return false;
        }
    },

    // --- Reuniões (Collection) ---
    async getReunioesPedagogicas() {
        try {
            const q = query(collection(db, COLLECTIONS.MEETINGS), orderBy('timestamp', 'desc'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Erro ao buscar reuniões:", error);
            return [];
        }
    },

    async addReuniaoPedagogica(reuniao) {
        try {
            await addDoc(collection(db, COLLECTIONS.MEETINGS), reuniao);
            return true;
        } catch (error) {
            console.error("Erro ao adicionar reunião:", error);
            return false;
        }
    },

    async deleteReuniaoPedagogica(id) {
        try {
            await deleteDoc(doc(db, COLLECTIONS.MEETINGS, id));
            return true;
        } catch (error) {
            console.error("Erro ao remover reunião:", error);
            return false;
        }
    },

    // --- Avaliações Mensais ---
    async getAvaliacoesMensais() {
        try {
            const querySnapshot = await getDocs(collection(db, COLLECTIONS.MONTHLY_REVIEWS));
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Erro ao buscar avaliações mensais:", error);
            return [];
        }
    },

    async saveAvaliacaoMensal(avaliacao) {
        try {
            // Check if exists for this month
            const q = query(collection(db, COLLECTIONS.MONTHLY_REVIEWS), where("mes", "==", avaliacao.mes));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const docId = querySnapshot.docs[0].id;
                await updateDoc(doc(db, COLLECTIONS.MONTHLY_REVIEWS, docId), avaliacao);
            } else {
                await addDoc(collection(db, COLLECTIONS.MONTHLY_REVIEWS), avaliacao);
            }
            return true;
        } catch (error) {
            console.error("Erro ao salvar avaliação mensal:", error);
            return false;
        }
    },

    // --- Agendamentos (Collection) ---
    async getAgendamentos() {
        try {
            const querySnapshot = await getDocs(collection(db, COLLECTIONS.APPOINTMENTS));
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // ID mapping might need adjustment based on app logic
        } catch (error) {
            console.error("Erro ao buscar agendamentos:", error);
            return [];
        }
    },

    async saveAgendamento(evento) {
        try {
            // Check if exists by ID (custom ID from app)
            const q = query(collection(db, COLLECTIONS.APPOINTMENTS), where("id", "==", evento.id));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const docId = querySnapshot.docs[0].id;
                await updateDoc(doc(db, COLLECTIONS.APPOINTMENTS, docId), evento);
            } else {
                await addDoc(collection(db, COLLECTIONS.APPOINTMENTS), evento);
            }
            return true;
        } catch (error) {
            console.error("Erro ao salvar agendamento:", error);
            return false;
        }
    },

    async addAgendamento(evento) {
        return this.saveAgendamento(evento);
    },

    async updateAgendamento(evento) {
        return this.saveAgendamento(evento);
    },

    async deleteAgendamento(eventoId) {
        try {
            const q = query(collection(db, COLLECTIONS.APPOINTMENTS), where("id", "==", eventoId));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const docId = querySnapshot.docs[0].id;
                await deleteDoc(doc(db, COLLECTIONS.APPOINTMENTS, docId));
                return true;
            }
            return false;
        } catch (error) {
            console.error("Erro ao remover agendamento:", error);
            return false;
        }
    },

    // --- Comentários (Collection) ---
    async getComentarios() {
        try {
            const q = query(collection(db, COLLECTIONS.COMMENTS), orderBy('timestamp', 'desc'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ ...doc.data() }));
        } catch (error) {
            console.error("Erro ao buscar comentários:", error);
            return [];
        }
    },

    async addComentario(comentario) {
        try {
            await addDoc(collection(db, COLLECTIONS.COMMENTS), comentario);
            return true;
        } catch (error) {
            console.error("Erro ao adicionar comentário:", error);
            return false;
        }
    },

    // --- Autenticação (Simples) ---
    // --- Autenticação (Simples) ---
    async checkLogin(username, password) {
        try {
            const q = query(collection(db, COLLECTIONS.USERS), where("username", "==", username), where("password", "==", password));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                // Debugging: check if user exists at all
                const qUser = query(collection(db, COLLECTIONS.USERS), where("username", "==", username));
                const userSnap = await getDocs(qUser);
                if (userSnap.empty) {
                    console.warn(`Debug: Usuário '${username}' não encontrado.`);
                } else {
                    console.warn(`Debug: Usuário '${username}' encontrado, mas senha incorreta.`);
                }
            }
            return !querySnapshot.empty;
        } catch (error) {
            console.error("Erro ao verificar login:", error);
            alert("Erro técnico ao verificar login (ver console): " + error.message);
            return false;
        }
    },

    async createInitialUser() {
        try {
            const username = "pastorJosemar";
            // Check if exists
            const q = query(collection(db, COLLECTIONS.USERS), where("username", "==", username));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                await addDoc(collection(db, COLLECTIONS.USERS), {
                    username: username,
                    password: "coordCEPP2026", // Idealmente deveria ser hash, mas aqui é simplificado
                    role: "coordenador"
                });
                console.log("Usuário inicial criado com sucesso.");
                alert("Usuário inicial 'pastorJosemar' criado com sucesso!");
                return true;
            } else {
                console.log("Usuário inicial já existe.");
            }
            return false; // Já existe
        } catch (error) {
            console.error("Erro ao criar usuário inicial:", error);
            alert("Erro técnico ao criar usuário inicial (ver console): " + error.message);
            return false;
        }
    }
};
