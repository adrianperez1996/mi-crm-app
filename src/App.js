import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    onAuthStateChanged, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut 
} from 'firebase/auth';
import { getFirestore, collection, doc, addDoc, getDocs, updateDoc, deleteDoc, query, where, onSnapshot, setLogLevel } from 'firebase/firestore';
import { ArrowRight, User, DollarSign, FileText, CheckSquare, Bell, Send, Folder, Plus, Edit, Trash2, X, Printer, LogOut, Eye, EyeOff } from 'lucide-react';

// --- Firebase Configuration ---
const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
};

// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Auth Page Component ---
const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleAuthAction = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
        } catch (err) {
            setError('Error: Revisa tu correo y contraseña. La contraseña debe tener al menos 6 caracteres.');
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl dark:bg-gray-800">
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
                    {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </h2>
                <p className="text-center text-gray-500 dark:text-gray-400">
                    Accede a tu CRM personalizado
                </p>
                <form onSubmit={handleAuthAction} className="space-y-6">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Correo electrónico"
                        required
                        className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    />
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Contraseña"
                            required
                            className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                           {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {error && <p className="text-sm text-center text-red-500">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 transition-colors"
                    >
                        {loading ? 'Cargando...' : (isLogin ? 'Entrar' : 'Registrarse')}
                    </button>
                </form>
                <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                    {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes una cuenta?'}
                    <button onClick={() => setIsLogin(!isLogin)} className="ml-1 font-medium text-blue-600 hover:underline dark:text-blue-400">
                        {isLogin ? 'Regístrate' : 'Inicia sesión'}
                    </button>
                </p>
            </div>
        </div>
    );
};


// --- Helper Components ---

const Modal = ({ children, onClose, size = 'lg' }) => {
    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in">
            <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full ${sizeClasses[size]} m-4 relative animate-fade-in-up`}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors z-10">
                    <X size={24} />
                </button>
                <div className="p-6 md:p-8">
                    {children}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, title, value, color }) => (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex items-center space-x-4 transition-transform hover:scale-105">
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
        </div>
    </div>
);


// --- Main Application Component ---
export default function App() {
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoadingAuth(false);
        });
        return () => unsubscribe();
    }, []);

    if (loadingAuth) {
        return <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div></div>;
    }

    if (!user) {
        return <AuthPage />;
    }

    return <CrmApp user={user} />;
}

const CrmApp = ({ user }) => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [clients, setClients] = useState([]);
    const [payments, setPayments] = useState([]);
    const [taxes, setTaxes] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState(null);

    const userId = user.uid;

    useEffect(() => {
        if (!userId) return;

        setLoadingData(true);
        const collectionsToSync = {
            clients: (data) => setClients(data.sort((a, b) => a.name.localeCompare(b.name))),
            payments: setPayments,
            taxes: setTaxes,
            tasks: setTasks,
            notifications: setNotifications,
        };

        const unsubscribers = Object.entries(collectionsToSync).map(([collectionName, setter]) => {
            const q = query(collection(db, `/artifacts/${firebaseConfig.appId}/users/${userId}/${collectionName}`));
            return onSnapshot(q, (querySnapshot) => {
                const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setter(items);
            }, (err) => {
                console.error(`Error fetching ${collectionName}:`, err);
                setError(`No se pudieron cargar los datos de ${collectionName}.`);
            });
        });
        
        setLoadingData(false);

        return () => unsubscribers.forEach(unsub => unsub());
    }, [userId]);
    
    // --- Data CRUD Functions ---
    const addData = async (collectionName, data) => {
        try {
            const docRef = await addDoc(collection(db, `/artifacts/${firebaseConfig.appId}/users/${userId}/${collectionName}`), data);
            return docRef;
        } catch (e) { console.error(e); setError(`Error al añadir datos.`); return null; }
    };
    const updateData = async (collectionName, id, data) => {
        try {
            await updateDoc(doc(db, `/artifacts/${firebaseConfig.appId}/users/${userId}/${collectionName}`, id), data);
        } catch (e) { console.error(e); setError(`Error al actualizar datos.`); }
    };
    const deleteData = async (collectionName, id) => {
        try {
            await deleteDoc(doc(db, `/artifacts/${firebaseConfig.appId}/users/${userId}/${collectionName}`, id));
        } catch (e) { console.error(e); setError(`Error al eliminar datos.`); }
    };
    
    // --- Automatic "Just-in-Time" Payment Generation ---
    useEffect(() => {
        if (!userId || clients.length === 0) return;
        const generateCurrentPayments = async () => { /* ... (logic remains the same) ... */ };
        generateCurrentPayments();
    }, [clients, payments, userId]);

    const renderSection = () => {
        if (loadingData) return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div></div>;
        if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

        switch (activeSection) {
            case 'dashboard': return <DashboardSection clients={clients} payments={payments} tasks={tasks} />;
            case 'clients': return <ClientsSection clients={clients} addClient={(c) => addData('clients', c)} updateClient={(id, c) => updateData('clients', id, c)} deleteClient={(id) => deleteData('clients', id)} />;
            case 'payments': return <PaymentsSection payments={payments} clients={clients} addPayment={(p) => addData('payments', p)} updatePayment={(id, p) => updateData('payments', id, p)} deletePayment={(id) => deleteData('payments', id)} />;
            case 'taxes': return <TaxesSection taxes={taxes} clients={clients} addTax={(t) => addData('taxes', t)} updateTax={(id, t) => updateData('taxes', id, t)} deleteTax={(id) => deleteData('taxes', id)} />;
            case 'tasks': return <TasksSection tasks={tasks} clients={clients} addTask={(t) => addData('tasks', t)} updateTask={(id, t) => updateData('tasks', id, t)} deleteTask={(id) => deleteData('tasks', id)} />;
            case 'notifications': return <NotificationsSection notifications={notifications} clients={clients} addNotification={(n) => addData('notifications', n)} updateNotification={(id, n) => updateData('notifications', id, n)} deleteNotification={(id) => deleteData('notifications', id)} />;
            case 'circulars': return <CircularsSection clients={clients} />;
            case 'drive': return <DriveSection clients={clients} />;
            default: return <DashboardSection clients={clients} payments={payments} tasks={tasks} />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100">
            <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} userEmail={user.email} />
            <main className="flex-1 flex flex-col overflow-hidden">
                <Header sectionTitle={activeSection} />
                <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 md:p-6">
                    {renderSection()}
                </div>
            </main>
        </div>
    );
}

// --- Layout Components ---
const Sidebar = ({ activeSection, setActiveSection, userEmail }) => {
    const navItems = [
        { id: 'dashboard', label: 'Panel Principal', icon: <ArrowRight size={20} /> },
        { id: 'clients', label: 'Clientes', icon: <User size={20} /> },
        { id: 'payments', label: 'Control de Pagos', icon: <DollarSign size={20} /> },
        { id: 'taxes', label: 'Gestión de Impuestos', icon: <FileText size={20} /> },
        { id: 'tasks', label: 'Tareas', icon: <CheckSquare size={20} /> },
        { id: 'notifications', label: 'Notificaciones', icon: <Bell size={20} /> },
        { id: 'circulars', label: 'Envío de Circulares', icon: <Send size={20} /> },
        { id: 'drive', label: 'Almacén (Drive)', icon: <Folder size={20} /> },
    ];

    return (
        <nav className="w-64 bg-white dark:bg-gray-800 shadow-lg flex-col hidden md:flex">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">ClientCRM</h1>
            </div>
            <ul className="flex-1 px-4 py-4 space-y-2">
                {navItems.map(item => (
                    <li key={item.id}>
                        <button
                            onClick={() => setActiveSection(item.id)}
                            className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left font-medium transition-all duration-200 ${
                                activeSection === item.id
                                    ? 'bg-blue-500 text-white shadow-md'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    </li>
                ))}
            </ul>
             <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-2" title={userEmail}>{userEmail}</p>
                <button
                    onClick={() => signOut(auth)}
                    className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left font-medium text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                >
                    <LogOut size={20} />
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </nav>
    );
};

// --- ALL OTHER COMPONENTS (Header, Sections, Modals) remain the same as before ---
// --- They are omitted here for brevity but should be included in the final file ---
const Header = ({ sectionTitle }) => (
    <header className="bg-white dark:bg-gray-800 shadow-sm p-4 border-b dark:border-gray-700">
        <h2 className="text-2xl font-semibold capitalize text-gray-800 dark:text-gray-100">{sectionTitle.replace(/_/g, ' ')}</h2>
    </header>
);
const ClientsSection = ({ clients, addClient, updateClient, deleteClient }) => { /* ... */ };
const ClientModal = ({ client, onSave, onClose }) => { /* ... */ };
const ClientPrintView = ({ client, onClose }) => { /* ... */ };
const PaymentsSection = ({ payments, clients, addPayment, updatePayment, deletePayment }) => { /* ... */ };
const TaxesSection = ({ taxes, clients, addTax, updateTax, deleteTax }) => { /* ... */ };
const TaxModal = ({ tax, clients, onSave, onClose }) => { /* ... */ };
const TasksSection = ({ tasks, clients, addTask, updateTask, deleteTask }) => { /* ... */ };
const TaskModal = ({ task, clients, onSave, onClose }) => { /* ... */ };
const NotificationsSection = ({ notifications, clients, addNotification, updateNotification, deleteNotification }) => { /* ... */ };
const NotificationModal = ({ notification, clients, onSave, onClose }) => { /* ... */ };
const DashboardSection = ({ clients, payments, tasks }) => { /* ... */ };
const CircularsSection = ({ clients }) => { /* ... */ };
const DriveSection = ({ clients }) => { /* ... */ };

// NOTE: I've omitted the full code for the section components for brevity. 
// You should copy the full component code from the previous version of the file.
// The only new component is `AuthPage`, and the main `App` and `Sidebar` components have been modified.
